import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ConsultForm from "@/components/ConsultForm";
import ProductDetail from "@/components/product/ProductDetail";
import { getProductBySlug, products } from "@/lib/products";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return products?.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product not found",
    };
  }

  return {
    title: `${product.name} | Cavli Wireless`,
    description: product.tagline,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <ProductDetail
        product={{
          name: product.name,
          tagline: product.tagline,
          description: product.description,
          category: product.category,
          image: product.image,
          modelUrl: product.image,

          details: {
            badges: [product.category],

            formFactors: [product.specifications.formFactor],

            highlights: product.features,

            specs: [
              {
                label: "Connectivity",
                value: product.specifications.connectivity,
              },
              {
                label: "Speed",
                value: product.specifications.speed,
              },
              {
                label: "GNSS",
                value: product.specifications.gnss,
              },
              {
                label: "eSIM",
                value: product.specifications.esim,
              },
              {
                label: "Form Factor",
                value: product.specifications.formFactor,
              },
            ],

            specifications: [
              {
                label: "Connectivity",
                value: product.specifications.connectivity,
              },
              {
                label: "Speed",
                value: product.specifications.speed,
              },
              {
                label: "GNSS",
                value: product.specifications.gnss,
              },
              {
                label: "eSIM",
                value: product.specifications.esim,
              },
              {
                label: "Form Factor",
                value: product.specifications.formFactor,
              },
            ],

            useCases: product.features,

            resources: [
              {
                label: "View product on Cavli Wireless",
                url: product.productUrl,
              },
            ],
          },
        }}
      />

      <div
        id="consult"
        className="mx-auto max-w-7xl px-10 pb-24 scroll-mt-24 sm:px-0"
      >
        <ConsultForm />
      </div>
    </>
  );
}
