from abc import ABC, abstractmethod

from app.collectors.types import CollectorOutput
from app.normalizer.types import NormalizedSnapshot


class BaseNormalizer(ABC):
    name: str = "base"

    @abstractmethod
    def normalize(self, collected: CollectorOutput) -> NormalizedSnapshot:
        raise NotImplementedError
