"use client";

import { useState, useEffect, useRef } from "react";
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
  SiDocker,
  SiGo,
  SiSqlite,
  SiDotnet,
  SiAnthropic,
  SiOpenai,
} from "react-icons/si";
import type { IconType } from "react-icons";
import { Code2, Layout, Server, Cpu, MapPin, ExternalLink, FileText, Mail } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { fetchFeaturedProjects, fetchProjects, fetchResume, type ResumeData } from "@/sanity/sanity-utils";
import type { Image as SanityImage } from "sanity";
import { ProjectCard, type ProjectCardData } from "@/components/projects/project-card";
import { ProjectCardSkeleton } from "@/components/projects/project-skeletons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// import { ContactDialog } from "@/components/contact/contact-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type EducationItem = {
  src: string;
  name: string;
  degree: string;
  link?: string;
  invertInLight?: boolean;
  invertInDark?: boolean;
};

const degrees: EducationItem[] = [
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
];

const certificates: EducationItem[] = [
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
  Go: SiGo,
  "C#": SiDotnet,
  SQL: SiPostgresql,
  SQLite: SiSqlite,
  React: SiReact,
  "Next.js": SiNextdotjs,
  "Tailwind CSS": SiTailwindcss,
  FastAPI: SiFastapi,
  Docker: SiDocker,
  Playwright: SiPuppeteer,
  "REST APIs": SiSwagger,
  Git: SiGit,
  NLP: SiHuggingface,
  "Agentic systems": SiRobotframework,
  MCP: SiAnthropic,
  "LLM orchestration": SiOpenai,
};

const expertiseCategories: { group: string; items: string[]; icon: LucideIcon }[] = [
  { group: "Languages", items: ["Python", "TypeScript", "JavaScript", "Go", "C#", "SQL"], icon: Code2 },
  { group: "Frontend & UI", items: ["Next.js", "Tailwind CSS", "React"], icon: Layout },
  { group: "Backend & Infrastructure", items: ["FastAPI", "Docker", "REST APIs", "Playwright", "SQLite", "Git"], icon: Server },
  { group: "AI/ML", items: ["NLP", "LLM orchestration", "MCP", "Agentic systems"], icon: Cpu },
];

const experience: {
  title: string;
  company: string;
  date: string;
  location?: string;
  // Updated type to accept either strings OR the link objects
  description: (string | { name: string; url: string })[];
}[] = [
  {
    title: "Founding Engineer",
    company: "NDA Startup",
    date: "Jan 2026 – June 2026",
    location: "Bay Area, CA",
    description: [
      "Architected market-ready technical infrastructures for CEOs, transitioning from vision to production-grade deployment in ambiguous startup environments ",
      "Developed modular, decoupled system frameworks from the ground up to ensure high availability and long-term operational scalability ",
      "Owned the technical roadmap for early-stage ventures, aligning complex engineering efforts with critical business milestones and product-market fit ",
    ],
  },
  {
    title: "Forward Deployed Engineer",
    company: "Spoqen",
    date: "Sep 2025 – Feb 2026",
    location: "Remote",
    description: [
      "Engineered LLM orchestration and scraper frameworks to automate mission-critical data acquisition using Python and Playwright ",
      "Developed and optimized scalable automation systems achieving 99.9% operational reliability across volatile, client-facing environments ",
      "Refined prompt logic and implemented dynamic adaptation logic to handle complex edge cases and maintain continuity in real-time processes ",
    ],
  },
  {
    title: "Website Developer",
    company: "Freelance",
    date: "2025 - Present",
    location: "Bay Area, CA",
    description: [
      "Designed and engineered high-performance custom web applications for Bay Area businesses and creators, emphasizing mobile responsiveness and modern brand identity",
      {
        name: "Marao Ethiopian Coffee (Custom e-commerce storefront & brand platform)",
        url: "https://www.maraoethiopiancoffee.com",
      },
      {
        name: "Richard Trinh Photography (Portfolio site with optimized asset delivery & galleries)",
        url: "https://rt-portfolio-drab.vercel.app/",
      },
    ],
  },
  {
    title: "Research Assistant",
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

type FeaturedProject = {
  _id: string;
  title: string;
  description: string;
  technologies?: string[];
  mainImage?: SanityImage;
  demoUrl?: string;
  githubUrl?: string;
  publishedAt?: string;
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

function formatResumeDate(dateStr?: string) {
  if (!dateStr) return null;
  try {
    const date = new Date(dateStr.includes("T") ? dateStr : `${dateStr}T12:00:00Z`);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch {
    return dateStr;
  }
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
  const [allProjects, setAllProjects] = useState<FeaturedProject[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [resume, setResume] = useState<ResumeData | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [featuredResult, allResult, resumeResult] = await Promise.allSettled([
          fetchFeaturedProjects(),
          fetchProjects(),
          fetchResume(),
        ]);
        if (featuredResult.status === "fulfilled") {
          setFeaturedProjects(featuredResult.value);
        }
        if (allResult.status === "fulfilled") {
          setAllProjects(allResult.value);
        }
        if (resumeResult.status === "fulfilled" && resumeResult.value) {
          setResume(resumeResult.value);
        }
      } catch {
        setFeaturedProjects([]);
        setAllProjects([]);
      } finally {
        setProjectsLoading(false);
      }
    };
    load();
  }, []);

  const resumeUrl = resume?.fileUrl || resume?.externalUrl;

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

          {/* Action CTAs: Get in touch & Resume */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:justify-start">
            {/* ContactDialog (Resend) - commented out
            <ContactDialog>
              <Button variant="default" className="gap-2 shadow-sm font-medium">
                <Mail className="size-4" />
                Get in Touch
              </Button>
            </ContactDialog>
            */}
            <Button variant="default" className="gap-2 shadow-sm font-medium" asChild>
              <a href="mailto:david@dc-dev.space">
                <Mail className="size-4" />
                Get in Touch
              </a>
            </Button>
            {resumeUrl ? (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center gap-2 rounded-md border border-border/80 bg-card px-4 py-2 text-sm font-medium text-foreground shadow-xs transition-colors hover:border-primary hover:text-primary"
              >
                <FileText className="size-4" />
                View Resume
              </a>
            ) : null}
          </div>
          {resume?.lastUpdated ? (
            <p className="mt-2.5 text-center text-xs text-muted-foreground/75 md:text-left">
              Resume updated {formatResumeDate(resume.lastUpdated)}
            </p>
          ) : null}

          <section id="contact" className="mt-10 w-full pb-2 md:text-left">
            <p className="mb-4 text-sm text-muted-foreground">Connect with me</p>
            <div className="flex flex-wrap items-center justify-center gap-6 md:justify-start">
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
          className="w-full border-t border-border/80 pt-12 md:pt-14"
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
                      ? "border-primary bg-primary text-primary-foreground font-semibold shadow-sm"
                      : "border-border/80 bg-card text-muted-foreground hover:border-primary/60 hover:text-foreground"
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
      </div>

      {/* Experience — vertical stack of cards + scroll-linked left rail */}
      <motion.section
        ref={experienceSectionRef}
        id="experience"
        className="mx-auto w-full max-w-5xl border-t border-border/80 px-4 pb-4 pt-16 md:pt-20"
        {...fadeUp}
      >
        <h2 className="mb-10 text-center text-2xl font-semibold tracking-[0.02em] text-foreground md:mb-8 md:pl-[calc(1rem+0.25rem)] md:text-left md:text-3xl">
          Experience
        </h2>
        <div className="flex gap-5 md:gap-6">
          {/* Scroll-progress rail (desktop) */}
          <div
            className="relative hidden w-1 shrink-0 self-stretch overflow-hidden rounded-full bg-border/30 md:block"
            aria-hidden
          >
            <motion.div
              className="absolute left-0 top-0 w-full rounded-full bg-primary"
              style={{ height: experienceBarHeight }}
            />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-6 md:gap-8">
          {experience.map((job, index) => (
            <motion.div key={`${job.company}-${job.title}-${index}`} {...staggerDelay(index)} className="w-full">
              <Card className="border-border/80 text-left shadow-sm transition-shadow hover:shadow-md">
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
                          <span>
 {typeof desc === 'string' ? (
 desc
 ) : (
<Link
  href={desc.url}
  target="_blank"
  rel="noopener noreferrer"
  className="text-opposing font-medium underline underline-offset-4 transition-all hover:opacity-80"
>
  {desc.name}
</Link>
 )}</span>
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

      {/* Projects Section - located beneath Experience */}
      <motion.section
        id="projects"
        className="mx-auto w-full max-w-5xl border-t border-border/80 px-4 pb-4 pt-16 md:pt-20"
        {...fadeUp}
      >
        <h2 className="mb-8 text-center text-2xl font-semibold tracking-[0.02em] text-foreground md:text-left md:text-3xl">
          Projects
        </h2>

        {projectsLoading ? (
          <div
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:gap-10 lg:grid-cols-3"
            aria-busy="true"
            aria-label="Loading projects"
          >
            {[0, 1, 2].map((i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <Tabs defaultValue="featured" className="w-full">
            <div className="mb-8 flex justify-center md:justify-start">
              <TabsList>
                <TabsTrigger value="featured">Featured</TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="featured" className="mt-0">
              {featuredProjects.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground md:text-left">
                  No featured projects found.
                </p>
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
                      publishedAt: project.publishedAt,
                    };
                    return <ProjectCard key={project._id} project={data} index={index} />;
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="all" className="mt-0">
              {allProjects.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground md:text-left">
                  No projects found.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:gap-10 lg:grid-cols-3">
                  {allProjects.map((project, index) => {
                    const data: ProjectCardData = {
                      _id: project._id,
                      title: project.title,
                      description: project.description,
                      technologies: project.technologies,
                      mainImage: project.mainImage,
                      demoUrl: project.demoUrl,
                      githubUrl: project.githubUrl,
                      publishedAt: project.publishedAt,
                    };
                    return <ProjectCard key={project._id} project={data} index={index} />;
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </motion.section>

      {/* Education Section - split into Degrees and Certificates */}
      <motion.section
        id="education"
        className="mx-auto w-full max-w-5xl border-t border-border/80 px-4 pb-16 pt-16 md:pt-20"
        {...fadeUp}
      >
        <h2 className="mb-10 text-center text-2xl font-semibold tracking-[0.02em] text-foreground md:text-left md:text-3xl">
          Education
        </h2>

        <div className="space-y-12">
          {/* Degrees */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:text-sm">
                Degrees
              </h3>
              <div className="h-px flex-1 bg-border/80" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {degrees.map((edu, index) => (
                <motion.div key={`degree-${index}`} {...staggerDelay(index)} className="h-full">
                  <a
                    href={edu.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block h-full rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Card className="relative flex h-full flex-col items-center border-border/80 bg-card text-center shadow-sm transition-all duration-200 group-hover:border-primary group-hover:shadow-md">
                      {edu.link ? (
                        <div className="absolute right-3.5 top-3.5 text-muted-foreground/40 transition-colors group-hover:text-primary">
                          <ExternalLink className="size-3.5" />
                        </div>
                      ) : null}
                      <CardContent className="flex w-full min-w-0 flex-col items-center px-4 pb-6 pt-6">
                        <div className="relative mb-3 flex h-14 w-14 items-center justify-center">
                          <Image
                            src={edu.src}
                            alt={edu.name}
                            width={56}
                            height={56}
                            style={{ width: "auto" }}
                            className={`max-h-12 object-contain ${
                              edu.invertInLight
                                ? "invert dark:invert-0"
                                : edu.invertInDark
                                  ? "dark:invert"
                                  : ""
                            }`}
                          />
                        </div>
                        <h4 className="break-words text-xs font-semibold text-foreground sm:text-sm">
                          {edu.name}
                        </h4>
                        <p className="mt-1 break-words text-[11px] leading-snug text-muted-foreground sm:text-xs">
                          {edu.degree}
                        </p>
                      </CardContent>
                    </Card>
                  </a>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Certificates */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:text-sm">
                Certificates
              </h3>
              <div className="h-px flex-1 bg-border/80" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {certificates.map((edu, index) => (
                <motion.div key={`cert-${index}`} {...staggerDelay(index)} className="h-full">
                  <a
                    href={edu.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block h-full rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Card className="relative flex h-full flex-col items-center border-border/80 bg-card text-center shadow-sm transition-all duration-200 group-hover:border-primary group-hover:shadow-md">
                      {edu.link ? (
                        <div className="absolute right-3.5 top-3.5 text-muted-foreground/40 transition-colors group-hover:text-primary">
                          <ExternalLink className="size-3.5" />
                        </div>
                      ) : null}
                      <CardContent className="flex w-full min-w-0 flex-col items-center px-4 pb-6 pt-6">
                        <div className="relative mb-3 flex h-14 w-14 items-center justify-center">
                          <Image
                            src={edu.src}
                            alt={edu.name}
                            width={56}
                            height={56}
                            style={{ width: "auto" }}
                            className={`max-h-12 object-contain ${
                              edu.invertInLight
                                ? "invert dark:invert-0"
                                : edu.invertInDark
                                  ? "dark:invert"
                                  : ""
                            }`}
                          />
                        </div>
                        <h4 className="break-words text-xs font-semibold text-foreground sm:text-sm">
                          {edu.name}
                        </h4>
                        <p className="mt-1 break-words text-[11px] leading-snug text-muted-foreground sm:text-xs">
                          {edu.degree}
                        </p>
                      </CardContent>
                    </Card>
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>
    </main>
  );
}
