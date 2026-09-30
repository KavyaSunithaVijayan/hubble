"use client";

import Link from "next/link";
import { MoveLeft } from "lucide-react";
import type { ProductDetails } from "@/lib/productDetails";
import Product3DViewer from "@/components/Product3DViewer";

type Props = {
  product: {
    name: string;
    tagline: string | null;
    description: string;
    category: string | null;
    image: string | null;
    modelUrl: string | null;
    details: ProductDetails | null;
  };
};

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mt-16 scroll-mt-24">
      <h2 className="mb-6 text-2xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export default function ProductDetail({ product }: Props) {
  console.log("PRODUCT:", {
    name: product.name,
    image: product.image,
    modelUrl: product.modelUrl,
  });

  const d = product.details;

  const badges = d?.badges ?? (product.category ? [product.category] : []);

  return (
    <div className="max-w-7xl mx-auto py-16 px-10 sm:px-0">
      <Link href="/">
        <div className="flex items-center gap-3 py-10">
          <MoveLeft size={15} />
          <h4>Back to Home</h4>
        </div>
      </Link>

      {/* Hero */}
      <div className="grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <h4 className="text-[#56D6C0] text-md py-5 uppercase">
            Cavli Product
          </h4>

          {badges.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {badges.map((b) => (
                <span
                  key={b}
                  className="rounded-full border border-[#56D6C0]/40 px-3 py-1 text-xs text-[#56D6C0]"
                >
                  {b}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            {product.name}
          </h1>

          {product.tagline && (
            <p className="text-md sm:text-lg text-[#9ca9ba] mb-4">
              {product.tagline}
            </p>
          )}

          {d && d.formFactors.length > 0 && (
            <p className="text-sm text-[#9ca9ba]">
              Available form factor: {d.formFactors.join(", ")}
            </p>
          )}

          <a
            href="#consult"
            className="mt-8 inline-block rounded-md bg-[#56D6C0] hover:bg-[#4bc7b2] px-5 py-3 font-medium text-white"
          >
            Consult Now
          </a>
        </div>

        {/* 3D MODEL */}
        <div id="3d-model" title="Explore in 3D">
          <Product3DViewer modelUrl={product.modelUrl} />
        </div>
      </div>

      {/* Anchor nav */}
      <nav className="mt-14 flex flex-wrap gap-6 border-b border-white/10 pb-3 text-sm text-[#9ca9ba]">
        <a href="#about" className="hover:text-white">
          About
        </a>

        <a href="#3d-model" className="hover:text-white">
          3D Model
        </a>

        {d && d.highlights.length > 0 && (
          <a href="#key-highlights" className="hover:text-white">
            Key Highlights
          </a>
        )}

        {d && d.specs.length > 0 && (
          <a href="#technical-data" className="hover:text-white">
            Technical Data
          </a>
        )}

        {d && d.useCases.length > 0 && (
          <a href="#applicable-industries" className="hover:text-white">
            Industries
          </a>
        )}

        {d?.variants && (
          <a href="#variants" className="hover:text-white">
            Variants
          </a>
        )}

        {d?.resources && (
          <a href="#resources" className="hover:text-white">
            Resources
          </a>
        )}
      </nav>

      {/* About */}
      <Section id="about" title={`About ${product.name}`}>
        <p className="max-w-3xl whitespace-pre-line text-sm leading-relaxed text-[#9ca9ba]">
          {product.description}
        </p>
      </Section>

      {d && (
        <>
          {/* Key Highlights */}
          {d.highlights.length > 0 && (
            <Section id="key-highlights" title="Key Highlights">
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {d.highlights.map((h) => (
                  <li
                    key={h}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                  >
                    {h}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* Technical Data */}
          {d.specs.length > 0 && (
            <Section id="technical-data" title="Technical Data">
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-left text-sm">
                  <tbody>
                    {d.specs.map((s) => (
                      <tr
                        key={s.label}
                        className="border-b border-white/10 last:border-0"
                      >
                        <th className="w-1/3 bg-white/5 px-4 py-3 align-top font-medium text-[#9ca9ba]">
                          {s.label}
                        </th>

                        <td className="whitespace-pre-line px-4 py-3">
                          {s.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="mt-2 text-xs text-[#9ca9ba]">
                * Optional feature. ** Requires SDK.
              </p>
            </Section>
          )}

          {/* Use Cases */}
          {d.useCases.length > 0 && (
            <Section
              id="applicable-industries"
              title="Use Cases Across IoT Applications"
            >
              <div className="flex flex-wrap gap-3">
                {d.useCases.map((u) => (
                  <span
                    key={u}
                    className="rounded-lg border border-white/10 px-4 py-2 text-sm"
                  >
                    {u}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* Variants */}
          {d.variants && (
            <Section id="variants" title="Available Variants">
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/5 text-[#9ca9ba]">
                    <tr>
                      {d.variants.columns.map((c) => (
                        <th key={c} className="px-4 py-3 font-medium">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {d.variants.rows.map((row, i) => (
                      <tr key={i} className="border-t border-white/10">
                        {row.map((cell, j) => (
                          <td key={j} className="px-4 py-3">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          )}

          {/* Resources */}
          {d.resources && (
            <Section id="resources" title="Downloadable Resources">
              <ul className="space-y-2 text-sm">
                {d.resources.map((r) => (
                  <li key={r.url}>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#56D6C0] underline"
                    >
                      {r.label}
                    </a>
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </>
      )}
    </div>
  );
}
