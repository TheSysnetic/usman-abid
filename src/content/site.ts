// Everything the portfolio says lives here. Edit this file to update the site.

export type Role = {
  company: string;
  title: string;
  period: string;
  location: string;
  current?: boolean;
  highlights: string[];
  stack: string[];
};

export type Project = {
  slug: string;
  name: string;
  url: string;
  category: string;
  role: string;
  summary: string;
  description: string;
  stack: string[];
  logo: string;
  accent: string;
};

export const profile = {
  name: "Usman Abid",
  role: "Senior Software Engineer",
  location: "Lahore, Pakistan",
  timeZone: "Asia/Karachi",
  email: "usmanabid935@gmail.com",
  photo: "/images/usman.jpg",
  careerStart: "2021-10-01",
  headline: "I turn complex ideas into production‑ready, scalable systems.",
  intro:
    "Senior Software Engineer working at the intersection of software architecture, full‑stack development and modern AI integrations — helping teams ship fast, reliably and at scale.",
  about: [
    "At the heart of my work is client satisfaction through strong technical execution and high‑quality engineering. I design RESTful and GraphQL APIs, scalable database schemas and AI pipelines that take models from data ingestion to production monitoring.",
    "I’m driven by innovation and enjoy mentoring other developers — building a culture of learning and collaboration on every team I join.",
  ],
} as const;

export const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/usman-abid/" },
  { label: "Email", href: `mailto:${profile.email}` },
] as const;

export const nav = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "work", label: "Work" },
  { id: "contact", label: "Contact" },
] as const;

export const experience: Role[] = [
  {
    company: "KnowledgeCity",
    title: "Senior Full‑Stack Developer",
    period: "2025 — Now",
    location: "California, US",
    current: true,
    highlights: [
      "Architect and maintain RESTful APIs in PHP with optimised MySQL queries and scalable schemas.",
      "Drove MLOps adoption for streamlined AI model lifecycle management.",
      "Lead stakeholder communication for AI feature rollouts and system integrations.",
      "Build responsive interfaces in modern JavaScript and modernise components in React.",
      "Raise reliability through testing strategy, code review and better team workflows.",
    ],
    stack: ["PHP", "MySQL", "MLOps", "JavaScript", "React"],
  },
  {
    company: "InvoZone",
    title: "Senior Software Engineer",
    period: "2022 — Now",
    location: "Lahore, PK",
    current: true,
    highlights: [
      "Lead architecture and design for scalable, AI‑driven enterprise systems.",
      "Designed AI pipelines covering data ingestion, model training, deployment and monitoring.",
      "Technical point of contact for clients — owning delivery, updates and satisfaction.",
      "Led cybersecurity work: vulnerability assessments, penetration testing and security controls.",
      "Mentor engineers, run code reviews and raise engineering standards.",
    ],
    stack: ["Node.js", "NestJS", "TypeScript", "Next.js", "PostgreSQL", "AWS", "Redis"],
  },
  {
    company: "Tinktanc",
    title: "Development Team Lead",
    period: "2022",
    location: "United States",
    highlights: [
      "Led a team of developers through the full software development lifecycle.",
      "Defined requirements, scope and timelines with product, design and stakeholders.",
      "Owned planning and delivery against coding standards, QA and milestones.",
    ],
    stack: ["Node.js", "React", "Next.js", "PostgreSQL", "MongoDB"],
  },
  {
    company: "Tinktanc",
    title: "Software Engineer",
    period: "2021",
    location: "United States",
    highlights: [
      "Built and maintained software to clear coding standards and best practices.",
      "Turned product and design requirements into technical specifications.",
      "Tested and debugged for functionality, performance and usability.",
    ],
    stack: ["JavaScript", "Node.js", "Express", "React"],
  },
];

export const projects: Project[] = [
  {
    slug: "vindeca",
    name: "Vindeca Health",
    url: "https://www.vindecahealth.com/",
    category: "Healthcare AI",
    role: "Full‑stack engineering",
    summary: "AI‑powered medication intelligence that helps health systems lower drug spend and improve outcomes.",
    description:
      "Vindeca Health’s Intelligent Medication platform evaluates real‑world data — length of stay, readmissions, efficacy, safety and cost — to help hospitals choose the best medications for their patients while cutting spend. It turns a months‑long manual medication‑use evaluation into actionable insights in hours. I work on the platform continuously, across the client‑facing analytics app and the tooling clinical teams use to author, review and publish insights.",
    stack: ["Next.js", "TypeScript", "React", "GraphQL", "PostgreSQL", "AWS"],
    logo: "/assets/projects/logo-vindeca.png",
    accent: "#3b82f6",
  },
  {
    slug: "stigmi",
    name: "Stigmi Learning",
    url: "https://stigmilearning.com/",
    category: "EdTech",
    role: "Led development",
    summary: "Interactive learning platform connecting tutors and students.",
    description:
      "I led the development of Stigmi Learning, an interactive platform that connects tutors and students. AdonisJS and MongoDB power the backend with a React/Next.js frontend, making personalised learning more accessible and efficient for students and educators alike.",
    stack: ["AdonisJS", "MongoDB", "Next.js", "Node.js", "ChatGPT"],
    logo: "/assets/projects/logo-stigmi.png",
    accent: "#e11d74",
  },
  {
    slug: "youoptimised",
    name: "You Optimised",
    url: "https://www.youoptimised.com/",
    category: "HealthTech",
    role: "Full‑stack engineering",
    summary: "Health management platform with doctor and patient dashboards fed by wearables.",
    description:
      "A comprehensive health management platform built with Next.js and Tailwind CSS on the front end and NestJS on the back end. Doctors and patients get dedicated dashboards, with the Terra API pulling health stats from wearable devices into the patient view.",
    stack: ["Next.js", "Tailwind CSS", "NestJS", "MongoDB", "AWS SDK"],
    logo: "/assets/projects/logo-youoptimised.png",
    accent: "#f59e0b",
  },
  {
    slug: "eddii",
    name: "Eddii Health",
    url: "https://www.eddiihealth.com/",
    category: "HealthTech",
    role: "Platform architecture",
    summary: "Health companion for mental health, nutrition and physical activity.",
    description:
      "A health platform with tailored features for monitoring mental health, nutrition and physical activity. I built its scalable architecture with React, TypeScript and Firebase.",
    stack: ["React", "TypeScript", "Firebase"],
    logo: "/assets/projects/logo-eddii.png",
    accent: "#ef5e2a",
  },
  {
    slug: "respondent",
    name: "Respondent",
    url: "https://www.respondent.io/",
    category: "Research SaaS",
    role: "Led development",
    summary: "Marketing platform on Prismic CMS and Next.js with a bespoke Tailwind UI.",
    description:
      "I led the build of a web application on Prismic CMS and Next.js, designing and implementing a custom UI in Tailwind CSS and owning the full lifecycle from concept to deployment across front and back end.",
    stack: ["Next.js", "Prismic", "Tailwind CSS"],
    logo: "/assets/projects/logo-responded.svg",
    accent: "#0066cc",
  },
  {
    slug: "usee360",
    name: "Usee‑360",
    url: "https://usee-360.com/",
    category: "PropTech",
    role: "Front end & back end",
    summary: "Real‑estate platform with immersive 360° property viewing.",
    description:
      "A real‑estate application offering immersive 360‑degree property viewing. I implemented the React front end and built back‑end services with Node.js and PostgreSQL.",
    stack: ["React", "Node.js", "Express", "PostgreSQL"],
    logo: "/assets/projects/logo-usee.png",
    accent: "#10b981",
  },
  {
    slug: "invohub",
    name: "InvoHub",
    url: "https://hub.invozone.com/",
    category: "Enterprise ERP",
    role: "Code architecture",
    summary: "ERP platform — re‑architected and migrated to TypeScript.",
    description:
      "I elevated the code architecture and overall quality of InvoHub, an advanced ERP platform, and led its migration to TypeScript for better efficiency, scalability and maintainability.",
    stack: ["NestJS", "React", "Next.js", "PostgreSQL", "TypeScript"],
    logo: "/assets/projects/logo-invohub.png",
    accent: "#2075ff",
  },
  {
    slug: "revbits",
    name: "RevBits ZTN",
    url: "https://www.revbits.com/",
    category: "Cybersecurity",
    role: "Core engineering",
    summary: "Zero Trust Network access for remote teams, BYOD and third parties.",
    description:
      "A secure remote‑access solution built with Node.js, Angular and PostgreSQL. It tackles remote‑workforce, BYOD and third‑party access with encryption, authentication and granular access controls to internal assets.",
    stack: ["Node.js", "Angular", "PostgreSQL", "Socket.io"],
    logo: "/assets/projects/logo-revbits.svg",
    accent: "#e11d48",
  },
  {
    slug: "rydelinx",
    name: "Rydelinx",
    url: "https://www.rydelinx.com/",
    category: "Mobility",
    role: "Back end & architecture",
    summary: "Ride‑hailing back end with real‑time comms, payments and clustering.",
    description:
      "I designed and built the back end for Rydelinx, a ride‑hailing app, on Node.js and MongoDB — integrating Stripe payments, Socket.IO real‑time messaging and Google location APIs, with Node clustering to stay fast under load.",
    stack: ["Node.js", "MongoDB", "Redis", "Socket.io", "Stripe"],
    logo: "/assets/projects/logo-rydelinx.png",
    accent: "#f97316",
  },
];

export const capabilities = [
  {
    title: "Architecture & AI",
    items: [
      "Software architecture",
      "AI pipelines",
      "MLOps",
      "AI integrations",
      "Security reviews",
      "Technical leadership",
    ],
  },
  {
    title: "Back end",
    items: ["Node.js", "NestJS", "AdonisJS", "PHP · Laravel", "Python · Django", "GraphQL", "REST"],
  },
  {
    title: "Front end",
    items: ["React", "Next.js", "TypeScript", "Vue · Nuxt", "Angular", "Tailwind CSS"],
  },
  {
    title: "Data & cloud",
    items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "DynamoDB", "AWS", "Docker · Kubernetes"],
  },
];

// Logos shown in the capabilities marquee (monochrome until hovered).
export const logos = [
  ["Node.js", "/assets/back-end/node.png"],
  ["TypeScript", "/assets/back-end/typescript.png"],
  ["NestJS", "/assets/back-end/nestjs.png"],
  ["React", "/assets/front-end/react.png"],
  ["Next.js", "/assets/front-end/nextjs.png"],
  ["Vue.js", "/assets/front-end/vue.png"],
  ["Angular", "/assets/front-end/angular.png"],
  ["GraphQL", "/assets/back-end/GraphQL.png"],
  ["PHP", "/assets/back-end/php.png"],
  ["Laravel", "/assets/back-end/laravel.png"],
  ["Python", "/assets/back-end/python.png"],
  ["PostgreSQL", "/assets/database/postgre.png"],
  ["MySQL", "/assets/database/mysql.png"],
  ["MongoDB", "/assets/database/mongodb.png"],
  ["Redis", "/assets/database/redis.png"],
  ["AWS", "/assets/back-end/AWS.png"],
  ["Docker", "/assets/back-end/Docker.png"],
  ["Kubernetes", "/assets/back-end/Kubernetes.png"],
  ["Tailwind CSS", "/assets/front-end/tailwind.png"],
  ["Firebase", "/assets/database/firebase.png"],
] as const;

export const education = [
  { school: "University of Central Punjab", detail: "BS Computer Science", period: "2017 — 2022" },
  { school: "Government College of Science, Lahore", detail: "FSc Pre‑Engineering", period: "2015 — 2017" },
];

export const certifications = [
  "DevOps — Beginners to Advanced",
  "Supervised Machine Learning: Regression & Classification",
];
