"use client";
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
  SiPostgresql,
  SiThreedotjs,
  SiTableau,
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
    title: "Research Assistant- UI/UX & Front-End Development",
    company: "Saint Mary's College of California, School of Science",
    date: "Feb 2024 – Aug 2024",
    description: [
      "Contributed to Dub Dragon, a browser-based music composition tool using finite state machines to generate dynamic MIDI outputs.",
      "Led development of the site prototype, focusing on runtime efficiency and intuitive user interaction",
      "Designed and built a clear, accessible front-end interface for diagram-based user input and real-time MIDI generation",
      "Optimized application performance through attention to visual clarity, responsiveness, and lightweight front-end architecture"
    ],
  },
  {
    title: "IT Services Intern",
    company: "Saint Mary's College of California",
    date: "September 2022 – May 2025",
    description: [
      "Scoped and deployed security authentication workflows affecting 2000+ users",
      "Translated technical solutions into clear, actionable steps for end users",
      "Liaised with faculty and IT leadership to deploy new hardware and resolve recurring issues",
      "Trained new interns and optimized ticket tracking via TDNext",
    ],
  },
  {
    title: "Machine Learning Research Intern",
    company: "Saint Mary's College of California, School of Science",
    date: "May 2023 – Dec 2023",
    description: [
      "Conducted applied research in a team on LLMs’ ability to interpret technical regulatory language using FCC datasets",
      "Compared open- vs closed-source models for comprehension benchmarks; summarized findings for non-technical audiences",
      "Contributed to academic report used by faculty and external collaborators presented in the HCI international 2024"
    ],
  },
];

export default function Home() {
  return (
    <main className="flex flex-col w-full justify-center items-center  px-6 text-center space-y-16">
      {/* About Section */}
      <div className="pt-35 flex flex-col  md:flex-row md:space-x-8 px-4 py-10 max-w-6xl mx-auto">
        {/* About Section */}
        <section
          id="about"
          className="w-full md:w-1/2 text-center md:text-left mb-10 md:mb-0"
        >
          <h1 className="text-5xl text-center font-bold text-black dark:text-white">
            David Coleman
          </h1>
          <h2 className="text-2xl text-center font-semibold text-gray-700 dark:text-gray-300 mt-2">
            Software Developer
          </h2>

          <p className="mt-4 text-lg text-center text-gray-600 dark:text-gray-300">
            Take a second and check out my portfolio showcasing my work in
            software development and photography.
          </p>
           {/* Contact Section */}
      <section id="contact" className="w-full max-w-6xl text-center pb-5">
        <h2 className="text-3xl font-bold text-black dark:text-white mb-6">
          
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
          Feel free to reach out via the platforms below:
        </p>
        <div className="flex justify-center gap-6">
          <a
            href="https://github.com/DLC-17"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform duration-300 hover:scale-110 hover:rotate-6 dark:text-white hover:text-gray-300 dark:hover:text-gray-600"
          >
            <FaGithub size={28} />
          </a>
          <a
            href="https://www.linkedin.com/in/david-coleman17/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform duration-300 hover:scale-110 hover:rotate-6  hover:text-gray-300 dark:hover:text-gray-600"
          >
            <FaLinkedin size={28} />
          </a>
          <a
            href="mailto:dlc17@stmarys-ca.edu"
            className="transition-transform duration-300 hover:scale-110 hover:rotate-6 hover:text-gray-300 dark:hover:text-gray-600"
          >
            <FaEnvelope size={28} />
          </a>
        </div>
      </section>
        </section>

        {/* Technologies Section */}
        <section id="technologies" className="w-full text-right  md:w-1/2">
          <h2 className="text-3xl text-center  font-bold text-black dark:text-white mb-6 ">
            Technologies
          </h2>
          <div className="flex flex-wrap items-center justify-center md:justify-center gap-6 ">
            {technologies.map(({ name, icon: Icon }, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-4 rounded-lg hover:-translate-y-2 bg-gray-100 dark:bg-accent hover:bg-gray-300 dark:hover:bg-gray-700 outline-1 outline-black dark:outline-white transition-all cursor-pointer"
              >
                <Icon size={32} className="text-black dark:text-white " />
                <span className="text-sm text-black dark:text-white font-medium">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
      {/* Experience Section */}
      <section id="experience" className="w-full max-w-6xl">
        <h2 className="text-3xl font-bold text-black dark:text-white mb-6">
          Experience
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6  ">
          {experience.map((job, index) => (
            <div
              key={index}
              className="bg-white dark:bg-accent outline-1 outline-black dark:outline-white p-6 rounded-lg shadow-md hover:shadow-lg hover:bg-gray-300 dark:hover:bg-gray-600 transform transition-transform duration-300 hover:-translate-y-2"
            >
              <h3 className="text-xl font-semibold text-black dark:text-white">
                {job.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">{job.company}</p>
              <p className="text-gray-500 dark:text-gray-400">{job.date}</p>
              <ul className="list-disc list-inside mt-2">
                {job.description.map((desc, descIndex) => (
                  <li
                    key={descIndex}
                    className="text-gray-600 dark:text-gray-300"
                  >
                    {desc}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      {/* Education Section */}
      <section id="education" className="w-full pb-10 max-w-6xl px-4">
        <h2 className="text-3xl font-bold text-black dark:text-white mb-6 text-center">
          Education
        </h2>

        {/* Timeline container */}
        <div className="relative flex items-start justify-between pt-8">
          {/* Top timeline bar */}
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gray-300 dark:bg-gray-600 z-0" />

          {education.map((edu, index) => (
            <div
              key={index}
              className="relative flex flex-col transform hover:-translate-y-2 items-center text-center text-black flex-1 px-2"
            >
              {/* Dot under the top line */}
              <div className="w-4 h-4 bg-accent-foreground rounded-full absolute top-0 z-10 translate-y-[-50%]" />

              {/* Content below the dot */}
              <div className="mt-6">
                <Image
                  src={edu.src}
                  alt={edu.name}
                  width={60}
                  height={60}
                  className="mx-auto mb-2"
                />
                <h3 className="text-md font-semibold text-black dark:text-white">
                  {edu.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {edu.degree}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      
    </main>
  );
}
