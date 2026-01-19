import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts } from '@/lib/sanity.client';
import { urlFor } from '@/lib/sanity.client';
import { Post } from '@/lib/sanity.types';
import Navigation from '@/components/Navigation';
import Footer from '@/components/sections/Footer';

export const metadata: Metadata = {
  title: 'Blog | Lexy - Asistente Legal IA',
  description: 'Artículos sobre legalidad, contratos, IA en el sector inmobiliario español. Guías completas validadas por abogados.',
  keywords: 'blog legal, contratos IA, legalidad inmobiliaria, guías legales',
};

export const revalidate = 60; // Revalidate every 60 seconds

export default async function BlogPage() {
  const posts: Post[] = await getAllPosts();

  return (
    <>
      <Navigation />
      <main className="bg-white">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6 bg-white">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-sm font-medium tracking-wide uppercase text-gray-900 mb-6">
              Blog Lexy
            </p>
            <h1 className="text-6xl md:text-7xl font-bold text-black leading-tight tracking-tight mb-6">
              Legalidad, IA y Contratos
            </h1>
            <p className="text-xl text-gray-900 max-w-2xl mx-auto">
              Guías completas sobre validez legal, normativa vigente y cómo
              funciona la IA en contratos inmobiliarios.
            </p>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="py-20 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {posts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-gray-900 mb-6">
                  No hay artículos publicados todavía.
                </p>
                <p className="text-base text-gray-600">
                  Pronto publicaremos contenido sobre legalidad y contratos IA.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                {posts.map((post) => (
                  <Link
                    key={post._id}
                    href={`/blog/${post.slug.current}`}
                    className="group"
                  >
                    <article className="bg-white rounded-2xl overflow-hidden border border-black/5 hover:border-emerald-600/20 transition-all hover:shadow-lg">
                      {/* Image */}
                      {post.mainImage && (
                        <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                          <Image
                            src={urlFor(post.mainImage).width(800).height(450).url()}
                            alt={post.mainImage.alt || post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}

                      {/* Content */}
                      <div className="p-8">
                        {/* Meta */}
                        <div className="flex items-center gap-3 mb-4 text-sm text-gray-600">
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

                        {/* Title */}
                        <h2 className="text-2xl font-bold text-black mb-3 leading-tight group-hover:text-emerald-600 transition-colors">
                          {post.title}
                        </h2>

                        {/* Excerpt */}
                        {post.excerpt && (
                          <p className="text-base text-gray-900 leading-relaxed mb-4">
                            {post.excerpt}
                          </p>
                        )}

                        {/* Categories */}
                        {post.categories && post.categories.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {post.categories.map((category) => (
                              <span
                                key={category._id}
                                className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full"
                              >
                                {category.title}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Read More */}
                        <div className="mt-6 flex items-center gap-2 text-emerald-600 font-medium">
                          <span>Leer artículo</span>
                          <svg
                            className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
