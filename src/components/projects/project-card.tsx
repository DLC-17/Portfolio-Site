"use client";

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
import { urlFor } from "@/sanity/sanity-utils";

export type ProjectCardData = {
  _id: string;
  title: string;
  description: string;
  technologies?: string[];
  mainImage?: SanityImage;
  demoUrl?: string;
  githubUrl?: string;
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

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const staggered = {
    ...motionProps,
    transition: {
      ...motionProps.transition,
      delay: index * 0.05,
    },
  };

  const imageUrl =
    project.mainImage != null
      ? urlFor(project.mainImage).width(800).height(450).url()
      : null;

  return (
    <motion.div {...staggered} className="h-full w-full">
      <Card className="flex h-full flex-col overflow-hidden transition-shadow duration-300 hover:shadow-md">
        {imageUrl ? (
          <div className="relative aspect-video w-full overflow-hidden border-b border-zinc-200/80 dark:border-zinc-800/80">
            <Image
              src={imageUrl}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : null}
        <CardHeader className="pb-3">
          <CardTitle className="text-base leading-snug">{project.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-3 pb-4">
          <CardDescription className="line-clamp-3">{project.description}</CardDescription>
          {project.technologies && project.technologies.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.map((tech, i) => (
                <Badge key={`${project._id}-${tech}-${i}`} variant="muted">
                  {tech}
                </Badge>
              ))}
            </div>
          ) : null}
        </CardContent>
        {(project.githubUrl || project.demoUrl) && (
          <CardFooter className="mt-auto flex flex-wrap gap-2 border-t border-zinc-200/80 pt-4 dark:border-zinc-800/80">
            {project.githubUrl ? (
              <Button variant="link" className="h-auto p-0 text-sm" asChild>
                <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  GitHub
                </Link>
              </Button>
            ) : null}
            {project.demoUrl ? (
              <Button variant="link" className="h-auto p-0 text-sm" asChild>
                <Link href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                  Live demo
                </Link>
              </Button>
            ) : null}
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
}
