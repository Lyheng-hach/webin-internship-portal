-- ============================================================
-- 1. university
-- ============================================================
INSERT INTO university (university_id, name, address, email, phone, website) VALUES
(1, 'Royal university of Phnom Penh', 'Russian Federation Blvd, Phnom Penh', 'info@rupp.edu.kh', '023883640', 'https://www.rupp.edu.kh'),
(2, 'Institute of Technology of Cambodia', 'Russian Federation Blvd, Phnom Penh', 'info@itc.edu.kh', '023880370', 'https://www.itc.edu.kh'),
(3, 'National university of Management', 'St. 96, Phnom Penh', 'info@num.edu.kh', '023428120', 'https://www.num.edu.kh'),
(4, 'BELTEI International university', 'Phnom Penh, Cambodia', 'info@beltei.edu.kh', '023999967', 'https://www.beltei.edu.kh'),
(5, 'Cambodia Academy of Digital Technology', 'National Road 6A, Phnom Penh', 'info@cadt.edu.kh', '023722335', 'https://www.cadt.edu.kh');

select * from university;

-- ============================================================
-- 2. Skill
-- ============================================================

INSERT INTO Skill (name, category) VALUES
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
        ("React Native",  "Mobile");
