import Image from 'next/image';
import { urlFor } from '@/lib/sanity.client';
import { PortableTextComponents } from '@portabletext/react';

export const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) {
        return null;
      }
      return (
        <figure className="my-12">
          <div className="relative aspect-video overflow-hidden rounded-2xl">
            <Image
              src={urlFor(value).width(1200).height(675).url()}
              alt={value.alt || 'Blog image'}
              fill
              className="object-cover"
            />
          </div>
          {value.caption && (
            <figcaption className="mt-4 text-center text-sm text-gray-600 italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    code: ({ value }) => {
      return (
        <div className="my-8">
          <pre className="bg-gray-900 text-gray-100 rounded-2xl p-6 overflow-x-auto">
            <code className="text-sm font-mono">{value.code}</code>
          </pre>
        </div>
      );
    },
  },
  block: {
    h1: ({ children }) => (
      <h1 className="text-5xl md:text-6xl font-bold text-black leading-tight tracking-tight mt-16 mb-8">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-4xl md:text-5xl font-bold text-black leading-tight tracking-tight mt-16 mb-6">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-3xl md:text-4xl font-bold text-black leading-tight mt-12 mb-4">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-2xl md:text-3xl font-bold text-black leading-tight mt-10 mb-4">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="text-lg text-gray-900 leading-relaxed mb-6">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-emerald-600 pl-6 my-8 italic text-xl text-gray-900 leading-relaxed">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-none space-y-3 my-8 ml-6">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal space-y-3 my-8 ml-6 marker:text-emerald-600 marker:font-bold">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="flex items-start gap-3 text-lg text-gray-900 leading-relaxed">
        <span className="flex-shrink-0 w-2 h-2 bg-emerald-600 rounded-full mt-2.5" />
        <span>{children}</span>
      </li>
    ),
    number: ({ children }) => (
      <li className="text-lg text-gray-900 leading-relaxed ml-2">{children}</li>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-bold text-black">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="bg-gray-100 text-emerald-700 px-2 py-1 rounded text-base font-mono">
        {children}
      </code>
    ),
    link: ({ children, value }) => {
      const rel = !value.href.startsWith('/')
        ? 'noreferrer noopener'
        : undefined;
      const target = value.blank ? '_blank' : undefined;
      return (
        <a
          href={value.href}
          rel={rel}
          target={target}
          className="text-emerald-600 hover:text-emerald-700 underline decoration-2 underline-offset-2 hover:underline-offset-4 transition-all font-medium"
        >
          {children}
        </a>
      );
    },
  },
};
