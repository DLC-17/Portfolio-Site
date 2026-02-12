'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { fetchProjects, urlFor } from "@/sanity/sanity-utils";
import { Image } from 'sanity';

type Project = {
  _id: string;
  title: string;
  description: string;
  technologies?: string[]; // optional, in case it's undefined
  mainImage?:  Image;
  demoUrl?: string;
  githubUrl?: string;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getProjects = async () => {
      try {
        const data = await fetchProjects();
        setProjects(data);
      } catch (err) {
        setError('Failed to fetch projects.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getProjects();
  }, []);

  return (
    <div className=" h-screen text-black pt-20 dark:text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">My Projects</h1>

        {loading ? (
          <p className="text-center text-lg">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <motion.div
            layoutId="modal"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {projects.map((project) => (
              <div
                key={project._id}
                className="outline-1 outline-black dark:outline-white p-6 rounded-lg shadow bg-gray-100 dark:bg-accent transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:scale-[1.02] hover:bg-gray-300 dark:hover:bg-gray-700 w-full max-w-md"
              >
                {project.mainImage && (
                  <img
                    src={urlFor(project.mainImage).width(800).url()}
                    alt={project.title}
                    className="rounded mb-4 object-cover h-48 w-full"
                  />
                )}
                <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{project.description}</p>

                {project.technologies && (
                  <p className="text-gray-500 font-bold dark:text-white mb-4">
                    Tools Used: {project.technologies.join(', ') }
                  </p>
                )}

                <div className="flex gap-4">
                  {project.githubUrl && (
                    <Link href={project.githubUrl} target="_blank" className="text-blue-500 hover:underline">
                      GitHub
                    </Link>
                  )}
                  {project.demoUrl && (
                    <Link href={project.demoUrl} target="_blank" className="text-blue-500 hover:underline">
                      Live Demo
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
