"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { Image as SanityImage } from "sanity";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowUpRight, ExternalLink, Maximize2 } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { urlFor } from "@/sanity/sanity-utils";

export type ProjectCardData = {
  _id: string;
  title: string;
  description: string;
  technologies?: string[];
  mainImage?: SanityImage;
  demoUrl?: string;
  githubUrl?: string;
  publishedAt?: string;
};

type ProjectCardProps = {
  project: ProjectCardData;
  index?: number;
};

const motionProps = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" as const },
  transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const },
};

/** Split Sanity text into clean experience-style bullet points or sentences */
function descriptionToBullets(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];
  const byNewline = trimmed
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (byNewline.length > 1) return byNewline;
  const sentences = trimmed.split(/(?<=[.!?])\s+/).filter((s) => s.length > 0);
  if (sentences.length > 1) return sentences;
  return [trimmed];
}

function formatProjectDate(isoDate?: string): string | null {
  if (!isoDate) return null;
  try {
    const date = new Date(isoDate);
    return isNaN(date.getTime())
      ? null
      : date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  } catch {
    return null;
  }
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const staggered = {
    ...motionProps,
    transition: {
      ...motionProps.transition,
      delay: index * 0.05,
    },
  };

  const thumbnailImageUrl =
    project.mainImage != null
      ? urlFor(project.mainImage).width(800).height(450).url()
      : null;

  const modalImageUrl =
    project.mainImage != null
      ? urlFor(project.mainImage).width(1200).height(675).url()
      : null;

  const bullets = descriptionToBullets(project.description);
  const formattedDate = formatProjectDate(project.publishedAt);

  return (
    <>
      <motion.div {...staggered} className="h-full w-full">
        <Card
          role="button"
          tabIndex={0}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-label={`View project details for ${project.title}`}
          onClick={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsOpen(true);
            }
          }}
          className="group relative flex h-full cursor-pointer flex-col overflow-hidden border-border/80 bg-card transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-xl dark:hover:border-primary/40 dark:hover:shadow-primary/5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
        >
          {thumbnailImageUrl ? (
            <div className="relative aspect-video w-full overflow-hidden border-b border-border/80 bg-muted/30">
              <Image
                src={thumbnailImageUrl}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {/* Subtle hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              {/* Hover expand pill indicator */}
              <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full border border-border/60 bg-background/85 px-2.5 py-1 text-xs font-medium text-foreground shadow-md backdrop-blur-md opacity-0 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0">
                <Maximize2 className="size-3 text-primary" />
                <span>Expand</span>
              </div>
            </div>
          ) : null}

          <CardHeader className="pb-3">
            <div className="flex items-baseline justify-between gap-2">
              <CardTitle className="text-base font-semibold leading-snug transition-colors duration-200 group-hover:text-primary">
                {project.title}
              </CardTitle>
              {formattedDate && (
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formattedDate}
                </span>
              )}
            </div>
          </CardHeader>

          <CardContent className="flex flex-1 flex-col gap-3 pb-4">
            <CardDescription className="line-clamp-3 text-sm leading-relaxed">
              {project.description}
            </CardDescription>
            {project.technologies && project.technologies.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {project.technologies.map((tech, i) => (
                  <Badge
                    key={`${project._id}-${tech}-${i}`}
                    variant="muted"
                    className="transition-colors group-hover:border-primary/30"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            ) : null}
          </CardContent>

          <CardFooter className="mt-auto flex items-center justify-between border-t border-border/80 pt-4">
            <div className="flex flex-wrap items-center gap-3">
              {project.githubUrl ? (
                <Button
                  variant="link"
                  className="h-auto p-0 text-xs font-medium text-muted-foreground hover:text-foreground"
                  asChild
                  onClick={(e) => e.stopPropagation()}
                >
                  <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    GitHub
                  </Link>
                </Button>
              ) : null}
              {project.demoUrl ? (
                <Button
                  variant="link"
                  className="h-auto p-0 text-xs font-medium text-muted-foreground hover:text-foreground"
                  asChild
                  onClick={(e) => e.stopPropagation()}
                >
                  <Link href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                    Live demo
                  </Link>
                </Button>
              ) : null}
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground/70 transition-colors duration-200 group-hover:text-primary">
              <span>Details</span>
              <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Expanded Modal Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-h-[90vh] w-[calc(100%-2rem)] max-w-2xl overflow-hidden p-0 gap-0 border-border/80 bg-background flex flex-col rounded-xl">
          {modalImageUrl ? (
            <div className="relative aspect-video w-full shrink-0 overflow-hidden border-b border-border/80 bg-muted/30 sm:aspect-[16/9]">
              <Image
                src={modalImageUrl}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 720px"
                priority
              />
            </div>
          ) : null}

          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            <DialogHeader className="space-y-1 text-left">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                <DialogTitle className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  {project.title}
                </DialogTitle>
                {formattedDate && (
                  <span className="text-xs text-muted-foreground sm:text-sm">
                    {formattedDate}
                  </span>
                )}
              </div>
              <DialogDescription className="sr-only">
                {`Overview and details for ${project.title}`}
              </DialogDescription>
            </DialogHeader>

            {project.technologies && project.technologies.length > 0 ? (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Technologies Used
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.map((tech, i) => (
                    <Badge
                      key={`modal-${project._id}-${tech}-${i}`}
                      variant="secondary"
                      className="px-2.5 py-1 text-xs font-medium"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Project Overview
              </h4>
              {bullets.length > 1 ? (
                <ul className="space-y-2.5 pt-1">
                  {bullets.map((bullet, i) => (
                    <li
                      key={`bullet-${i}`}
                      className="flex gap-2.5 text-sm sm:text-base leading-relaxed text-muted-foreground"
                    >
                      <span className="mt-1.5 size-1.5 rounded-full bg-primary shrink-0" aria-hidden />
                      <span className="text-pretty">{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm sm:text-base leading-relaxed text-muted-foreground text-pretty">
                  {project.description}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="flex flex-wrap items-center justify-between gap-3 border-t border-border/80 bg-muted/20 px-6 py-4 sm:justify-between">
            <div className="flex flex-wrap items-center gap-2.5">
              {project.demoUrl ? (
                <Button asChild size="sm" className="gap-2 font-medium">
                  <Link href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="size-3.5" />
                    Live Demo
                  </Link>
                </Button>
              ) : null}
              {project.githubUrl ? (
                <Button asChild variant="outline" size="sm" className="gap-2 border-border/80 font-medium">
                  <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <FaGithub className="size-3.5" />
                    GitHub Repo
                  </Link>
                </Button>
              ) : null}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="border-border/80 text-xs"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
