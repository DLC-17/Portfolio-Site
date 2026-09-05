"use client";

import { useEffect, useState } from "react";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { ArrowUp, FileText } from "lucide-react";
import { fetchResume, type ResumeData } from "@/sanity/sanity-utils";

export default function Footer() {
  const [resume, setResume] = useState<ResumeData | null>(null);

  useEffect(() => {
    fetchResume()
      .then((data) => {
        if (data) setResume(data);
      })
      .catch(() => {});
  }, []);

  const resumeUrl = resume?.fileUrl || resume?.externalUrl;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full border-t border-border/80 bg-background/60 py-10 transition-colors">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 px-6 sm:flex-row sm:px-8">
        <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
          <p className="text-sm font-semibold tracking-wide text-foreground">
            David Coleman
          </p>
          <p className="text-xs text-muted-foreground">
            Forward Deployed Engineer • Bay Area, CA
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground/80">
            © {new Date().getFullYear()} All rights reserved. Built with Next.js & Sanity.
          </p>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="https://github.com/DLC-17"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="GitHub"
          >
            <FaGithub size={18} />
          </a>
          <a
            href="https://www.linkedin.com/in/david-coleman17/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="LinkedIn"
          >
            <FaLinkedin size={18} />
          </a>
          <a
            href="mailto:david@dc-dev.space"
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Email"
          >
            <FaEnvelope size={18} />
          </a>

          {resumeUrl ? (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Resume PDF"
            >
              <FileText size={16} />
              <span className="hidden sm:inline">Resume</span>
            </a>
          ) : null}

          <div className="h-4 w-px bg-border/80" />

          <button
            type="button"
            onClick={scrollToTop}
            className="group flex items-center gap-1.5 rounded-md border border-border/80 bg-card px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
            aria-label="Back to top"
          >
            <span>Top</span>
            <ArrowUp className="size-3.5 transition-transform group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
