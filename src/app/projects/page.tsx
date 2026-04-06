"use client";

import { useEffect, useState } from "react";
import { fetchFeaturedProjects, fetchProjects } from "@/sanity/sanity-utils";
import type { Image } from "sanity";
import { FeaturedProjectBlock } from "@/components/projects/featured-project-block";
import { ProjectCard, type ProjectCardData } from "@/components/projects/project-card";
import { ProjectsPageLoadingSkeleton } from "@/components/projects/project-skeletons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Project = {
  _id: string;
  title: string;
  description: string;
  technologies?: string[];
  mainImage?: Image;
  demoUrl?: string;
  githubUrl?: string;
};

export default function ProjectsPage() {
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [all, featured] = await Promise.all([fetchProjects(), fetchFeaturedProjects()]);
        setAllProjects(all);
        setFeaturedProjects(featured);
      } catch (err) {
        setError("Failed to fetch projects.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const listAsCardData = (list: Project[]): ProjectCardData[] =>
    list.map((p) => ({
      _id: p._id,
      title: p.title,
      description: p.description,
      technologies: p.technologies,
      mainImage: p.mainImage,
      demoUrl: p.demoUrl,
      githubUrl: p.githubUrl,
    }));

  return (
    <div className="min-h-svh bg-background px-6 py-16 pt-24 text-foreground md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 md:mb-16">
          <h1 className="text-3xl font-semibold tracking-[0.02em] md:text-4xl">Projects</h1>
        </header>

        {loading ? (
          <ProjectsPageLoadingSkeleton />
        ) : error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : (
          <Tabs defaultValue="featured" className="w-full">
            <TabsList className="mb-10">
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
            <TabsContent value="featured" className="mt-0">
              {featuredProjects.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No featured projects in Sanity. Toggle “Featured” on a project in Studio.
                </p>
              ) : (
                <div className="flex flex-col gap-8 md:gap-10 lg:gap-12">
                  {listAsCardData(featuredProjects).map((project, index) => (
                    <FeaturedProjectBlock key={project._id} project={project} index={index} />
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="all" className="mt-0">
              {allProjects.length === 0 ? (
                <p className="text-sm text-muted-foreground">No projects in Sanity yet.</p>
              ) : (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10 xl:grid-cols-3">
                  {listAsCardData(allProjects).map((project, index) => (
                    <ProjectCard key={project._id} project={project} index={index} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
