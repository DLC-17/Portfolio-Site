"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FaGithub, FaLinkedin, FaEnvelope, FaCamera } from "react-icons/fa";
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
import { Code2, Layout, Server, Cpu, MapPin } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { fetchFeaturedProjects } from "@/sanity/sanity-utils";
import type { Image as SanityImage } from "sanity";
import { ProjectCard, type ProjectCardData } from "@/components/projects/project-card";
import { ProjectCardSkeleton } from "@/components/projects/project-skeletons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
      "Engineered LLM orchestration and scraper frameworks to automate mission-critical data acquisition using Python and Playwright ",
      "Developed and optimized scalable automation systems achieving 99.9% operational reliability across volatile, client-facing environments ",
      "Refined prompt logic and implemented dynamic adaptation logic to handle complex edge cases and maintain continuity in real-time processes ",
      ],
  },
  {
    title: "Technical Consultant",
    company: "Independent",
    date: "May 2025 – Present",
    location: "Bay Area, CA",
    description: [
      "Architected market-ready technical infrastructures for CEOs, transitioning from vision to production-grade deployment in ambiguous startup environments ",
      "Developed modular, decoupled system frameworks from the ground up to ensure high availability and long-term operational scalability ",
      "Owned the technical roadmap for early-stage ventures, aligning complex engineering efforts with critical business milestones and product-market fit ",
      ],
  },
    {
    title: "Software Engineer Intern",
    company: "Saint Mary's College of California",
    date: "February 2024 – August 2024",
    location: "Moraga, CA, USA",
    description: [
    "Engineered a modular, node-based audio engine using Vanilla JavaScript and containerized the local development environment with Docker to ensure cross-platform deployment consistency",
    "Implemented Finite State Machine (FSM) automata logic to trigger real-time audio notes based on node and edge traversal",
    "Developed JSON serialization functionality enabling users to import and export complex automata configurations for local storage and rendering",
    ],
    },
  {
    title: "AI Systems Specialist",
    company: "Infinitus Systems, Inc",
    date: "Dec 2023 – Jan 2024",
    location: "San Francisco, CA",
    description: [
      "Served as a critical Human-in-the-Loop (HITL) layer for a proprietary Voice AI agent, maintaining 100% data accuracy during high-volume operational spikes ",
      "Identified and resolved AI hallucinations and logic drift in real-time to preserve the integrity of sensitive patient insurance data in production ",
      "Analyzed live AI-to-client interactions to identify failure patterns, providing technical feedback to refine agent decision-making logic ",
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
  {
    title: "IT Analyst",
    company: "Saint Mary's College of California",
    date: "September 2022 – May 2025",
    location: "Moraga, CA, USA",
    description: [
    "Managed high-availability technical operations and network diagnostics for a distributed ecosystem of 2,000+ faculty, students, and staff",
    "Spearheaded a campus-wide security infrastructure migration to Multi-Factor Authentication (MFA), achieving 100% user adoption",
    "Facilitated stakeholder education and technical troubleshooting to bridge the gap between security requirements and user experience",
    ],
    },
];

type FeaturedProject = {
  _id: string;
  title: string;
  description: string;
  technologies?: string[];
  mainImage?: SanityImage;
  demoUrl?: string;
  githubUrl?: string;
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" as const },
  transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as const },
};

const heroEnter = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
};

function staggerDelay(index: number) {
  return { ...fadeUp, transition: { ...fadeUp.transition, delay: index * 0.06 } };
}

export default function Home() {
  const experienceSectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress: experienceScrollProgress } = useScroll({
    target: experienceSectionRef,
    offset: ["start 0.85", "end 0.35"],
  });
  const experienceBarHeight = useTransform(experienceScrollProgress, [0, 1], ["0%", "100%"]);

  const [selectedExpertiseIndex, setSelectedExpertiseIndex] = useState<number | null>(0);
  const selectedCategory = selectedExpertiseIndex !== null ? expertiseCategories[selectedExpertiseIndex] : null;
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

  return (
    <main className="flex w-full flex-col items-center space-y-20 px-6 text-center md:space-y-24">
      {/* About Section */}
      <div className="mx-auto flex w-full max-w-5xl flex-col px-4 pb-10 pt-28 md:pt-32">
        <motion.section id="about" className="mb-10 w-full md:mb-14" {...heroEnter}>
          <h1 className="text-balance text-center font-semibold tracking-[0.02em] text-foreground md:text-left text-4xl md:text-5xl">
            David Coleman
          </h1>
          <p className="mt-3 text-center text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground md:text-left">
            Forward Deployed Engineer
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-center text-base leading-relaxed text-muted-foreground md:mx-0 md:text-left md:text-lg">
            Building production AI systems—from voice agents to MCP tooling.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground md:mx-0 md:text-left">
            Portfolio focused on software development and technical delivery.
          </p>
          <section id="contact" className="mt-10 w-full pb-2 md:text-left">
            <p className="mb-4 text-sm text-muted-foreground">Get in touch</p>
            <div className="flex justify-center gap-8 md:justify-start">
              <a
                href="https://github.com/DLC-17"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/80 transition-colors hover:text-foreground"
                aria-label="GitHub"
              >
                <FaGithub size={22} />
              </a>
              <a
                href="https://www.linkedin.com/in/david-coleman17/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/80 transition-colors hover:text-foreground"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={22} />
              </a>
              <a
                href="https://dlc-17.github.io/Personal-site/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/80 transition-colors hover:text-foreground"
                aria-label="Personal Site"
              >
                <FaCamera size={22} />
              </a>
              <div className="flex items-center gap-2.5">
                <a
                  href="mailto:david@dc-dev.space"
                  className="text-foreground/80 transition-colors hover:text-foreground"
                  aria-label="Email"
                >
                  <FaEnvelope size={22} />
                </a>
                <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="size-4 shrink-0 opacity-80" aria-hidden />
                  SF Bay Area
                </span>
              </div>
            </div>
          </section>
        </motion.section>

        {/* Technical Expertise - selectable category icons with labels, skills horizontal below; click again to toggle off */}
        <motion.section
          id="expertise"
          className="w-full border-t border-zinc-200/80 pt-12 dark:border-zinc-800/80 md:pt-14"
          {...fadeUp}
        >
          <h2 className="mb-8 text-center text-2xl font-semibold tracking-[0.02em] text-foreground md:text-left md:text-3xl">
            Technical expertise
          </h2>
          <div className="mb-6 flex flex-wrap justify-center gap-2 md:justify-start">
            {expertiseCategories.map((cat, index) => {
              const Icon = cat.icon;
              const isSelected = index === selectedExpertiseIndex;
              return (
                <button
                  key={cat.group}
                  type="button"
                  onClick={() => setSelectedExpertiseIndex(isSelected ? null : index)}
                  className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium shadow-sm transition-all duration-300 ${
                    isSelected
                      ? "border-zinc-300/80 bg-muted text-foreground dark:border-zinc-600/80"
                      : "border-zinc-200/80 bg-card text-muted-foreground hover:border-zinc-300/80 hover:text-foreground dark:border-zinc-800/80 dark:hover:border-zinc-700/80"
                  }`}
                  aria-label={cat.group}
                  aria-pressed={isSelected}
                >
                  <Icon size={18} className="shrink-0" />
                  <span>{cat.group}</span>
                </button>
              );
            })}
          </div>
          {selectedCategory ? (
            <div className="flex flex-wrap justify-center gap-2 md:justify-start">
              {selectedCategory.items.map((name) => {
                const Icon = skillIcons[name];
                return (
                  <Badge
                    key={name}
                    variant="muted"
                    className="flex items-center gap-1.5 px-2.5 py-1 font-normal"
                  >
                    {Icon ? <Icon size={14} className="shrink-0" /> : null}
                    {name}
                  </Badge>
                );
              })}
            </div>
          ) : null}
        </motion.section>

        {/* Featured Projects */}
        {(projectsLoading || featuredProjects.length > 0) && (
          <motion.section
            id="featured-projects"
            className="mt-16 w-full border-t border-zinc-200/80 pt-10 dark:border-zinc-800/80 md:mt-20 md:pt-14"
            {...fadeUp}
          >
            <div className="mb-8 flex flex-col gap-2 text-center md:flex-row md:items-end md:justify-between md:text-left">
              <h2 className="text-2xl font-semibold tracking-[0.02em] text-foreground md:text-3xl">Featured projects</h2>
              <Link
                href="/projects"
                className="text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                View all projects
              </Link>
            </div>
            {projectsLoading ? (
              <div
                className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:gap-10 lg:grid-cols-3"
                aria-busy="true"
                aria-label="Loading featured projects"
              >
                {[0, 1, 2].map((i) => (
                  <ProjectCardSkeleton key={i} />
                ))}
              </div>
            ) : featuredProjects.length === 0 ? (
              <p className="text-sm text-muted-foreground">No featured projects yet. Mark items as featured in Sanity Studio.</p>
            ) : (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:gap-10 lg:grid-cols-3">
                {featuredProjects.map((project, index) => {
                  const data: ProjectCardData = {
                    _id: project._id,
                    title: project.title,
                    description: project.description,
                    technologies: project.technologies,
                    mainImage: project.mainImage,
                    demoUrl: project.demoUrl,
                    githubUrl: project.githubUrl,
                  };
                  return <ProjectCard key={project._id} project={data} index={index} />;
                })}
              </div>
            )}
          </motion.section>
        )}
      </div>

      {/* Experience — vertical stack of cards + scroll-linked left rail */}
      <motion.section
        ref={experienceSectionRef}
        id="experience"
        className="mx-auto w-full max-w-5xl px-4 pb-4 pt-16 md:pt-20"
        {...fadeUp}
      >
        <h2 className="mb-10 text-center text-2xl font-semibold tracking-[0.02em] text-foreground md:mb-8 md:pl-[calc(1rem+0.25rem)] md:text-left md:text-3xl">
          Experience
        </h2>
        <div className="flex gap-5 md:gap-6">
          {/* Scroll-progress rail (desktop) */}
          <div
            className="relative hidden w-1 shrink-0 self-stretch overflow-hidden rounded-full bg-zinc-200/80 dark:bg-zinc-800/80 md:block"
            aria-hidden
          >
            <motion.div
              className="absolute left-0 top-0 w-full rounded-full bg-foreground/35 dark:bg-foreground/45"
              style={{ height: experienceBarHeight }}
            />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-6 md:gap-8">
          {experience.map((job, index) => (
            <motion.div key={`${job.company}-${job.title}-${index}`} {...staggerDelay(index)} className="w-full">
              <Card className="border-zinc-200/80 text-left shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800/80">
                <CardHeader className="space-y-3 pb-2">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                    <div>
                      <CardTitle className="text-base sm:text-lg">{job.title}</CardTitle>
                      <p className="mt-1 text-sm font-medium text-muted-foreground">{job.company}</p>
                    </div>
                    <div className="shrink-0 text-left text-xs text-muted-foreground sm:text-right sm:text-sm">
                      <p className="whitespace-nowrap">{job.date}</p>
                      {job.location ? <p className="whitespace-nowrap">{job.location}</p> : null}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2.5 pt-2">
                    {job.description.map((desc, i) => (
                      <li key={i} className="flex gap-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                        <span className="mt-0.5 shrink-0 text-foreground/35" aria-hidden>
                          –
                        </span>
                        <span>{desc}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          </div>
        </div>
      </motion.section>

      {/* Education Section - stacked on mobile, horizontal on desktop */}
      <motion.section
        id="education"
        className="mx-auto w-full max-w-6xl border-t border-zinc-200/80 px-4 pb-16 pt-16 dark:border-zinc-800/80 md:pt-20"
        {...fadeUp}
      >
        <h2 className="mb-8 text-center text-2xl font-semibold tracking-[0.02em] text-foreground sm:text-3xl">
          Education
        </h2>

        <div className="relative grid grid-cols-2 gap-4 pt-6 md:flex md:items-start md:justify-between md:gap-4 md:pt-8">
          <div className="absolute left-0 top-0 z-0 hidden h-px w-full bg-zinc-200/80 md:block dark:bg-zinc-800/80" />

          {education.map((edu, index) => (
            <motion.div key={index} {...staggerDelay(index)} className="md:flex-1 md:min-w-0">
            <Card
              className="relative flex h-full flex-col items-center border-zinc-200/80 bg-card text-center shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800/80"
            >
              <div className="absolute top-0 z-10 size-2.5 -translate-y-1/2 rounded-full bg-foreground md:left-1/2 md:-translate-x-1/2" />
              <CardContent className="flex w-full min-w-0 flex-col items-center px-3 pb-6 pt-8 sm:px-4">
                <Image
                  src={edu.src}
                  alt={edu.name}
                  width={0}
                  height={0}
                  className={`mb-3 w-12 sm:w-[60px] ${
                  (edu as { invertInDark?: boolean; invertInLight?: boolean }).invertInLight
                    ? "invert dark:invert-0"
                    : (edu as { invertInDark?: boolean; invertInLight?: boolean }).invertInDark
                      ? "dark:invert"
                      : ""
                }`}
                />
                <h3 className="break-words text-xs font-semibold text-foreground sm:text-sm">
                  {edu.name}
                </h3>
                <p className="mt-1 break-words text-[11px] leading-snug text-muted-foreground sm:text-xs">
                  {edu.degree}
                </p>
              </CardContent>
            </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </main>
  );
}
