"""
seed.py — Populate the WEBIN database with realistic sample data.

Usage (from /backend folder):
    python seed.py

Run AFTER:
  • uvicorn is stopped (or the DB tables already exist)
  • You have run the two ALTER / CREATE TABLE SQL statements for
    SupervisionRequest and SupervisorNotification

WARNING: This script CLEARS all existing rows before inserting.
"""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from datetime import date, datetime, timedelta
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from sqlalchemy import text

import models  # registers all models with Base.metadata
from database import SessionLocal
from models.user import UserAccount
from models.university import University
from models.student import Student
from models.supervisor import Supervisor
from models.company import Company
from models.admin import Admin
from models.intern_position import InternPosition
from models.application import Application
from models.interview import Interview
from models.intern_info import InternInfo
from models.evaluation import Evaluation
from models.document import Document
from models.notification import Notification
from models.supervision_request import SupervisionRequest
from models.supervisor_notification import SupervisorNotification
from models.skill import Skill
from models.intern_position import PositionSkill

pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")
hash_pw = lambda p: pwd.hash(p)

TODAY = date.today()

# ─────────────────────────────────────────────────────────────────────────────
def clear(db: Session):
    print("  Clearing existing data …")
    # Disable FK checks so we can truncate in any order
    db.execute(text("SET FOREIGN_KEY_CHECKS = 0"))
    tables = [
        "SupervisorNotification",
        "SupervisionRequest",
        "Evaluation",
        "Document",
        "Notification",
        "InternInfo",
        "Interview",
        "Application",
        "PositionSkill",
        "InternPosition",
        "Skill",
        "Admin",
        "Student",
        "Supervisor",
        "Company",
        "UserAccount",
        "University",
    ]
    for t in tables:
        db.execute(text(f"TRUNCATE TABLE `{t}`"))
    db.execute(text("SET FOREIGN_KEY_CHECKS = 1"))
    db.commit()
    print("  ✓ Tables cleared")


# ─────────────────────────────────────────────────────────────────────────────
def seed(db: Session):

    # ── 0. Skills ─────────────────────────────────────────────────────────────
    print("  Seeding skills …")
    skill_data = [
        ("Python",        "Programming"),
        ("JavaScript",    "Programming"),
        ("Java",          "Programming"),
        ("C++",           "Programming"),
        ("React",         "Frontend"),
        ("Vue.js",        "Frontend"),
        ("HTML/CSS",      "Frontend"),
        ("Tailwind CSS",  "Frontend"),
        ("FastAPI",       "Backend"),
        ("Django",        "Backend"),
        ("Node.js",       "Backend"),
        ("REST API",      "Backend"),
        ("MySQL",         "DataBase"),
        ("PostgreSQL",    "DataBase"),
        ("MongoDB",       "DataBase"),
        ("SQLAlchemy",    "DataBase"),
        ("Docker",        "DevOps"),
        ("Git",           "DevOps"),
        ("AWS",           "DevOps"),
        ("Linux",         "DevOps"),
        ("Figma",         "Design"),
        ("Adobe XD",      "Design"),
        ("UI/UX Design",  "Design"),
        ("Power BI",      "Data"),
        ("Tableau",       "Data"),
        ("Excel",         "Data"),
        ("Pandas",        "Data"),
        ("Machine Learning", "AI_ML"),
        ("PyTorch",       "AI_ML"),
        ("TensorFlow",    "AI_ML"),
        ("scikit-learn",  "AI_ML"),
        ("Flutter",       "Mobile"),
        ("React Native",  "Mobile"),
    ]
    skills_objs = [Skill(name=n, category=c) for n, c in skill_data]
    db.add_all(skills_objs)
    db.flush()
    # Build a lookup: name → Skill object
    skill_map = {s.name: s for s in skills_objs}
    print(f"  ✓ {len(skills_objs)} skills")

    # ── 1. Universities ───────────────────────────────────────────────────────
    print("  Seeding universities …")
    unis = [
        University(name="Universiti Malaya (UM)",              address="Jalan Universiti, 50603 KL",             email="info@um.edu.my",   phone="+60-3-7967-7022", website="https://um.edu.my"),
        University(name="Universiti Teknologi Malaysia (UTM)", address="81310 UTM Skudai, Johor Bahru",          email="info@utm.my",      phone="+60-7-553-5000",  website="https://utm.my"),
        University(name="Universiti Putra Malaysia (UPM)",    address="43400 UPM Serdang, Selangor",            email="info@upm.edu.my",   phone="+60-3-9769-6000", website="https://upm.edu.my"),
        University(name="Universiti Kebangsaan Malaysia (UKM)",address="43600 UKM Bangi, Selangor",             email="info@ukm.my",      phone="+60-3-8921-5555", website="https://ukm.my"),
        University(name="Multimedia University (MMU)",         address="Persiaran Multimedia, 63100 Cyberjaya",  email="info@mmu.edu.my",  phone="+60-3-8312-5000", website="https://mmu.edu.my"),
    ]
    db.add_all(unis)
    db.flush()
    um, utm, upm, ukm, mmu = unis
    print(f"  ✓ {len(unis)} universities")

    # ── 2. UserAccounts ───────────────────────────────────────────────────────
    print("  Seeding user accounts …")
    pw = hash_pw("Password123!")   # all demo accounts use the same password

    u_admin  = UserAccount(user_email="admin@webin.com",         user_password=pw, role="admin")
    u_co1    = UserAccount(user_email="techcorp@webin.com",      user_password=pw, role="company")
    u_co2    = UserAccount(user_email="datasolutions@webin.com", user_password=pw, role="company")
    u_co3    = UserAccount(user_email="creativelab@webin.com",   user_password=pw, role="company")
    u_sup1   = UserAccount(user_email="dr.ahmad@webin.com",      user_password=pw, role="supervisor")
    u_sup2   = UserAccount(user_email="dr.siti@webin.com",       user_password=pw, role="supervisor")
    u_sup3   = UserAccount(user_email="prof.chen@webin.com",     user_password=pw, role="supervisor")
    u_stu1   = UserAccount(user_email="ali@webin.com",           user_password=pw, role="student")
    u_stu2   = UserAccount(user_email="nurul@webin.com",         user_password=pw, role="student")
    u_stu3   = UserAccount(user_email="kevin@webin.com",         user_password=pw, role="student")
    u_stu4   = UserAccount(user_email="farah@webin.com",         user_password=pw, role="student")
    u_stu5   = UserAccount(user_email="rajan@webin.com",         user_password=pw, role="student")

    all_users = [u_admin,u_co1,u_co2,u_co3,u_sup1,u_sup2,u_sup3,
                 u_stu1,u_stu2,u_stu3,u_stu4,u_stu5]
    db.add_all(all_users)
    db.flush()
    print(f"  ✓ {len(all_users)} user accounts (password: Password123!)")

    # ── 3. Admin ──────────────────────────────────────────────────────────────
    admin = Admin(user_id=u_admin.user_id, name="System Admin", phone="+60-3-0000-0001")
    db.add(admin)
    db.flush()
    print("  ✓ 1 admin")

    # ── 4. Companies ──────────────────────────────────────────────────────────
    print("  Seeding companies …")
    co1 = Company(
        user_id=u_co1.user_id, name="TechCorp Malaysia Sdn Bhd",
        industry="Information Technology", phone="+60-3-2345-6789",
        address="Level 15, Menara TM, Jalan Pantai Baharu, 50672 Kuala Lumpur",
        website="https://techcorp.my",
        description_company="A leading IT solutions provider specialising in cloud infrastructure and enterprise software.",
        status="Active", verified_status="Verified",
    )
    co2 = Company(
        user_id=u_co2.user_id, name="Data Solutions Bhd",
        industry="Data Analytics", phone="+60-3-8888-1234",
        address="Suite 8-1, Menara Mustapha, Jalan Sultan Ismail, 50250 KL",
        website="https://datasolutions.my",
        description_company="Specialist in big data analytics, machine learning pipelines and BI dashboards.",
        status="Active", verified_status="Verified",
    )
    co3 = Company(
        user_id=u_co3.user_id, name="Creative Lab Studio",
        industry="Digital Media & Design", phone="+60-3-7712-5500",
        address="G-02, Damansara Utama Business Centre, PJ",
        website="https://creativelab.my",
        description_company="Award-winning digital creative studio for branding, UX and motion design.",
        status="Active", verified_status="Pending",
    )
    db.add_all([co1, co2, co3])
    db.flush()
    print("  ✓ 3 companies")

    # ── 5. Supervisors ────────────────────────────────────────────────────────
    print("  Seeding supervisors …")
    sup1 = Supervisor(
        user_id=u_sup1.user_id, university_id=um.university_id,
        name="Dr. Ahmad Bin Razali", phone="+60-12-3456789",
        department="Computer Science", position="Senior_Lecturer",
        specialization="Software Engineering", office="Block A, Room 203",
        office_hours="Mon–Wed 9am–12pm",
    )
    sup2 = Supervisor(
        user_id=u_sup2.user_id, university_id=utm.university_id,
        name="Dr. Siti Nor Binti Hamid", phone="+60-13-9988776",
        department="Information Systems", position="Lecturer",
        specialization="Data Science & AI", office="Block C, Room 105",
        office_hours="Tue & Thu 2pm–4pm",
    )
    sup3 = Supervisor(
        user_id=u_sup3.user_id, university_id=mmu.university_id,
        name="Prof. Chen Wei Liang", phone="+60-16-7654321",
        department="Multimedia Technology", position="Professor",
        specialization="Human-Computer Interaction", office="MMU Tower, Level 9",
        office_hours="Fri 10am–1pm",
    )
    db.add_all([sup1, sup2, sup3])
    db.flush()
    print("  ✓ 3 supervisors")

    # ── 6. Students ───────────────────────────────────────────────────────────
    print("  Seeding students …")
    stu1 = Student(
        user_id=u_stu1.user_id, university_id=um.university_id,
        name="Muhammad Ali Bin Hassan", gender="M",
        date_of_birth=date(2002, 4, 15), nationality="Malaysian",
        marital_status="Single", phone="+60-11-2233445",
        address="No. 12, Jalan Universiti, 59990 Kuala Lumpur",
        year_of_study=3, major="Computer Science", gpa=3.75,
    )
    stu2 = Student(
        user_id=u_stu2.user_id, university_id=utm.university_id,
        name="Nurul Ain Binti Zulkifli", gender="F",
        date_of_birth=date(2001, 9, 22), nationality="Malaysian",
        marital_status="Single", phone="+60-11-9988776",
        address="Kolej Perdana, UTM Skudai, 81310 Johor Bahru",
        year_of_study=4, major="Information Systems", gpa=3.50,
    )
    stu3 = Student(
        user_id=u_stu3.user_id, university_id=mmu.university_id,
        name="Kevin Tan Jia Hao", gender="M",
        date_of_birth=date(2002, 12, 3), nationality="Malaysian",
        marital_status="Single", phone="+60-16-5544332",
        address="Jalan Teknologi 3/3, Cyberjaya, 63000 Selangor",
        year_of_study=3, major="Software Engineering", gpa=3.85,
    )
    stu4 = Student(
        user_id=u_stu4.user_id, university_id=upm.university_id,
        name="Farah Diyana Binti Rosli", gender="F",
        date_of_birth=date(2001, 6, 18), nationality="Malaysian",
        marital_status="Single", phone="+60-12-6677889",
        address="Kolej Canselor, UPM Serdang, 43400 Selangor",
        year_of_study=4, major="Data Science", gpa=3.65,
    )
    stu5 = Student(
        user_id=u_stu5.user_id, university_id=ukm.university_id,
        name="Rajan Kumar A/L Subramaniam", gender="M",
        date_of_birth=date(2003, 2, 28), nationality="Malaysian",
        marital_status="Single", phone="+60-17-3344556",
        address="Kolej Tun Hussein Onn, UKM Bangi, 43600 Selangor",
        year_of_study=2, major="Computer Engineering", gpa=3.40,
    )
    students = [stu1, stu2, stu3, stu4, stu5]
    db.add_all(students)
    db.flush()
    print(f"  ✓ {len(students)} students")

    # ── 7. Intern Positions ───────────────────────────────────────────────────
    print("  Seeding intern positions …")
    pos1 = InternPosition(
        company_id=co1.company_id, title="Software Engineering Intern",
        description_post="Join our backend team to build REST APIs with FastAPI and PostgreSQL. "
                         "You'll work on real production features with mentorship from senior engineers.",
        location="Kuala Lumpur (Hybrid)", department="Engineering",
        salary_min=800, salary_max=1200, position_type="Hybrid",
        posted_date=TODAY - timedelta(days=30), deadtime=TODAY + timedelta(days=30),
        status="Active", slots=3, filled_slots=1,
    )
    pos2 = InternPosition(
        company_id=co1.company_id, title="Cloud Infrastructure Intern",
        description_post="Help manage and automate AWS and Azure cloud environments. "
                         "Experience with Linux, Terraform, or Docker is a plus.",
        location="Kuala Lumpur (On-site)", department="DevOps",
        salary_min=900, salary_max=1300, position_type="Full-Time",
        posted_date=TODAY - timedelta(days=20), deadtime=TODAY + timedelta(days=40),
        status="Active", slots=2, filled_slots=0,
    )
    pos3 = InternPosition(
        company_id=co2.company_id, title="Data Analytics Intern",
        description_post="Work alongside data scientists to build dashboards and perform EDA on "
                         "large datasets using Python, SQL and Power BI.",
        location="Kuala Lumpur (Remote)", department="Data Analytics",
        salary_min=700, salary_max=1000, position_type="Remote",
        posted_date=TODAY - timedelta(days=15), deadtime=TODAY + timedelta(days=45),
        status="Active", slots=4, filled_slots=2,
    )
    pos4 = InternPosition(
        company_id=co2.company_id, title="Machine Learning Intern",
        description_post="Assist in training and evaluating ML models for NLP and computer vision projects. "
                         "Proficiency in Python and PyTorch preferred.",
        location="Kuala Lumpur (Hybrid)", department="AI Research",
        salary_min=1000, salary_max=1500, position_type="Hybrid",
        posted_date=TODAY - timedelta(days=10), deadtime=TODAY + timedelta(days=50),
        status="Active", slots=2, filled_slots=1,
    )
    pos5 = InternPosition(
        company_id=co3.company_id, title="UI/UX Design Intern",
        description_post="Design beautiful and intuitive user interfaces using Figma. "
                         "You will work on real client projects from day one.",
        location="Petaling Jaya (On-site)", department="Design",
        salary_min=600, salary_max=900, position_type="Full-Time",
        posted_date=TODAY - timedelta(days=25), deadtime=TODAY + timedelta(days=20),
        status="Active", slots=2, filled_slots=0,
    )
    pos6 = InternPosition(
        company_id=co3.company_id, title="Frontend Developer Intern",
        description_post="Build responsive web interfaces with React and Tailwind CSS. "
                         "Work closely with designers and backend developers.",
        location="Petaling Jaya (Hybrid)", department="Development",
        salary_min=750, salary_max=1100, position_type="Hybrid",
        posted_date=TODAY - timedelta(days=5), deadtime=TODAY + timedelta(days=55),
        status="Active", slots=3, filled_slots=0,
    )
    positions = [pos1, pos2, pos3, pos4, pos5, pos6]
    db.add_all(positions)
    db.flush()

    # Link skills to positions
    pos_skills = [
        (pos1, ["Python", "FastAPI", "REST API", "MySQL", "Git"]),
        (pos2, ["AWS", "Docker", "Linux", "Git"]),
        (pos3, ["Python", "Power BI", "MySQL", "Pandas", "Excel"]),
        (pos4, ["Python", "PyTorch", "Machine Learning", "scikit-learn"]),
        (pos5, ["Figma", "UI/UX Design", "Adobe XD"]),
        (pos6, ["React", "JavaScript", "HTML/CSS", "Tailwind CSS"]),
    ]
    for pos, snames in pos_skills:
        for sname in snames:
            if sname in skill_map:
                db.add(PositionSkill(
                    intern_position_id=pos.intern_position_id,
                    skill_id=skill_map[sname].skill_id,
                ))
    db.flush()
    print(f"  ✓ {len(positions)} intern positions (with skills)")

    # ── 8. Applications ───────────────────────────────────────────────────────
    print("  Seeding applications …")
    app1 = Application(
        student_id=stu1.student_id, intern_position_id=pos1.intern_position_id,
        apply_date=TODAY - timedelta(days=20), status="Accepted",
        cover_letter="I am a passionate CS student eager to contribute to TechCorp's backend team. "
                     "I have experience with Python and REST APIs from my university projects.",
    )
    app2 = Application(
        student_id=stu1.student_id, intern_position_id=pos3.intern_position_id,
        apply_date=TODAY - timedelta(days=12), status="Pending",
        cover_letter="My data analysis coursework and Python skills make me a great fit for this role.",
    )
    app3 = Application(
        student_id=stu2.student_id, intern_position_id=pos3.intern_position_id,
        apply_date=TODAY - timedelta(days=18), status="Accepted",
        cover_letter="As an Information Systems student with Power BI experience, "
                     "I am excited to work on your analytics team.",
    )
    app4 = Application(
        student_id=stu2.student_id, intern_position_id=pos5.intern_position_id,
        apply_date=TODAY - timedelta(days=8), status="Rejected",
        cover_letter="I have a strong interest in UX design and have completed several Figma projects.",
        remarks="Position requires on-site — applicant is based in Johor.",
    )
    app5 = Application(
        student_id=stu3.student_id, intern_position_id=pos1.intern_position_id,
        apply_date=TODAY - timedelta(days=15), status="Accepted",
        cover_letter="I'm a software engineering student with React and FastAPI experience. "
                     "Looking forward to growing at TechCorp.",
    )
    app6 = Application(
        student_id=stu3.student_id, intern_position_id=pos6.intern_position_id,
        apply_date=TODAY - timedelta(days=6), status="Pending",
        cover_letter="Frontend development is my passion — I've built several React projects.",
    )
    app7 = Application(
        student_id=stu4.student_id, intern_position_id=pos4.intern_position_id,
        apply_date=TODAY - timedelta(days=9), status="Accepted",
        cover_letter="As a Data Science student I have hands-on experience with PyTorch and scikit-learn.",
    )
    app8 = Application(
        student_id=stu5.student_id, intern_position_id=pos2.intern_position_id,
        apply_date=TODAY - timedelta(days=5), status="Pending",
        cover_letter="I am interested in cloud infrastructure and have basic AWS knowledge.",
    )
    applications = [app1,app2,app3,app4,app5,app6,app7,app8]
    db.add_all(applications)
    db.flush()
    print(f"  ✓ {len(applications)} applications")

    # ── 9. Interviews ─────────────────────────────────────────────────────────
    print("  Seeding interviews …")
    iv1 = Interview(
        application_id=app1.application_id,
        company_id=co1.company_id, student_id=stu1.student_id,
        scheduled_at=datetime.now() - timedelta(days=10),
        interview_type="Online", location="Google Meet",
        status="Completed",
    )
    iv2 = Interview(
        application_id=app3.application_id,
        company_id=co2.company_id, student_id=stu2.student_id,
        scheduled_at=datetime.now() - timedelta(days=7),
        interview_type="Online", location="Microsoft Teams",
        status="Completed",
    )
    iv3 = Interview(
        application_id=app5.application_id,
        company_id=co1.company_id, student_id=stu3.student_id,
        scheduled_at=datetime.now() + timedelta(days=3),
        interview_type="Onsite", location="TechCorp HQ, Level 15, Menara TM",
        status="Scheduled",
    )
    iv4 = Interview(
        application_id=app7.application_id,
        company_id=co2.company_id, student_id=stu4.student_id,
        scheduled_at=datetime.now() + timedelta(days=5),
        interview_type="Online", location="Zoom",
        status="Scheduled",
    )
    interviews = [iv1, iv2, iv3, iv4]
    db.add_all(interviews)
    db.flush()
    print(f"  ✓ {len(interviews)} interviews")

    # ── 10. InternInfo (started internships) ──────────────────────────────────
    print("  Seeding intern records …")
    int1 = InternInfo(
        student_id=stu1.student_id, company_id=co1.company_id,
        supervisor_id=sup1.supervisor_id, intern_position_id=pos1.intern_position_id,
        department="Engineering", field="Backend Development",
        start_date=TODAY - timedelta(days=30), end_date=TODAY + timedelta(days=60),
        status="Active",
    )
    int2 = InternInfo(
        student_id=stu2.student_id, company_id=co2.company_id,
        supervisor_id=sup2.supervisor_id, intern_position_id=pos3.intern_position_id,
        department="Data Analytics", field="Business Intelligence",
        start_date=TODAY - timedelta(days=60), end_date=TODAY - timedelta(days=1),
        status="Completed",
    )
    int3 = InternInfo(
        student_id=stu4.student_id, company_id=co2.company_id,
        supervisor_id=sup2.supervisor_id, intern_position_id=pos4.intern_position_id,
        department="AI Research", field="Machine Learning",
        start_date=TODAY + timedelta(days=14), end_date=TODAY + timedelta(days=104),
        status="Pending",
    )
    intern_records = [int1, int2, int3]
    db.add_all(intern_records)
    db.flush()
    print(f"  ✓ {len(intern_records)} intern records")

    # ── 11. Evaluations ───────────────────────────────────────────────────────
    print("  Seeding evaluations …")
    eval1 = Evaluation(
        intern_id=int2.intern_id, supervisor_id=sup2.supervisor_id,
        evaluation_type="Midterm",
        technical_score=85, communication_score=78,
        problem_solving=80, attitude_score=90, total_score=83,
        feedback="Nurul shows strong analytical skills and is a great team player. "
                 "Needs to improve speed on SQL queries.",
        status="Submitted", submitted_at=datetime.now() - timedelta(days=30),
    )
    eval2 = Evaluation(
        intern_id=int2.intern_id, supervisor_id=sup2.supervisor_id,
        evaluation_type="Final",
        technical_score=90, communication_score=85,
        problem_solving=88, attitude_score=92, total_score=89,
        feedback="Excellent final performance. Nurul delivered a high-quality Power BI dashboard "
                 "and demonstrated significant growth throughout the internship.",
        status="Submitted", submitted_at=datetime.now() - timedelta(days=2),
    )
    evaluations = [eval1, eval2]
    db.add_all(evaluations)
    db.flush()
    print(f"  ✓ {len(evaluations)} evaluations")

    # ── 12. Documents ─────────────────────────────────────────────────────────
    print("  Seeding documents …")
    doc1 = Document(
        student_id=stu1.student_id, document_type="Resume",
        file_name="Ali_Resume_2025.pdf",
        file_url="https://drive.google.com/file/d/sample_ali_resume",
        status="Verified", upload_date=TODAY - timedelta(days=40),
    )
    doc2 = Document(
        student_id=stu1.student_id, document_type="Transcript",
        file_name="Ali_Official_Transcript.pdf",
        file_url="https://drive.google.com/file/d/sample_ali_transcript",
        status="Pending", upload_date=TODAY - timedelta(days=38),
    )
    doc3 = Document(
        student_id=stu2.student_id, document_type="Resume",
        file_name="Nurul_Resume_2025.pdf",
        file_url="https://drive.google.com/file/d/sample_nurul_resume",
        status="Verified", upload_date=TODAY - timedelta(days=65),
    )
    doc4 = Document(
        student_id=stu2.student_id, document_type="Offer Letter",
        file_name="Nurul_OfferLetter_DataSolutions.pdf",
        file_url="https://drive.google.com/file/d/sample_nurul_offer",
        status="Verified", upload_date=TODAY - timedelta(days=62),
    )
    doc5 = Document(
        student_id=stu3.student_id, document_type="Resume",
        file_name="Kevin_CV_2025.pdf",
        file_url="https://drive.google.com/file/d/sample_kevin_resume",
        status="Pending", upload_date=TODAY - timedelta(days=10),
    )
    documents = [doc1, doc2, doc3, doc4, doc5]
    db.add_all(documents)
    db.flush()
    print(f"  ✓ {len(documents)} documents")

    # ── 13. Supervision Requests ──────────────────────────────────────────────
    print("  Seeding supervision requests …")
    sr1 = SupervisionRequest(
        student_id=stu3.student_id, supervisor_id=sup1.supervisor_id,
        message="Dear Dr. Ahmad, I am applying to TechCorp and would appreciate your guidance "
                "as my academic supervisor for this internship.",
        status="Pending",
    )
    sr2 = SupervisionRequest(
        student_id=stu5.student_id, supervisor_id=sup2.supervisor_id,
        message="I would like to request your supervision for my cloud infrastructure internship "
                "at TechCorp. Your expertise in IS is very relevant.",
        status="Pending",
    )
    # stu4's request already approved (they have an intern record)
    sr3 = SupervisionRequest(
        student_id=stu4.student_id, supervisor_id=sup2.supervisor_id,
        message="Hello Dr. Siti, I am excited about my ML internship and would love to have "
                "you as my supervisor.",
        status="Approved",
    )
    sup_requests = [sr1, sr2, sr3]
    db.add_all(sup_requests)
    db.flush()
    print(f"  ✓ {len(sup_requests)} supervision requests")

    # ── 14. Supervisor Notifications ──────────────────────────────────────────
    print("  Seeding supervisor notifications …")
    sn1 = SupervisorNotification(
        supervisor_id=sup1.supervisor_id,
        title="New Intern Assigned",
        message="Muhammad Ali Bin Hassan has started their internship at TechCorp Malaysia Sdn Bhd. "
                "Department: Engineering.",
        is_read=False,
    )
    sn2 = SupervisorNotification(
        supervisor_id=sup2.supervisor_id,
        title="New Intern Assigned",
        message="Nurul Ain Binti Zulkifli has started their internship at Data Solutions Bhd. "
                "Department: Data Analytics.",
        is_read=True,
    )
    sn3 = SupervisorNotification(
        supervisor_id=sup2.supervisor_id,
        title="Internship Completed",
        message="Nurul Ain Binti Zulkifli's internship at Data Solutions Bhd has been marked as Completed.",
        is_read=False,
    )
    sup_notifs = [sn1, sn2, sn3]
    db.add_all(sup_notifs)
    db.flush()
    print(f"  ✓ {len(sup_notifs)} supervisor notifications")

    db.commit()


# ─────────────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    db = SessionLocal()
    try:
        print("\n🌱  WEBIN Database Seeder")
        print("=" * 45)
        clear(db)
        seed(db)
        print("=" * 45)
        print("✅  Seeding complete!\n")
        print("Demo accounts (all passwords: Password123!)")
        print("  admin@webin.com         → Admin")
        print("  techcorp@webin.com      → Company (TechCorp, Verified)")
        print("  datasolutions@webin.com → Company (Data Solutions, Verified)")
        print("  creativelab@webin.com   → Company (Creative Lab, Pending)")
        print("  dr.ahmad@webin.com      → Supervisor (UM)")
        print("  dr.siti@webin.com       → Supervisor (UTM)")
        print("  prof.chen@webin.com     → Supervisor (MMU)")
        print("  ali@webin.com           → Student (Active intern @ TechCorp)")
        print("  nurul@webin.com         → Student (Completed intern @ Data Solutions)")
        print("  kevin@webin.com         → Student (Pending applications)")
        print("  farah@webin.com         → Student (Pending intern @ Data Solutions)")
        print("  rajan@webin.com         → Student (Pending application)")
        print()
    except Exception as e:
        db.rollback()
        print(f"\n❌  Seeding failed: {e}")
        raise
    finally:
        db.close()
