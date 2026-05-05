export interface FlowNode {
  id: string;
  message: string;
  options?: { text: string; nextId: string }[];
  resultCard?: {
    title: string;
    salary: string;
    timeToReady: string;
    skills: string[];
    resources: { name: string; url: string }[];
    firstStep: string;
  };
}

export const flows: Record<string, Record<string, FlowNode>> = {
  career_discovery: {
    'start': {
      id: 'start',
      message: "Hello! I'm NX RaahNuma, your personal career counselor. Let's find your perfect career path. First, what best describes you right now?",
      options: [
        { text: "I'm a student (still studying)", nextId: 'student' },
        { text: "I just graduated", nextId: 'graduated' },
        { text: "I'm working but want to change careers", nextId: 'working' },
        { text: "I have no idea where to start", nextId: 'no_idea' }
      ]
    },
    'student': {
      id: 'student',
      message: "Great! What are you currently studying?",
      options: [
        { text: "Computer Science / IT", nextId: 'student_cs' },
        { text: "Business / Commerce", nextId: 'student_biz' },
        { text: "Medicine / Health", nextId: 'student_med' },
        { text: "Engineering", nextId: 'student_eng' },
        { text: "Arts / Humanities", nextId: 'student_arts' },
        { text: "Law", nextId: 'student_law' },
        { text: "Something else", nextId: 'student_other' }
      ]
    },
    'student_cs': {
      id: 'student_cs',
      message: "Excellent field! What area excites you most within tech?",
      options: [
        { text: "Building apps & websites", nextId: 'cs_web' },
        { text: "Working with data & AI", nextId: 'cs_data' },
        { text: "Cybersecurity", nextId: 'cs_cyber' },
        { text: "Games & Graphics", nextId: 'cs_games' },
        { text: "Not sure yet", nextId: 'cs_notsure' }
      ]
    },
    'cs_web': {
      id: 'cs_web',
      message: "Perfect! Web and app development is one of the highest-demand fields in 2026. Here's what I recommend for you:",
      resultCard: {
        title: "Software Engineer / Full Stack Developer",
        salary: "$60,000 - $150,000/year",
        timeToReady: "12-18 months",
        skills: ["React", "Node.js", "Python", "SQL"],
        resources: [
          { name: "freeCodeCamp", url: "https://www.freecodecamp.org/" },
          { name: "The Odin Project", url: "https://www.theodinproject.com/" },
          { name: "CS50", url: "https://cs50.harvard.edu/x/" }
        ],
        firstStep: "Start HTML & CSS basics today — completely free"
      },
      options: [
        { text: "Show me the full roadmap", nextId: 'action_roadmap' },
        { text: "Find a mentor for this", nextId: 'action_mentor' },
        { text: "What skills should I learn first?", nextId: 'action_skills' },
        { text: "Start over", nextId: 'start' }
      ]
    },
    'cs_data': {
      id: 'cs_data',
      message: "Data Science and AI are shaping the future. Here's your path:",
      resultCard: {
        title: "Data Scientist / ML Engineer",
        salary: "$80,000 - $160,000/year",
        timeToReady: "18-24 months",
        skills: ["Python", "Statistics", "TensorFlow", "SQL"],
        resources: [
          { name: "Kaggle", url: "https://www.kaggle.com/" },
          { name: "fast.ai", url: "https://course.fast.ai/" },
          { name: "Google ML Crash Course", url: "https://developers.google.com/machine-learning/crash-course" }
        ],
        firstStep: "Learn Python basics — 4 weeks, completely free"
      },
      options: [
        { text: "Show me the full roadmap", nextId: 'action_roadmap' },
        { text: "Find a mentor for this", nextId: 'action_mentor' },
        { text: "What skills should I learn first?", nextId: 'action_skills' },
        { text: "Start over", nextId: 'start' }
      ]
    },
    'cs_cyber': {
      id: 'cs_cyber',
      message: "Security is more critical than ever. Here's your path:",
      resultCard: {
        title: "Cybersecurity Analyst",
        salary: "$70,000 - $130,000/year",
        timeToReady: "12-18 months",
        skills: ["Network Security", "Ethical Hacking", "Linux", "Python"],
        resources: [
          { name: "TryHackMe", url: "https://tryhackme.com/" },
          { name: "Cybrary", url: "https://www.cybrary.it/" },
          { name: "Professor Messer", url: "https://www.professormesser.com/" }
        ],
        firstStep: "Get CompTIA Security+ certification roadmap"
      },
      options: [
        { text: "Show me the full roadmap", nextId: 'action_roadmap' },
        { text: "Find a mentor for this", nextId: 'action_mentor' },
        { text: "Start over", nextId: 'start' }
      ]
    },
    'cs_games': {
      id: 'cs_games',
      message: "Game development is a creative and technical challenge. Here's your path:",
      resultCard: {
        title: "Game Developer",
        salary: "$65,000 - $140,000/year",
        timeToReady: "12-24 months",
        skills: ["C#", "C++", "Unity", "Unreal Engine"],
        resources: [
          { name: "Unity Learn", url: "https://learn.unity.com/" },
          { name: "Unreal Online Learning", url: "https://www.unrealengine.com/en-US/onlinelearning-courses" }
        ],
        firstStep: "Download Unity and complete the Roll-a-ball tutorial"
      },
      options: [
        { text: "Show me the full roadmap", nextId: 'action_roadmap' },
        { text: "Find a mentor for this", nextId: 'action_mentor' },
        { text: "Start over", nextId: 'start' }
      ]
    },
    'cs_notsure': {
      id: 'cs_notsure',
      message: "No worries at all! Let me ask you a different way — when you have free time, what do you naturally enjoy doing?",
      options: [
        { text: "Building or creating things", nextId: 'cs_web' },
        { text: "Solving puzzles and problems", nextId: 'cs_data' },
        { text: "Helping and teaching others", nextId: 'cs_cyber' },
        { text: "Writing or storytelling", nextId: 'student_arts' },
        { text: "Managing and organizing", nextId: 'student_biz' }
      ]
    },
    'student_biz': {
      id: 'student_biz',
      message: "Business is a broad and rewarding field. What direction are you most drawn to?",
      options: [
        { text: "Starting my own business", nextId: 'biz_startup' },
        { text: "Finance & investment", nextId: 'biz_finance' },
        { text: "Marketing & brand building", nextId: 'biz_marketing' },
        { text: "Human Resources", nextId: 'biz_hr' },
        { text: "Supply chain & operations", nextId: 'biz_ops' }
      ]
    },
    'biz_startup': {
      id: 'biz_startup',
      message: "Entrepreneurship is challenging but incredibly rewarding. Here's your path:",
      resultCard: {
        title: "Entrepreneur / Startup Founder",
        salary: "Unlimited",
        timeToReady: "You can start RIGHT NOW",
        skills: ["Business planning", "Marketing", "Finance basics", "Networking"],
        resources: [
          { name: "Y Combinator Startup School", url: "https://www.startupschool.org/" },
          { name: "Coursera Business Basics", url: "https://www.coursera.org/browse/business" }
        ],
        firstStep: "Identify one real problem in your community and write a 1-page solution"
      },
      options: [
        { text: "Show me the full roadmap", nextId: 'action_roadmap' },
        { text: "Find a mentor for this", nextId: 'action_mentor' },
        { text: "How do I get funding?", nextId: 'action_funding' },
        { text: "Start over", nextId: 'start' }
      ]
    },
    'biz_finance': {
      id: 'biz_finance',
      message: "Finance is the language of business. Here's your path:",
      resultCard: {
        title: "Financial Analyst / Investment Banker",
        salary: "$65,000 - $200,000/year",
        timeToReady: "2-3 years (with CFA preferred)",
        skills: ["Excel", "Financial modeling", "Bloomberg", "Accounting"],
        resources: [
          { name: "CFA Institute", url: "https://www.cfainstitute.org/" },
          { name: "Investopedia", url: "https://www.investopedia.com/" },
          { name: "Wall Street Prep", url: "https://www.wallstreetprep.com/" }
        ],
        firstStep: "Learn Excel financial modeling — free on YouTube"
      },
      options: [
        { text: "Show me the full roadmap", nextId: 'action_roadmap' },
        { text: "Find a mentor for this", nextId: 'action_mentor' },
        { text: "Start over", nextId: 'start' }
      ]
    },
    'biz_marketing': {
      id: 'biz_marketing',
      message: "Marketing connects products with people. Here's your path:",
      resultCard: {
        title: "Digital Marketing Manager / Brand Strategist",
        salary: "$50,000 - $120,000/year",
        timeToReady: "6-12 months",
        skills: ["SEO", "Google Ads", "Social Media", "Content", "Analytics"],
        resources: [
          { name: "Google Digital Garage", url: "https://learndigital.withgoogle.com/digitalgarage" },
          { name: "HubSpot Academy", url: "https://academy.hubspot.com/" },
          { name: "Meta Blueprint", url: "https://www.facebook.com/business/learn" }
        ],
        firstStep: "Get Google Digital Marketing certificate — free, 40 hours"
      },
      options: [
        { text: "Show me the full roadmap", nextId: 'action_roadmap' },
        { text: "Find a mentor for this", nextId: 'action_mentor' },
        { text: "Start over", nextId: 'start' }
      ]
    },
    'biz_hr': {
      id: 'biz_hr',
      message: "Human Resources focuses on the most important asset: people.",
      resultCard: {
        title: "HR Manager / Talent Acquisition Specialist",
        salary: "$55,000 - $110,000/year",
        timeToReady: "1-2 years",
        skills: ["Recruitment", "Employee Relations", "Labor Law", "Communication"],
        resources: [
          { name: "SHRM", url: "https://www.shrm.org/" },
          { name: "LinkedIn Learning", url: "https://www.linkedin.com/learning/" }
        ],
        firstStep: "Take an introductory HR course online"
      },
      options: [
        { text: "Show me the full roadmap", nextId: 'action_roadmap' },
        { text: "Find a mentor for this", nextId: 'action_mentor' },
        { text: "Start over", nextId: 'start' }
      ]
    },
    'biz_ops': {
      id: 'biz_ops',
      message: "Operations ensures the business runs smoothly.",
      resultCard: {
        title: "Supply Chain Manager / Operations Analyst",
        salary: "$60,000 - $120,000/year",
        timeToReady: "1-2 years",
        skills: ["Logistics", "Data Analysis", "Process Improvement", "Project Management"],
        resources: [
          { name: "ASCM", url: "https://www.ascm.org/" },
          { name: "edX Supply Chain Courses", url: "https://www.edx.org/learn/supply-chain-management" }
        ],
        firstStep: "Learn the basics of Lean Six Sigma"
      },
      options: [
        { text: "Show me the full roadmap", nextId: 'action_roadmap' },
        { text: "Find a mentor for this", nextId: 'action_mentor' },
        { text: "Start over", nextId: 'start' }
      ]
    },
    'student_med': {
      id: 'student_med',
      message: "Healthcare is one of the most impactful careers. What path interests you?",
      options: [
        { text: "Become a doctor", nextId: 'med_doctor' },
        { text: "Nursing & patient care", nextId: 'med_nursing' },
        { text: "Medical research", nextId: 'med_research' },
        { text: "Health technology", nextId: 'med_tech' },
        { text: "Mental health & psychology", nextId: 'med_psych' }
      ]
    },
    'med_doctor': {
      id: 'med_doctor',
      message: "Becoming a doctor is a long but rewarding journey. Here's your path:",
      resultCard: {
        title: "Medical Doctor / Physician",
        salary: "$150,000 - $300,000/year",
        timeToReady: "8-12 years total",
        skills: ["Biology", "Chemistry", "Patient Care", "Diagnosis"],
        resources: [
          { name: "Khan Academy MCAT", url: "https://www.khanacademy.org/test-prep/mcat" },
          { name: "Osmosis", url: "https://www.osmosis.org/" },
          { name: "Amboss", url: "https://www.amboss.com/" }
        ],
        firstStep: "Focus on Biology, Chemistry, Physics — these are your foundation"
      },
      options: [
        { text: "Show me the full roadmap", nextId: 'action_roadmap' },
        { text: "Find a mentor for this", nextId: 'action_mentor' },
        { text: "What exams do I need?", nextId: 'action_exams' },
        { text: "Start over", nextId: 'start' }
      ]
    },
    'med_tech': {
      id: 'med_tech',
      message: "Health technology merges medicine and innovation. Here's your path:",
      resultCard: {
        title: "Health Informatics / MedTech Developer",
        salary: "$70,000 - $130,000/year",
        timeToReady: "12-18 months",
        skills: ["Programming", "Healthcare Data", "HL7/FHIR standards", "Analytics"],
        resources: [
          { name: "Coursera Health Informatics", url: "https://www.coursera.org/specializations/health-informatics" },
          { name: "Health IT", url: "https://www.healthit.gov/" }
        ],
        firstStep: "Combine your medical knowledge with basic coding skills (Python/SQL)"
      },
      options: [
        { text: "Show me the full roadmap", nextId: 'action_roadmap' },
        { text: "Find a mentor for this", nextId: 'action_mentor' },
        { text: "Start over", nextId: 'start' }
      ]
    },
    'med_nursing': {
      id: 'med_nursing',
      message: "Nursing is the backbone of healthcare.",
      resultCard: {
        title: "Registered Nurse (RN) / Nurse Practitioner",
        salary: "$70,000 - $120,000/year",
        timeToReady: "2-4 years",
        skills: ["Patient Care", "Clinical Skills", "Communication", "Empathy"],
        resources: [
          { name: "NCSBN", url: "https://www.ncsbn.org/" },
          { name: "AllNurses", url: "https://allnurses.com/" }
        ],
        firstStep: "Look into BSN programs in your area"
      },
      options: [
        { text: "Show me the full roadmap", nextId: 'action_roadmap' },
        { text: "Find a mentor for this", nextId: 'action_mentor' },
        { text: "Start over", nextId: 'start' }
      ]
    },
    'med_research': {
      id: 'med_research',
      message: "Medical research pushes the boundaries of science.",
      resultCard: {
        title: "Clinical Research Scientist",
        salary: "$80,000 - $140,000/year",
        timeToReady: "4-8 years (often requires PhD)",
        skills: ["Data Analysis", "Research Methods", "Scientific Writing", "Lab Techniques"],
        resources: [
          { name: "NIH", url: "https://www.nih.gov/" },
          { name: "Nature Careers", url: "https://www.nature.com/naturecareers/" }
        ],
        firstStep: "Find undergraduate research opportunities"
      },
      options: [
        { text: "Show me the full roadmap", nextId: 'action_roadmap' },
        { text: "Find a mentor for this", nextId: 'action_mentor' },
        { text: "Start over", nextId: 'start' }
      ]
    },
    'med_psych': {
      id: 'med_psych',
      message: "Mental health is an increasingly important field.",
      resultCard: {
        title: "Psychologist / Therapist",
        salary: "$60,000 - $120,000/year",
        timeToReady: "6-8 years (Master's or Doctorate)",
        skills: ["Counseling", "Active Listening", "Assessment", "Empathy"],
        resources: [
          { name: "APA", url: "https://www.apa.org/" },
          { name: "Psychology Today", url: "https://www.psychologytoday.com/" }
        ],
        firstStep: "Take introductory psychology and sociology courses"
      },
      options: [
        { text: "Show me the full roadmap", nextId: 'action_roadmap' },
        { text: "Find a mentor for this", nextId: 'action_mentor' },
        { text: "Start over", nextId: 'start' }
      ]
    },
    'student_eng': {
      id: 'student_eng',
      message: "Engineering is a fantastic choice. Which branch are you in or interested in?",
      options: [
        { text: "Software Engineering", nextId: 'cs_web' },
        { text: "Civil Engineering", nextId: 'eng_civil' },
        { text: "Electrical Engineering", nextId: 'eng_elec' },
        { text: "Mechanical Engineering", nextId: 'eng_mech' },
        { text: "Chemical Engineering", nextId: 'eng_chem' }
      ]
    },
    'eng_civil': {
      id: 'eng_civil',
      message: "Civil Engineering shapes the world we live in.",
      resultCard: {
        title: "Civil Engineer",
        salary: "$65,000 - $120,000/year",
        timeToReady: "4 years (Bachelor's degree)",
        skills: ["AutoCAD", "Structural Analysis", "Project Management", "Mathematics"],
        resources: [
          { name: "ASCE", url: "https://www.asce.org/" },
          { name: "Engineering.com", url: "https://www.engineering.com/" }
        ],
        firstStep: "Master calculus and physics"
      },
      options: [
        { text: "Show me the full roadmap", nextId: 'action_roadmap' },
        { text: "Find a mentor for this", nextId: 'action_mentor' },
        { text: "Start over", nextId: 'start' }
      ]
    },
    'eng_elec': {
      id: 'eng_elec',
      message: "Electrical Engineering powers our technology.",
      resultCard: {
        title: "Electrical Engineer",
        salary: "$70,000 - $130,000/year",
        timeToReady: "4 years (Bachelor's degree)",
        skills: ["Circuit Design", "Matlab", "Systems Engineering", "C++"],
        resources: [
          { name: "IEEE", url: "https://www.ieee.org/" },
          { name: "All About Circuits", url: "https://www.allaboutcircuits.com/" }
        ],
        firstStep: "Start learning basic circuit theory"
      },
      options: [
        { text: "Show me the full roadmap", nextId: 'action_roadmap' },
        { text: "Find a mentor for this", nextId: 'action_mentor' },
        { text: "Start over", nextId: 'start' }
      ]
    },
    'eng_mech': {
      id: 'eng_mech',
      message: "Mechanical Engineering is the core of physical innovation.",
      resultCard: {
        title: "Mechanical Engineer",
        salary: "$70,000 - $120,000/year",
        timeToReady: "4 years (Bachelor's degree)",
        skills: ["SolidWorks", "Thermodynamics", "Materials Science", "CAD"],
        resources: [
          { name: "ASME", url: "https://www.asme.org/" },
          { name: "Coursera Mechanical", url: "https://www.coursera.org/courses?query=mechanical%20engineering" }
        ],
        firstStep: "Get familiar with 3D modeling software like SolidWorks or Fusion 360"
      },
      options: [
        { text: "Show me the full roadmap", nextId: 'action_roadmap' },
        { text: "Find a mentor for this", nextId: 'action_mentor' },
        { text: "Start over", nextId: 'start' }
      ]
    },
    'eng_chem': {
      id: 'eng_chem',
      message: "Chemical Engineering transforms materials into useful products.",
      resultCard: {
        title: "Chemical Engineer",
        salary: "$75,000 - $135,000/year",
        timeToReady: "4 years (Bachelor's degree)",
        skills: ["Process Engineering", "Chemistry", "Fluid Mechanics", "Data Analysis"],
        resources: [
          { name: "AIChE", url: "https://www.aiche.org/" },
          { name: "ChemE Tube", url: "https://www.youtube.com/user/LearnChemE" }
        ],
        firstStep: "Focus on organic chemistry and thermodynamics"
      },
      options: [
        { text: "Show me the full roadmap", nextId: 'action_roadmap' },
        { text: "Find a mentor for this", nextId: 'action_mentor' },
        { text: "Start over", nextId: 'start' }
      ]
    },
    'student_law': {
      id: 'student_law',
      message: "Law is a highly respected and intellectually rigorous profession.",
      resultCard: {
        title: "Lawyer / Legal Counsel",
        salary: "$60,000 - $200,000/year",
        timeToReady: "5-7 years",
        skills: ["Research", "Critical Thinking", "Public Speaking", "Negotiation"],
        resources: [
          { name: "LSAC", url: "https://www.lsac.org/" },
          { name: "Harvard Law Free Courses", url: "https://pll.harvard.edu/subject/law" }
        ],
        firstStep: "Build strong reading, writing and debate skills now"
      },
      options: [
        { text: "Show me the full roadmap", nextId: 'action_roadmap' },
        { text: "Find a mentor for this", nextId: 'action_mentor' },
        { text: "Start over", nextId: 'start' }
      ]
    },
    'student_arts': {
      id: 'student_arts',
      message: "The Arts and Humanities build critical thinking and communication skills.",
      resultCard: {
        title: "Content Creator / Copywriter",
        salary: "$45,000 - $90,000/year",
        timeToReady: "6-12 months",
        skills: ["Writing", "SEO", "Editing", "Research"],
        resources: [
          { name: "Copyblogger", url: "https://copyblogger.com/" },
          { name: "HubSpot Content Marketing", url: "https://academy.hubspot.com/courses/content-marketing" }
        ],
        firstStep: "Start a personal blog or portfolio today"
      },
      options: [
        { text: "Show me the full roadmap", nextId: 'action_roadmap' },
        { text: "Find a mentor for this", nextId: 'action_mentor' },
        { text: "Start over", nextId: 'start' }
      ]
    },
    'student_other': {
      id: 'student_other',
      message: "Let's narrow it down. What do you enjoy doing most?",
      options: [
        { text: "Building or creating things", nextId: 'cs_web' },
        { text: "Solving puzzles and problems", nextId: 'cs_data' },
        { text: "Helping and teaching others", nextId: 'med_psych' },
        { text: "Writing or storytelling", nextId: 'student_arts' },
        { text: "Managing and organizing", nextId: 'biz_ops' }
      ]
    },
    'graduated': {
      id: 'graduated',
      message: "Congratulations on graduating! What is your degree in?",
      options: [
        { text: "Computer Science / IT", nextId: 'grad_cs' },
        { text: "Business / Finance", nextId: 'grad_biz' },
        { text: "Engineering", nextId: 'grad_eng' },
        { text: "Social Sciences", nextId: 'grad_social' },
        { text: "Medicine / Health", nextId: 'grad_med' },
        { text: "Arts / Humanities", nextId: 'grad_arts' }
      ]
    },
    'grad_cs': {
      id: 'grad_cs',
      message: "Tech is a great field. Since you've graduated, the focus is now on landing the job.",
      resultCard: {
        title: "Junior Software Engineer",
        salary: "$60,000 - $90,000/year",
        timeToReady: "Ready now (Job hunt: 2-4 months)",
        skills: ["Algorithms", "System Design", "Interviewing", "Portfolio Building"],
        resources: [
          { name: "LeetCode", url: "https://leetcode.com/" },
          { name: "Pramp (Mock Interviews)", url: "https://www.pramp.com/" },
          { name: "GitHub", url: "https://github.com/" }
        ],
        firstStep: "Polish your resume and build two solid portfolio projects"
      },
      options: [
        { text: "Show me the full roadmap", nextId: 'action_roadmap' },
        { text: "Find a mentor for this", nextId: 'action_mentor' },
        { text: "Help with interviews", nextId: 'interview_prep' },
        { text: "Start over", nextId: 'start' }
      ]
    },
    'grad_biz': {
      id: 'grad_biz',
      message: "With a business degree, you have many options. Let's focus on landing a strong entry-level role.",
      resultCard: {
        title: "Business Analyst / Marketing Coordinator",
        salary: "$50,000 - $80,000/year",
        timeToReady: "Ready now (Job hunt: 1-3 months)",
        skills: ["Excel", "Data Analysis", "Communication", "Project Management"],
        resources: [
          { name: "LinkedIn Learning", url: "https://www.linkedin.com/learning/" },
          { name: "Coursera Data Analysis", url: "https://www.coursera.org/professional-certificates/google-data-analytics" }
        ],
        firstStep: "Optimize your LinkedIn profile and start networking"
      },
      options: [
        { text: "Show me the full roadmap", nextId: 'action_roadmap' },
        { text: "Find a mentor for this", nextId: 'action_mentor' },
        { text: "Start over", nextId: 'start' }
      ]
    },
    'grad_eng': {
      id: 'grad_eng',
      message: "Engineering graduates are always in demand. Let's get you into the industry.",
      resultCard: {
        title: "Junior Engineer",
        salary: "$65,000 - $85,000/year",
        timeToReady: "Ready now",
        skills: ["CAD/Software Tools", "Problem Solving", "Teamwork", "Technical Writing"],
        resources: [
          { name: "Engineering Jobs", url: "https://www.engineering.com/jobs/" },
          { name: "FE Exam Prep", url: "https://ncees.org/engineering/fe/" }
        ],
        firstStep: "Consider taking the FE exam if relevant to your field"
      },
      options: [
        { text: "Show me the full roadmap", nextId: 'action_roadmap' },
        { text: "Find a mentor for this", nextId: 'action_mentor' },
        { text: "Start over", nextId: 'start' }
      ]
    },
    'grad_social': {
      id: 'grad_social',
      message: "Social science degrees offer great analytical skills. Let's apply them.",
      resultCard: {
        title: "Market Research Analyst / HR Generalist",
        salary: "$45,000 - $70,000/year",
        timeToReady: "Ready now",
        skills: ["Research", "Writing", "Data Interpretation", "Empathy"],
        resources: [
          { name: "Qualtrics Basecamp", url: "https://basecamp.qualtrics.com/" },
          { name: "SHRM", url: "https://www.shrm.org/" }
        ],
        firstStep: "Learn basic data analysis tools like Excel or Tableau"
      },
      options: [
        { text: "Show me the full roadmap", nextId: 'action_roadmap' },
        { text: "Find a mentor for this", nextId: 'action_mentor' },
        { text: "Start over", nextId: 'start' }
      ]
    },
    'grad_med': {
      id: 'grad_med',
      message: "Healthcare is always growing. Your next steps depend on your specific degree.",
      resultCard: {
        title: "Healthcare Administrator / Clinical Assistant",
        salary: "$45,000 - $80,000/year",
        timeToReady: "Ready now",
        skills: ["Patient Communication", "Medical Terminology", "Organization", "Ethics"],
        resources: [
          { name: "AAMA", url: "https://www.aama-ntl.org/" },
          { name: "Healthcare Triage", url: "https://www.youtube.com/user/thehealthcaretriage" }
        ],
        firstStep: "Look for entry-level clinical or administrative roles at local hospitals"
      },
      options: [
        { text: "Show me the full roadmap", nextId: 'action_roadmap' },
        { text: "Find a mentor for this", nextId: 'action_mentor' },
        { text: "Start over", nextId: 'start' }
      ]
    },
    'grad_arts': {
      id: 'grad_arts',
      message: "Arts and Humanities grads thrive in creative and communication roles.",
      resultCard: {
        title: "Copywriter / PR Assistant",
        salary: "$40,000 - $65,000/year",
        timeToReady: "Ready now",
        skills: ["Writing", "Creativity", "Media Relations", "Content Management"],
        resources: [
          { name: "PRSA", url: "https://www.prsa.org/" },
          { name: "Canva Design School", url: "https://www.canva.com/designschool/" }
        ],
        firstStep: "Build a strong portfolio of your writing or creative work"
      },
      options: [
        { text: "Show me the full roadmap", nextId: 'action_roadmap' },
        { text: "Find a mentor for this", nextId: 'action_mentor' },
        { text: "Start over", nextId: 'start' }
      ]
    },
    'working': {
      id: 'working',
      message: "Career transitions are more common and successful than ever. What is your current field?",
      options: [
        { text: "IT / Tech", nextId: 'work_change_reason' },
        { text: "Finance / Banking", nextId: 'work_change_reason' },
        { text: "Teaching / Education", nextId: 'work_change_reason' },
        { text: "Healthcare", nextId: 'work_change_reason' },
        { text: "Sales / Marketing", nextId: 'work_change_reason' },
        { text: "Government / Public sector", nextId: 'work_change_reason' }
      ]
    },
    'work_change_reason': {
      id: 'work_change_reason',
      message: "What is driving you to change? This helps me give better advice.",
      options: [
        { text: "I want higher salary", nextId: 'cs_web' },
        { text: "I'm bored and want new challenges", nextId: 'cs_data' },
        { text: "Better work-life balance", nextId: 'biz_hr' },
        { text: "More job security", nextId: 'cs_cyber' },
        { text: "I want to follow my passion", nextId: 'student_other' }
      ]
    },
    'no_idea': {
      id: 'no_idea',
      message: "That is completely okay — most people feel this way! Let's figure this out together. When you imagine your ideal work day, which sounds best?",
      options: [
        { text: "Working on a computer solving technical problems", nextId: 'cs_web' },
        { text: "Meeting people and helping them", nextId: 'med_nursing' },
        { text: "Creating things — designs, content, art", nextId: 'student_arts' },
        { text: "Managing teams and making decisions", nextId: 'biz_startup' },
        { text: "Working outdoors or with physical things", nextId: 'eng_civil' }
      ]
    },
    'action_roadmap': {
      id: 'action_roadmap',
      message: "Great! Check out our detailed roadmaps tool.",
      options: [
        { text: "Go to Roadmaps", nextId: 'nav_roadmap' },
        { text: "Start over", nextId: 'start' }
      ]
    },
    'action_mentor': {
      id: 'action_mentor',
      message: "A mentor can accelerate your progress significantly. Check out our Mentor Marketplace.",
      options: [
        { text: "Browse Mentors", nextId: 'nav_mentors' },
        { text: "Start over", nextId: 'start' }
      ]
    },
    'action_skills': {
      id: 'action_skills',
      message: "The best way to start is by learning the foundational skills. Would you like to take a skills assessment?",
      options: [
        { text: "Take Assessment", nextId: 'nav_assessment' },
        { text: "Start over", nextId: 'start' }
      ]
    },
    'action_exams': {
      id: 'action_exams',
      message: "For medical paths, the MCAT (US) or similar entrance exams are critical. Start preparing early.",
      options: [
        { text: "Start over", nextId: 'start' }
      ]
    },
    'action_funding': {
      id: 'action_funding',
      message: "Funding can come from bootstrapping, angel investors, or VC. Start with a solid business plan first.",
      options: [
        { text: "Start over", nextId: 'start' }
      ]
    },
    'nav_roadmap': { id: 'nav_roadmap', message: "Redirecting...", options: [] },
    'nav_mentors': { id: 'nav_mentors', message: "Redirecting...", options: [] },
    'nav_assessment': { id: 'nav_assessment', message: "Redirecting...", options: [] },
    
    // Resume flow
    'resume_help': {
      id: 'resume_help',
      message: "I'll help you build a strong resume. What stage are you at?",
      options: [
        { text: "I need to build a resume from scratch", nextId: 'resume_scratch' },
        { text: "I have a resume but want to improve it", nextId: 'resume_improve' },
        { text: "I want to check if my resume is ATS-friendly", nextId: 'resume_ats' },
        { text: "I need a cover letter", nextId: 'resume_cover' }
      ]
    },
    'resume_scratch': {
      id: 'resume_scratch',
      message: "Starting from scratch is great. Focus on highlighting your education, skills, and any projects or volunteer work.",
      options: [
        { text: "Go to Resume Builder", nextId: 'nav_resume' },
        { text: "Start over", nextId: 'start' }
      ]
    },
    'resume_improve': {
      id: 'resume_improve',
      message: "To improve an existing resume, focus on quantifiable achievements (e.g., 'Increased sales by 20%') rather than just listing duties.",
      options: [
        { text: "Go to Resume Builder", nextId: 'nav_resume' },
        { text: "Start over", nextId: 'start' }
      ]
    },
    'resume_ats': {
      id: 'resume_ats',
      message: "ATS (Applicant Tracking Systems) look for specific keywords. Make sure your resume matches the job description terminology.",
      options: [
        { text: "Go to Resume Builder", nextId: 'nav_resume' },
        { text: "Start over", nextId: 'start' }
      ]
    },
    'resume_cover': {
      id: 'resume_cover',
      message: "A good cover letter tells a story your resume doesn't. Highlight your passion and why you fit the company culture.",
      options: [
        { text: "Start over", nextId: 'start' }
      ]
    },
    'nav_resume': { id: 'nav_resume', message: "Redirecting...", options: [] },

    // Interview Prep Flow
    'interview_prep': {
      id: 'interview_prep',
      message: "Great — let's prepare you for interviews! What type of interview are you preparing for?",
      options: [
        { text: "Tech / Software Engineering", nextId: 'int_tech' },
        { text: "Business / Finance", nextId: 'int_biz' },
        { text: "Medical / Healthcare", nextId: 'int_med' },
        { text: "General / HR round", nextId: 'int_hr' },
        { text: "Scholarship interview", nextId: 'int_schol' }
      ]
    },
    'int_tech': {
      id: 'int_tech',
      message: "Tech interviews focus heavily on algorithms, system design, and coding. Practice on LeetCode and be prepared to explain your thought process out loud.",
      options: [
        { text: "Book a mock interview with a mentor", nextId: 'nav_mentors' },
        { text: "Start over", nextId: 'start' }
      ]
    },
    'int_biz': {
      id: 'int_biz',
      message: "Business interviews often use the STAR method (Situation, Task, Action, Result) for behavioral questions, and may include case studies.",
      options: [
        { text: "Book a mock interview with a mentor", nextId: 'nav_mentors' },
        { text: "Start over", nextId: 'start' }
      ]
    },
    'int_med': {
      id: 'int_med',
      message: "Medical interviews (like MMI) test ethical decision-making, empathy, and communication under pressure.",
      options: [
        { text: "Book a mock interview with a mentor", nextId: 'nav_mentors' },
        { text: "Start over", nextId: 'start' }
      ]
    },
    'int_hr': {
      id: 'int_hr',
      message: "HR rounds check for culture fit. Be ready to answer 'Tell me about yourself', 'What are your weaknesses?', and 'Why do you want to work here?'.",
      options: [
        { text: "Book a mock interview with a mentor", nextId: 'nav_mentors' },
        { text: "Start over", nextId: 'start' }
      ]
    },
    'int_schol': {
      id: 'int_schol',
      message: "Scholarship interviews want to see your vision, leadership potential, and how the scholarship will help you impact society.",
      options: [
        { text: "Book a mock interview with a mentor", nextId: 'nav_mentors' },
        { text: "Start over", nextId: 'start' }
      ]
    },

    // Freelancing Guide Flow
    'freelance_guide': {
      id: 'freelance_guide',
      message: "Freelancing is a great path! What skill do you want to freelance with?",
      options: [
        { text: "Web development", nextId: 'free_web' },
        { text: "Graphic design", nextId: 'free_design' },
        { text: "Content writing", nextId: 'free_write' },
        { text: "Video editing", nextId: 'free_video' },
        { text: "Digital marketing", nextId: 'free_marketing' },
        { text: "Data entry / Virtual assistant", nextId: 'free_va' },
        { text: "I don't have a skill yet", nextId: 'start' }
      ]
    },
    'free_web': {
      id: 'free_web',
      message: "Web dev is highly lucrative on platforms like Upwork and Fiverr. Start by building 3 solid portfolio sites. Price yourself competitively ($15-$25/hr) to get initial reviews, then raise rates.",
      options: [
        { text: "Find a freelancing mentor", nextId: 'nav_mentors' },
        { text: "Start over", nextId: 'start' }
      ]
    },
    'free_design': {
      id: 'free_design',
      message: "For design, visual proof is everything. Build a strong Behance or Dribbble portfolio. Start offering small gigs (like logo design or social media posts) to build a client base.",
      options: [
        { text: "Find a freelancing mentor", nextId: 'nav_mentors' },
        { text: "Start over", nextId: 'start' }
      ]
    },
    'free_write': {
      id: 'free_write',
      message: "Content writers are always in demand. Niche down (e.g., tech writing, health blogs). Create sample articles on Medium to show clients your style and SEO knowledge.",
      options: [
        { text: "Find a freelancing mentor", nextId: 'nav_mentors' },
        { text: "Start over", nextId: 'start' }
      ]
    },
    'free_video': {
      id: 'free_video',
      message: "With the rise of YouTube and TikTok, video editors are essential. Create a short, punchy showreel. Offer a free trial edit for YouTubers to get your foot in the door.",
      options: [
        { text: "Find a freelancing mentor", nextId: 'nav_mentors' },
        { text: "Start over", nextId: 'start' }
      ]
    },
    'free_marketing': {
      id: 'free_marketing',
      message: "Digital marketers should focus on ROI. Specializing in Google Ads or Facebook Ads usually pays better than general social media management. Get certified.",
      options: [
        { text: "Find a freelancing mentor", nextId: 'nav_mentors' },
        { text: "Start over", nextId: 'start' }
      ]
    },
    'free_va': {
      id: 'free_va',
      message: "Virtual Assistants are in high demand. Highlight your organizational skills, proficiency in tools like Excel/Asana/Slack, and excellent communication.",
      options: [
        { text: "Find a freelancing mentor", nextId: 'nav_mentors' },
        { text: "Start over", nextId: 'start' }
      ]
    }
  },
  scholarships: {
    'start': {
      id: 'start',
      message: "Let's find scholarships that match your profile. Where do you want to study?",
      options: [
        { text: "United States", nextId: 'schol_us' },
        { text: "United Kingdom", nextId: 'schol_uk' },
        { text: "Canada", nextId: 'schol_can' },
        { text: "Australia", nextId: 'schol_aus' },
        { text: "Germany", nextId: 'schol_ger' },
        { text: "Any country", nextId: 'schol_any' }
      ]
    },
    'schol_us': {
      id: 'schol_us',
      message: "The US has great opportunities like Fulbright. What is your current education level?",
      options: [
        { text: "High School / O-Levels", nextId: 'schol_level' },
        { text: "Bachelor's student", nextId: 'schol_level' },
        { text: "Bachelor's graduate", nextId: 'schol_level' },
        { text: "Master's student", nextId: 'schol_level' }
      ]
    },
    'schol_uk': {
      id: 'schol_uk',
      message: "The UK offers Chevening and Commonwealth scholarships. What is your current education level?",
      options: [
        { text: "High School / O-Levels", nextId: 'schol_level' },
        { text: "Bachelor's student", nextId: 'schol_level' },
        { text: "Bachelor's graduate", nextId: 'schol_level' },
        { text: "Master's student", nextId: 'schol_level' }
      ]
    },
    'schol_can': { id: 'schol_can', message: "Canada is very welcoming to international students. What is your current education level?", options: [{ text: "High School / O-Levels", nextId: 'schol_level' }, { text: "Bachelor's student", nextId: 'schol_level' }, { text: "Bachelor's graduate", nextId: 'schol_level' }, { text: "Master's student", nextId: 'schol_level' }] },
    'schol_aus': { id: 'schol_aus', message: "Australia Awards are fantastic. What is your current education level?", options: [{ text: "High School / O-Levels", nextId: 'schol_level' }, { text: "Bachelor's student", nextId: 'schol_level' }, { text: "Bachelor's graduate", nextId: 'schol_level' }, { text: "Master's student", nextId: 'schol_level' }] },
    'schol_ger': { id: 'schol_ger', message: "Germany (DAAD) offers excellent tuition-free education. What is your current education level?", options: [{ text: "High School / O-Levels", nextId: 'schol_level' }, { text: "Bachelor's student", nextId: 'schol_level' }, { text: "Bachelor's graduate", nextId: 'schol_level' }, { text: "Master's student", nextId: 'schol_level' }] },
    'schol_any': { id: 'schol_any', message: "Keeping options open is smart. What is your current education level?", options: [{ text: "High School / O-Levels", nextId: 'schol_level' }, { text: "Bachelor's student", nextId: 'schol_level' }, { text: "Bachelor's graduate", nextId: 'schol_level' }, { text: "Master's student", nextId: 'schol_level' }] },
    
    'schol_level': {
      id: 'schol_level',
      message: "What is your field of study?",
      options: [
        { text: "STEM (Science, Tech, Eng, Math)", nextId: 'schol_field' },
        { text: "Business / Economics", nextId: 'schol_field' },
        { text: "Medicine / Health", nextId: 'schol_field' },
        { text: "Arts / Humanities / Law", nextId: 'schol_field' },
        { text: "Any field", nextId: 'schol_field' }
      ]
    },
    'schol_field': {
      id: 'schol_field',
      message: "What type of funding are you looking for?",
      options: [
        { text: "Full scholarship (tuition + living)", nextId: 'schol_result' },
        { text: "Partial scholarship (tuition only)", nextId: 'schol_result' },
        { text: "Any financial support available", nextId: 'schol_result' }
      ]
    },
    'schol_result': {
      id: 'schol_result',
      message: "I recommend checking out our Scholarship Finder tool for a tailored list.",
      options: [
        { text: "Go to Scholarship Finder", nextId: 'nav_scholarships' },
        { text: "Talk to a scholarship mentor", nextId: 'nav_mentors' },
        { text: "Start over", nextId: 'start' }
      ]
    },
    'nav_scholarships': { id: 'nav_scholarships', message: "Redirecting...", options: [] },
    'nav_mentors': { id: 'nav_mentors', message: "Redirecting...", options: [] }
  }
};

export function getStartNode(flowId: string): FlowNode | null {
  return flows[flowId]?.['start'] || null;
}

export function getNode(flowId: string, nodeId: string): FlowNode | null {
  return flows[flowId]?.[nodeId] || null;
}
