const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://qcmjmdsoygrfcitnnqac.supabase.co";
const SUPABASE_KEY = "sb_publishable__scO4pQv-Xft14X53GiO0Q_XoD4VwNz";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// -------------------------------------------------------------
// 1. TEACHERS
// -------------------------------------------------------------
const teachers = [
    {
        name: "Dr. Mahesh Kumar",
        phone: "9876599999",
        email: "mahesh@christ.edu",
        department: "Computer Science",
        password: "password",
        is_coordinator: true // Teacher Coordinator
    },
    {
        name: "Prof. Priya Sen",
        phone: "9876588888",
        email: "priya@christ.edu",
        department: "Commerce",
        password: "password",
        is_coordinator: false
    },
    {
        name: "Dr. Rajesh Varma",
        phone: "9876577777",
        email: "rajesh.varma@christ.edu",
        department: "Mathematics",
        password: "password",
        is_coordinator: false
    },
    {
        name: "Dr. Sunitha Menon",
        phone: "9876566666",
        email: "sunitha.menon@christ.edu",
        department: "Management",
        password: "password",
        is_coordinator: true // Teacher Coordinator
    },
    {
        name: "Prof. Alexander Paul",
        phone: "9876555555",
        email: "alexander.paul@christ.edu",
        department: "Computer Science",
        password: "password",
        is_coordinator: false
    }
];

// -------------------------------------------------------------
// 2. CLASS INCHARGE MAPPINGS
// -------------------------------------------------------------
const classIncharges = [
    { class_name: "1 BCA A", incharge: "Dr. Mahesh Kumar" },
    { class_name: "2 BSc CS A", incharge: "Prof. Alexander Paul" },
    { class_name: "3 BCom B", incharge: "Prof. Priya Sen" },
    { class_name: "2 BBA A", incharge: "Dr. Sunitha Menon" },
    { class_name: "1 BSc Math A", incharge: "Dr. Rajesh Varma" }
];

// -------------------------------------------------------------
// 3. STUDENTS (24 realistic students across 4 departments & 5 classes)
// -------------------------------------------------------------
const students = [
    // --- Computer Science / BCA (1 BCA A & 2 BSc CS A) ---
    {
        name: "Ananya Nair",
        register_number: "CC_CS_01",
        phone: "9876500001",
        email: "ananya.nair@christ.edu",
        course: "BCA",
        department: "Computer Science",
        class: "1 BCA A",
        gender: "Female",
        password: "password",
        is_coordinator: true, // Student Coordinator
        force_password_reset: false,
        scores: { _admission_year: "2024", attendancePercentage: 95, placementStatus: "Placed" }
    },
    {
        name: "Arjun Menon",
        register_number: "CC_CS_02",
        phone: "9876500002",
        email: "arjun.menon@christ.edu",
        course: "BCA",
        department: "Computer Science",
        class: "1 BCA A",
        gender: "Male",
        password: "password",
        is_coordinator: true, // Student Coordinator
        force_password_reset: false,
        scores: { _admission_year: "2024", attendancePercentage: 90, placementStatus: "Placed" }
    },
    {
        name: "Diya Thomas",
        register_number: "CC_CS_03",
        phone: "9876500003",
        email: "diya.thomas@christ.edu",
        course: "BSc Computer Science",
        department: "Computer Science",
        class: "2 BSc CS A",
        gender: "Female",
        password: "password",
        is_coordinator: false,
        force_password_reset: false,
        scores: { _admission_year: "2023", attendancePercentage: 98, placementStatus: "Placed" }
    },
    {
        name: "Rahul Varma",
        register_number: "CC_CS_04",
        phone: "9876500004",
        email: "rahul.varma@christ.edu",
        course: "BSc Computer Science",
        department: "Computer Science",
        class: "2 BSc CS A",
        gender: "Male",
        password: "password",
        is_coordinator: false,
        force_password_reset: false,
        scores: { _admission_year: "2023", attendancePercentage: 82, placementStatus: "Assessment" }
    },
    {
        name: "Meera Joseph",
        register_number: "CC_CS_05",
        phone: "9876500005",
        email: "meera.joseph@christ.edu",
        course: "BCA",
        department: "Computer Science",
        class: "1 BCA A",
        gender: "Female",
        password: "password",
        is_coordinator: false,
        force_password_reset: false,
        scores: { _admission_year: "2024", attendancePercentage: 92, placementStatus: "Technical Round" }
    },
    {
        name: "Karthik R",
        register_number: "CC_CS_06",
        phone: "9876500006",
        email: "karthik.r@christ.edu",
        course: "BSc Computer Science",
        department: "Computer Science",
        class: "2 BSc CS A",
        gender: "Male",
        password: "password",
        is_coordinator: false,
        force_password_reset: false,
        scores: { _admission_year: "2023", attendancePercentage: 74, placementStatus: "Participating" }
    },

    // --- Commerce (3 BCom B) ---
    {
        name: "Sneha Mathew",
        register_number: "CC_CM_01",
        phone: "9876500007",
        email: "sneha.mathew@christ.edu",
        course: "BCom",
        department: "Commerce",
        class: "3 BCom B",
        gender: "Female",
        password: "password",
        is_coordinator: false,
        force_password_reset: false,
        scores: { _admission_year: "2022", attendancePercentage: 91, placementStatus: "Technical Round" }
    },
    {
        name: "Vishnu Prasad",
        register_number: "CC_CM_02",
        phone: "9876500008",
        email: "vishnu.prasad@christ.edu",
        course: "BCom",
        department: "Commerce",
        class: "3 BCom B",
        gender: "Male",
        password: "password",
        is_coordinator: false,
        force_password_reset: false,
        scores: { _admission_year: "2022", attendancePercentage: 86, placementStatus: "Technical Round" }
    },
    {
        name: "Neha George",
        register_number: "CC_CM_03",
        phone: "9876500009",
        email: "neha.george@christ.edu",
        course: "BCom",
        department: "Commerce",
        class: "3 BCom B",
        gender: "Female",
        password: "password",
        is_coordinator: false,
        force_password_reset: false,
        scores: { _admission_year: "2022", attendancePercentage: 88, placementStatus: "HR Round" }
    },
    {
        name: "Rohan Das",
        register_number: "CC_CM_04",
        phone: "9876500010",
        email: "rohan.das@christ.edu",
        course: "BCom",
        department: "Commerce",
        class: "3 BCom B",
        gender: "Male",
        password: "password",
        is_coordinator: false,
        force_password_reset: false,
        scores: { _admission_year: "2022", attendancePercentage: 79, placementStatus: "Participating" }
    },
    {
        name: "Athira Suresh",
        register_number: "CC_CM_05",
        phone: "9876500011",
        email: "athira.suresh@christ.edu",
        course: "BCom",
        department: "Commerce",
        class: "3 BCom B",
        gender: "Female",
        password: "password",
        is_coordinator: false,
        force_password_reset: false,
        scores: { _admission_year: "2022", attendancePercentage: 85, placementStatus: "Rejected" }
    },
    {
        name: "Deepak Nambiar",
        register_number: "CC_CM_06",
        phone: "9876500012",
        email: "deepak.n@christ.edu",
        course: "BCom",
        department: "Commerce",
        class: "3 BCom B",
        gender: "Male",
        password: "password",
        is_coordinator: false,
        force_password_reset: false,
        scores: { _admission_year: "2022", attendancePercentage: 70, placementStatus: "Participating" }
    },

    // --- Mathematics (1 BSc Math A) ---
    {
        name: "Kiran Babu",
        register_number: "CC_MT_01",
        phone: "9876500013",
        email: "kiran.babu@christ.edu",
        course: "BSc Mathematics",
        department: "Mathematics",
        class: "1 BSc Math A",
        gender: "Male",
        password: "password",
        is_coordinator: false,
        force_password_reset: false,
        scores: { _admission_year: "2024", attendancePercentage: 87, placementStatus: "Technical Round" }
    },
    {
        name: "Amrutha Paul",
        register_number: "CC_MT_02",
        phone: "9876500014",
        email: "amrutha.paul@christ.edu",
        course: "BSc Mathematics",
        department: "Mathematics",
        class: "1 BSc Math A",
        gender: "Female",
        password: "password",
        is_coordinator: false,
        force_password_reset: false,
        scores: { _admission_year: "2024", attendancePercentage: 93, placementStatus: "Assessment" }
    },
    {
        name: "Nikhil Jose",
        register_number: "CC_MT_03",
        phone: "9876500015",
        email: "nikhil.jose@christ.edu",
        course: "BSc Mathematics",
        department: "Mathematics",
        class: "1 BSc Math A",
        gender: "Male",
        password: "password",
        is_coordinator: false,
        force_password_reset: false,
        scores: { _admission_year: "2024", attendancePercentage: 80, placementStatus: "Assessment" }
    },
    {
        name: "Fathima Rahman",
        register_number: "CC_MT_04",
        phone: "9876500016",
        email: "fathima.rahman@christ.edu",
        course: "BSc Mathematics",
        department: "Mathematics",
        class: "1 BSc Math A",
        gender: "Female",
        password: "password",
        is_coordinator: false,
        force_password_reset: false,
        scores: { _admission_year: "2024", attendancePercentage: 68, placementStatus: "Not Registered" }
    },
    {
        name: "Abhinav Krishnan",
        register_number: "CC_MT_05",
        phone: "9876500017",
        email: "abhinav.k@christ.edu",
        course: "BSc Mathematics",
        department: "Mathematics",
        class: "1 BSc Math A",
        gender: "Male",
        password: "password",
        is_coordinator: false,
        force_password_reset: false,
        scores: { _admission_year: "2024", attendancePercentage: 62, placementStatus: "Not Registered" }
    },
    {
        name: "Sanjana V",
        register_number: "CC_MT_06",
        phone: "9876500018",
        email: "sanjana.v@christ.edu",
        course: "BSc Mathematics",
        department: "Mathematics",
        class: "1 BSc Math A",
        gender: "Female",
        password: "password",
        is_coordinator: false,
        force_password_reset: false,
        scores: { _admission_year: "2024", attendancePercentage: 75, placementStatus: "Participating" }
    },

    // --- Management / BBA (2 BBA A) ---
    {
        name: "Devika Raj",
        register_number: "CC_MG_01",
        phone: "9876500019",
        email: "devika.raj@christ.edu",
        course: "BBA",
        department: "Management",
        class: "2 BBA A",
        gender: "Female",
        password: "password",
        is_coordinator: false,
        force_password_reset: false,
        scores: { _admission_year: "2023", attendancePercentage: 94, placementStatus: "Final Round" }
    },
    {
        name: "Adithya Mohan",
        register_number: "CC_MG_02",
        phone: "9876500020",
        email: "adithya.mohan@christ.edu",
        course: "BBA",
        department: "Management",
        class: "2 BBA A",
        gender: "Male",
        password: "password",
        is_coordinator: false,
        force_password_reset: false,
        scores: { _admission_year: "2023", attendancePercentage: 89, placementStatus: "HR Round" }
    },
    {
        name: "Maria Joseph",
        register_number: "CC_MG_03",
        phone: "9876500021",
        email: "maria.joseph@christ.edu",
        course: "BBA",
        department: "Management",
        class: "2 BBA A",
        gender: "Female",
        password: "password",
        is_coordinator: false,
        force_password_reset: false,
        scores: { _admission_year: "2023", attendancePercentage: 88, placementStatus: "HR Round" }
    },
    {
        name: "Kevin Thomas",
        register_number: "CC_MG_04",
        phone: "9876500022",
        email: "kevin.thomas@christ.edu",
        course: "BBA",
        department: "Management",
        class: "2 BBA A",
        gender: "Male",
        password: "password",
        is_coordinator: false,
        force_password_reset: false,
        scores: { _admission_year: "2023", attendancePercentage: 76, placementStatus: "Participating" }
    },
    {
        name: "Gokul Krishna",
        register_number: "CC_MG_05",
        phone: "9876500023",
        email: "gokul.krishna@christ.edu",
        course: "BBA",
        department: "Management",
        class: "2 BBA A",
        gender: "Male",
        password: "password",
        is_coordinator: false,
        force_password_reset: false,
        scores: { _admission_year: "2023", attendancePercentage: 58, placementStatus: "Not Registered" }
    },
    {
        name: "Reshma Pillai",
        register_number: "CC_MG_06",
        phone: "9876500024",
        email: "reshma.pillai@christ.edu",
        course: "BBA",
        department: "Management",
        class: "2 BBA A",
        gender: "Female",
        password: "password",
        is_coordinator: false,
        force_password_reset: false,
        scores: { _admission_year: "2023", attendancePercentage: 71, placementStatus: "Rejected" }
    }
];

// -------------------------------------------------------------
// 4. TRAINING PROGRAMS (5 Programs with batches, sessions, attendance, feedback)
// -------------------------------------------------------------
const trainingPrograms = [
    {
        id: "TRN_001",
        name: "Python for Data Analytics & AI Bootcamp",
        description: "Comprehensive hands-on training covering Python syntax, data structures, NumPy, Pandas data manipulation, and exploratory data analysis.",
        venue: "Computer Lab 3 & Central Auditorium",
        date: "2026-08-01",
        end_date: "2026-08-25",
        days: 20,
        is_registration_open: true,
        is_feedback_open: true,
        target: { type: "all" },
        registrations: [
            "CC_CS_01", "CC_CS_02", "CC_CS_03", "CC_CS_04", "CC_CS_05", "CC_CS_06",
            "CC_CM_01", "CC_CM_02", "CC_MT_01", "CC_MT_02", "CC_MT_03", "CC_MG_01"
        ],
        batches: [
            {
                id: "batch_py_a",
                name: "Python Analytics Batch A",
                students: ["CC_CS_01", "CC_CS_02", "CC_CS_05", "CC_CM_01", "CC_MT_01", "CC_MG_01"]
            },
            {
                id: "batch_py_b",
                name: "Python Analytics Batch B",
                students: ["CC_CS_03", "CC_CS_04", "CC_CS_06", "CC_CM_02", "CC_MT_02", "CC_MT_03"]
            }
        ],
        sessions: [
            {
                id: "sess_py_01",
                batchId: "batch_py_a",
                title: "Python Fundamentals, Environment & Syntax",
                date: "2026-08-02",
                time: "10:00 AM - 12:30 PM",
                venue: "Computer Lab 3",
                attendance: ["CC_CS_01", "CC_CS_02", "CC_CS_05", "CC_CM_01", "CC_MT_01", "CC_MG_01"]
            },
            {
                id: "sess_py_02",
                batchId: "batch_py_a",
                title: "Data Structures, Collections & Functions",
                date: "2026-08-06",
                time: "10:00 AM - 12:30 PM",
                venue: "Computer Lab 3",
                attendance: ["CC_CS_01", "CC_CS_02", "CC_CS_05", "CC_CM_01", "CC_MT_01"] // CC_MG_01 absent
            },
            {
                id: "sess_py_03",
                batchId: "batch_py_a",
                title: "NumPy Arrays & Vectorized Computing",
                date: "2026-08-11",
                time: "10:00 AM - 12:30 PM",
                venue: "Computer Lab 3",
                attendance: ["CC_CS_01", "CC_CS_02", "CC_CS_05", "CC_CM_01", "CC_MG_01"] // CC_MT_01 absent
            },
            {
                id: "sess_py_04",
                batchId: "batch_py_a",
                title: "Pandas DataFrames, Cleaning & Filtering",
                date: "2026-08-16",
                time: "10:00 AM - 12:30 PM",
                venue: "Computer Lab 3",
                attendance: ["CC_CS_01", "CC_CS_02", "CC_CS_05", "CC_MT_01", "CC_MG_01"]
            },
            {
                id: "sess_py_05",
                batchId: "batch_py_a",
                title: "Exploratory Data Analysis & Matplotlib Visualization",
                date: "2026-08-22",
                time: "10:00 AM - 01:00 PM",
                venue: "Computer Lab 3",
                attendance: ["CC_CS_01", "CC_CS_02", "CC_CS_05", "CC_CM_01", "CC_MT_01", "CC_MG_01"]
            }
        ],
        feedbacks: [
            { regNo: "CC_CS_01", studentName: "Ananya Nair", rating: 5, comment: "Exceptional hands-on curriculum, especially the Pandas data wrangling exercises.", date: "2026-08-23" },
            { regNo: "CC_CS_02", studentName: "Arjun Menon", rating: 5, comment: "Very practical sessions with real-world datasets.", date: "2026-08-23" },
            { regNo: "CC_CM_01", studentName: "Sneha Mathew", rating: 4, comment: "Great bridge training for non-CS students to get into analytics.", date: "2026-08-24" }
        ]
    },
    {
        id: "TRN_002",
        name: "Advanced Excel & Power BI for Business Intelligence",
        description: "Master business dashboarding, Power Query automation, DAX modeling, and executive KPI reporting.",
        venue: "Commerce Lab & Smart Classroom 102",
        date: "2026-08-05",
        end_date: "2026-08-30",
        days: 18,
        is_registration_open: true,
        is_feedback_open: true,
        target: { type: "all" },
        registrations: [
            "CC_CM_01", "CC_CM_02", "CC_CM_03", "CC_CM_04", "CC_CM_05", "CC_CM_06",
            "CC_MG_01", "CC_MG_02", "CC_MG_03", "CC_MG_04", "CC_CS_01", "CC_CS_03"
        ],
        batches: [
            {
                id: "batch_bi_a",
                name: "Power BI Batch A",
                students: ["CC_CM_01", "CC_CM_02", "CC_CM_03", "CC_MG_01", "CC_MG_02", "CC_CS_01"]
            },
            {
                id: "batch_bi_b",
                name: "Power BI Batch B",
                students: ["CC_CM_04", "CC_CM_05", "CC_CM_06", "CC_MG_03", "CC_MG_04", "CC_CS_03"]
            }
        ],
        sessions: [
            {
                id: "sess_bi_01",
                batchId: "batch_bi_a",
                title: "Advanced Formulas, XLOOKUP & Dynamic Pivot Tables",
                date: "2026-08-07",
                time: "02:00 PM - 04:30 PM",
                venue: "Commerce Lab",
                attendance: ["CC_CM_01", "CC_CM_02", "CC_CM_03", "CC_MG_01", "CC_MG_02", "CC_CS_01"]
            },
            {
                id: "sess_bi_02",
                batchId: "batch_bi_a",
                title: "Power Query ETL & Data Normalization",
                date: "2026-08-12",
                time: "02:00 PM - 04:30 PM",
                venue: "Commerce Lab",
                attendance: ["CC_CM_01", "CC_CM_02", "CC_MG_01", "CC_MG_02", "CC_CS_01"]
            },
            {
                id: "sess_bi_03",
                batchId: "batch_bi_a",
                title: "Data Modeling, Star Schemas & Relationships",
                date: "2026-08-18",
                time: "02:00 PM - 04:30 PM",
                venue: "Commerce Lab",
                attendance: ["CC_CM_01", "CC_CM_02", "CC_CM_03", "CC_MG_01", "CC_CS_01"]
            },
            {
                id: "sess_bi_04",
                batchId: "batch_bi_a",
                title: "DAX Measures, CALCULATE & Time Intelligence",
                date: "2026-08-24",
                time: "02:00 PM - 04:30 PM",
                venue: "Commerce Lab",
                attendance: ["CC_CM_01", "CC_CM_02", "CC_CM_03", "CC_MG_01", "CC_MG_02", "CC_CS_01"]
            },
            {
                id: "sess_bi_05",
                batchId: "batch_bi_a",
                title: "Interactive Executive Dashboard Development",
                date: "2026-08-28",
                time: "02:00 PM - 05:00 PM",
                venue: "Commerce Lab",
                attendance: ["CC_CM_01", "CC_CM_02", "CC_CM_03", "CC_MG_01", "CC_MG_02", "CC_CS_01"]
            }
        ],
        feedbacks: [
            { regNo: "CC_CM_02", studentName: "Vishnu Prasad", rating: 5, comment: "DAX time intelligence functions were explained in crystal-clear fashion.", date: "2026-08-29" },
            { regNo: "CC_MG_01", studentName: "Devika Raj", rating: 5, comment: "Building interactive dashboards gave me confidence for corporate analyst roles.", date: "2026-08-29" }
        ]
    },
    {
        id: "TRN_003",
        name: "SQL & Relational Database Architecture",
        description: "Core SQL querying, relational database design, indexing, joins, subqueries, and window functions.",
        venue: "Database Lab 1",
        date: "2026-08-10",
        end_date: "2026-09-02",
        days: 15,
        is_registration_open: true,
        is_feedback_open: true,
        target: { type: "all" },
        registrations: [
            "CC_CS_01", "CC_CS_02", "CC_CS_03", "CC_CS_04", "CC_CS_05",
            "CC_MT_01", "CC_MT_02", "CC_MT_03", "CC_CM_01", "CC_CM_02"
        ],
        batches: [
            {
                id: "batch_sql_a",
                name: "SQL Batch A",
                students: ["CC_CS_01", "CC_CS_02", "CC_CS_03", "CC_CS_04", "CC_CS_05", "CC_MT_01", "CC_MT_02", "CC_MT_03", "CC_CM_01", "CC_CM_02"]
            }
        ],
        sessions: [
            {
                id: "sess_sql_01",
                batchId: "batch_sql_a",
                title: "Relational Schemas, Constraints & DDL",
                date: "2026-08-12",
                time: "09:30 AM - 11:30 AM",
                venue: "Database Lab 1",
                attendance: ["CC_CS_01", "CC_CS_02", "CC_CS_03", "CC_CS_04", "CC_CS_05", "CC_MT_01", "CC_MT_02", "CC_MT_03", "CC_CM_01", "CC_CM_02"]
            },
            {
                id: "sess_sql_02",
                batchId: "batch_sql_a",
                title: "DML, Filtering, Pattern Matching & NULL Handling",
                date: "2026-08-17",
                time: "09:30 AM - 11:30 AM",
                venue: "Database Lab 1",
                attendance: ["CC_CS_01", "CC_CS_02", "CC_CS_03", "CC_CS_05", "CC_MT_01", "CC_MT_02", "CC_CM_01", "CC_CM_02"]
            },
            {
                id: "sess_sql_03",
                batchId: "batch_sql_a",
                title: "Inner, Left, Right & Full Outer Joins",
                date: "2026-08-22",
                time: "09:30 AM - 11:30 AM",
                venue: "Database Lab 1",
                attendance: ["CC_CS_01", "CC_CS_02", "CC_CS_03", "CC_CS_04", "CC_CS_05", "CC_MT_01", "CC_MT_03", "CC_CM_01"]
            },
            {
                id: "sess_sql_04",
                batchId: "batch_sql_a",
                title: "Aggregations, GROUP BY, HAVING & Subqueries",
                date: "2026-08-27",
                time: "09:30 AM - 11:30 AM",
                venue: "Database Lab 1",
                attendance: ["CC_CS_01", "CC_CS_02", "CC_CS_03", "CC_CS_05", "CC_MT_01", "CC_MT_02", "CC_CM_01", "CC_CM_02"]
            }
        ],
        feedbacks: [
            { regNo: "CC_CS_03", studentName: "Diya Thomas", rating: 5, comment: "The complex joins problem set prepared me directly for the UST technical round.", date: "2026-08-28" }
        ]
    },
    {
        id: "TRN_004",
        name: "Corporate Business Analytics & Case Studies",
        description: "Case-study driven training on solving business bottlenecks, revenue analysis, market segmentation, and presentation skills.",
        venue: "Seminar Hall 2",
        date: "2026-08-15",
        end_date: "2026-09-08",
        days: 16,
        is_registration_open: true,
        is_feedback_open: true,
        target: { type: "all" },
        registrations: [
            "CC_MG_01", "CC_MG_02", "CC_MG_03", "CC_MG_04", "CC_CM_01", "CC_CM_02", "CC_CM_03"
        ],
        batches: [
            {
                id: "batch_ba_a",
                name: "Business Analytics Batch A",
                students: ["CC_MG_01", "CC_MG_02", "CC_MG_03", "CC_MG_04", "CC_CM_01", "CC_CM_02", "CC_CM_03"]
            }
        ],
        sessions: [
            {
                id: "sess_ba_01",
                batchId: "batch_ba_a",
                title: "Business Problem Structuring & Hypothesis Testing",
                date: "2026-08-18",
                time: "11:00 AM - 01:00 PM",
                venue: "Seminar Hall 2",
                attendance: ["CC_MG_01", "CC_MG_02", "CC_MG_03", "CC_MG_04", "CC_CM_01", "CC_CM_02", "CC_CM_03"]
            },
            {
                id: "sess_ba_02",
                batchId: "batch_ba_a",
                title: "Market Sizing, Unit Economics & Customer LTV",
                date: "2026-08-25",
                time: "11:00 AM - 01:00 PM",
                venue: "Seminar Hall 2",
                attendance: ["CC_MG_01", "CC_MG_02", "CC_MG_03", "CC_CM_01", "CC_CM_02"]
            }
        ],
        feedbacks: [
            { regNo: "CC_MG_01", studentName: "Devika Raj", rating: 5, comment: "Outstanding case simulations for consulting interviews.", date: "2026-08-26" }
        ]
    },
    {
        id: "TRN_005",
        name: "Campus Aptitude & Corporate Soft Skills Masterclass",
        description: "Intensive training on quantitative aptitude, logical reasoning, verbal ability, and group discussion etiquette.",
        venue: "College Central Auditorium",
        date: "2026-08-01",
        end_date: "2026-09-15",
        days: 25,
        is_registration_open: true,
        is_feedback_open: true,
        target: { type: "all" },
        registrations: [
            "CC_CS_01", "CC_CS_02", "CC_CS_03", "CC_CS_04", "CC_CS_05", "CC_CS_06",
            "CC_CM_01", "CC_CM_02", "CC_CM_03", "CC_CM_04", "CC_CM_05", "CC_CM_06",
            "CC_MT_01", "CC_MT_02", "CC_MT_03", "CC_MG_01", "CC_MG_02", "CC_MG_03"
        ],
        batches: [
            {
                id: "batch_apt_a",
                name: "Aptitude Batch A",
                students: ["CC_CS_01", "CC_CS_02", "CC_CS_03", "CC_CM_01", "CC_CM_02", "CC_MT_01", "CC_MG_01", "CC_MG_02"]
            },
            {
                id: "batch_apt_b",
                name: "Aptitude Batch B",
                students: ["CC_CS_04", "CC_CS_05", "CC_CS_06", "CC_CM_03", "CC_CM_04", "CC_MT_02", "CC_MT_03", "CC_MG_03"]
            }
        ],
        sessions: [
            {
                id: "sess_apt_01",
                batchId: "batch_apt_a",
                title: "Speed Math, Percentages, Profit & Loss Shortcuts",
                date: "2026-08-03",
                time: "03:00 PM - 05:00 PM",
                venue: "Auditorium",
                attendance: ["CC_CS_01", "CC_CS_02", "CC_CS_03", "CC_CM_01", "CC_CM_02", "CC_MT_01", "CC_MG_01", "CC_MG_02"]
            },
            {
                id: "sess_apt_02",
                batchId: "batch_apt_a",
                title: "Permutations, Combinations & Probability Models",
                date: "2026-08-10",
                time: "03:00 PM - 05:00 PM",
                venue: "Auditorium",
                attendance: ["CC_CS_01", "CC_CS_02", "CC_CS_03", "CC_CM_01", "CC_MT_01", "CC_MG_01"]
            },
            {
                id: "sess_apt_03",
                batchId: "batch_apt_a",
                title: "Logical Deductions, Blood Relations & Syllogisms",
                date: "2026-08-17",
                time: "03:00 PM - 05:00 PM",
                venue: "Auditorium",
                attendance: ["CC_CS_01", "CC_CS_02", "CC_CS_03", "CC_CM_01", "CC_CM_02", "CC_MT_01", "CC_MG_01", "CC_MG_02"]
            }
        ],
        feedbacks: [
            { regNo: "CC_CS_02", studentName: "Arjun Menon", rating: 5, comment: "Helped me ace the TCS NQT aptitude section with speed and precision.", date: "2026-08-18" }
        ]
    }
];

// -------------------------------------------------------------
// 5. PLACEMENT ACTIVITIES (Workshops, Drills, Orientation)
// -------------------------------------------------------------
const placementActivities = [
    {
        id: "PLC_001",
        name: "Resume Building & ATS Optimization Workshop",
        venue: "Seminar Hall 1",
        date: "2026-08-12",
        last_date: "2026-08-15",
        description: "Hands-on session on creating ATS-compliant tech and consulting resumes with live faculty reviews.",
        type: "placement",
        target: { type: "all" },
        registrations: ["CC_CS_01", "CC_CS_02", "CC_CS_03", "CC_CS_04", "CC_CS_05", "CC_CM_01", "CC_CM_02", "CC_MT_01", "CC_MG_01", "CC_MG_02"],
        phases: [
            { id: "PHS_RES_1", name: "Resume Draft Submission", isSelectedPhase: false, completions: ["CC_CS_01", "CC_CS_02", "CC_CS_03", "CC_CS_04", "CC_CS_05", "CC_CM_01", "CC_CM_02", "CC_MT_01", "CC_MG_01", "CC_MG_02"] },
            { id: "PHS_RES_2", name: "Faculty Verification & ATS Verified", isSelectedPhase: false, completions: ["CC_CS_01", "CC_CS_02", "CC_CS_03", "CC_CM_01", "CC_MG_01"] }
        ]
    },
    {
        id: "PLC_002",
        name: "Technical Coding & DSA Mock Interview Drill",
        venue: "Lab 2 & Virtual Meet",
        date: "2026-08-20",
        last_date: "2026-08-25",
        description: "One-on-one technical mock interview simulations conducted by alumni software engineers.",
        type: "placement",
        target: { type: "course", courses: ["BCA", "BSc Computer Science", "BSc Mathematics"] },
        registrations: ["CC_CS_01", "CC_CS_02", "CC_CS_03", "CC_CS_04", "CC_CS_05", "CC_MT_01", "CC_MT_02"],
        phases: [
            { id: "PHS_DSA_1", name: "Live Coding Round", isSelectedPhase: false, completions: ["CC_CS_01", "CC_CS_02", "CC_CS_03", "CC_CS_05", "CC_MT_01"] },
            { id: "PHS_DSA_2", name: "System Design & OOP Review", isSelectedPhase: false, completions: ["CC_CS_01", "CC_CS_02", "CC_CS_03"] }
        ]
    },
    {
        id: "PLC_003",
        name: "Mock HR & Group Discussion Simulation",
        venue: "Executive Board Room",
        date: "2026-09-02",
        last_date: "2026-09-08",
        description: "Corporate simulation of HR rounds, behavioral questions (STAR methodology), and group discussions.",
        type: "placement",
        target: { type: "all" },
        registrations: ["CC_CS_01", "CC_CS_02", "CC_CM_01", "CC_CM_02", "CC_CM_03", "CC_MG_01", "CC_MG_02", "CC_MG_03"],
        phases: [
            { id: "PHS_HR_1", name: "Group Discussion Round", isSelectedPhase: false, completions: ["CC_CS_01", "CC_CS_02", "CC_CM_01", "CC_CM_02", "CC_MG_01", "CC_MG_02"] },
            { id: "PHS_HR_2", name: "Personal Interview & STAR Evaluation", isSelectedPhase: false, completions: ["CC_CS_01", "CC_CM_01", "CC_MG_01"] }
        ]
    },
    {
        id: "PLC_004",
        name: "Annual Placement Season Orientation 2026-27",
        venue: "Christ Central Auditorium",
        date: "2026-07-28",
        last_date: "2026-08-01",
        description: "Official kickoff meeting outlining placement policies, eligibility standards, dream company rules, and schedule.",
        type: "placement",
        target: { type: "all" },
        registrations: [
            "CC_CS_01", "CC_CS_02", "CC_CS_03", "CC_CS_04", "CC_CS_05", "CC_CS_06",
            "CC_CM_01", "CC_CM_02", "CC_CM_03", "CC_CM_04", "CC_CM_05",
            "CC_MT_01", "CC_MT_02", "CC_MT_03", "CC_MG_01", "CC_MG_02", "CC_MG_03", "CC_MG_04"
        ],
        phases: [
            { id: "PHS_ORT_1", name: "Attendance & Registration Verified", isSelectedPhase: false, completions: [
                "CC_CS_01", "CC_CS_02", "CC_CS_03", "CC_CS_04", "CC_CS_05",
                "CC_CM_01", "CC_CM_02", "CC_CM_03", "CC_MT_01", "CC_MT_02", "CC_MG_01", "CC_MG_02"
            ]}
        ]
    },
    {
        id: "PLC_005",
        name: "Financial Modeling & Consulting Prep Workshop",
        venue: "Management Seminar Hall",
        date: "2026-09-18",
        last_date: "2026-09-24",
        description: "Specialized training for Commerce and Management students on three-statement financial modeling and consulting frameworks.",
        type: "placement",
        target: { type: "course", courses: ["BCom", "BBA"] },
        registrations: ["CC_CM_01", "CC_CM_02", "CC_CM_03", "CC_MG_01", "CC_MG_02", "CC_MG_03"],
        phases: [
            { id: "PHS_FIN_1", name: "Financial Model Submission", isSelectedPhase: false, completions: ["CC_CM_01", "CC_MG_01", "CC_MG_02"] },
            { id: "PHS_FIN_2", name: "Case Presentation & Faculty Review", isSelectedPhase: false, completions: ["CC_CM_01", "CC_MG_01"] }
        ]
    }
];

// -------------------------------------------------------------
// 6. RECRUITMENT DRIVES (type: 'recruitment', with company name, job role in venue, phases & placed students)
// -------------------------------------------------------------
const recruitmentDrives = [
    {
        id: "REC_001",
        name: "Deloitte",
        venue: "Technology & Risk Analyst", // Used as Job Role in UI
        date: "2026-08-15",
        last_date: "2026-08-28",
        description: "Role: Technology & Risk Analyst | CTC: 6.0 LPA | Locations: Bangalore / Hyderabad | Eligibility: 65% aggregate in BCA, BSc CS, BBA.",
        type: "recruitment",
        target: { type: "all" },
        registrations: ["CC_CS_01", "CC_CS_02", "CC_CS_04", "CC_CM_01", "CC_MG_01", "CC_MG_02"],
        phases: [
            {
                id: "PHS_DEL_1",
                name: "Online Aptitude & Logical Assessment",
                isSelectedPhase: false,
                completions: ["CC_CS_01", "CC_CS_02", "CC_CM_01", "CC_MG_01"]
            },
            {
                id: "PHS_DEL_2",
                name: "Technical & Problem Solving Round",
                isSelectedPhase: false,
                completions: ["CC_CS_01", "CC_CM_01", "CC_MG_01"]
            },
            {
                id: "PHS_DEL_3",
                name: "Partner & Behavioral Interview",
                isSelectedPhase: false,
                completions: ["CC_CS_01", "CC_MG_01"]
            },
            {
                id: "PHS_DEL_4",
                name: "Selected Phase", // Recognized by isSelectedPhase helper
                isSelectedPhase: true,
                completions: ["CC_CS_01"] // Ananya Nair PLACED!
            }
        ]
    },
    {
        id: "REC_002",
        name: "Tata Consultancy Services (TCS)",
        venue: "Software Developer (Digital & Ninja)",
        date: "2026-08-18",
        last_date: "2026-09-02",
        description: "Role: Software Developer | CTC: 4.5 - 7.0 LPA | National Qualifier Test (NQT) followed by technical and MR rounds.",
        type: "recruitment",
        target: { type: "all" },
        registrations: ["CC_CS_01", "CC_CS_02", "CC_CS_03", "CC_CS_05", "CC_MT_01", "CC_MT_02", "CC_CM_02"],
        phases: [
            {
                id: "PHS_TCS_1",
                name: "TCS National Qualifier Test (NQT)",
                isSelectedPhase: false,
                completions: ["CC_CS_01", "CC_CS_02", "CC_CS_03", "CC_MT_01", "CC_CM_02"]
            },
            {
                id: "PHS_TCS_2",
                name: "Technical Coding & Interview",
                isSelectedPhase: false,
                completions: ["CC_CS_02", "CC_CS_03", "CC_MT_01"]
            },
            {
                id: "PHS_TCS_3",
                name: "Managerial & HR Discussion",
                isSelectedPhase: false,
                completions: ["CC_CS_02"]
            },
            {
                id: "PHS_TCS_4",
                name: "Final Selected Phase",
                isSelectedPhase: true,
                completions: ["CC_CS_02"] // Arjun Menon PLACED!
            }
        ]
    },
    {
        id: "REC_003",
        name: "UST Global",
        venue: "Data Analyst & Cloud Trainee",
        date: "2026-08-20",
        last_date: "2026-09-05",
        description: "Role: Data Analyst & Cloud Trainee | CTC: 5.5 LPA | Kochi Infopark / Trivandrum | Working with Python, SQL, and Azure Cloud data pipelines.",
        type: "recruitment",
        target: { type: "all" },
        registrations: ["CC_CS_02", "CC_CS_03", "CC_CS_05", "CC_MT_01", "CC_MT_02", "CC_CM_01"],
        phases: [
            {
                id: "PHS_UST_1",
                name: "Online Technical Test (Python/SQL)",
                isSelectedPhase: false,
                completions: ["CC_CS_03", "CC_CS_05", "CC_MT_01", "CC_CM_01"]
            },
            {
                id: "PHS_UST_2",
                name: "Technical Video Interview",
                isSelectedPhase: false,
                completions: ["CC_CS_03", "CC_CS_05"]
            },
            {
                id: "PHS_UST_3",
                name: "Selected Phase",
                isSelectedPhase: true,
                completions: ["CC_CS_03"] // Diya Thomas PLACED!
            }
        ]
    },
    {
        id: "REC_004",
        name: "Ernst & Young (EY)",
        venue: "Associate - Tax & Financial Assurance",
        date: "2026-08-25",
        last_date: "2026-09-12",
        description: "Role: Associate Consultant - Assurance & Tax | CTC: 5.0 LPA | Bangalore / Kochi | Excellent career growth in corporate audit and tax advisory.",
        type: "recruitment",
        target: { type: "course", courses: ["BCom", "BBA"] },
        registrations: ["CC_CM_01", "CC_CM_02", "CC_CM_03", "CC_CM_04", "CC_MG_01", "CC_MG_02", "CC_MG_03"],
        phases: [
            {
                id: "PHS_EY_1",
                name: "Aptitude & Commercial Awareness Test",
                isSelectedPhase: false,
                completions: ["CC_CM_01", "CC_CM_02", "CC_CM_03", "CC_MG_01", "CC_MG_02"]
            },
            {
                id: "PHS_EY_2",
                name: "Group Discussion Round",
                isSelectedPhase: false,
                completions: ["CC_CM_01", "CC_CM_03", "CC_MG_01"]
            },
            {
                id: "PHS_EY_3",
                name: "Senior Manager & Partner Interview",
                isSelectedPhase: false,
                completions: ["CC_CM_03", "CC_MG_01"] // In final interview!
            },
            {
                id: "PHS_EY_4",
                name: "Final Selection",
                isSelectedPhase: true,
                completions: [] // Drive currently ongoing
            }
        ]
    },
    {
        id: "REC_005",
        name: "Infosys Limited",
        venue: "Systems Engineer & Operations Trainee",
        date: "2026-09-01",
        last_date: "2026-09-18",
        description: "Role: Systems Engineer | CTC: 4.0 LPA | Mysore Training Campus & Pan-India locations | Open to all graduating batches.",
        type: "recruitment",
        target: { type: "all" },
        registrations: ["CC_CS_04", "CC_CS_05", "CC_CS_06", "CC_MT_01", "CC_MT_02", "CC_MT_03", "CC_MG_04"],
        phases: [
            {
                id: "PHS_INF_1",
                name: "InfyTQ Online Assessment",
                isSelectedPhase: false,
                completions: ["CC_CS_04", "CC_CS_05", "CC_MT_01", "CC_MT_02"]
            },
            {
                id: "PHS_INF_2",
                name: "Technical & Behavioral Interview",
                isSelectedPhase: false,
                completions: ["CC_CS_05", "CC_MT_01"]
            },
            {
                id: "PHS_INF_3",
                name: "Selected Phase",
                isSelectedPhase: true,
                completions: [] // Results pending
            }
        ]
    }
];

// -------------------------------------------------------------
// 7. MCQ EXAMS (3 full realistic exams with 10 questions each)
// -------------------------------------------------------------
const exams = [
    {
        id: "EXM_001",
        title: "Python Programming & Data Analytics Fundamentals",
        duration: 30,
        pass_mark: 50,
        negative: 0.25,
        target: { type: "all" },
        questions: [
            {
                text: "Which Python library is primarily used for tabular data manipulation and analysis?",
                type: "single",
                marks: 1,
                options: ["NumPy", "Pandas", "Matplotlib", "Scikit-Learn"],
                correct: ["Pandas"],
                explanation: "Pandas provides DataFrame and Series data structures optimized for working with structured tabular data."
            },
            {
                text: "Which of the following are mutable data types in standard Python?",
                type: "multiple",
                marks: 1,
                options: ["List", "Tuple", "Dictionary", "String"],
                correct: ["List", "Dictionary"],
                explanation: "Lists and dictionaries can be altered in place, whereas Tuples and Strings are immutable."
            },
            {
                text: "In Python, indexing starts at 0 for lists and tuples.",
                type: "truefalse",
                marks: 1,
                options: ["True", "False"],
                correct: ["True"],
                explanation: "Python adopts zero-based indexing for all sequential data structures."
            },
            {
                text: "What does the 'len()' function return when passed a Python dictionary?",
                type: "single",
                marks: 1,
                options: ["Total number of key-value pairs", "Size in bytes", "Sum of all values", "Number of keys only"],
                correct: ["Total number of key-value pairs"],
                explanation: "len(dict) returns the count of top-level keys (key-value pairs) in the dictionary."
            },
            {
                text: "Which Pandas method is used to remove missing or NaN values from a DataFrame?",
                type: "single",
                marks: 1,
                options: ["df.remove_nan()", "df.dropna()", "df.fillna()", "df.clean()"],
                correct: ["df.dropna()"],
                explanation: "df.dropna() drops rows or columns containing null values based on the axis specified."
            },
            {
                text: "Which function is used to convert a JSON string into a Python dictionary?",
                type: "single",
                marks: 1,
                options: ["json.loads()", "json.dumps()", "json.parse()", "json.stringify()"],
                correct: ["json.loads()"],
                explanation: "json.loads() deserializes a JSON string into a native Python dictionary/object."
            },
            {
                text: "Python dictionaries preserve key insertion order in modern Python (3.7+).",
                type: "truefalse",
                marks: 1,
                options: ["True", "False"],
                correct: ["True"],
                explanation: "Since Python 3.7, dict insertion order preservation is an official language guarantee."
            },
            {
                text: "Which method is used in Pandas to aggregate and group data by categorical columns?",
                type: "single",
                marks: 1,
                options: ["df.categorize()", "df.groupby()", "df.cluster()", "df.pivot_table()"],
                correct: ["df.groupby()"],
                explanation: "df.groupby() splits the data into groups based on some criteria, applies a function, and combines results."
            },
            {
                text: "Which operator is used for exponentiation (power) in Python?",
                type: "single",
                marks: 1,
                options: ["^", "**", "^^", "exp()"],
                correct: ["**"],
                explanation: "In Python, 2 ** 3 evaluates to 8. The caret (^) operator represents bitwise XOR."
            },
            {
                text: "A list comprehension can replace standard for-loops to build lists with cleaner syntax.",
                type: "truefalse",
                marks: 1,
                options: ["True", "False"],
                correct: ["True"],
                explanation: "List comprehensions offer a concise way to create lists such as [x*2 for x in items]."
            }
        ]
    },
    {
        id: "EXM_002",
        title: "Relational Databases & SQL Querying Assessment",
        duration: 30,
        pass_mark: 50,
        negative: 0.25,
        target: { type: "all" },
        questions: [
            {
                text: "Which SQL clause is used to filter rows AFTER an aggregation with GROUP BY has been computed?",
                type: "single",
                marks: 1,
                options: ["WHERE", "HAVING", "ORDER BY", "FILTER"],
                correct: ["HAVING"],
                explanation: "WHERE filters individual rows before aggregation; HAVING filters aggregated groups."
            },
            {
                text: "Which of the following commands belong to Data Definition Language (DDL)?",
                type: "multiple",
                marks: 1,
                options: ["CREATE", "SELECT", "ALTER", "DROP"],
                correct: ["CREATE", "ALTER", "DROP"],
                explanation: "CREATE, ALTER, and DROP modify schema structure (DDL). SELECT is DQL/DML."
            },
            {
                text: "A PRIMARY KEY column allows NULL values by default.",
                type: "truefalse",
                marks: 1,
                options: ["True", "False"],
                correct: ["False"],
                explanation: "A PRIMARY KEY strictly enforces both UNIQUE and NOT NULL constraints."
            },
            {
                text: "Which JOIN type returns all records from the left table and matched records from the right table?",
                type: "single",
                marks: 1,
                options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "CROSS JOIN"],
                correct: ["LEFT JOIN"],
                explanation: "A LEFT OUTER JOIN preserves all rows from the left table and fills non-matching right table columns with NULL."
            },
            {
                text: "Which aggregate function counts only non-null values of a specific column in SQL?",
                type: "single",
                marks: 1,
                options: ["COUNT(column_name)", "COUNT(*)", "SUM(column_name)", "TOTAL()"],
                correct: ["COUNT(column_name)"],
                explanation: "COUNT(column) ignores NULL rows in that column, whereas COUNT(*) counts all rows."
            },
            {
                text: "What SQL keyword eliminates duplicate rows from the output result set?",
                type: "single",
                marks: 1,
                options: ["UNIQUE", "DISTINCT", "DIFFERENT", "ISOLATE"],
                correct: ["DISTINCT"],
                explanation: "SELECT DISTINCT column FROM table returns unique values without repetition."
            },
            {
                text: "Database indexes speed up read/SELECT queries but can slightly slow down INSERT/UPDATE operations.",
                type: "truefalse",
                marks: 1,
                options: ["True", "False"],
                correct: ["True"],
                explanation: "Indexes must be updated during write operations, which introduces slight write overhead for faster reads."
            },
            {
                text: "Which SQL constraint ensures all values in a column are distinct?",
                type: "single",
                marks: 1,
                options: ["CHECK", "UNIQUE", "FOREIGN KEY", "DEFAULT"],
                correct: ["UNIQUE"],
                explanation: "The UNIQUE constraint ensures that all values in a column are different."
            },
            {
                text: "Which wildcard character represents zero or more characters in an SQL LIKE expression?",
                type: "single",
                marks: 1,
                options: ["_", "%", "*", "?"],
                correct: ["%"],
                explanation: "The percentage sign (%) represents zero, one, or multiple characters. The underscore (_) represents exactly one."
            },
            {
                text: "A foreign key creates a link between data in two tables.",
                type: "truefalse",
                marks: 1,
                options: ["True", "False"],
                correct: ["True"],
                explanation: "A foreign key in one table references the primary key in another table, enforcing referential integrity."
            }
        ]
    },
    {
        id: "EXM_003",
        title: "Power BI & Business Intelligence Fundamentals",
        duration: 25,
        pass_mark: 40,
        negative: 0,
        target: { type: "all" },
        questions: [
            {
                text: "What language is used for data transformation and mashup inside Power Query?",
                type: "single",
                marks: 1,
                options: ["DAX", "M Language", "Python", "R"],
                correct: ["M Language"],
                explanation: "Power Query uses the functional 'M' language to record and execute ETL steps."
            },
            {
                text: "What does DAX stand for in Power BI and Excel data models?",
                type: "single",
                marks: 1,
                options: ["Data Analysis Expressions", "Direct Access XML", "Dynamic Analytical X-functions", "Database Aggregation Syntax"],
                correct: ["Data Analysis Expressions"],
                explanation: "DAX stands for Data Analysis Expressions, a formula language used in Power BI and Analysis Services."
            },
            {
                text: "Calculated columns in Power BI are evaluated during data refresh and consume RAM.",
                type: "truefalse",
                marks: 1,
                options: ["True", "False"],
                correct: ["True"],
                explanation: "Calculated columns are computed row-by-row at refresh and stored in memory, whereas measures are evaluated on the fly."
            },
            {
                text: "Which DAX function overrides or modifies filter context in a calculation?",
                type: "single",
                marks: 1,
                options: ["SUMX", "CALCULATE", "FILTER", "LOOKUPVALUE"],
                correct: ["CALCULATE"],
                explanation: "CALCULATE is the only DAX function capable of altering, adding, or removing filter context."
            },
            {
                text: "Star schema architecture is the recommended data modeling standard in Power BI.",
                type: "truefalse",
                marks: 1,
                options: ["True", "False"],
                correct: ["True"],
                explanation: "Star schema with central Fact tables and surrounding Dimension tables maximizes engine performance and simplicity."
            },
            {
                text: "Which view in Power BI Desktop allows you to create relationships between tables?",
                type: "single",
                marks: 1,
                options: ["Report View", "Data View", "Model View", "Service View"],
                correct: ["Model View"],
                explanation: "Model View shows the entity relationship diagram where users drag keys to connect tables."
            },
            {
                text: "A slicer visual in Power BI acts as a user-interactive filter on the report page.",
                type: "truefalse",
                marks: 1,
                options: ["True", "False"],
                correct: ["True"],
                explanation: "Slicers provide on-canvas filtering for report consumers to isolate specific years, regions, or categories."
            },
            {
                text: "Power BI dashboards can only be created and customized in Power BI Service (cloud), not Desktop.",
                type: "truefalse",
                marks: 1,
                options: ["True", "False"],
                correct: ["True"],
                explanation: "Desktop creates Reports (.pbix). Multi-report Dashboards are assembled exclusively in Power BI Service."
            }
        ]
    }
];

// -------------------------------------------------------------
// 8. EXAM ATTEMPTS (Realistic attempts with pass/fail variety)
// -------------------------------------------------------------
const examAttempts = [
    // --- Python Exam Attempts ---
    {
        exam_id: "EXM_001",
        register_number: "CC_CS_01", // Ananya Nair: 10/10 (Passed)
        answers: {
            "0": ["Pandas"],
            "1": ["List", "Dictionary"],
            "2": ["True"],
            "3": ["Total number of key-value pairs"],
            "4": ["df.dropna()"],
            "5": ["json.loads()"],
            "6": ["True"],
            "7": ["df.groupby()"],
            "8": ["**"],
            "9": ["True"]
        },
        score: 10,
        passed: true
    },
    {
        exam_id: "EXM_001",
        register_number: "CC_CS_02", // Arjun Menon: 9/10 (Passed)
        answers: {
            "0": ["Pandas"],
            "1": ["List", "Dictionary"],
            "2": ["True"],
            "3": ["Total number of key-value pairs"],
            "4": ["df.dropna()"],
            "5": ["json.loads()"],
            "6": ["True"],
            "7": ["df.groupby()"],
            "8": ["^"], // wrong
            "9": ["True"]
        },
        score: 9,
        passed: true
    },
    {
        exam_id: "EXM_001",
        register_number: "CC_CS_03", // Diya Thomas: 10/10 (Passed)
        answers: {
            "0": ["Pandas"],
            "1": ["List", "Dictionary"],
            "2": ["True"],
            "3": ["Total number of key-value pairs"],
            "4": ["df.dropna()"],
            "5": ["json.loads()"],
            "6": ["True"],
            "7": ["df.groupby()"],
            "8": ["**"],
            "9": ["True"]
        },
        score: 10,
        passed: true
    },
    {
        exam_id: "EXM_001",
        register_number: "CC_CS_04", // Rahul Varma: 4/10 (Failed)
        answers: {
            "0": ["NumPy"],
            "1": ["List"],
            "2": ["True"],
            "3": ["Size in bytes"],
            "4": ["df.dropna()"],
            "5": ["json.parse()"],
            "6": ["True"],
            "7": ["df.categorize()"],
            "8": ["^"],
            "9": ["True"]
        },
        score: 4,
        passed: false
    },
    {
        exam_id: "EXM_001",
        register_number: "CC_CM_01", // Sneha Mathew: 8/10 (Passed)
        answers: {
            "0": ["Pandas"],
            "1": ["List", "Dictionary"],
            "2": ["True"],
            "3": ["Total number of key-value pairs"],
            "4": ["df.dropna()"],
            "5": ["json.loads()"],
            "6": ["False"], // wrong
            "7": ["df.groupby()"],
            "8": ["^"], // wrong
            "9": ["True"]
        },
        score: 8,
        passed: true
    },

    // --- SQL Exam Attempts ---
    {
        exam_id: "EXM_002",
        register_number: "CC_CS_01", // Ananya: 10/10 (Passed)
        answers: {
            "0": ["HAVING"],
            "1": ["CREATE", "ALTER", "DROP"],
            "2": ["False"],
            "3": ["LEFT JOIN"],
            "4": ["COUNT(column_name)"],
            "5": ["DISTINCT"],
            "6": ["True"],
            "7": ["UNIQUE"],
            "8": ["%"],
            "9": ["True"]
        },
        score: 10,
        passed: true
    },
    {
        exam_id: "EXM_002",
        register_number: "CC_CS_02", // Arjun: 10/10 (Passed)
        answers: {
            "0": ["HAVING"],
            "1": ["CREATE", "ALTER", "DROP"],
            "2": ["False"],
            "3": ["LEFT JOIN"],
            "4": ["COUNT(column_name)"],
            "5": ["DISTINCT"],
            "6": ["True"],
            "7": ["UNIQUE"],
            "8": ["%"],
            "9": ["True"]
        },
        score: 10,
        passed: true
    },
    {
        exam_id: "EXM_002",
        register_number: "CC_MT_01", // Kiran Babu: 9/10 (Passed)
        answers: {
            "0": ["HAVING"],
            "1": ["CREATE", "ALTER", "DROP"],
            "2": ["False"],
            "3": ["LEFT JOIN"],
            "4": ["COUNT(column_name)"],
            "5": ["DISTINCT"],
            "6": ["False"], // wrong
            "7": ["UNIQUE"],
            "8": ["%"],
            "9": ["True"]
        },
        score: 9,
        passed: true
    },
    {
        exam_id: "EXM_002",
        register_number: "CC_MT_03", // Nikhil Jose: 4/10 (Failed)
        answers: {
            "0": ["WHERE"],
            "1": ["CREATE"],
            "2": ["True"],
            "3": ["LEFT JOIN"],
            "4": ["COUNT(*)"],
            "5": ["DISTINCT"],
            "6": ["False"],
            "7": ["CHECK"],
            "8": ["%"],
            "9": ["True"]
        },
        score: 4,
        passed: false
    },

    // --- Power BI Exam Attempts ---
    {
        exam_id: "EXM_003",
        register_number: "CC_CM_01", // Sneha Mathew: 8/8 (Passed)
        answers: {
            "0": ["M Language"],
            "1": ["Data Analysis Expressions"],
            "2": ["True"],
            "3": ["CALCULATE"],
            "4": ["True"],
            "5": ["Model View"],
            "6": ["True"],
            "7": ["True"]
        },
        score: 8,
        passed: true
    },
    {
        exam_id: "EXM_003",
        register_number: "CC_CM_02", // Vishnu Prasad: 7/8 (Passed)
        answers: {
            "0": ["M Language"],
            "1": ["Data Analysis Expressions"],
            "2": ["True"],
            "3": ["CALCULATE"],
            "4": ["True"],
            "5": ["Model View"],
            "6": ["True"],
            "7": ["False"] // wrong
        },
        score: 7,
        passed: true
    },
    {
        exam_id: "EXM_003",
        register_number: "CC_MG_01", // Devika Raj: 8/8 (Passed)
        answers: {
            "0": ["M Language"],
            "1": ["Data Analysis Expressions"],
            "2": ["True"],
            "3": ["CALCULATE"],
            "4": ["True"],
            "5": ["Model View"],
            "6": ["True"],
            "7": ["True"]
        },
        score: 8,
        passed: true
    }
];

// -------------------------------------------------------------
// MAIN SEED FUNCTION
// -------------------------------------------------------------
async function seedAll() {
    console.log("=== Starting Complete Database Seeding ===");

    // 1. Insert Teachers
    console.log("Inserting Teachers...");
    const { data: insTeachers, error: errTeachers } = await supabase
        .from('teachers')
        .upsert(teachers, { onConflict: 'phone' })
        .select();
    if (errTeachers) console.error("Teachers Error:", errTeachers.message);
    else console.log(`✓ Inserted ${insTeachers.length} Teachers.`);

    // 2. Insert Class Incharges
    console.log("Inserting Class Incharges...");
    const { data: insClasses, error: errClasses } = await supabase
        .from('class_incharge')
        .upsert(classIncharges, { onConflict: 'class_name' })
        .select();
    if (errClasses) console.error("Class Incharge Error:", errClasses.message);
    else console.log(`✓ Inserted ${insClasses.length} Class Incharges.`);

    // 3. Insert Students
    console.log("Inserting Students...");
    const { data: insStudents, error: errStudents } = await supabase
        .from('students')
        .upsert(students, { onConflict: 'register_number' })
        .select();
    if (errStudents) console.error("Students Error:", errStudents.message);
    else console.log(`✓ Inserted ${insStudents.length} Students.`);

    // 4. Insert Training Programs
    console.log("Inserting Training Programs...");
    const { data: insTrn, error: errTrn } = await supabase
        .from('training_programs')
        .upsert(trainingPrograms, { onConflict: 'id' })
        .select();
    if (errTrn) console.error("Training Programs Error:", errTrn.message);
    else console.log(`✓ Inserted ${insTrn.length} Training Programs.`);

    // 5. Insert Placement Activities & Recruitment Drives
    console.log("Inserting Placement Activities & Recruitment Drives...");
    const allActivities = [...placementActivities, ...recruitmentDrives];
    const { data: insPlc, error: errPlc } = await supabase
        .from('placement_activities')
        .upsert(allActivities, { onConflict: 'id' })
        .select();
    if (errPlc) console.error("Placement Activities Error:", errPlc.message);
    else console.log(`✓ Inserted ${insPlc.length} Placement Activities & Recruitment Drives.`);

    // 6. Insert MCQ Exams
    console.log("Inserting MCQ Exams...");
    const { data: insExams, error: errExams } = await supabase
        .from('exams')
        .upsert(exams, { onConflict: 'id' })
        .select();
    if (errExams) console.error("MCQ Exams Error:", errExams.message);
    else console.log(`✓ Inserted ${insExams.length} MCQ Exams.`);

    // 7. Insert Exam Attempts
    console.log("Inserting Exam Attempts...");
    const { data: insAttempts, error: errAttempts } = await supabase
        .from('exam_attempts')
        .insert(examAttempts)
        .select();
    if (errAttempts) console.error("Exam Attempts Error:", errAttempts.message);
    else console.log(`✓ Inserted ${insAttempts ? insAttempts.length : 0} Exam Attempts.`);

    console.log("=== Seeding Process Finished Successfully ===");
}

seedAll();
