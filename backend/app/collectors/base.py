from abc import ABC, abstractmethod
from typing import Optional

from app.collectors.types import CollectorOutput


class BaseCollector(ABC):
    """
    Contract:
    - pluggable collectors
    - always return stable CollectorOutput
    """

    name: str = "base"

    def __init__(self, region: str, account_id: Optional[str] = None):
        self.region = region
        self.account_id = account_id

    @abstractmethod
    def collect(self) -> CollectorOutput:
        raise NotImplementedError
