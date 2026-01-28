from dataclasses import dataclass
from typing import Any, Dict, List, Optional, Tuple

from app.engine.types import AssetNode


@dataclass(frozen=True)
class Edge:
    src: str
    dst: str
    relation: str
    data: Dict[str, Any]


class AssetGraph:
    """
    Lightweight directed graph.

    Node key: "<asset_type>:<asset_id>:<region>"
    """

    def __init__(self):
        self.nodes: Dict[str, AssetNode] = {}
        self.edges_out: Dict[str, List[Edge]] = {}
        self.edges_in: Dict[str, List[Edge]] = {}

    @staticmethod
    def key(asset_type: str, asset_id: str, region: str) -> str:
        return f"{asset_type}:{asset_id}:{region}"

    def add_node(self, node: AssetNode) -> str:
        k = self.key(node.asset_type, node.asset_id, node.region)
        self.nodes[k] = node
        self.edges_out.setdefault(k, [])
        self.edges_in.setdefault(k, [])
        return k

    def add_edge(
        self,
        src_key: str,
        dst_key: str,
        relation: str,
        data: Optional[Dict[str, Any]] = None,
    ) -> None:
        if data is None:
            data = {}

        edge = Edge(src=src_key, dst=dst_key, relation=relation, data=data)

        self.edges_out.setdefault(src_key, []).append(edge)
        self.edges_in.setdefault(dst_key, []).append(edge)

    def summary(self) -> Dict[str, int]:
        return {
            "nodes": len(self.nodes),
            "edges": sum(len(v) for v in self.edges_out.values()),
        }


class GraphBuilder:
    """
    Builds relationships from asset node data.
    """

    def build(self, nodes: List[AssetNode]) -> AssetGraph:
        graph = AssetGraph()

        # index
        key_by_type_id_region: Dict[Tuple[str, str, str], str] = {}

        for n in nodes:
            k = graph.add_node(n)
            key_by_type_id_region[(n.asset_type, n.asset_id, n.region)] = k

        # relationship linking
        for k, node in graph.nodes.items():
            if node.asset_type == "ec2":
                self._link_ec2(graph, key_by_type_id_region, node)

            if node.asset_type == "security_group":
                self._link_sg_rules(graph, node)

            if node.asset_type == "s3":
                self._link_bucket_acl(graph, node)

        return graph

    def _link_ec2(
        self,
        graph: AssetGraph,
        idx: Dict[Tuple[str, str, str], str],
        node: AssetNode,
    ) -> None:
        src = AssetGraph.key(node.asset_type, node.asset_id, node.region)

        # EC2 -> SG edges (if sg_ids present in instance data)
        sg_ids = node.data.get("security_groups", [])
        for sg_id in sg_ids:
            sg_key = idx.get(("security_group", sg_id, node.region))
            if sg_key:
                graph.add_edge(src, sg_key, "attached_sg", {"sg_id": sg_id})

        # EC2 -> IAM role edges (if role present)
        role = node.data.get("iam_role")
        if role:
            role_key = idx.get(("iam_role", role, node.region))
            if role_key:
                graph.add_edge(src, role_key, "assumes_role", {"role": role})

    def _link_sg_rules(self, graph: AssetGraph, node: AssetNode) -> None:
        src = AssetGraph.key(node.asset_type, node.asset_id, node.region)
        rules = node.data.get("inbound_rules", [])
        for r in rules:
            # SG -> ingress rule edge (edge stores rule info)
            graph.add_edge(src, src, "ingress_rule", r)

    def _link_bucket_acl(self, graph: AssetGraph, node: AssetNode) -> None:
        src = AssetGraph.key(node.asset_type, node.asset_id, node.region)

        # bucket -> access control edge
        graph.add_edge(
            src,
            src,
            "access_control",
            {
                "public_access_block": node.data.get("public_access_block", True),
                "encryption": node.data.get("encryption", "UNKNOWN"),
                "versioning": node.data.get("versioning", False),
            },
        )
