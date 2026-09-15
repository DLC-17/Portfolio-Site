import { createClient } from "next-sanity";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "zycmjwme";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token =
  process.env.SANITY_API_WRITE_TOKEN ||
  process.env.SANITY_AUTH_TOKEN;

const updatedProjects = [
  {
    _id: "09949357-c7c9-44cb-a8b2-f85bb7ae5876",
    title: "GPerturb Trust Explorer",
    technologies: [
      "Python",
      "Streamlit",
      "Pandas",
      "PyArrow",
      "Anthropic Claude API",
      "Bayesian Modeling"
    ],
    description: `High-throughput cancer genomics analysis platform converting complex Bayesian GPerturb posterior outputs into prioritized therapeutic targets.
Built an interactive Streamlit application to evaluate dual Gaussian/ZIP model heads and posterior inclusion probabilities (PIPs) across extensive perturbation screens.
Engineered a novel multi-factor trust-scoring framework that ranks candidate targets by statistical robustness, effect consistency, and biological plausibility rather than raw effect size alone.
Integrated Anthropic API for automated target annotation and literature cross-referencing, accelerating preclinical discovery.`,
    demoUrl: "https://gperturb-targetlens.replit.app",
    featured: true,
  },
  {
    _id: "dc4037e4-0a78-41ce-9a0a-6a28673879bc",
    title: "Spoqen: Voice AI Flow Generator",
    technologies: [
      "TypeScript",
      "Next.js",
      "Python",
      "Playwright",
      "LLM Orchestration",
      "FastAPI"
    ],
    description: `Enterprise workflow platform automating the translation of unstructured call recordings and transcripts into production-grade Voice AI agent conversation flows.
Architected an interactive drag-and-drop node graph interface enabling engineers and non-technical stakeholders to visualize, test, and refine conversational logic in real-time.
Implemented automated prompt engineering pipelines and guardrail validation to minimize latency, eliminate conversational dead-ends, and prevent AI drift.
Engineered robust data ingestion pipelines handling volatile, multi-speaker conversational audio at scale.`,
    demoUrl: "https://www.spoqen.com/",
    featured: true,
  },
  {
    _id: "b6d64a75-e720-498e-b5cd-70df924d42f5",
    title: "Omnishelf",
    technologies: [
      "Golang",
      "Gin",
      "SQLite",
      "Docker",
      "TypeScript",
      "Vite",
      "Tailwind CSS"
    ],
    description: `Self-hosted, privacy-first personal media tracker engineered natively for TrueNAS and home-server container environments.
Unified tracking architecture across disparate media formats including books, films, TV series, video games, and collectible card games.
Built with a lightweight Golang Gin backend and SQLite database to deliver sub-millisecond query latencies and zero cloud dependencies.
Containerized with multi-arch Docker images, supporting automated metadata enrichment and local offline caching.`,
    githubUrl: "https://github.com/DLC-17/OmniShelf",
    featured: false,
  },
  {
    _id: "c718576f-d8e1-41e2-bee3-9886a21c5759",
    title: "Portfolio Website",
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Gemini API",
      "Sanity CMS",
      "Framer Motion"
    ],
    description: `High-performance personal portfolio and engineering showcase designed with Next.js 16, React 19, and Tailwind CSS v4.
Features an integrated conversational AI avatar powered by Google Gemini 2.5 Flash with streaming responses, strict persona boundaries, and IP rate-limiting.
Embedded headless CMS architecture using Sanity Studio with custom schema management, singletons, and on-demand ISR revalidation webhooks.
Fully responsive design featuring dark/light theme switching, Framer Motion transitions, and accessible dialogs.`,
    demoUrl: "https://www.dc-dev.space",
    githubUrl: "https://github.com/DLC-17/Portfolio-Site",
    featured: false,
  },
  {
    _id: "d41a33ad-9293-4498-a61c-eb140d51e167",
    title: "Photography Portfolio",
    technologies: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Vercel",
      "Image Optimization"
    ],
    description: `Client-facing visual portfolio designed and engineered for a Bay Area commercial and portrait photographer.
Built with modern responsive layouts and dynamic photo galleries optimized for high-resolution asset delivery and minimal cumulative layout shift (CLS).
Implemented custom client review workflows, fast thumbnail loading, and smooth image transition carousels.`,
    demoUrl: "https://rt-portfolio-drab.vercel.app",
    githubUrl: "https://github.com/DLC-17/RT-Portfolio",
    featured: false,
  },
  {
    _id: "722adff9-586b-427c-9787-78d9eb93a624",
    title: "Real-Time Face Verification",
    technologies: [
      "Python",
      "OpenCV",
      "NumPy",
      "Deep Learning",
      "Computer Vision"
    ],
    description: `Computer vision pipeline implementing real-time facial detection, alignment, and biometric feature extraction from live camera feeds.
Utilized OpenCV and deep learning embedding extractors to perform cosine similarity distance matching against enrolled identities.
Optimized inference loop to maintain 30+ FPS video processing with low latency on standard consumer hardware.`,
    githubUrl: "https://github.com/DLC-17/Real-Time-Face-verification",
    featured: false,
  },
];

async function main() {
  console.log("=== Project Descriptions & Technology Enhancement ===");
  console.log(`Sanity Project: ${projectId} (Dataset: ${dataset})`);

  if (!token) {
    console.log("\n⚠️ No SANITY_API_WRITE_TOKEN or SANITY_AUTH_TOKEN found in environment or .env.local.");
    console.log("To apply these changes automatically:");
    console.log("  1. Create an Editor or Admin token in your Sanity Manage dashboard (https://manage.sanity.io)");
    console.log("  2. Add SANITY_API_WRITE_TOKEN=your_token to .env.local");
    console.log("  3. Run: node scripts/update-sanity-projects.mjs");
    console.log("\nAlternatively, you can copy and paste the updated text below into your Sanity Studio at /admin-studio:\n");

    updatedProjects.forEach((p, idx) => {
      console.log(`--------------------------------------------------`);
      console.log(`[${idx + 1}] ${p.title} (ID: ${p._id})`);
      console.log(`Technologies: ${p.technologies.join(", ")}`);
      console.log(`Featured: ${p.featured ? "Yes" : "No"}`);
      console.log(`Description:\n${p.description}\n`);
    });
    return;
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: "2023-07-26",
    useCdn: false,
    token,
  });

  console.log("\nApplying patches to Sanity...");
  for (const p of updatedProjects) {
    try {
      await client
        .patch(p._id)
        .set({
          title: p.title,
          technologies: p.technologies,
          description: p.description,
          featured: p.featured,
        })
        .commit();
      console.log(`✓ Updated "${p.title}" (${p._id})`);
    } catch (err) {
      console.error(`✗ Failed to update "${p.title}":`, err?.message || err);
    }
  }
  console.log("\nDone updating Sanity projects!");
}

main().catch(console.error);
