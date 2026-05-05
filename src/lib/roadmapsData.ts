export const ROADMAPS = [
  {
    career: "Software Engineer",
    description: "Complete 18-month roadmap to become a Full Stack Software Engineer.",
    educationLevel: "Self-taught / Bootcamp / Degree",
    hoursPerWeek: 20,
    startingPoint: "Absolute Beginner",
    milestones: [
      {
        month: "Months 1-2",
        title: "Internet Basics, HTML & CSS",
        tasks: [
          { text: "Understand how the internet, browsers, and DNS work", completed: false },
          { text: "Learn HTML5 semantics and structure", completed: false },
          { text: "Master CSS basics, Flexbox, and CSS Grid", completed: false },
          { text: "Build a responsive portfolio website", completed: false }
        ],
        resources: ["freeCodeCamp Responsive Web Design", "MDN Web Docs"],
        skills: ["HTML", "CSS", "Responsive Design"]
      },
      {
        month: "Months 3-5",
        title: "JavaScript Fundamentals",
        tasks: [
          { text: "Learn variables, data types, and functions", completed: false },
          { text: "Master DOM manipulation and events", completed: false },
          { text: "Understand ES6+ features (arrow functions, destructuring)", completed: false },
          { text: "Build an interactive To-Do list app", completed: false }
        ],
        resources: ["JavaScript30 by Wes Bos", "The Odin Project - Foundations"],
        skills: ["JavaScript", "DOM Manipulation", "Problem Solving"]
      },
      {
        month: "Months 6-8",
        title: "Frontend Framework (React)",
        tasks: [
          { text: "Learn React components, props, and state", completed: false },
          { text: "Master React Hooks (useState, useEffect)", completed: false },
          { text: "Understand routing with React Router", completed: false },
          { text: "Build a weather app using a public API", completed: false }
        ],
        resources: ["React Official Documentation", "Scrimba React Course"],
        skills: ["React", "State Management", "API Fetching"]
      },
      {
        month: "Months 9-11",
        title: "Backend Development (Node.js & Express)",
        tasks: [
          { text: "Learn basic terminal commands and Git/GitHub", completed: false },
          { text: "Set up a Node.js server with Express", completed: false },
          { text: "Build RESTful APIs and handle routing", completed: false },
          { text: "Understand middleware and error handling", completed: false }
        ],
        resources: ["Full Stack Open (University of Helsinki)", "Node.js documentation"],
        skills: ["Node.js", "Express", "REST APIs", "Git"]
      },
      {
        month: "Months 12-14",
        title: "Databases (SQL & NoSQL)",
        tasks: [
          { text: "Learn relational database concepts and SQL", completed: false },
          { text: "Set up PostgreSQL and learn basic queries", completed: false },
          { text: "Learn MongoDB (NoSQL) and Mongoose", completed: false },
          { text: "Connect your Node backend to a database", completed: false }
        ],
        resources: ["SQLBolt", "MongoDB University"],
        skills: ["PostgreSQL", "MongoDB", "Database Design"]
      },
      {
        month: "Months 15-18",
        title: "Full Stack Project & Job Hunt",
        tasks: [
          { text: "Build a full-stack e-commerce or social app", completed: false },
          { text: "Deploy frontend to Vercel/Netlify, backend to Render/Heroku", completed: false },
          { text: "Practice algorithm questions on LeetCode", completed: false },
          { text: "Polish resume and apply to 10 jobs a week", completed: false }
        ],
        resources: ["LeetCode", "Pramp (Mock Interviews)"],
        skills: ["Deployment", "Algorithms", "Interviewing"]
      }
    ],
    salaryProgression: [
      { year: 1, salary: 65000 },
      { year: 3, salary: 90000 },
      { year: 5, salary: 130000 },
      { year: 10, salary: 160000 }
    ]
  },
  {
    career: "Data Scientist",
    description: "Complete 24-month roadmap to become a Data Scientist.",
    educationLevel: "Degree / Bootcamp / Self-taught",
    hoursPerWeek: 20,
    startingPoint: "Beginner with Math skills",
    milestones: [
      {
        month: "Months 1-3",
        title: "Math & Statistics Fundamentals",
        tasks: [
          { text: "Review Linear Algebra (matrices, vectors)", completed: false },
          { text: "Learn Calculus basics (derivatives, gradients)", completed: false },
          { text: "Master Descriptive and Inferential Statistics", completed: false },
          { text: "Understand Probability distributions", completed: false }
        ],
        resources: ["Khan Academy Math", "StatQuest with Josh Starmer"],
        skills: ["Linear Algebra", "Calculus", "Statistics", "Probability"]
      },
      {
        month: "Months 4-6",
        title: "Python Programming",
        tasks: [
          { text: "Learn Python basics (data structures, loops, functions)", completed: false },
          { text: "Master NumPy for numerical computing", completed: false },
          { text: "Learn Pandas for data manipulation", completed: false },
          { text: "Practice Python problem solving", completed: false }
        ],
        resources: ["Automate the Boring Stuff with Python", "Kaggle Python Course"],
        skills: ["Python", "NumPy", "Pandas"]
      },
      {
        month: "Months 7-10",
        title: "Data Visualization & SQL",
        tasks: [
          { text: "Learn Matplotlib and Seaborn for visualization", completed: false },
          { text: "Master SQL queries (JOINs, aggregations, window functions)", completed: false },
          { text: "Build interactive dashboards (Tableau/PowerBI)", completed: false },
          { text: "Complete an exploratory data analysis (EDA) project", completed: false }
        ],
        resources: ["Mode SQL Tutorial", "Tableau Public Training"],
        skills: ["Data Visualization", "SQL", "Tableau"]
      },
      {
        month: "Months 11-15",
        title: "Machine Learning Foundations",
        tasks: [
          { text: "Learn Scikit-Learn library", completed: false },
          { text: "Understand regression models (Linear, Logistic)", completed: false },
          { text: "Learn classification (Decision Trees, Random Forests)", completed: false },
          { text: "Understand clustering (K-Means) and PCA", completed: false }
        ],
        resources: ["Andrew Ng Machine Learning (Coursera)", "Hands-On Machine Learning (Book)"],
        skills: ["Scikit-Learn", "Regression", "Classification", "Clustering"]
      },
      {
        month: "Months 16-20",
        title: "Deep Learning & Advanced Topics",
        tasks: [
          { text: "Learn Neural Networks fundamentals", completed: false },
          { text: "Master TensorFlow or PyTorch", completed: false },
          { text: "Learn CNNs for computer vision", completed: false },
          { text: "Understand NLP basics and Transformers", completed: false }
        ],
        resources: ["fast.ai", "DeepLearning.AI Specialization"],
        skills: ["PyTorch", "TensorFlow", "Deep Learning", "NLP"]
      },
      {
        month: "Months 21-24",
        title: "Portfolio & Job Hunt",
        tasks: [
          { text: "Complete 2 end-to-end ML projects (data collection to deployment)", completed: false },
          { text: "Learn model deployment using Flask/FastAPI and Docker", completed: false },
          { text: "Participate in Kaggle competitions", completed: false },
          { text: "Polish resume and practice ML interviews", completed: false }
        ],
        resources: ["Kaggle", "Towards Data Science"],
        skills: ["Model Deployment", "Docker", "MLOps"]
      }
    ],
    salaryProgression: [
      { year: 1, salary: 80000 },
      { year: 3, salary: 110000 },
      { year: 5, salary: 140000 },
      { year: 10, salary: 180000 }
    ]
  },
  {
    career: "Digital Marketer",
    description: "Complete 8-month roadmap to become a Digital Marketing Manager.",
    educationLevel: "Self-taught / Degree",
    hoursPerWeek: 15,
    startingPoint: "Beginner",
    milestones: [
      {
        month: "Months 1-2",
        title: "Marketing Foundations & Content",
        tasks: [
          { text: "Understand marketing funnels and buyer personas", completed: false },
          { text: "Learn copywriting basics and storytelling", completed: false },
          { text: "Start a blog or social media account to practice", completed: false }
        ],
        resources: ["HubSpot Academy", "Copyblogger"],
        skills: ["Copywriting", "Content Strategy", "Brand Positioning"]
      },
      {
        month: "Months 3-4",
        title: "SEO & Organic Growth",
        tasks: [
          { text: "Learn on-page, off-page, and technical SEO", completed: false },
          { text: "Master keyword research tools (Ahrefs/SEMrush free tiers)", completed: false },
          { text: "Optimize your blog/website for search", completed: false }
        ],
        resources: ["Moz Beginner's Guide to SEO", "Google Search Central"],
        skills: ["SEO", "Keyword Research", "Google Analytics"]
      },
      {
        month: "Months 5-6",
        title: "Paid Advertising (PPC)",
        tasks: [
          { text: "Get Google Ads certified", completed: false },
          { text: "Learn Facebook/Meta Ads Manager", completed: false },
          { text: "Understand ROAS, CPA, and conversion tracking", completed: false }
        ],
        resources: ["Google Skillshop", "Meta Blueprint"],
        skills: ["Google Ads", "Facebook Ads", "Data Analysis"]
      },
      {
        month: "Months 7-8",
        title: "Email Marketing & Job Hunt",
        tasks: [
          { text: "Learn email marketing platforms (Mailchimp/Klaviyo)", completed: false },
          { text: "Understand drip campaigns and list building", completed: false },
          { text: "Build a portfolio showing campaign results (even small ones)", completed: false }
        ],
        resources: ["Really Good Emails", "Mailchimp Academy"],
        skills: ["Email Marketing", "Automation", "Campaign Management"]
      }
    ],
    salaryProgression: [
      { year: 1, salary: 50000 },
      { year: 3, salary: 75000 },
      { year: 5, salary: 100000 },
      { year: 10, salary: 130000 }
    ]
  },
  {
    career: "Medical Doctor",
    description: "10-year academic and clinical roadmap to become a Physician.",
    educationLevel: "University degree required",
    hoursPerWeek: 40,
    startingPoint: "Pre-Med Undergraduate",
    milestones: [
      {
        month: "Years 1-4",
        title: "Pre-Med Undergraduate",
        tasks: [
          { text: "Complete required pre-med science courses (Bio, Chem, Physics)", completed: false },
          { text: "Maintain a high GPA (3.7+ recommended)", completed: false },
          { text: "Gain clinical experience (shadowing, volunteering)", completed: false },
          { text: "Prepare for and take the MCAT", completed: false }
        ],
        resources: ["AAMC Guidelines", "Khan Academy MCAT"],
        skills: ["Biology", "Chemistry", "Critical Thinking", "Discipline"]
      },
      {
        month: "Years 5-6",
        title: "Medical School (Pre-Clinical)",
        tasks: [
          { text: "Master anatomy, biochemistry, pharmacology", completed: false },
          { text: "Pass USMLE Step 1 (or regional equivalent)", completed: false },
          { text: "Learn patient interviewing and physical exams", completed: false }
        ],
        resources: ["First Aid for the USMLE", "UWorld"],
        skills: ["Medical Knowledge", "Anatomy", "Pathology"]
      },
      {
        month: "Years 7-8",
        title: "Medical School (Clinical Rotations)",
        tasks: [
          { text: "Complete core clinical rotations (Surgery, IM, Peds, OBGYN)", completed: false },
          { text: "Pass USMLE Step 2 CK", completed: false },
          { text: "Apply for residency programs (ERAS)", completed: false }
        ],
        resources: ["OnlineMedEd", "AMBOSS"],
        skills: ["Clinical Diagnostics", "Patient Care", "Surgical Basics"]
      },
      {
        month: "Years 9-11+",
        title: "Residency & Fellowship",
        tasks: [
          { text: "Match into a specialty residency program", completed: false },
          { text: "Complete 3-7 years of residency training", completed: false },
          { text: "Pass specialty board certification exams", completed: false }
        ],
        resources: ["ACGME", "Specialty Board Sites"],
        skills: ["Specialized Medicine", "Leadership", "Advanced Procedures"]
      }
    ],
    salaryProgression: [
      { year: 1, salary: 60000 }, // Resident
      { year: 4, salary: 200000 }, // Attending (Primary Care)
      { year: 8, salary: 250000 },
      { year: 15, salary: 350000 } // Attending (Specialist)
    ]
  },
  {
    career: "Entrepreneur",
    description: "12-month practical roadmap to launch your first startup.",
    educationLevel: "No degree required",
    hoursPerWeek: 30,
    startingPoint: "Idea Stage",
    milestones: [
      {
        month: "Months 1-2",
        title: "Ideation & Validation",
        tasks: [
          { text: "Identify a painful problem in a growing market", completed: false },
          { text: "Conduct 50+ user interviews (Mom Test methodology)", completed: false },
          { text: "Create a landing page to collect waitlist emails", completed: false }
        ],
        resources: ["The Mom Test (Book)", "Y Combinator Startup School"],
        skills: ["Market Research", "Customer Discovery", "Problem Solving"]
      },
      {
        month: "Months 3-5",
        title: "MVP Development",
        tasks: [
          { text: "Build a Minimum Viable Product (no-code tools or code)", completed: false },
          { text: "Onboard your first 10 beta users", completed: false },
          { text: "Iterate product based on weekly user feedback", completed: false }
        ],
        resources: ["Bubble / Webflow", "Lean Startup Methodology"],
        skills: ["Product Management", "Prototyping", "User Feedback"]
      },
      {
        month: "Months 6-8",
        title: "Go-to-Market & Initial Revenue",
        tasks: [
          { text: "Launch publicly (Product Hunt, Reddit, LinkedIn)", completed: false },
          { text: "Set up pricing model and Stripe integration", completed: false },
          { text: "Acquire your first 10 paying customers", completed: false }
        ],
        resources: ["Stripe Docs", "Lenny's Newsletter"],
        skills: ["Sales", "Marketing", "Pricing Strategy"]
      },
      {
        month: "Months 9-12",
        title: "Growth & Fundraising Prep",
        tasks: [
          { text: "Identify your most profitable acquisition channel", completed: false },
          { text: "Establish legal entity (e.g., Delaware C-Corp via Stripe Atlas)", completed: false },
          { text: "Create a pitch deck if seeking venture capital", completed: false }
        ],
        resources: ["Stripe Atlas", "Sequoia Capital Pitch Deck Template"],
        skills: ["Legal Basics", "Fundraising", "Growth Metrics (CAC/LTV)"]
      }
    ],
    salaryProgression: [
      { year: 1, salary: 0 },
      { year: 3, salary: 70000 },
      { year: 5, salary: 150000 },
      { year: 10, salary: 300000 }
    ]
  },
  {
    career: "UX Designer",
    description: "10-month roadmap to become a UI/UX Designer.",
    educationLevel: "Bootcamp / Self-taught / Degree",
    hoursPerWeek: 20,
    startingPoint: "Beginner",
    milestones: [
      {
        month: "Months 1-2",
        title: "Design Fundamentals & Figma",
        tasks: [
          { text: "Learn design principles (typography, color, layout, hierarchy)", completed: false },
          { text: "Master Figma (auto layout, components, variants)", completed: false },
          { text: "Recreate popular app interfaces to practice", completed: false }
        ],
        resources: ["Figma Official Tutorials", "Refactoring UI (Book)"],
        skills: ["Figma", "Visual Design", "UI Principles"]
      },
      {
        month: "Months 3-4",
        title: "User Experience (UX) Theory",
        tasks: [
          { text: "Understand the UX design process (Design Thinking)", completed: false },
          { text: "Learn how to conduct user research and create personas", completed: false },
          { text: "Practice wireframing and user flows", completed: false }
        ],
        resources: ["Nielsen Norman Group", "Coursera Google UX Certificate"],
        skills: ["User Research", "Wireframing", "Information Architecture"]
      },
      {
        month: "Months 5-7",
        title: "Prototyping & Testing",
        tasks: [
          { text: "Build interactive prototypes in Figma", completed: false },
          { text: "Conduct usability testing on your prototypes", completed: false },
          { text: "Learn about accessibility guidelines (WCAG)", completed: false }
        ],
        resources: ["Laws of UX", "A11y Project"],
        skills: ["Prototyping", "Usability Testing", "Accessibility"]
      },
      {
        month: "Months 8-10",
        title: "Portfolio & Job Hunt",
        tasks: [
          { text: "Complete 3 comprehensive case studies for your portfolio", completed: false },
          { text: "Build a personal portfolio website (Webflow/Framer)", completed: false },
          { text: "Practice whiteboard challenges for interviews", completed: false }
        ],
        resources: ["Bestfolios", "Designboard.io"],
        skills: ["Case Studies", "Interviewing", "Webflow"]
      }
    ],
    salaryProgression: [
      { year: 1, salary: 65000 },
      { year: 3, salary: 85000 },
      { year: 5, salary: 110000 },
      { year: 10, salary: 140000 }
    ]
  },
  {
    career: "Cybersecurity Analyst",
    description: "14-month roadmap to enter InfoSec.",
    educationLevel: "Self-taught / Certifications / Degree",
    hoursPerWeek: 20,
    startingPoint: "IT Beginner",
    milestones: [
      {
        month: "Months 1-3",
        title: "IT & Networking Fundamentals",
        tasks: [
          { text: "Understand computer hardware and OS basics", completed: false },
          { text: "Master networking concepts (TCP/IP, OSI model, DNS, DHCP)", completed: false },
          { text: "Study for and pass CompTIA Network+ (optional but recommended)", completed: false }
        ],
        resources: ["Professor Messer Network+", "Cisco Networking Academy"],
        skills: ["Networking", "TCP/IP", "System Admin"]
      },
      {
        month: "Months 4-6",
        title: "Security Foundations",
        tasks: [
          { text: "Learn core security concepts (CIA triad, cryptography, access control)", completed: false },
          { text: "Understand common threats and vulnerabilities", completed: false },
          { text: "Study for and pass CompTIA Security+ certification", completed: false }
        ],
        resources: ["Professor Messer Security+", "Cybrary"],
        skills: ["Security+", "Cryptography", "Risk Management"]
      },
      {
        month: "Months 7-10",
        title: "Practical Skills & Linux",
        tasks: [
          { text: "Master Linux command line", completed: false },
          { text: "Learn basic Python or Bash scripting", completed: false },
          { text: "Practice on TryHackMe (Complete beginner paths)", completed: false }
        ],
        resources: ["TryHackMe", "OverTheWire Bandit"],
        skills: ["Linux", "Scripting", "Vulnerability Scanning"]
      },
      {
        month: "Months 11-14",
        title: "Specialization & Job Hunt",
        tasks: [
          { text: "Choose a path: Blue Team (Defense) or Red Team (Offense)", completed: false },
          { text: "Blue: Learn SIEM tools (Splunk) and incident response", completed: false },
          { text: "Red: Practice on HackTheBox and study for eJPT/OSCP", completed: false },
          { text: "Build a home lab and document your projects", completed: false }
        ],
        resources: ["HackTheBox", "Splunk Free Training"],
        skills: ["SIEM", "Incident Response", "Penetration Testing"]
      }
    ],
    salaryProgression: [
      { year: 1, salary: 70000 },
      { year: 3, salary: 95000 },
      { year: 5, salary: 125000 },
      { year: 10, salary: 160000 }
    ]
  },
  {
    career: "Financial Analyst",
    description: "18-month roadmap to break into Finance.",
    educationLevel: "Finance/Economics Degree preferred",
    hoursPerWeek: 15,
    startingPoint: "Undergrad / Recent Grad",
    milestones: [
      {
        month: "Months 1-3",
        title: "Accounting & Excel Mastery",
        tasks: [
          { text: "Master the 3 financial statements (Income, Balance, Cash Flow)", completed: false },
          { text: "Learn advanced Excel (VLOOKUP, INDEX/MATCH, Pivot Tables)", completed: false },
          { text: "Learn Excel shortcuts to work without a mouse", completed: false }
        ],
        resources: ["Wall Street Prep Free Resources", "Corporate Finance Institute (CFI)"],
        skills: ["Excel", "Financial Accounting", "Data Analysis"]
      },
      {
        month: "Months 4-7",
        title: "Financial Modeling & Valuation",
        tasks: [
          { text: "Build a 3-statement model from scratch", completed: false },
          { text: "Learn valuation methods (DCF, Comps, Precedent Transactions)", completed: false },
          { text: "Complete a full valuation model on a public company", completed: false }
        ],
        resources: ["Aswath Damodaran (NYU) YouTube classes", "Macabacus"],
        skills: ["Financial Modeling", "DCF Valuation", "Forecasting"]
      },
      {
        month: "Months 8-14",
        title: "Certifications & Markets",
        tasks: [
          { text: "Register and study for CFA Level I (optional but highly recommended)", completed: false },
          { text: "Follow financial news daily (WSJ, Bloomberg, Financial Times)", completed: false },
          { text: "Understand macroeconomics and market drivers", completed: false }
        ],
        resources: ["CFA Institute", "Investopedia"],
        skills: ["CFA Concepts", "Macroeconomics", "Market Analysis"]
      },
      {
        month: "Months 15-18",
        title: "Networking & Interviewing",
        tasks: [
          { text: "Conduct cold outreach and informational interviews on LinkedIn", completed: false },
          { text: "Prepare for technical finance interview questions", completed: false },
          { text: "Create stock pitch presentations to show employers", completed: false }
        ],
        resources: ["Mergers & Inquisitions", "Vault Guides"],
        skills: ["Networking", "Technical Interviews", "Presentation"]
      }
    ],
    salaryProgression: [
      { year: 1, salary: 65000 },
      { year: 3, salary: 90000 },
      { year: 5, salary: 130000 },
      { year: 10, salary: 200000 }
    ]
  }
];
