CREATE DATABASE webint;
USE webint;

-- No dependencies

CREATE TABLE UserAccount (
	user_id 		INT AUTO_INCREMENT NOT NULL,
    user_email 		VARCHAR(100) NOT NULL,
    user_password 	VARCHAR(255) NOT NULL,
    role 			ENUM('student', 'supervisor', 'company', 'admin') NOT NULL,
    created_at 		DATETIME DEFAULT CURRENT_TIMESTAMP,
	updated_at 		DATETIME DEFAULT CURRENT_TIMESTAMP 
							 ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT pk_useraccount 				PRIMARY KEY (user_id),
    CONSTRAINT uq_useraccount_email 		UNIQUE (user_email),
    CONSTRAINT ck_useraccount_email			CHECK (user_email LIKE '%@gmail.com'),
    CONSTRAINT ck_user_account_password 	CHECK (CHAR_LENGTH(user_password) >= 8)
);

CREATE TABLE University (
	university_id	INT NOT NULL AUTO_INCREMENT,
    name			VARCHAR(100) NOT NULL,
    address			VARCHAR(255) NOT NULL,
    email			VARCHAR(100) NOT NULL,
    phone			VARCHAR(20) NOT NULL,
	website			VARCHAR(150),
    created_at		DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at		DATETIME DEFAULT CURRENT_TIMESTAMP
							 ON UPDATE CURRENT_TIMESTAMP,
                             
	CONSTRAINT pk_university 			PRIMARY KEY (university_id),
    CONSTRAINT uq_university_email 		UNIQUE (email),
    CONSTRAINT ck_university_email 		CHECK (email LIKE '%@gmail.com'),
    CONSTRAINT ck_university_phone 		CHECK (CHAR_LENGTH (phone) BETWEEN 9 AND 10),
    CONSTRAINT ck_university_website	CHECK (website IS NULL OR website LIKE 'http%')
    
);

CREATE TABLE Skill (
	skill_id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    category ENUM('Frontend', 'Backend', 'DataBase', 'Mobile', 'DevOps', 'Design', 'Data', 'AI_ML', 'Programming', 'Other') NOT NULL,
    created_at 		DATETIME DEFAULT CURRENT_TIMESTAMP,
	updated_at 		DATETIME DEFAULT CURRENT_TIMESTAMP 
							 ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT pk_skill PRIMARY KEY (skill_id),
    CONSTRAINT uq_skill_name UNIQUE (name),
    CONSTRAINT ck_skill_name CHECK (CHAR_LENGTH(name) > 0)
);

-- Target User of System

CREATE TABLE Student (
	student_id 			INT AUTO_INCREMENT NOT NULL,
    user_id 			INT NOT NULL,
    university_id 		INT NOT NULL,
    name 				VARCHAR(50) NOT NULL,
    gender 				ENUM('M', 'F') NOT NULL,
    date_of_birth 		DATE NOT NULL,
    nationality 		VARCHAR(50) NOT NULL,
    marital_status 		ENUM('Single', 'Married') NOT NULL DEFAULT 'Single',
    phone 				VARCHAR(20) NOT NULL,
    address 			VARCHAR(200) NOT NULL,
    year_of_study 		TINYINT NOT NULL,
    major 				VARCHAR(100) NOT NULL,
    gpa 				DECIMAL(3,2),
    profile_picrture 	VARCHAR(250),
    created_at      	DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      	DATETIME DEFAULT CURRENT_TIMESTAMP
								 ON UPDATE CURRENT_TIMESTAMP,
                                 
    CONSTRAINT pk_student 				PRIMARY KEY(student_id),
    CONSTRAINT fk_student_useraccount 	FOREIGN KEY(user_id)
										REFERENCES UserAccount(user_id)
										ON DELETE RESTRICT
										ON UPDATE CASCADE,
	CONSTRAINT fk_student_university  	FOREIGN KEY(university_id)
										REFERENCES University(university_id)
										ON DELETE RESTRICT
										ON UPDATE CASCADE,
	CONSTRAINT ck_student_gpa 			CHECK (gpa BETWEEN 0.00 AND 4.00),
    CONSTRAINT ck_student_date_of_birth CHECK (date_of_birth <= '2020-12-31' AND date_of_birth >= '1900-01-01'),
    CONSTRAINT ck_student_phone 		CHECK (CHAR_LENGTH(phone) BETWEEN 9 AND 10)
);

CREATE TABLE Supervisor (
    supervisor_id 	INT NOT NULL AUTO_INCREMENT,
	user_id      	INT NOT NULL,
    university_id 	INT NOT NULL,
    name         	VARCHAR(50) NOT NULL,
    phone        	VARCHAR(20) NOT NULL,
    department		VARCHAR(100) NOT NULL,
    position     	ENUM ('Lecturer', 'Senior_Lecturer','Associate_Professor', 'Professor', 'Advisor') NOT NULL
					DEFAULT 'Lecturer',
	specialization  VARCHAR(150),
    office          VARCHAR(100),
    office_hours    VARCHAR(100),
    status			ENUM('Active', 'Inactive') NOT NULL
					DEFAULT 'Active',
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP
							 ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT pk_supevisor 				PRIMARY KEY (supervisor_id),
    CONSTRAINT fk_supervisor_useraccount 	FOREIGN KEY (user_id)
											REFERENCES UserAccount(user_id)
											ON DELETE RESTRICT
											ON UPDATE CASCADE,
	CONSTRAINT fk_supervisor_university		FOREIGN KEY (university_id)
											REFERENCES University(university_id)
                                            ON DELETE RESTRICT
                                            ON UPDATE CASCADE,
	CONSTRAINT uq_supervisor_phone 			UNIQUE (phone),
    CONSTRAINT ck_supervisor_phone 			CHECK (CHAR_LENGTH (phone) BETWEEN 9 AND 10)
);

CREATE TABLE Company (
	company_id 				INT NOT NULL AUTO_INCREMENT,
    user_id 				INT NOT NULL,
    name 					VARCHAR(100) NOT NULL,
    industry 				VARCHAR(100) NOT NULL,
    phone 					VARCHAR(20) NOT NULL,
    address 				VARCHAR(100) NOT NULL,
    website 				VARCHAR(250),
    description_company 	TEXT,
    status 					ENUM('Active', 'Inactive', 'Suspended') NOT NULL 
							DEFAULT 'Active',
	verified_status 		ENUM('Pending', 'Verified', 'Rejected') NOT NULL 
							DEFAULT 'Pending',
	created_at      		DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      		DATETIME DEFAULT CURRENT_TIMESTAMP
									 ON UPDATE CURRENT_TIMESTAMP,
                                     
	CONSTRAINT pk_company 				PRIMARY KEY(company_id),
    CONSTRAINT fk_company_useraccount 	FOREIGN KEY(user_id) 
										REFERENCES UserAccount(user_id)
                                        ON DELETE RESTRICT
                                        ON UPDATE CASCADE,
	CONSTRAINT uq_company_name 			UNIQUE(name),
    CONSTRAINT ck_company_phone 		CHECK(CHAR_LENGTH(phone) BETWEEN 9 AND 10),
    CONSTRAINT ck_company_website 		CHECK(website IS NULL OR website LIKE 'http%')
    
);

CREATE TABLE Admin (
	admin_id 	INT NOT NULL AUTO_INCREMENT,
    user_id		INT NOT NULL,
    name 		VARCHAR(50) NOT NULL,
    phone 		VARCHAR(20) NOT NULL,
    status		ENUM('Active', 'Inactive', 'Suspended') NOT NULL
				DEFAULT 'Active',
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
						 ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT pk_admin 			PRIMARY KEY(admin_id),
    CONSTRAINT fk_admin_useraccount FOREIGN KEY(user_id)
									REFERENCES UserAccount(user_id)
                                    ON DELETE RESTRICT
                                    ON UPDATE CASCADE,
	CONSTRAINT ck_admin_phone 		CHECK (CHAR_LENGTH(phone) BETWEEN 9 AND 10)
);

CREATE TABLE InternPosition (
	intern_position_id 	INT NOT NULL AUTO_INCREMENT,
    company_id 			INT NOT NULL,
    title			 	VARCHAR(150) NOT NULL,
    description_post 	TEXT,
    location 			VARCHAR(250) NOT NULL,
    department 			VARCHAR(100),
    salary_min 			DECIMAL(10,2),
    salary_max 			DECIMAL(10,2),
    position_type 		ENUM('Full-Time', 'Part-Time', 'Remote', 'Hybrid') NOT NULL DEFAULT 'Full-Time',
    posted_date 		DATE DEFAULT (CURRENT_DATE),
    deadtime 			DATE,
    status 				ENUM('Active', 'Draft', 'Closed', 'Expired') NOT NULL DEFAULT 'Draft',
    slots 				TINYINT NOT NULL DEFAULT 1,
    filled_slots 		TINYINT NOT NULL DEFAULT 0,
    created_at      	DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      	DATETIME DEFAULT CURRENT_TIMESTAMP
								 ON UPDATE CURRENT_TIMESTAMP,
                                     
	CONSTRAINT pk_intern_position 					PRIMARY KEY(intern_position_id),
    CONSTRAINT fk_intern_position_company 			FOREIGN KEY(company_id) 
													REFERENCES Company(company_id)
													ON DELETE RESTRICT
													ON UPDATE CASCADE,
    CONSTRAINT ck_intern_position_salary 			CHECK (salary_min <= salary_max),
    CONSTRAINT ck_intern_position_salary_min 		CHECK (salary_min >= 0),
    CONSTRAINT ck_intern_position_slots 			CHECK (slots > 0),
    CONSTRAINT ck_intern_position_filled_slots 		CHECK (filled_slots >= 0),
    CONSTRAINT ck_intern_position_slots_not_exceed 	CHECK (filled_slots <= slots)
);

CREATE TABLE PositionSkill (
	intern_position_id 	INT NOT NULL,
    skill_id 			INT NOT NULL,
    created_at 			DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT pk_position_skill 				PRIMARY KEY(intern_position_id, skill_id),
    CONSTRAINT fk_positionskill_internposition 	FOREIGN KEY(intern_position_id)
												REFERENCES InternPosition(intern_position_id)
                                                ON DELETE RESTRICT
                                                ON UPDATE CASCADE,
	CONSTRAINT fk_positionskill_skill 			FOREIGN KEY(skill_id) 
												REFERENCES Skill(skill_id)
												ON DELETE RESTRICT
												ON UPDATE CASCADE
);

CREATE TABLE Application (
	application_id 		INT NOT NULL AUTO_INCREMENT,
    student_id 			INT NOT NULL,
    intern_position_id 	INT NOT NULL,
    apply_date 			DATE NOT NULL
						DEFAULT (CURRENT_DATE),
	cover_letter 		TEXT,
    remarks 			TEXT,
    status 				ENUM('Pending', 'Reviewed', 'Accepted', 'Rejected', 'Withdraw') NOT NULL
						DEFAULT 'Pending',
	created_at      	DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      	DATETIME DEFAULT CURRENT_TIMESTAMP
								 ON UPDATE CURRENT_TIMESTAMP,
                                 
	CONSTRAINT pk_application 					PRIMARY KEY(application_id),
    CONSTRAINT fk_application_student 			FOREIGN KEY(student_id) 
												REFERENCES Student(student_id)
												ON DELETE RESTRICT
												ON UPDATE CASCADE,
	CONSTRAINT fk_application_intern_position 	FOREIGN KEY(intern_position_id)
												REFERENCES InternPosition(intern_position_id)
                                                ON DELETE RESTRICT
                                                ON UPDATE CASCADE,
	CONSTRAINT uq_application_student_position 	UNIQUE (student_id, intern_position_id)
);

CREATE TABLE Interview (
	interview_id 	INT NOT NULL AUTO_INCREMENT,
    application_id 	INT NOT NULL,
    company_id 		INT NOT NULL,
    student_id 		INT NOT NULL,
    
    scheduled_at 	DATETIME NOT NULL,
    location 		TEXT NOT NULL,
    interview_type 	ENUM('Online', 'Onsite') NOT NULL
					DEFAULT 'Online',
	status 			ENUM('Scheduled', 'Completed', 'Cancelled', 'Rescheduled') NOT NULL
					DEFAULT 'Scheduled',
	created_at 		DATETIME DEFAULT CURRENT_TIMESTAMP,
	updated_at 		DATETIME DEFAULT CURRENT_TIMESTAMP 
							 ON UPDATE CURRENT_TIMESTAMP,
                             
	CONSTRAINT pk_interview 				PRIMARY KEY (interview_id),
    CONSTRAINT fk_interview_application 	FOREIGN KEY (application_id) 
											REFERENCES Application(application_id)
											ON DELETE RESTRICT
											ON UPDATE CASCADE,
	CONSTRAINT fk_interviw_company 			FOREIGN KEY (company_id)
											REFERENCES Company(company_id)
											ON DELETE RESTRICT
											ON UPDATE CASCADE,
	CONSTRAINT fk_interview_student 		FOREIGN KEY (student_id)
											REFERENCES Student(student_id)
											ON DELETE RESTRICT
											ON UPDATE CASCADE,
	CONSTRAINT uq_interview_application 	UNIQUE (application_id)
);

CREATE TABLE InternInfo (
	intern_id 			INT NOT NULL AUTO_INCREMENT,
    student_id 			INT NOT NULL,
    company_id 			INT NOT NULL,
    supervisor_id 		INT NOT NULL,
    intern_position_id 	INT NOT NULL,
    
    department 			VARCHAR(100) NOT NULL,
    field				VARCHAR(100),
    start_date 			DATE NOT NULL,
    end_date 			DATE NOT NULL,
    status 				ENUM('Pending', 'Active', 'Completed','Terminated') NOT NULL
						DEFAULT 'Pending',
	created_at      	DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      	DATETIME DEFAULT CURRENT_TIMESTAMP
								 ON UPDATE CURRENT_TIMESTAMP,
                             
	CONSTRAINT pk_interninfo 					PRIMARY KEY(intern_id),
    CONSTRAINT fk_interninfo_student 			FOREIGN KEY(student_id)
												REFERENCES Student(student_id)
												ON DELETE RESTRICT
												ON UPDATE CASCADE,
	CONSTRAINT fk_interninfo_company 			FOREIGN KEY(company_id)
												REFERENCES Company(company_id)
												ON DELETE RESTRICT
												ON UPDATE CASCADE,
	CONSTRAINT fk_interninfo_supervisor 		FOREIGN KEY(supervisor_id)
												REFERENCES Supervisor(supervisor_id)
												ON DELETE RESTRICT
												ON UPDATE CASCADE,
	CONSTRAINT fk_interninfo_internposition 	FOREIGN KEY(intern_position_id)
												REFERENCES InternPosition(intern_position_id)
												ON DELETE RESTRICT
												ON UPDATE CASCADE,
	CONSTRAINT uq_interninfo_student_position 	UNIQUE (student_id, intern_position_id),
    CONSTRAINT ck_interninfo_dates 				CHECK (end_date > start_date)
	
);

CREATE TABLE Document (
	document_id 	INT NOT NULL AUTO_INCREMENT,
    student_id 		INT NOT NULL,
    document_type 	VARCHAR(100),
    file_name 		VARCHAR(250),
    file_url 		VARCHAR(250),
	status 			ENUM('Pending', 'Verified', 'Rejected') NOT NULL DEFAULT 'Pending',
    upload_date 	DATE DEFAULT (CURRENT_DATE),
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP
							 ON UPDATE CURRENT_TIMESTAMP,
                                 
	CONSTRAINT pk_document 			PRIMARY KEY(document_id),
    CONSTRAINT fk_document_student 	FOREIGN KEY(student_id) 
									REFERENCES Student(student_id)
                                    ON DELETE RESTRICT
                                    ON UPDATE CASCADE
);

CREATE TABLE Evaluation (
	evaluation_id 			INT NOT NULL AUTO_INCREMENT,
    intern_id 				INT NOT NULL,
    supervisor_id 			INT NOT NULL,
    evaluation_type 		ENUM('Midterm', 'Final') NOT NULL,
    technical_score 		TINYINT,
    communication_score 	TINYINT,
    problem_solving 		TINYINT,
    attitude_score 			TINYINT,
    total_score 			TINYINT,
    feedback 				TEXT,
    status 					ENUM('Pending', 'Submitted', 'Reviewed') NOT NULL
							DEFAULT 'Pending',
	submitted_at 			DATETIME,
    created_at      		DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      		DATETIME DEFAULT CURRENT_TIMESTAMP
									 ON UPDATE CURRENT_TIMESTAMP,
                             
	CONSTRAINT pk_evaluation 					PRIMARY KEY(evaluation_id),
    CONSTRAINT fk_evaluation_interninfo 		FOREIGN KEY(intern_id)
												REFERENCES InternInfo(intern_id)
												ON DELETE RESTRICT
												ON UPDATE CASCADE,
	CONSTRAINT fk_evaluation_supervisor 		FOREIGN KEY(supervisor_id)
												REFERENCES Supervisor(supervisor_id)
												ON DELETE RESTRICT
												ON UPDATE CASCADE,
	CONSTRAINT uq_evaluation_intern_type 		UNIQUE(intern_id, evaluation_type),
    CONSTRAINT ck_evalution_technical 			CHECK(technical_score BETWEEN 0 AND 100),
    CONSTRAINT ck_evalution_communication 		CHECK(communication_score BETWEEN 0 AND 100),
    CONSTRAINT ck_evalution_problem_solving 	CHECK(problem_solving BETWEEN 0 AND 100),
    CONSTRAINT ck_evalution_attitude 			CHECK(attitude_score BETWEEN 0 AND 100),
    CONSTRAINT ck_evalution_total 				CHECK(total_score BETWEEN 0 AND 100)
);

CREATE TABLE Notification (
	notification_id 	INT NOT NULL AUTO_INCREMENT,
	application_id 		INT NOT NULL,
    student_id 			INT NOT NULL,
    company_id 			INT NOT NULL,
    
    type 				ENUM('APPLICATION SUBMITTED', 'APPLICATION_REVIEWED', 'APPLICATION_ACCEPTED', 'APPLICATION_REJECTED', 'APPLICATION_WITHDRAW', 'APPLICATION_DEADLINE') NOT NULL,
    message 			TEXT NOT NULL,
    is_read 			TINYINT(1) NOT NULL
						DEFAULT 0,
	created_at 			DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT pk_notification 				PRIMARY KEY (notification_id),
    CONSTRAINT fk_notification_application 	FOREIGN KEY (application_id)
											REFERENCES Application(application_id)
                                            ON DELETE RESTRICT
                                            ON UPDATE CASCADE,
	CONSTRAINT fk_notification_student 		FOREIGN KEY (student_id)
											REFERENCES Student(student_id)
                                            ON DELETE RESTRICT
                                            ON UPDATE CASCADE,
	CONSTRAINT fk_notification_company 		FOREIGN KEY (company_id)
											REFERENCES Company(company_id)
                                            ON DELETE RESTRICT
                                            ON UPDATE CASCADE,
	CONSTRAINT ck_notification_is_read 		CHECK (is_read IN (0, 1))
	
);
    
CREATE TABLE AdminAuditLog(
	log_id 			INT NOT NULL AUTO_INCREMENT,
    admin_id 		INT NOT NULL,
    action 			VARCHAR(100) NOT NULL,
    target_table 	VARCHAR(100) NOT NULL,
    target_id 		INT,
    old_value 		TEXT,
    new_value 		TEXT,
    performed_at 	DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT pk_admin_auditlog 	PRIMARY KEY(log_id),
    CONSTRAINT fk_auditlog_admin 	FOREIGN KEY (admin_id)
									REFERENCES Admin(admin_id)
                                    ON DELETE RESTRICT
                                    ON UPDATE CASCADE
);

DELIMITER //

CREATE TRIGGER after_application_insert_notify
AFTER INSERT ON Application
FOR EACH ROW
BEGIN

	DECLARE v_company_id INT;
    
    SELECT company_id
    INTO v_company_id
    FROM InternPosition
    WHERE intern_position_id = NEW.intern_position_id;

	INSERT INTO Notification (
		application_id,
        student_id,
        company_id,
        type,
        message,
        is_read,
        created_at
	)
    VALUES (
		NEW.application_id,
        NEW.student_id,
        v_company_id,
        'APPLICATION_SUBMITTED',
        CONCAT('New application received from student ID: ', NEW.student_id),
        FALSE,
        NOW()
	);

END //
DELIMITER ;

DELIMITER //











    