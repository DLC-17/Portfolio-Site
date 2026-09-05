import { createClient, groq } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import type { Image } from 'sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

if (!projectId || !dataset) {
  throw new Error(
    'Missing Sanity env: set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET'
  )
}

const config = {
  projectId,
  dataset,
  apiVersion: '2023-07-26',
  useCdn: true,
}

export const sanityClient = createClient(config)

const builder = imageUrlBuilder(sanityClient)
export const urlFor = (source: Image | any) => builder.image(source)

// ✅ Fetch Projects
export const fetchProjects = async () => {
  return await sanityClient.fetch(
    groq`*[_type == "project"] | order(publishedAt desc){
      _id,
      title,
      slug,
      description,
      technologies,
      demoUrl,
      githubUrl,
      mainImage,
      publishedAt
    }`
  )
}
//fetch projects labeled as featured
export const fetchFeaturedProjects = async () => {
  return await sanityClient.fetch(
    groq`*[_type == "project" && (featured == true || Featured == true)] | order(coalesce(publishedAt, _createdAt) desc){
      _id,
      title,
      slug,
      description,
      technologies,
      demoUrl,
      githubUrl,
      mainImage,
      publishedAt,
      featured
    }`
  )
}

export type ResumeData = {
  _id?: string;
  title?: string;
  fileUrl?: string;
  externalUrl?: string;
  lastUpdated?: string;
};

// ✅ Fetch Resume
export const fetchResume = async (): Promise<ResumeData | null> => {
  try {
    const data = await sanityClient.fetch(
      groq`*[_id in ["resume", "drafts.resume"] || _type == "resume"] | order(_updatedAt desc)[0]{
        _id,
        title,
        "fileUrl": resumeFile.asset->url,
        externalUrl,
        lastUpdated,
        "assetUploadedAt": resumeFile.asset->_createdAt,
        _updatedAt
      }`
    );

    if (!data) return null;

    // Automatically resolve the last updated day to the date of the asset file upload in Sanity
    const uploadIso = data.assetUploadedAt || data._updatedAt;
    const autoDate = uploadIso ? uploadIso.split("T")[0] : undefined;

    return {
      _id: data._id,
      title: data.title,
      fileUrl: data.fileUrl,
      externalUrl: data.externalUrl,
      lastUpdated: autoDate || data.lastUpdated,
    };
  } catch (error) {
    console.error("Error fetching resume from Sanity:", error);
    return null;
  }
};
