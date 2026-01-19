import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';
import { getAllPosts, getPostBySlug, urlFor } from '@/lib/sanity.client';
import { Post } from '@/lib/sanity.types';
import Navigation from '@/components/Navigation';
import Footer from '@/components/sections/Footer';
import Button from '@/components/Button';
import { portableTextComponents } from '@/components/blog/PortableTextComponents';

// Generate static params for all posts
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post: Post) => ({
    slug: post.slug.current,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post: Post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post no encontrado | Lexy',
    };
  }

  const metaTitle = post.seo?.metaTitle || post.title;
  const metaDescription = post.seo?.metaDescription || post.excerpt || '';
  const ogImage = post.seo?.ogImage
    ? urlFor(post.seo.ogImage).width(1200).height(630).url()
    : post.mainImage
    ? urlFor(post.mainImage).width(1200).height(630).url()
    : undefined;

  return {
    title: `${metaTitle} | Lexy`,
    description: metaDescription,
    keywords: post.seo?.keywords?.join(', '),
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      images: ogImage ? [{ url: ogImage }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export const revalidate = 60; // Revalidate every 60 seconds

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post: Post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <Navigation />
      <main className="bg-white">
        {/* Hero Section */}
        <article className="pt-32 pb-20 px-6">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="mb-8">
              <Link
                href="/blog"
                className="text-sm text-gray-600 hover:text-emerald-600 transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Volver al blog
              </Link>
            </nav>

            {/* Categories */}
            {post.categories && post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.categories.map((category) => (
                  <span
                    key={category._id}
                    className="px-3 py-1 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full"
                  >
                    {category.title}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-black leading-tight tracking-tight mb-8">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-12 text-gray-600">
              {post.author.image && (
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                  <Image
                    src={urlFor(post.author.image).width(48).height(48).url()}
                    alt={post.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="font-medium text-black">{post.author.name}</span>
                <span>·</span>
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                {post.readingTime && (
                  <>
                    <span>·</span>
                    <span>{post.readingTime} min lectura</span>
                  </>
                )}
              </div>
            </div>

            {/* Main Image */}
            {post.mainImage && (
              <div className="relative aspect-video overflow-hidden rounded-2xl mb-16 border border-black/5">
                <Image
                  src={urlFor(post.mainImage).width(1200).height(675).url()}
                  alt={post.mainImage.alt || post.title}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <PortableText value={post.body} components={portableTextComponents} />
            </div>

            {/* CTA Section */}
            <div className="mt-20 p-12 bg-emerald-50 rounded-2xl border-2 border-emerald-200 text-center">
              <h3 className="text-3xl font-bold text-black mb-4">
                ¿Listo para generar contratos legales en 30 segundos?
              </h3>
              <p className="text-lg text-gray-900 mb-8 max-w-2xl mx-auto">
                Prueba Lexy gratis durante 14 días. Sin tarjeta de crédito.
                Acceso inmediato a todas las funciones.
              </p>
              <Button
                variant="primary"
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-12 py-4 rounded-full font-medium shadow-lg hover:shadow-emerald-600/30 transition-all"
              >
                Construir mi primer contrato gratis
              </Button>
            </div>

            {/* Author Bio */}
            {post.author.bio && (
              <div className="mt-16 pt-12 border-t border-black/10">
                <div className="flex items-start gap-6">
                  {post.author.image && (
                    <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={urlFor(post.author.image).width(80).height(80).url()}
                        alt={post.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h4 className="text-xl font-bold text-black mb-2">
                      {post.author.name}
                    </h4>
                    <div className="text-base text-gray-900 leading-relaxed">
                      <PortableText value={post.author.bio} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Related Links */}
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-black mb-8">
              Sigue explorando
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/"
                className="px-6 py-3 border-2 border-gray-300 hover:border-emerald-600 text-black hover:text-emerald-600 font-medium rounded-full transition-all"
              >
                Volver a inicio
              </Link>
              <Link
                href="/blog"
                className="px-6 py-3 border-2 border-gray-300 hover:border-emerald-600 text-black hover:text-emerald-600 font-medium rounded-full transition-all"
              >
                Ver todos los artículos
              </Link>
              <Link
                href="/#precios"
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full shadow-lg transition-all"
              >
                Ver precios
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
