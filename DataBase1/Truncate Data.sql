-- Disable FK checks so you can delete in any order
SET FOREIGN_KEY_CHECKS = 0;

-- Junction & child tables first
TRUNCATE TABLE AdminAuditLog;
TRUNCATE TABLE ApplicationDocument;
TRUNCATE TABLE SupervisorNotification;
TRUNCATE TABLE SupervisionRequest;
TRUNCATE TABLE Notification;
TRUNCATE TABLE Evaluation;
TRUNCATE TABLE Interview;
TRUNCATE TABLE InternInfo;
TRUNCATE TABLE Application;
TRUNCATE TABLE Document;
TRUNCATE TABLE PositionSkill;
TRUNCATE TABLE InternPosition;
TRUNCATE TABLE University;
TRUNCATE TABLE Skill;

-- Profile tables
TRUNCATE TABLE Admin;
TRUNCATE TABLE Supervisor;
TRUNCATE TABLE Student;
TRUNCATE TABLE Company;

-- Root table last
TRUNCATE TABLE UserAccount;

-- Re-enable FK checks
SET FOREIGN_KEY_CHECKS = 1;