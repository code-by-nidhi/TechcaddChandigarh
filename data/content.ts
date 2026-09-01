import { site } from "./site";

/* ------------------------------ How it works ------------------------------ */

export interface ProcessStep {
  step: string;
  title: string;
  body: string;
}

export const processSteps: ProcessStep[] = [
  {
    step: "01",
    title: "Career counselling",
    body: "A free session where we look at your background, your degree timeline and the roles you are actually targeting — then recommend a track and a duration. No pressure to enrol on the day.",
  },
  {
    step: "02",
    title: "Classroom & lab",
    body: "Small batches with a trainer in the room. Concepts in the first half, supervised lab work in the second. You write code every single day rather than watching someone else write it.",
  },
  {
    step: "03",
    title: "Live project & internship",
    body: "You join a real client project with sprint planning, code review and deployment. This is what fills the experience section of your CV and gives you something to talk about in interviews.",
  },
  {
    step: "04",
    title: "Placement drives",
    body: "CV and portfolio review, mock interviews, then drives with our hiring partners. Placement support continues after your course finishes until you are placed.",
  },
];

/* ------------------------------ Training formats ------------------------------ */

export interface FormatCard {
  duration: string;
  title: string;
  body: string;
  href: string;
}

export const formatCards: FormatCard[] = [
  {
    duration: "45 Days",
    title: "Summer & winter training",
    body: "One technology, one finished project, inside a semester break.",
    href: `/45-days-training-in-${site.citySlug}`,
  },
  {
    duration: "6 Weeks",
    title: "University-mandated",
    body: "Meets the standard six-week requirement, with report and certificate.",
    href: `/6-weeks-training-in-${site.citySlug}`,
  },
  {
    duration: "6 Months",
    title: "With internship",
    body: "Full syllabus, live client project and an internship experience letter.",
    href: `/6-months-training-in-${site.citySlug}`,
  },
  {
    duration: "9 Months",
    title: "Expert track",
    body: "Two client projects, electives and a year of placement support.",
    href: `/9-months-training-in-${site.citySlug}`,
  },
];

/* ------------------------------ Differentiators ------------------------------ */

export interface Difference {
  title: string;
  body: string;
  stat?: string;
}

export const differences: Difference[] = [
  {
    title: "Curriculum built from job descriptions",
    body: "We read the roles our students apply for and rewrite modules when the market moves. When agents and RAG became hiring requirements, they became modules — not a webinar.",
    stat: "Reviewed every quarter",
  },
  {
    title: "Trainers who still write production code",
    body: "Every technical trainer works on client projects alongside teaching. That is why the answer to 'how is this done in a real company' is a demonstration rather than a guess.",
    stat: "100% certified trainers",
  },
  {
    title: "Hiring partners, not a job board",
    body: "We run drives on campus with companies that have hired our students before. Recruiters come back because our students arrive knowing Git, deployment and how to explain their own code.",
    stat: `${site.stats.partners} hiring partners`,
  },
  {
    title: "Batches that fit around your life",
    body: "Morning, evening and weekend batches, campus or online, with the option to switch mid-course. EMI options available on longer programs.",
    stat: "EMI available",
  },
];

/* --------------------------------- Included --------------------------------- */

export interface IncludedItem {
  title: string;
  body: string;
}

export const includedItems: IncludedItem[] = [
  {
    title: "Industry certificate",
    body: "Verifiable online, issued on completion of your assessment and project.",
  },
  {
    title: "Internship letter",
    body: "Issued for real client work you contributed to — not for attendance.",
  },
  {
    title: "Live client projects",
    body: "Actual briefs with deadlines, reviews and a deployment at the end.",
  },
  {
    title: "Doubt-clearing sessions",
    body: "Scheduled weekly, plus open lab hours whenever a trainer is on the floor.",
  },
  {
    title: "Interview preparation",
    body: "CV review, portfolio polish, mock interviews and aptitude practice.",
  },
];

/* ------------------------------- Testimonials ------------------------------- */

export interface Testimonial {
  name: string;
  role: string;
  course: string;
  quote: string;
  initials: string;
}

export const testimonials: Testimonial[] = [
  {
    name: "Harleen Kaur",
    role: "Frontend Developer, Mohali",
    course: "Full-Stack Development",
    initials: "HK",
    quote:
      "The live projects were the difference. In interviews I could open the repository, walk through the commits and explain why I made each decision. That is what got me the offer.",
  },
  {
    name: "Rohit Sharma",
    role: "Data Analyst, Chandigarh",
    course: "Data Analytics",
    initials: "RS",
    quote:
      "I came from a commerce background and assumed SQL would be beyond me. The trainers sat with me through every doubt session until it clicked. Six months later I am writing production queries.",
  },
  {
    name: "Simranjit Singh",
    role: "Python Developer, Panchkula",
    course: "45 Days Training",
    initials: "SS",
    quote:
      "I joined for a 45-day summer training and ended up with a job offer from the company whose project I worked on. The training report was almost incidental by the end.",
  },
  {
    name: "Ananya Verma",
    role: "AI Engineer, Zirakpur",
    course: "Artificial Intelligence",
    initials: "AV",
    quote:
      "The generative AI modules were genuinely current. We built a RAG system with evaluations, not a chatbot demo. My interviewer said it was the first candidate project he had seen with tracing set up.",
  },
  {
    name: "Gurpreet Dhillon",
    role: "Hiring Manager, IT Services",
    course: "Recruiting partner",
    initials: "GD",
    quote:
      "We hire from techcadd because their students arrive understanding version control and deployment. We spend our onboarding time on our domain instead of teaching them Git.",
  },
  {
    name: "Neha Bansal",
    role: "Security Analyst, Mohali",
    course: "Cyber Security",
    initials: "NB",
    quote:
      "The lab range was the whole reason I chose this course. Reading about privilege escalation and actually doing it in an isolated environment are completely different things.",
  },
];

/* ---------------------------------- FAQs ---------------------------------- */

export interface Faq {
  question: string;
  answer: string;
}

export const faqs: Faq[] = [
  {
    question: "Do I need a coding background to join?",
    answer:
      "For the core tracks, no. Digital marketing, data analytics, basic computer and design courses all start from zero. For the advanced AI and agentic tracks we do expect Python fundamentals — and if you do not have them, we start you on the Python module first.",
  },
  {
    question: "How long are the courses, and which duration should I pick?",
    answer:
      "Most tracks run as three-month certificates, six-month advanced certificates or nine-month diplomas. Three months suits working professionals adding a skill. Six months is the most popular because it includes the internship. Nine months is for students who want maximum depth before their first job.",
  },
  {
    question: "What does it cost?",
    answer:
      "It depends on the track and duration. As examples, Data Analytics runs at ₹45,000 with a current offer of ₹35,000, and the six-month AI program is ₹70,000 with an offer of ₹55,000. EMI options are available on longer programs and there is no registration fee.",
  },
  {
    question: "Is the project work real, or a practice exercise?",
    answer:
      "Real. Students work on live client briefs with deadlines, sprint reviews and a deployment. That is what the internship letter is issued against — actual contribution, not attendance.",
  },
  {
    question: "Do you help with placement?",
    answer:
      `Yes. Placement support includes CV and portfolio review, mock interviews, aptitude practice and drives with our ${site.stats.partners} hiring partners. Support continues after your course finishes until you are placed.`,
  },
  {
    question: "Can I attend online instead of coming to the centre?",
    answer:
      "Yes, and you can switch between campus and online mid-course. Online students get the same recordings, doubt sessions and project supervision. Lab-heavy tracks like cyber security work best on campus, and we will tell you that during counselling.",
  },
  {
    question: "Will my university accept the training certificate?",
    answer:
      "Yes. Our 45-day, six-week, four-month and six-month formats are built against standard university industrial training requirements, including attendance records, the project file and the presentation.",
  },
  {
    question: "What are the batch timings?",
    answer:
      `We run morning, afternoon, evening and weekend batches. The centre is open ${site.contact.hours}. Working professionals usually take the 7 AM or 7 PM slots.`,
  },
];

/* ------------------------------- Technologies ------------------------------- */

export interface TechGroup {
  name: string;
  items: string[];
}

export const techGroups: TechGroup[] = [
  {
    name: "Programming",
    items: ["Python", "JavaScript", "TypeScript", "Java", "C", "C++", "Kotlin", "PHP", "SQL", "Dart"],
  },
  {
    name: "Frameworks",
    items: ["React", "Next.js", "Node.js", "Express", "Angular", "Django", "Laravel", "Spring Boot", "Flutter", "Tailwind CSS"],
  },
  {
    name: "AI & ML",
    items: ["TensorFlow", "PyTorch", "Keras", "scikit-learn", "Hugging Face", "LangChain", "LangGraph", "OpenAI", "Anthropic", "OpenCV", "Pandas", "NumPy", "Jupyter", "Streamlit"],
  },
  {
    name: "Databases",
    items: ["MySQL", "PostgreSQL", "MongoDB", "Redis", "SQLite", "Pinecone", "pgvector"],
  },
  {
    name: "DevOps",
    items: ["Git", "GitHub Actions", "Docker", "Kubernetes", "Jenkins", "Terraform", "Ansible", "Prometheus", "Grafana", "Nginx"],
  },
  {
    name: "Cloud",
    items: ["AWS", "Azure", "Google Cloud", "Vercel", "Firebase", "Cloudflare"],
  },
  {
    name: "Security",
    items: ["Kali Linux", "Burp Suite", "Wireshark", "Metasploit", "Nmap", "Splunk"],
  },
  {
    name: "CAD & Design",
    items: ["AutoCAD", "SolidWorks", "Revit", "3ds Max", "Figma", "Photoshop", "Illustrator", "CorelDRAW"],
  },
  {
    name: "Marketing & Analytics",
    items: ["Google Ads", "Meta Ads", "GA4", "Search Console", "Semrush", "Power BI", "Tableau", "HubSpot"],
  },
];

/* ------------------------------- Hero metrics ------------------------------- */

export const heroStats = [
  { value: `${new Date().getFullYear() - site.founded}+ yrs`, label: "Training since 2007" },
  { value: site.stats.alumni, label: "Alumni network" },
  { value: site.stats.partners, label: "Hiring partners" },
];

export const trustPoints = [
  `${site.stats.rating}★ on Google (${site.stats.reviews} reviews)`,
  "Free career counselling",
  "No registration fee",
  "EMI options available",
];
