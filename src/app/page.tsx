"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import {
  SiJavascript,
  SiTypescript,
  SiPython,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiFastapi,
  SiPostgresql,
  SiPuppeteer,
  SiSwagger,
  SiGit,
  SiHuggingface,
  SiRobotframework,
} from "react-icons/si";
import type { IconType } from "react-icons";
import { Code2, Layout, Server, Cpu } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { fetchFeaturedProjects, urlFor } from "@/sanity/sanity-utils";
import type { Image as SanityImage } from "sanity";

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
    invertInLight: true,
  },
  {
    src: "/Logos/Anthropic.svg",
    name: "Anthropic",
    degree: "Introduction to Model Context Protocol",
    link: "https://anthropic.skilljar.com/introduction-to-model-context-protocol",
    invertInDark: true,
  },
];

const skillIcons: Record<string, IconType> = {
  Python: SiPython,
  TypeScript: SiTypescript,
  JavaScript: SiJavascript,
  SQL: SiPostgresql,
  React: SiReact,
  "Next.js": SiNextdotjs,
  "Tailwind CSS": SiTailwindcss,
  FastAPI: SiFastapi,
  Playwright: SiPuppeteer,
  "REST APIs": SiSwagger,
  Git: SiGit,
  NLP: SiHuggingface,
  "Agentic systems": SiRobotframework,
};

const expertiseCategories: { group: string; items: string[]; icon: LucideIcon }[] = [
  { group: "Languages", items: ["Python", "TypeScript", "JavaScript", "C#", "SQL"], icon: Code2 },
  { group: "Frontend & UI", items: ["Next.js", "Tailwind CSS", "React"], icon: Layout },
  { group: "Backend & Infrastructure", items: ["FastAPI", "Playwright", "REST APIs", "Git"], icon: Server },
  { group: "AI/ML", items: ["NLP", "LLM orchestration", "MCP", "Agentic systems"], icon: Cpu },
];

const experience: { title: string; company: string; date: string; location?: string; description: string[] }[] = [
  {
    title: "Forward Deployed Engineer",
    company: "Spoqen",
    date: "Sep 2025 – Present",
    location: "Remote",
    description: [
      "Developed FastAPI endpoints to integrate voice agents with Playwright, utilizing WebSockets and asynchronous Python (Asyncio) to handle live web task execution",
      "Optimized Playwright-based automation systems achieving 99.9% uptime, processing 400+ voice interactions monthly",
      "Implemented dynamic adaptation logic resulting in a reduction of failure rate by 30%, maintaining continuity across real-time processes",
    ],
  },
  {
    title: "Technical Consultant",
    company: "Coleman Technical Consulting",
    date: "May 2025 – Present",
    location: "Bay Area, CA",
    description: [
      "Architected scalable technical solutions for early-stage startups, transforming high-level product visions into production-ready MVPs with a focus on accelerated time-to-market",
      "Engineered modular systems to let non-technical stakeholders configure complex product logic, reducing manual setup time and speeding feature rollout",
    ],
  },
  {
    title: "AI Systems Specialist",
    company: "Infinitus Systems, Inc",
    date: "Dec 2023 – Jan 2024",
    location: "San Francisco, CA",
    description: [
      "Managed automated insurance workflows for a proprietary Voice AI agent, ensuring 100% accuracy in patient benefit verification during high-volume spikes",
      "Executed real-time overrides for 100+ AI interactions to resolve hallucinations and edge cases, maintaining data integrity for mission-critical insurance calls in a regulated industry",
      "Validated unstructured data extraction from live calls to ensure precision in claims-adjacent processing and provider-facing data synchronization",
    ],
  },
  {
    title: "ML Research Intern",
    company: "Saint Mary's College of California",
    date: "May 2023 – Dec 2023",
    location: "Moraga, CA",
    description: [
      "Engineered a Python-based evaluation framework to test model responses against FCC datasets, providing clear insight into domain-specific context retention",
      "Conducted a structured user study to quantify model response quality, presenting findings at HCI International 2024",
    ],
  },
];

const PROJECT_TYPES = ["Contract", "Full-time", "Part-time"] as const;

type FeaturedProject = {
  _id: string;
  title: string;
  description: string;
  technologies?: string[];
  mainImage?: SanityImage;
  demoUrl?: string;
  githubUrl?: string;
};

export default function Home() {
  const [selectedExpertiseIndex, setSelectedExpertiseIndex] = useState<number | null>(0);
  const selectedCategory = selectedExpertiseIndex !== null ? expertiseCategories[selectedExpertiseIndex] : null;
  const [contactName, setContactName] = useState("");
  const [projectType, setProjectType] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [contactStatus, setContactStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [contactError, setContactError] = useState("");
  const [featuredProjects, setFeaturedProjects] = useState<FeaturedProject[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchFeaturedProjects();
        setFeaturedProjects(data);
      } catch {
        setFeaturedProjects([]);
      } finally {
        setProjectsLoading(false);
      }
    };
    load();
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactStatus("loading");
    setContactError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName,
          projectType,
          message: contactMessage,
          from:'contact@dc-dev.space',
          website: honeypot,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setContactStatus("error");
        setContactError((data as { error?: string }).error || "Something went wrong. Please try again.");
        return;
      }
      setContactStatus("success");
      setContactName("");
      setProjectType("");
      setContactMessage("");
    } catch {
      setContactStatus("error");
      setContactError("Something went wrong. Please try again.");
    }
  };

  return (
    <main className="flex flex-col w-full justify-center items-center  px-6 text-center space-y-16">
      {/* About Section */}
      <div className="pt-35 flex flex-col px-4 py-10 max-w-6xl mx-auto w-full">
        <section
          id="about"
          className="w-full text-center md:text-left mb-6"
        >
          <h1 className="text-5xl text-center font-bold text-black dark:text-white">
            David Coleman
          </h1>
          <h2 className="text-2xl text-center font-semibold text-gray-700 dark:text-gray-300 mt-2">
            Forward Deployed Engineer
          </h2>
          <p className="mt-2 text-lg text-center text-gray-600 dark:text-gray-400">
            Building production AI systems—from voice agents to MCP tooling
          </p>

          <p className="mt-4 text-lg text-center text-gray-600 dark:text-gray-300">
            Take a second and check out my portfolio showcasing my work in
            software development and photography.
          </p>
          {/* Contact Section */}
          <section id="contact" className="w-full max-w-6xl text-center pb-6">
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
                href="mailto:david@dc-dev.space"
                className="transition-transform duration-300 hover:scale-110 hover:rotate-6 hover:text-gray-300 dark:hover:text-gray-600"
              >
                <FaEnvelope size={28} />
              </a>
            </div>
          </section>
        </section>

        {/* Technical Expertise - selectable category icons with labels, skills horizontal below; click again to toggle off */}
        <section id="expertise" className="w-full">
          <h2 className="text-2xl font-bold text-black dark:text-white mb-4">
            Technical Expertise
          </h2>
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            {expertiseCategories.map((cat, index) => {
              const Icon = cat.icon;
              const isSelected = index === selectedExpertiseIndex;
              return (
                <button
                  key={cat.group}
                  type="button"
                  onClick={() => setSelectedExpertiseIndex(isSelected ? null : index)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 outline-1 outline-black dark:outline-white shadow-md hover:-translate-y-2 hover:shadow-xl hover:scale-[1.02] ${
                    isSelected
                      ? "bg-gray-300 dark:bg-gray-700"
                      : "bg-gray-100 dark:bg-accent hover:bg-gray-300 dark:hover:bg-gray-700"
                  }`}
                  aria-label={cat.group}
                  aria-pressed={isSelected}
                >
                  <Icon
                    size={22}
                    className={`shrink-0 ${isSelected ? "text-black dark:text-white" : "text-gray-600 dark:text-gray-400"}`}
                  />
                  <span className={`text-sm font-medium ${isSelected ? "text-black dark:text-white" : "text-gray-600 dark:text-gray-400"}`}>
                    {cat.group}
                  </span>
                </button>
              );
            })}
          </div>
          {selectedCategory ? (
            <div className="flex flex-wrap justify-center gap-2">
              {selectedCategory.items.map((name) => {
                const Icon = skillIcons[name];
                return (
                  <div
                    key={name}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg shadow-md bg-gray-100 dark:bg-accent outline-1 outline-black dark:outline-white transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:scale-[1.02] hover:bg-gray-300 dark:hover:bg-gray-700"
                  >
                    {Icon ? (
                      <Icon size={20} className="text-black dark:text-white shrink-0" />
                    ) : null}
                    <span className="text-sm text-black dark:text-white font-medium">
                      {name}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : null}
        </section>

        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <section id="featured-projects" className="w-full mt-12">
            <h2 className="text-2xl font-bold text-black dark:text-white mb-6">
              Featured Projects
            </h2>
            {projectsLoading ? (
              <p className="text-gray-600 dark:text-gray-400">Loading projects…</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
                {featuredProjects.map((project) => (
                  <div
                    key={project._id}
                    className="w-full max-w-md outline-1 outline-black dark:outline-white p-6 rounded-lg shadow-md bg-gray-100 dark:bg-accent transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:scale-[1.02] hover:bg-gray-300 dark:hover:bg-gray-700"
                  >
                    {project.mainImage && (
                      <img
                        src={urlFor(project.mainImage).width(800).url()}
                        alt={project.title}
                        className="rounded mb-4 object-cover h-40 w-full"
                      />
                    )}
                    <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                      {project.title}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    {project.technologies && (
                      <p className="text-gray-500 dark:text-gray-400 text-xs mb-4">
                        {project.technologies.join(", ")}
                      </p>
                    )}
                    <div className="flex gap-3">
                      {project.githubUrl && (
                        <Link
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                        >
                          GitHub
                        </Link>
                      )}
                      {project.demoUrl && (
                        <Link
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                        >
                          Live Demo
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Link
              href="/projects"
              className="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              View all projects →
            </Link>
          </section>
        )}
      </div>

      {/* Experience Section - Vertical alternating timeline */}
      <section id="experience" className="w-full max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-black dark:text-white mb-10">
          Experience
        </h2>
        <div className="relative">
          {/* Central vertical line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-gray-300 dark:bg-gray-600 z-0" />
          {experience.map((job, index) => {
            const isLeft = index % 2 === 0;
            const dateBlock = (
              <div className="flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 text-sm whitespace-nowrap">
                <span>{job.date}</span>
                {job.location ? <span>{job.location}</span> : null}
              </div>
            );
            const card = (
              <div className="outline-1 outline-black dark:outline-white p-6 rounded-lg shadow-md bg-gray-100 dark:bg-accent transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:scale-[1.02] hover:bg-gray-300 dark:hover:bg-gray-700 text-center">
                <h3 className="text-xl font-semibold text-black dark:text-white">
                  {job.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{job.company}</p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-center mx-auto">
                  {job.description.map((desc, i) => (
                    <li key={i} className="text-gray-600 dark:text-gray-300 text-sm">
                      {desc}
                    </li>
                  ))}
                </ul>
              </div>
            );
            return (
              <div key={index} className="relative flex w-full mb-8 z-10">
                {/* Left half: card or date */}
                <div className="w-1/2 pr-4 flex justify-end items-start">
                  {isLeft ? card : dateBlock}
                </div>
                {/* Timeline dot */}
                <div className="absolute left-1/2 top-6 -translate-x-1/2 w-4 h-4 rounded-full bg-accent-foreground border-4 border-gray-100 dark:border-gray-900 shrink-0 z-20" />
                {/* Right half: date or card */}
                <div className="w-1/2 pl-4 flex justify-start items-start">
                  {isLeft ? dateBlock : card}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="w-fit pb-10 max-w-6xl px-4">
        <h2 className="text-3xl font-bold text-black dark:text-white mb-6 text-center">
          Education
        </h2>

        <div className="relative flex items-start justify-between pt-8">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gray-300 dark:bg-gray-600 z-0" />

          {education.map((edu, index) => (
            <div
              key={index}
              className="relative flex flex-col transform hover:-translate-y-2 items-center text-center text-black flex-1 px-2"
            >
              <div className="w-4 h-4 bg-accent-foreground rounded-full absolute top-0 z-10 translate-y-[-50%]" />

              <div className="mt-6">
                <Image
                  src={edu.src}
                  alt={edu.name}
                  width={60}
                  height={60}
                  className={`mx-auto mb-2 ${
                  (edu as { invertInDark?: boolean; invertInLight?: boolean }).invertInLight
                    ? "invert dark:invert-0"
                    : (edu as { invertInDark?: boolean; invertInLight?: boolean }).invertInDark
                      ? "dark:invert"
                      : ""
                }`}
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

      {/* Contact Form */}
      <section id="contact-form" className="w-full max-w-xl mx-auto px-4 pb-16">
        <h2 className="text-3xl font-bold text-black dark:text-white mb-6 text-center">
          Get in Touch
        </h2>
        <form
          onSubmit={handleContactSubmit}
          className="flex flex-col gap-4 outline-1 outline-black dark:outline-white p-6 rounded-lg bg-gray-100 dark:bg-accent"
        >
          {/* Honeypot - hidden from users, bots will fill it */}
          <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
            <label htmlFor="contact-website">Website</label>
            <input
              id="contact-website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="contact-name" className="block text-sm font-medium text-black dark:text-white mb-1">
              Name
            </label>
            <Input
              id="contact-name"
              type="text"
              placeholder="Your name"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              required
              className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
            />
          </div>
          <div>
            <label htmlFor="contact-project-type" className="block text-sm font-medium text-black dark:text-white mb-1">
              Project type
            </label>
            <select
              id="contact-project-type"
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
              required
              className="flex h-9 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-1 text-base text-black dark:text-white outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
            >
              <option value="">Select project type</option>
              {PROJECT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="contact-message" className="block text-sm font-medium text-black dark:text-white mb-1">
              Message
            </label>
            <textarea
              id="contact-message"
              placeholder="Your message"
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
              required
              rows={4}
              className="flex w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-base text-black dark:text-white placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 resize-y min-h-[80px]"
            />
          </div>
          {contactStatus === "success" && (
            <p className="text-sm text-green-600 dark:text-green-400">
              Message sent. I&apos;ll get back to you soon.
            </p>
          )}
          {contactStatus === "error" && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {contactError}
            </p>
          )}
          <Button
            type="submit"
            disabled={contactStatus === "loading"}
            className="mt-2 bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white disabled:opacity-70"
          >
            {contactStatus === "loading" ? "Sending…" : "Send message"}
          </Button>
        </form>
      </section>
    </main>
  );
}
