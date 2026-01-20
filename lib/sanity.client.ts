import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
});

// Image URL builder
const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}

// Queries
export async function getAllPosts() {
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
