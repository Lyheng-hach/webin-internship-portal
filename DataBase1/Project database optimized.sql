-- ============================================================
--  WEBIN — Internship Job Portal Database

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE UserAccount (
    user_id       INT AUTO_INCREMENT NOT NULL,
    user_email    VARCHAR(100)       NOT NULL,
    user_password VARCHAR(255)       NOT NULL,
    role          ENUM('student', 'supervisor', 'company', 'admin') NOT NULL,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_useraccount          PRIMARY KEY (user_id),
    CONSTRAINT uq_useraccount_email    UNIQUE      (user_email),
    CONSTRAINT ck_useraccount_email    CHECK (user_email LIKE '%@%.%'),   -- any valid email
    CONSTRAINT ck_useraccount_password CHECK (CHAR_LENGTH(user_password) >= 8)
);

CREATE TABLE University (
    university_id INT NOT NULL AUTO_INCREMENT,
    name          VARCHAR(100) NOT NULL,
    address       VARCHAR(255) NOT NULL,
    email         VARCHAR(100) NOT NULL,
    phone         VARCHAR(20)  NOT NULL,
    website       VARCHAR(150),
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_university        PRIMARY KEY (university_id),
    CONSTRAINT uq_university_email  UNIQUE      (email),
    CONSTRAINT ck_university_email  CHECK (email LIKE '%@%.%'),
    CONSTRAINT ck_university_phone  CHECK (CHAR_LENGTH(phone) BETWEEN 9 AND 15),
    CONSTRAINT ck_university_website CHECK (website IS NULL OR website LIKE 'http%')
);

CREATE TABLE Skill (
    skill_id   INT NOT NULL AUTO_INCREMENT,
    name       VARCHAR(100) NOT NULL,
    category   ENUM('Frontend','Backend','DataBase','Mobile','DevOps',
                    'Design','Data','AI_ML','Programming','Other') NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_skill      PRIMARY KEY (skill_id),
    CONSTRAINT uq_skill_name UNIQUE      (name),
    CONSTRAINT ck_skill_name CHECK (CHAR_LENGTH(name) > 0)
);

-- ── Target Users ──────────────────────────────────────────────────────────────

CREATE TABLE Student (
    student_id      INT AUTO_INCREMENT NOT NULL,
    user_id         INT NOT NULL,
    university_id   INT NOT NULL,
    name            VARCHAR(50)  NOT NULL,
    gender          ENUM('M','F') NOT NULL,
    date_of_birth   DATE          NOT NULL,
    nationality     VARCHAR(50)  NOT NULL,
    marital_status  ENUM('Single','Married') NOT NULL DEFAULT 'Single',
    phone           VARCHAR(20)  NOT NULL,
    address         VARCHAR(200) NOT NULL,
    year_of_study   TINYINT      NOT NULL,
    major           VARCHAR(100) NOT NULL,
    gpa             DECIMAL(3,2),
    profile_picture VARCHAR(250),                          -- [FIX] typo corrected
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_student               PRIMARY KEY (student_id),
    CONSTRAINT fk_student_useraccount   FOREIGN KEY (user_id)
                                        REFERENCES UserAccount(user_id)
                                        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_student_university    FOREIGN KEY (university_id)
                                        REFERENCES University(university_id)
                                        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT ck_student_gpa           CHECK (gpa BETWEEN 0.00 AND 4.00),
    CONSTRAINT ck_student_dob           CHECK (date_of_birth BETWEEN '1900-01-01' AND '2020-12-31'),
    CONSTRAINT ck_student_phone         CHECK (CHAR_LENGTH(phone) BETWEEN 9 AND 15),
    CONSTRAINT ck_student_year          CHECK (year_of_study BETWEEN 1 AND 6)   -- [NEW]
);

CREATE TABLE Supervisor (
    supervisor_id  INT NOT NULL AUTO_INCREMENT,
    user_id        INT NOT NULL,
    university_id  INT NOT NULL,
    name           VARCHAR(50)  NOT NULL,
    phone          VARCHAR(20)  NOT NULL,
    department     VARCHAR(100) NOT NULL,
    position       ENUM('Lecturer','Senior_Lecturer','Associate_Professor',
                        'Professor','Advisor') NOT NULL DEFAULT 'Lecturer',
    specialization VARCHAR(150),
    office         VARCHAR(100),
    office_hours   VARCHAR(100),
    status         ENUM('Active','Inactive') NOT NULL DEFAULT 'Active',
    created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_supervisor              PRIMARY KEY (supervisor_id),
    CONSTRAINT fk_supervisor_useraccount  FOREIGN KEY (user_id)
                                          REFERENCES UserAccount(user_id)
                                          ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_supervisor_university   FOREIGN KEY (university_id)
                                          REFERENCES University(university_id)
                                          ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT uq_supervisor_phone        UNIQUE (phone),
    CONSTRAINT ck_supervisor_phone        CHECK (CHAR_LENGTH(phone) BETWEEN 9 AND 15)
);

CREATE TABLE Company (
    company_id          INT NOT NULL AUTO_INCREMENT,
    user_id             INT NOT NULL,
    name                VARCHAR(100) NOT NULL,
    industry            VARCHAR(100) NOT NULL,
    phone               VARCHAR(20)  NOT NULL,
    address             VARCHAR(100) NOT NULL,
    website             VARCHAR(250),
    description_company TEXT,
    status              ENUM('Active','Inactive','Suspended') NOT NULL DEFAULT 'Active',
    verified_status     ENUM('Pending','Verified','Rejected')  NOT NULL DEFAULT 'Pending',
    created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_company             PRIMARY KEY (company_id),
    CONSTRAINT fk_company_useraccount FOREIGN KEY (user_id)
                                      REFERENCES UserAccount(user_id)
                                      ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT uq_company_name        UNIQUE (name),
    CONSTRAINT ck_company_phone       CHECK (CHAR_LENGTH(phone) BETWEEN 9 AND 15),
    CONSTRAINT ck_company_website     CHECK (website IS NULL OR website LIKE 'http%')
);

CREATE TABLE Admin (
    admin_id   INT NOT NULL AUTO_INCREMENT,
    user_id    INT NOT NULL,
    name       VARCHAR(50) NOT NULL,
    phone      VARCHAR(20) NOT NULL,
    status     ENUM('Active','Inactive','Suspended') NOT NULL DEFAULT 'Active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_admin             PRIMARY KEY (admin_id),
    CONSTRAINT fk_admin_useraccount FOREIGN KEY (user_id)
                                    REFERENCES UserAccount(user_id)
                                    ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT uq_admin_phone       UNIQUE (phone),                   -- [NEW]
    CONSTRAINT ck_admin_phone       CHECK (CHAR_LENGTH(phone) BETWEEN 9 AND 15)
);

-- ── Core Entities ─────────────────────────────────────────────────────────────

CREATE TABLE InternPosition (
    intern_position_id INT  NOT NULL AUTO_INCREMENT,
    company_id         INT  NOT NULL,
    title              VARCHAR(150) NOT NULL,
    description_post   TEXT,
    location           VARCHAR(250) NOT NULL,
    department         VARCHAR(100),
    salary_min         DECIMAL(10,2),
    salary_max         DECIMAL(10,2),
    position_type      ENUM('Full-Time','Part-Time','Remote','Hybrid') NOT NULL DEFAULT 'Full-Time',
    posted_date        DATE DEFAULT (CURRENT_DATE),
    deadtime           DATE,
    status             ENUM('Active','Draft','Closed','Expired') NOT NULL DEFAULT 'Draft',
    slots              TINYINT UNSIGNED NOT NULL DEFAULT 1,
    filled_slots       TINYINT UNSIGNED NOT NULL DEFAULT 0,
    created_at         DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at         DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_intern_position               PRIMARY KEY (intern_position_id),
    CONSTRAINT fk_intern_position_company       FOREIGN KEY (company_id)
                                                REFERENCES Company(company_id)
                                                ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT ck_intern_position_salary        CHECK (salary_min IS NULL OR salary_max IS NULL OR salary_min <= salary_max),
    CONSTRAINT ck_intern_position_salary_min    CHECK (salary_min IS NULL OR salary_min >= 0),
    CONSTRAINT ck_intern_position_slots         CHECK (slots > 0),
    CONSTRAINT ck_intern_position_filled_slots  CHECK (filled_slots >= 0),
    CONSTRAINT ck_intern_position_slots_exceed  CHECK (filled_slots <= slots),
    CONSTRAINT ck_intern_position_deadline      CHECK (deadtime IS NULL OR deadtime >= posted_date)  -- [NEW]
);

CREATE TABLE PositionSkill (
    intern_position_id INT NOT NULL,
    skill_id           INT NOT NULL,
    created_at         DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_position_skill                PRIMARY KEY (intern_position_id, skill_id),
    CONSTRAINT fk_positionskill_internposition  FOREIGN KEY (intern_position_id)
                                                REFERENCES InternPosition(intern_position_id)
                                                ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_positionskill_skill           FOREIGN KEY (skill_id)
                                                REFERENCES Skill(skill_id)
                                                ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE Application (
    application_id    INT NOT NULL AUTO_INCREMENT,
    student_id        INT NOT NULL,
    intern_position_id INT NOT NULL,
    document_id 		INT NOT NULL,
    apply_date        DATE NOT NULL DEFAULT (CURRENT_DATE),
    cover_letter      TEXT,
    remarks           TEXT,
    status            ENUM('Pending','Reviewed','Accepted','Rejected','Withdraw') NOT NULL DEFAULT 'Pending',
    created_at        DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at        DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_application                   PRIMARY KEY (application_id),
    CONSTRAINT fk_application_student           FOREIGN KEY (student_id)
                                                REFERENCES Student(student_id)
                                                ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_application_intern_position   FOREIGN KEY (intern_position_id)
                                                REFERENCES InternPosition(intern_position_id)
                                                ON DELETE RESTRICT ON UPDATE CASCADE,
	CONSTRAINT fk_application_document			FOREIGN KEY (document_id)
												REFERENCES Document(document_id)
                                                ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT uq_application_student_position  UNIQUE (student_id, intern_position_id)
);

CREATE TABLE Interview (
    interview_id   INT NOT NULL AUTO_INCREMENT,
    application_id INT NOT NULL,
    company_id     INT NOT NULL,
    student_id     INT NOT NULL,
    scheduled_at   DATETIME NOT NULL,
    location       TEXT     NOT NULL,
    interview_type ENUM('Online','Onsite') NOT NULL DEFAULT 'Online',
    status         ENUM('Scheduled','Completed','Cancelled','Rescheduled') NOT NULL DEFAULT 'Scheduled',
    created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_interview             PRIMARY KEY (interview_id),
    CONSTRAINT fk_interview_application FOREIGN KEY (application_id)
                                        REFERENCES Application(application_id)
                                        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_interview_company     FOREIGN KEY (company_id)
                                        REFERENCES Company(company_id)
                                        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_interview_student     FOREIGN KEY (student_id)
                                        REFERENCES Student(student_id)
                                        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT uq_interview_application UNIQUE (application_id)
);

CREATE TABLE InternInfo (
    intern_id          INT NOT NULL AUTO_INCREMENT,
    student_id         INT NOT NULL,
    company_id         INT NOT NULL,
    supervisor_id      INT NOT NULL,
    intern_position_id INT NOT NULL,
    department         VARCHAR(100) NOT NULL,
    field              VARCHAR(100),
    start_date         DATE         NOT NULL,
    end_date           DATE         NOT NULL,
    status             ENUM('Pending','Active','Completed','Terminated') NOT NULL DEFAULT 'Pending',
    created_at         DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at         DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_interninfo                    PRIMARY KEY (intern_id),
    CONSTRAINT fk_interninfo_student            FOREIGN KEY (student_id)
                                                REFERENCES Student(student_id)
                                                ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_interninfo_company            FOREIGN KEY (company_id)
                                                REFERENCES Company(company_id)
                                                ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_interninfo_supervisor         FOREIGN KEY (supervisor_id)
                                                REFERENCES Supervisor(supervisor_id)
                                                ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_interninfo_internposition     FOREIGN KEY (intern_position_id)
                                                REFERENCES InternPosition(intern_position_id)
                                                ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT uq_interninfo_student_position   UNIQUE (student_id, intern_position_id),
    CONSTRAINT ck_interninfo_dates              CHECK (end_date > start_date)
);

CREATE TABLE Document (
    document_id   INT NOT NULL AUTO_INCREMENT,
    student_id    INT NOT NULL,
    document_type VARCHAR(100),
    file_name     VARCHAR(250),
    file_url      VARCHAR(250),
    status        ENUM('Pending','Verified','Rejected') NOT NULL DEFAULT 'Pending',
    upload_date   DATE DEFAULT (CURRENT_DATE),
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_document         PRIMARY KEY (document_id),
    CONSTRAINT fk_document_student FOREIGN KEY (student_id)
                                   REFERENCES Student(student_id)
                                   ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE Evaluation (
    evaluation_id      INT NOT NULL AUTO_INCREMENT,
    intern_id          INT NOT NULL,
    supervisor_id      INT NOT NULL,
    evaluation_type    ENUM('Midterm','Final') NOT NULL,
    technical_score    TINYINT UNSIGNED,         -- [FIX] UNSIGNED: 0-255, scores 0-100
    communication_score TINYINT UNSIGNED,
    problem_solving    TINYINT UNSIGNED,
    attitude_score     TINYINT UNSIGNED,
    total_score        TINYINT UNSIGNED,         -- auto-calculated by trigger
    feedback           TEXT,
    status             ENUM('Pending','Submitted','Reviewed') NOT NULL DEFAULT 'Pending',
    submitted_at       DATETIME,
    created_at         DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at         DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_evaluation                PRIMARY KEY (evaluation_id),
    CONSTRAINT fk_evaluation_interninfo     FOREIGN KEY (intern_id)
                                            REFERENCES InternInfo(intern_id)
                                            ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_evaluation_supervisor     FOREIGN KEY (supervisor_id)
                                            REFERENCES Supervisor(supervisor_id)
                                            ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT uq_evaluation_intern_type    UNIQUE (intern_id, evaluation_type),
    CONSTRAINT ck_evaluation_technical      CHECK (technical_score     BETWEEN 0 AND 100),
    CONSTRAINT ck_evaluation_communication  CHECK (communication_score BETWEEN 0 AND 100),
    CONSTRAINT ck_evaluation_problem        CHECK (problem_solving      BETWEEN 0 AND 100),
    CONSTRAINT ck_evaluation_attitude       CHECK (attitude_score       BETWEEN 0 AND 100),
    CONSTRAINT ck_evaluation_total          CHECK (total_score          BETWEEN 0 AND 100)
);

CREATE TABLE Notification (
    notification_id INT NOT NULL AUTO_INCREMENT,
    application_id  INT NOT NULL,
    student_id      INT NOT NULL,
    company_id      INT NOT NULL,
    type            ENUM(
                        'APPLICATION_SUBMITTED',   -- [FIX] was 'APPLICATION SUBMITTED' (space)
                        'APPLICATION_REVIEWED',
                        'APPLICATION_ACCEPTED',
                        'APPLICATION_REJECTED',
                        'APPLICATION_WITHDRAW',
                        'APPLICATION_DEADLINE'
                    ) NOT NULL,
    message         TEXT        NOT NULL,
    is_read         TINYINT(1)  NOT NULL DEFAULT 0,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_notification              PRIMARY KEY (notification_id),
    CONSTRAINT fk_notification_application  FOREIGN KEY (application_id)
                                            REFERENCES Application(application_id)
                                            ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_notification_student      FOREIGN KEY (student_id)
                                            REFERENCES Student(student_id)
                                            ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_notification_company      FOREIGN KEY (company_id)
                                            REFERENCES Company(company_id)
                                            ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT ck_notification_is_read      CHECK (is_read IN (0, 1))
);

CREATE TABLE AdminAuditLog (
    log_id        INT NOT NULL AUTO_INCREMENT,
    admin_id      INT NOT NULL,
    action        VARCHAR(100) NOT NULL,
    target_table  VARCHAR(100) NOT NULL,
    target_id     INT,
    old_value     TEXT,
    new_value     TEXT,
    performed_at  DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_admin_auditlog  PRIMARY KEY (log_id),
    CONSTRAINT fk_auditlog_admin  FOREIGN KEY (admin_id)
                                  REFERENCES Admin(admin_id)
                                  ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE SupervisionRequest (
    request_id    INT PRIMARY KEY AUTO_INCREMENT,
    student_id    INT NOT NULL,
    supervisor_id INT NOT NULL,
    message       TEXT NULL,
    status        ENUM('Pending', 'Approved', 'Rejected') NOT NULL DEFAULT 'Pending',
    created_at    DATETIME DEFAULT NOW(),
    updated_at    DATETIME DEFAULT NOW() ON UPDATE NOW(),
    CONSTRAINT fk_sr_student    FOREIGN KEY (student_id)    REFERENCES Student(student_id)       ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_sr_supervisor FOREIGN KEY (supervisor_id) REFERENCES Supervisor(supervisor_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE SupervisorNotification (
    id            INT PRIMARY KEY AUTO_INCREMENT,
    supervisor_id INT NOT NULL,
    title         VARCHAR(200) NOT NULL,
    message       TEXT NOT NULL,
    is_read       TINYINT(1) NOT NULL DEFAULT 0,
    created_at    DATETIME DEFAULT NOW(),
    CONSTRAINT fk_sn_supervisor FOREIGN KEY (supervisor_id) REFERENCES Supervisor(supervisor_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE ApplicationDocument (
  id INT NOT NULL AUTO_INCREMENT,
  application_id INT NOT NULL,
  document_id INT NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_appdoc (application_id, document_id),
  FOREIGN KEY (application_id) REFERENCES Application(application_id) ON DELETE CASCADE,
  FOREIGN KEY (document_id) REFERENCES Document(document_id) ON DELETE CASCADE
);

-- ============================================================
-- INDEXES
-- ============================================================

-- InternPosition: filter by status, company+status, deadline scan
CREATE INDEX idx_internposition_status         ON InternPosition(status);
CREATE INDEX idx_internposition_company_status ON InternPosition(company_id, status);
CREATE INDEX idx_internposition_deadtime       ON InternPosition(deadtime);

-- Application: filter by status, student dashboard
CREATE INDEX idx_application_status            ON Application(status);
CREATE INDEX idx_application_student_status    ON Application(student_id, status);

-- Notification: student unread count, company unread count
CREATE INDEX idx_notification_student_read     ON Notification(student_id, is_read);
CREATE INDEX idx_notification_company_read     ON Notification(company_id, is_read);

-- InternInfo: filter by status, supervisor workload
CREATE INDEX idx_interninfo_status             ON InternInfo(status);
CREATE INDEX idx_interninfo_supervisor         ON InternInfo(supervisor_id, status);

-- Evaluation: supervisor pending evals, status filter
CREATE INDEX idx_evaluation_status             ON Evaluation(status);
CREATE INDEX idx_evaluation_supervisor_status  ON Evaluation(supervisor_id, status);

-- Document: student document list with status filter
CREATE INDEX idx_document_student_status       ON Document(student_id, status);

-- AdminAuditLog: time-ordered lookup
CREATE INDEX idx_auditlog_performed_at         ON AdminAuditLog(performed_at);

-- ============================================================
-- TRIGGERS
-- ============================================================

DELIMITER //

-- ── 1. Validate before a student applies ─────────────────────────────────────
--   Blocks application if:
--     • position is not Active
--     • position is fully booked (filled_slots >= slots)
--     • application deadline has passed
CREATE TRIGGER before_application_insert_validate
BEFORE INSERT ON Application
FOR EACH ROW
BEGIN
    DECLARE v_status      VARCHAR(20);
    DECLARE v_slots       TINYINT UNSIGNED;
    DECLARE v_filled      TINYINT UNSIGNED;
    DECLARE v_deadline    DATE;

    SELECT status, slots, filled_slots, deadtime
    INTO   v_status, v_slots, v_filled, v_deadline
    FROM   InternPosition
    WHERE  intern_position_id = NEW.intern_position_id;

    IF v_status != 'Active' THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Cannot apply: this position is not currently active.';
    END IF;

    IF v_filled >= v_slots THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Cannot apply: no slots remaining for this position.';
    END IF;

    IF v_deadline IS NOT NULL AND v_deadline < CURDATE() THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Cannot apply: the application deadline has passed.';
    END IF;
END //


-- ── 2. Notify company when student submits application (kept from original) ───
CREATE TRIGGER after_application_insert_notify
AFTER INSERT ON Application
FOR EACH ROW
BEGIN
    DECLARE v_company_id INT;

    SELECT company_id INTO v_company_id
    FROM   InternPosition
    WHERE  intern_position_id = NEW.intern_position_id;

    INSERT INTO Notification
        (application_id, student_id, company_id, type, message, is_read, created_at)
    VALUES
        (NEW.application_id,
         NEW.student_id,
         v_company_id,
         'APPLICATION_SUBMITTED',
         CONCAT('New application received from student ID: ', NEW.student_id),
         FALSE,
         NOW());
END //


-- ── 3. Notify student when their application status changes ──────────────────
CREATE TRIGGER after_application_update_notify_student
AFTER UPDATE ON Application
FOR EACH ROW
BEGIN
    DECLARE v_company_id INT;
    DECLARE v_msg        TEXT;
    DECLARE v_type       VARCHAR(50);

    -- Only fire when status actually changed
    IF OLD.status != NEW.status THEN

        SELECT company_id INTO v_company_id
        FROM   InternPosition
        WHERE  intern_position_id = NEW.intern_position_id;

        CASE NEW.status
            WHEN 'Reviewed' THEN
                SET v_type = 'APPLICATION_REVIEWED';
                SET v_msg  = CONCAT('Your application #', NEW.application_id,
                                    ' has been reviewed by the company.');
            WHEN 'Accepted' THEN
                SET v_type = 'APPLICATION_ACCEPTED';
                SET v_msg  = CONCAT('Congratulations! Your application #',
                                    NEW.application_id, ' has been accepted.');
            WHEN 'Rejected' THEN
                SET v_type = 'APPLICATION_REJECTED';
                SET v_msg  = CONCAT('Your application #', NEW.application_id,
                                    ' was not successful this time.');
            WHEN 'Withdraw' THEN
                SET v_type = 'APPLICATION_WITHDRAW';
                SET v_msg  = CONCAT('Your application #', NEW.application_id,
                                    ' has been withdrawn.');
            ELSE
                SET v_type = NULL;
        END CASE;

        IF v_type IS NOT NULL THEN
            INSERT INTO Notification
                (application_id, student_id, company_id, type, message, is_read, created_at)
            VALUES
                (NEW.application_id, NEW.student_id, v_company_id,
                 v_type, v_msg, FALSE, NOW());
        END IF;

    END IF;
END //


-- ── 4. Manage filled_slots when application status changes ───────────────────
--   • Accepted           → increment filled_slots
--   • Accepted → Withdraw/Rejected → decrement filled_slots
--   • Position auto-closes when filled_slots = slots
CREATE TRIGGER after_application_update_slots
AFTER UPDATE ON Application
FOR EACH ROW
BEGIN
    IF OLD.status != NEW.status THEN

        -- Student accepted → one more slot taken
        IF NEW.status = 'Accepted' AND OLD.status != 'Accepted' THEN
            UPDATE InternPosition
            SET    filled_slots = filled_slots + 1
            WHERE  intern_position_id = NEW.intern_position_id;

            -- Auto-close position if fully booked
            UPDATE InternPosition
            SET    status = 'Closed'
            WHERE  intern_position_id = NEW.intern_position_id
              AND  filled_slots >= slots;

        -- Was accepted, now withdrawing or rejected → free the slot
        ELSEIF OLD.status = 'Accepted'
           AND NEW.status IN ('Withdraw', 'Rejected') THEN
            UPDATE InternPosition
            SET    filled_slots = GREATEST(filled_slots - 1, 0),
                   status       = CASE
                                    WHEN status = 'Closed' THEN 'Active'
                                    ELSE status
                                  END
            WHERE  intern_position_id = NEW.intern_position_id;
        END IF;

    END IF;
END //


-- ── 5. Auto-calculate total_score on Evaluation INSERT ───────────────────────
--   total_score = ROUND( average of all non-NULL sub-scores )
CREATE TRIGGER before_evaluation_insert_set_total
BEFORE INSERT ON Evaluation
FOR EACH ROW
BEGIN
    DECLARE v_sum   INT DEFAULT 0;
    DECLARE v_count INT DEFAULT 0;

    IF NEW.technical_score IS NOT NULL THEN
        SET v_sum = v_sum + NEW.technical_score; SET v_count = v_count + 1;
    END IF;
    IF NEW.communication_score IS NOT NULL THEN
        SET v_sum = v_sum + NEW.communication_score; SET v_count = v_count + 1;
    END IF;
    IF NEW.problem_solving IS NOT NULL THEN
        SET v_sum = v_sum + NEW.problem_solving; SET v_count = v_count + 1;
    END IF;
    IF NEW.attitude_score IS NOT NULL THEN
        SET v_sum = v_sum + NEW.attitude_score; SET v_count = v_count + 1;
    END IF;

    IF v_count > 0 THEN
        SET NEW.total_score = ROUND(v_sum / v_count);
    END IF;
END //


-- ── 6. Auto-recalculate total_score on Evaluation UPDATE ─────────────────────
CREATE TRIGGER before_evaluation_update_set_total
BEFORE UPDATE ON Evaluation
FOR EACH ROW
BEGIN
    DECLARE v_sum   INT DEFAULT 0;
    DECLARE v_count INT DEFAULT 0;

    IF NEW.technical_score IS NOT NULL THEN
        SET v_sum = v_sum + NEW.technical_score; SET v_count = v_count + 1;
    END IF;
    IF NEW.communication_score IS NOT NULL THEN
        SET v_sum = v_sum + NEW.communication_score; SET v_count = v_count + 1;
    END IF;
    IF NEW.problem_solving IS NOT NULL THEN
        SET v_sum = v_sum + NEW.problem_solving; SET v_count = v_count + 1;
    END IF;
    IF NEW.attitude_score IS NOT NULL THEN
        SET v_sum = v_sum + NEW.attitude_score; SET v_count = v_count + 1;
    END IF;

    IF v_count > 0 THEN
        SET NEW.total_score = ROUND(v_sum / v_count);
    END IF;
END //


-- ── 7. Auto-create Midterm & Final evaluation records when intern is assigned ─
--   When a row is inserted into InternInfo, two blank Evaluation rows
--   (one Midterm, one Final) are pre-created with status 'Pending'
--   so supervisors always see what evaluations are expected.
CREATE TRIGGER after_interninfo_insert_create_evaluations
AFTER INSERT ON InternInfo
FOR EACH ROW
BEGIN
    INSERT INTO Evaluation
        (intern_id, supervisor_id, evaluation_type, status, created_at, updated_at)
    VALUES
        (NEW.intern_id, NEW.supervisor_id, 'Midterm', 'Pending', NOW(), NOW()),
        (NEW.intern_id, NEW.supervisor_id, 'Final',   'Pending', NOW(), NOW());
END //

DELIMITER ;

-- ============================================================
-- SCHEDULED EVENT — auto-expire past-deadline positions
-- ============================================================
-- Requires: SET GLOBAL event_scheduler = ON;  (run once as root)

SET GLOBAL event_scheduler = ON;

CREATE EVENT IF NOT EXISTS evt_expire_internpositions
ON SCHEDULE EVERY 1 DAY
STARTS (CURRENT_DATE + INTERVAL 1 DAY)
COMMENT 'Sets InternPosition status to Expired when deadline has passed'
DO
    UPDATE InternPosition
    SET    status = 'Expired'
    WHERE  deadtime < CURDATE()
      AND  status   = 'Active';
