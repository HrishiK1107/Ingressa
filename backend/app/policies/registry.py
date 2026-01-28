from typing import Dict, List, Type

from app.policies.base import BasePolicy


class PolicyRegistry:
    def __init__(self):
        self._policies: Dict[str, Type[BasePolicy]] = {}

    def register(self, policy_cls: Type[BasePolicy]) -> None:
        self._policies[policy_cls.policy_id] = policy_cls

    def all(self) -> List[BasePolicy]:
        return [cls() for cls in self._policies.values()]

    def get(self, policy_id: str) -> BasePolicy:
        cls = self._policies[policy_id]
        return cls()
