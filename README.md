# David Coleman - Developer Portfolio

A highly interactive, modern developer portfolio and blog built with Next.js 16, React 19, and Sanity CMS. Designed to showcase production-grade engineering, complete with an integrated AI avatar powered by Gemini 2.5 Flash, interactive WebGL backgrounds, and a global command palette.

## 🚀 Key Features

- **Integrated AI Avatar:** A custom chatbot powered by Google Gemini 2.5 Flash. It acts as an interactive persona grounded in David's real-world engineering experience to answer recruiter and client questions, complete with rate-limiting and streaming responses.
- **Sanity CMS Integration:** Fully headless content management for the Resume, Featured Projects, and Developer Blog. Supports real-time updates, custom `PortableText` rendering, and rich code-block syntax highlighting (`@sanity/code-input`).
- **Interactive WebGL Background:** Uses Three.js and React Three Fiber to render 3,000 floating particles that dynamically transition from a scattered sphere to a solid cube based on the user's scroll position. (Dynamically downscales to 800 particles on mobile for 60fps performance).
- **Global Command Palette:** Hit `Cmd + K` anywhere on the site to trigger a Spotlight-style menu for instant navigation, theme toggling, and opening the AI chat.
- **Modern UI & Animations:** Built with Tailwind CSS v4, Framer Motion (for spring physics and "scramble" text effects), and custom Lucide React iconography.
- **Serverless Contact Form:** Secure contact API route utilizing `Resend` for transactional emails, complete with honeypot spam protection.

## 🛠 Tech Stack

- **Framework:** Next.js 16 (App Router) & React 19
- **Styling:** Tailwind CSS v4, `tailwindcss-animate`, `@tailwindcss/typography`
- **Animations & 3D:** Framer Motion, Three.js, `@react-three/fiber`, `@react-three/drei`
- **CMS:** Sanity Studio & `next-sanity`
- **AI / LLM:** `@google/genai` (Gemini 2.5 Flash)
- **Email:** Resend
- **Deployment:** Vercel (Recommended)

## 💻 Getting Started

This project uses **npm** for dependency management.

1. **Clone and install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```
   *(Note: `--legacy-peer-deps` is required for React 19 compatibility with React Three Fiber)*

2. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   # Sanity Configuration
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_REVALIDATE_SECRET=your_webhook_secret

   # AI Configuration
   GEMINI_API_KEY=your_gemini_api_key

   # Contact Form (Resend)
   RESEND_API_KEY=your_resend_api_key
   CONTACT_EMAIL=your_receiving_email@domain.com
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser.

4. **Access the CMS:**
   Navigate to [http://localhost:3000/admin-studio](http://localhost:3000/admin-studio) to manage projects, blog posts, and your resume PDF directly from the browser.

## 📈 Production Deployment

This project is optimized for deployment on Vercel. Be sure to:
1. Add all environment variables to your Vercel project settings.
2. Set up a Sanity webhook pointing to `https://your-domain.com/api/revalidate` with your secret to enable on-demand ISR cache clearing when you publish new content.
3. Verify your production domains in `src/app/api/chat/route.ts` to ensure the AI Chatbot accepts requests from your live URL.