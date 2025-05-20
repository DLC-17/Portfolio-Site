// app/projects/page.tsx
"use client";

import Link from "next/link";
import { Project } from "@/components/types";
import { motion } from "motion/react"

const projects: Project[] = [
  {
    id: 1,
    title: "Photography Portfolio",
    description: "A responsive Angular-based portfolio for a Bay Area photographer.",
    Technologies: ["Angular", "TypeScript", "HTML", "CSS"],
    imageUrl: "",
    url:"https://github.com/DLC-17/RT-Portfolio",
  },
  {
    id: 2,
    title: "Real-Time Face Recognition",
    description: "A real-time face recognition project using Machine Learning.",
    Technologies: ["Python", "OpenCV", "TensorFlow"],
    imageUrl: "",
    url:"https://github.com/DLC-17/Real-Time-Face-verification",
  },
  {
    id: 3,
    title: "Database Programming Final Project",
    description: "A fully comprehensive database project detailing the stastics various Baseball players.",
    Technologies: ["SQL", "PostgreSQL", "Python","Tableau"],
    imageUrl: "",
    url:"https://github.com/DLC-17/Database-Final",
  },
  {id: 4,
    title: "Portfolio Website",
    description: "A personal portfolio website showcasing my projects and skills. Built with Next.js and Tailwind CSS.",
    Technologies: ["Next.js", "Tailwind CSS", "React", "TypeScript","Three.js"],
    imageUrl: "",
    url:"https://github.com/DLC-17/Portfolio-Site"},
];

export default function ProjectsPage() {
  return (
    <div className="max-h-fit min-h-[90vh] bg-gray-100 dark:bg-gray-900 text-black dark:text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">        
        {/* Title */}
        <h1 className="text-4xl font-bold text-center mb-8">My Projects</h1>
        <motion.div layoutId="modal"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {projects.map((project) => (
            <div key={project.id} className="bg-white dark:bg-gray-800 outline-1 outline-black dark:outline-white hover:bg-gray-300 dark:hover:bg-gray-700 p-6 rounded-lg shadow hover:shadow-lg transition">
              <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">{project.description}</p>
              <p className="text-gray-500 dark:text-gray-400 mb-4">Tools Used:&nbsp; 
                {project.Technologies.join(", ")}</p>
              {project.url && (
                <Link href={project.url} target="_blank" className="text-blue-500 hover:underline">View Project</Link>
              )}
            </div>
          ))}
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        </div>
      </div>
    </div>
  );
}