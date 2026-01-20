import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';

// Check if Sanity is configured
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

export const client = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion: '2024-01-01',
      useCdn: true,
    })
  : null;

// Image URL builder
const builder = client ? imageUrlBuilder(client) : null;

export function urlFor(source: any) {
  if (!builder) {
    console.warn('Sanity client not configured. Add NEXT_PUBLIC_SANITY_PROJECT_ID to environment variables.');
    // Return a mock builder that supports chaining
    const mockBuilder: any = {
      url: () => '',
      width: () => mockBuilder,
      height: () => mockBuilder,
      fit: () => mockBuilder,
      auto: () => mockBuilder,
      quality: () => mockBuilder,
    };
    return mockBuilder;
  }
  return builder.image(source);
}

// Queries
export async function getAllPosts() {
  if (!client) return [];
  return client.fetch(`
    *[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      "author": author->{name, image},
      "categories": categories[]->{title, slug},
      mainImage,
      readingTime
    }
  `);
}

export async function getPostBySlug(slug: string) {
  if (!client) return null;
  return client.fetch(
    `
    *[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      "author": author->{name, slug, image, bio},
      "categories": categories[]->{title, slug},
      mainImage,
      body,
      seo,
      readingTime
    }
  `,
    { slug }
  );
}

export async function getAllCategories() {
  if (!client) return [];
  return client.fetch(`
    *[_type == "category"] | order(title asc) {
      _id,
      title,
      slug,
      description
    }
  `);
}

export async function getPostsByCategory(categorySlug: string) {
  if (!client) return [];
  return client.fetch(
    `
    *[_type == "post" && references(*[_type=="category" && slug.current == $categorySlug]._id)] | order(publishedAt desc) {
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      "author": author->{name, image},
      "categories": categories[]->{title, slug},
      mainImage,
      readingTime
    }
  `,
    { categorySlug }
  );
}

export async function getRecentPosts(limit: number = 3) {
  if (!client) return [];
  return client.fetch(
    `
    *[_type == "post"] | order(publishedAt desc) [0...${limit}] {
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      "author": author->{name, image},
      mainImage,
      readingTime
    }
  `
  );
}
