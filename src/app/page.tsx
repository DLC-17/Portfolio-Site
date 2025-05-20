import Image from "next/image";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import {
  SiJavascript,
  SiTypescript,
  SiPython,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiNodedotjs,
  SiPostgresql,SiThreedotjs, SiTableau, 
} from "react-icons/si";
import { IconType } from "react-icons";

const education = [
  {
    src: "/Logos/SMCpl.png",
    name: "Saint Mary's College of California",
    degree: "B.S Computer Science",
    link: "https://www.stmarys-ca.edu/",
  },
  {
    src: "/Logos/SMCpl.png",
    name: "Saint Mary's College of California",
    degree: "B.S Data Science",
    link: "https://www.stmarys-ca.edu/",
  },
  {
    src: "/Logos/Coursera.svg",
    name: "Coursera",
    degree: "Introduction to Large Language Models",
    link: "https://coursera.org/share/36cc32471b500f9e129e864381d774f8",
  },
  {
    src: "/Logos/fcc_primary_small.png",
    name: "FreeCode Camp",
    degree: "Responsive Web Design",
    link: "https://freecodecamp.org/certification/DLC/responsive-web-design",
  },
];

const technologies: { name: string; icon: IconType }[] = [
  { name: "JavaScript", icon: SiJavascript },
  { name: "TypeScript", icon: SiTypescript },
  { name: "Python", icon: SiPython },
  { name: "React", icon: SiReact },
  { name: "Next.js", icon: SiNextdotjs },
  { name: "Tailwind CSS", icon: SiTailwindcss },
  { name: "Node.js", icon: SiNodedotjs },
  { name: "PostgreSQL", icon: SiPostgresql },
  { name: "Three.js", icon: SiThreedotjs }, 
  { name: "Tableau", icon: SiTableau },
];
const experience = [
  {
    title: "A/V Student Worker",
    company: "Saint Mary's College",
    date: "May 2024 – Present",
    description: [
      "Assist users with technology troubleshooting, software setup, and system operation, improving their ability to navigate AV tools effectively.",
      "Train and guide event organizers on best practices for multimedia technology, ensuring smooth execution of over 30+ campus events.",
      "Collaborate with a team of 9 to maintain and upgrade AV equipment.",
    ],
  },
  {
    title: "IT Services Intern",
    company: "Saint Mary's College",
    date: "September 2022 – Present",
    description: [
      "Diagnose and resolve technical issues related to network connectivity, software applications, and hardware for 200+ students and faculty, ensuring minimal downtime.",
      "Implement and maintain security protocols, including multi-factor authentication (MFA) for 200+ users, strengthening system protection against unauthorized access.",
    ]
  },
  {
    title: "Artificial Intelligence Operator",
    company: "Infinitus AI",
    date: "December 2023 – January 2024",
    description: [
      "Worked with engineering teams to enhance the NLP model for an AI chatbot, improving patient data management.",
      "Verified and updated 100+ patient records, ensuring data integrity for AI-driven healthcare applications.",
    ],
  },
];

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6 text-center space-y-16">
      {/* About Section */}
      <section id="about" className="w-full max-w-4xl mx-auto text-center h-screen flex flex-col items-center justify-center pt-4">
        
        <h1 className="text-5xl font-bold text-black dark:text-white">David Coleman</h1>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mt-2">
          Software Developer | Data Scientist | IT Professional
        </h2>
        
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Take a second and check out my portfolio showcasing my work in software development and photography.
        </p>
        
      </section>

      {/* Education Section */}
      <section id="education" className="w-full max-w-6xl">
        <h2 className="text-3xl font-bold text-black dark:text-white mb-6">Education</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {education.map((edu, index) => (
            <a
              key={index}
              href={edu.link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white dark:bg-gray-800 outline-1 outline-black dark:outline-white hover:bg-gray-300 dark:hover:bg-gray-700 p-6 rounded-lg shadow hover:shadow-lg transition"
            >
              <div className="flex flex-col items-center">
                <Image src={edu.src} alt={edu.name} width={80} height={80} className="mb-4" />
                <h3 className="text-xl font-semibold text-black dark:text-white">{edu.name}</h3>
                <p className="text-gray-600 dark:text-gray-300">{edu.degree}</p>
              </div>
            </a>
          ))}
        </div>
      </section>
      {/* Experience Section */}
      <section id="experience" className="w-full max-w-6xl">
        <h2 className="text-3xl font-bold text-black dark:text-white mb-6">Experience</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
              {experience.map((job, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 outline-1 outline-black dark:outline-white p-6 rounded-lg shadow hover:shadow-lg background hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                >
                  <h3 className="text-xl font-semibold text-black dark:text-white">{job.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{job.company}</p>
                  <p className="text-gray-500 dark:text-gray-400">{job.date}</p>
                  <ul className="list-disc list-inside mt-2">
                    {job.description.map((desc, descIndex) => (
                      <li key={descIndex} className="text-gray-600 dark:text-gray-300">
                        {desc}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            

        </div>
      </section>

      {/* Technologies Section */}
      <section id="technologies" className="w-full max-w-6xl">
        <h2 className="text-3xl font-bold text-black dark:text-white mb-6">Technologies</h2>
        <div className="flex flex-wrap justify-center gap-6">
          {technologies.map(({ name, icon: Icon }, index) => (
            <div
              key={index}
              className="flex flex-rows items-center gap-2 p-4 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 outline-1 outline-black dark:outline-white transition-all cursor-pointer"
            >
              <Icon size={32} className="text-black dark:text-white" />
              <span className="text-sm text-black dark:text-white font-medium">{name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="w-full max-w-6xl text-center pb-5">
        <h2 className="text-3xl font-bold text-black dark:text-white mb-6">Contact</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
          Feel free to reach out via the platforms below:
        </p>
        <div className="flex justify-center gap-6">
          <a href="https://github.com/DLC-17" target="_blank" rel="noopener noreferrer" className="hover:text-red-500">
            <FaGithub size={28} />
          </a>
          <a
            href="https://www.linkedin.com/in/david-coleman17/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-500"
          >
            <FaLinkedin size={28} />
          </a>
          <a href="mailto:dlc17@stmarys-ca.edu" className="hover:text-red-500">
            <FaEnvelope size={28} />
          </a>
        </div>
      </section>
    </main>
  );
}