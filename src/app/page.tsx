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
];

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6 text-center space-y-16">
      {/* About Section */}
      <section id="about" className="w-full max-w-4xl mx-auto text-center flex flex-col items-center justify-center">
        <Image
          src="/Profile-photo.jpg"
          alt="Profile Picture"
          width={180}
          height={180}
          className="rounded-full mb-6"
        />
        <h1 className="text-5xl font-bold text-black dark:text-white">David Coleman</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Showcasing my work in software development and photography.
        </p>
        <p className="text-lg max-w-xl mt-4 text-gray-700 dark:text-gray-300">
          Hi, I&apos;m David, a soon-to-be Saint Mary&apos;s College of California alumnus with a passion for
          software development and creating innovative solutions.
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
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition"
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

      {/* Technologies Section */}
      <section id="technologies" className="w-full max-w-6xl">
        <h2 className="text-3xl font-bold text-black dark:text-white mb-6">Technologies</h2>
        <div className="flex flex-wrap justify-center gap-6">
          {technologies.map(({ name, icon: Icon }, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all cursor-pointer"
            >
              <Icon size={32} className="text-black dark:text-white" />
              <span className="text-sm text-black dark:text-white font-medium">{name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="w-full max-w-6xl text-center">
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