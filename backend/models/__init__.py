# Import every model here so SQLAlchemy registers all tables with Base.metadata
# before any FK resolution happens at runtime.

from models.user import UserAccount          # noqa: F401
from models.university import University     # noqa: F401
from models.student import Student           # noqa: F401
from models.supervisor import Supervisor     # noqa: F401
from models.company import Company           # noqa: F401
from models.skill import Skill               # noqa: F401
from models.intern_position import InternPosition  # noqa: F401
from models.application import Application   # noqa: F401
from models.interview import Interview       # noqa: F401
from models.intern_info import InternInfo    # noqa: F401
from models.evaluation import Evaluation     # noqa: F401
from models.document import Document         # noqa: F401
from models.notification import Notification # noqa: F401
from models.audit_log import AdminAuditLog              # noqa: F401
from models.admin import Admin                          # noqa: F401
from models.supervision_request import SupervisionRequest          # noqa: F401
from models.supervisor_notification import SupervisorNotification  # noqa: F401
from models.application_document import ApplicationDocument        # noqa: F401
