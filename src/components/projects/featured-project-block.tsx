"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProjectCardData } from "@/components/projects/project-card";
import { urlFor } from "@/sanity/sanity-utils";

const motionBlock = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" as const },
  transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as const },
};

function staggerDelay(index: number) {
  return {
    ...motionBlock,
    transition: { ...motionBlock.transition, delay: index * 0.06 },
  };
}

/** Turn Sanity description into experience-style bullet lines */
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

type FeaturedProjectBlockProps = {
  project: ProjectCardData;
  index: number;
};

/** Large horizontal featured row: image left, experience-style copy on the right. */
export function FeaturedProjectBlock({ project, index }: FeaturedProjectBlockProps) {
  const bullets = descriptionToBullets(project.description);
  const techLine =
    project.technologies && project.technologies.length > 0
      ? project.technologies.join(" · ")
      : null;
  const hasLinks = Boolean(project.demoUrl || project.githubUrl);

  const imageUrl =
    project.mainImage != null
      ? urlFor(project.mainImage).width(1200).height(675).url()
      : null;

  return (
    <motion.div {...staggerDelay(index)} className="w-full">
      <Card className="group overflow-hidden border-border/80 text-left shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-xl">
        <div className="flex min-h-[min(56vw,280px)] flex-col md:min-h-[320px] lg:min-h-[360px] md:flex-row">
          {/* Image / visual column */}
          <div
            className={
              imageUrl
                ? "relative aspect-[16/10] w-full shrink-0 overflow-hidden border-b border-border/80 sm:aspect-[16/9] md:aspect-auto md:h-auto md:min-h-[320px] md:w-[min(46%,520px)] md:min-w-[300px] lg:min-h-[360px] lg:min-w-[360px] md:border-b-0 md:border-r"
                : "relative hidden min-h-[200px] w-full shrink-0 bg-muted/40 md:flex md:min-h-[320px] md:w-[min(46%,520px)] md:min-w-[300px] lg:min-h-[360px] lg:min-w-[360px] md:border-r md:border-border/80"
            }
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 520px"
                priority={index === 0}
              />
            ) : (
              <div className="flex h-full min-h-[200px] items-center justify-center p-6 text-center text-sm text-muted-foreground">
                No project image
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex min-w-0 flex-1 flex-col justify-center px-6 py-7 md:px-9 md:py-8 lg:px-10 lg:py-10">
            <CardHeader className="space-y-3 p-0 pb-2">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                <div>
                  <CardTitle className="text-xl font-semibold tracking-tight transition-colors duration-200 group-hover:text-primary sm:text-2xl lg:text-[1.65rem] lg:leading-snug">
                    {project.title}
                  </CardTitle>
                  {techLine ? (
                    <p className="mt-2 text-sm font-medium text-muted-foreground md:text-base">
                      {techLine}
                    </p>
                  ) : null}
                </div>
                {hasLinks ? (
                  <div className="flex shrink-0 flex-col gap-1.5 text-left text-sm text-muted-foreground sm:items-end sm:text-right md:text-[0.95rem]">
                    {project.demoUrl ? (
                      <Link
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="whitespace-nowrap underline-offset-4 transition-colors hover:text-foreground hover:underline"
                      >
                        Live demo
                      </Link>
                    ) : null}
                    {project.githubUrl ? (
                      <Link
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="whitespace-nowrap underline-offset-4 transition-colors hover:text-foreground hover:underline"
                      >
                        GitHub
                      </Link>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </CardHeader>
            <CardContent className="p-0 pt-1">
              <ul className="space-y-3 pt-2 md:space-y-3.5">
                {bullets.map((line, i) => (
                  <li
                    key={`${project._id}-b-${i}`}
                    className="flex gap-2.5 text-pretty text-sm leading-relaxed text-muted-foreground md:text-base md:leading-relaxed"
                  >
                    <span className="mt-1 shrink-0 text-foreground/35 md:mt-1.5" aria-hidden>
                      –
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
