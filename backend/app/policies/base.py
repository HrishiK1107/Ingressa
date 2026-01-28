from abc import ABC, abstractmethod
from typing import List

from app.engine.graph import AssetGraph
from app.normalizer.types import NormalizedSnapshot
from app.policies.types import PolicyResult


class BasePolicy(ABC):
    policy_id: str = "POL-000"
    title: str = "base policy"
    description: str = ""
    severity: str = "LOW"

    @abstractmethod
    def evaluate(self, snap: NormalizedSnapshot, graph: AssetGraph) -> List[PolicyResult]:
        raise NotImplementedError
