"use client";

import Link from "next/link";
import { MoveLeft } from "lucide-react";
import type { ProductDetails } from "@/lib/productDetails";
import Product3DViewer from "@/components/product/Product3DViewer";

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

      <div className="grid gap-10 md:grid-cols-2 md:items-center">
        <div id="3d-model" title="Explore in 3D">
          <Product3DViewer modelUrl={product.modelUrl} />
        </div>
        <div>
          {badges?.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {badges?.map((b) => (
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
            {product?.name}
          </h1>

          {product?.tagline && (
            <p className="text-md sm:text-lg text-[#9ca9ba] mb-4">
              {product?.tagline}
            </p>
          )}

          {d && d?.formFactors?.length > 0 && (
            <p className="text-sm text-[#9ca9ba]">
              Available form factor : {d.formFactors?.join(", ")}
            </p>
          )}
          <div className="py-5">
            <h3 className="font-semibold text-[#56D6C0]">
              About {product?.name}
            </h3>
            <p className="max-w-3xl whitespace-pre-line text-sm leading-relaxed text-[#9ca9ba] mt-4">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      {d && (
        <>
          {d.highlights?.length > 0 && (
            <div className="py-10">
              <h3 className="font-semibold text-[#56D6C0] py-6 uppercase">
                Key Highlights
              </h3>
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {d.highlights?.map((h) => (
                  <li
                    key={h}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                  >
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {d.specs?.length > 0 && (
            <div className="">
              <h3 className="font-semibold text-[#56D6C0] py-6 uppercase">
                specifications
              </h3>
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-left text-sm">
                  <tbody>
                    {d.specs?.map((s) => (
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
            </div>
          )}
        </>
      )}
    </div>
  );
}
