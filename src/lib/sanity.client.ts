import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Sanity project configuration
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 's5r9o1yx';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = '2024-01-01';

// Create Sanity client
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production', // Use CDN in production for faster response
  perspective: 'published', // Only return published documents
});

// Image URL builder helper
const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// Helper function to get all blog posts
export async function getAllPosts() {
  try {
    const posts = await client.fetch(
      `*[_type == "post"] | order(publishedAt desc) {
        _id,
        title,
        slug,
        excerpt,
        publishedAt,
        mainImage,
        "author": author->name,
        "categories": categories[]->title
      }`
    );
    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

// Helper function to get a single post by slug
export async function getPostBySlug(slug: string) {
  try {
    const post = await client.fetch(
      `*[_type == "post" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        excerpt,
        publishedAt,
        mainImage,
        body,
        "author": author->{name, image},
        "categories": categories[]->title
      }`,
      { slug }
    );
    return post;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}
