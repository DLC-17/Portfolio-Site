import { createClient, groq } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import type { Image } from 'sanity'

const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
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

// ✅ Fetch Blog Posts
export const fetchPosts = async () => {
  return await sanityClient.fetch(
    groq`*[_type == "post"] | order(publishedAt desc){
      _id,
      title,
      slug,
      excerpt,
      author,
      categories,
      mainImage,
      body,
      publishedAt
    }`
  )
}

// ✅ Fetch Individual Photos
export const fetchPhotos = async () => {
  return await sanityClient.fetch(
    groq`*[_type == "photo"] | order(takenAt desc){
      _id,
      title,
      slug,
      image{
        asset->{
          _id,
          url
        },
        alt
      },
      location,
      takenAt,
      tags
    }`
  )
}

// ✅ Fetch Photo Groups (Events)
export const fetchPhotoGroups = async () => {
  return await sanityClient.fetch(
    groq`*[_type == "photoGroup"]{
      _id,
      title,
      description,
      photos[]->{
        _id,
        title,
        slug,
        image{
          asset->{
            _id,
            url
          },
          alt
        },
        location,
        takenAt,
        tags
      }
    }`
  )
}
