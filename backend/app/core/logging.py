import logging
from contextvars import ContextVar
from typing import Optional

# Stores scan_id per request/task safely
scan_id_ctx: ContextVar[Optional[str]] = ContextVar("scan_id", default=None)


class ScanIdFilter(logging.Filter):
    def filter(self, record: logging.LogRecord) -> bool:
        record.scan_id = scan_id_ctx.get() or "-"
        return True


def setup_logging() -> None:
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)

    # Clear any default handlers to avoid duplicate logs
    if logger.handlers:
        logger.handlers.clear()

    handler = logging.StreamHandler()
    formatter = logging.Formatter(
        fmt="%(asctime)s | %(levelname)s | %(name)s | scan_id=%(scan_id)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    handler.setFormatter(formatter)
    handler.addFilter(ScanIdFilter())

    logger.addHandler(handler)
