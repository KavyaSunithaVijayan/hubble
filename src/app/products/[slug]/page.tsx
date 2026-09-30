import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ConsultForm from "@/components/ConsultForm";
import ProductDetail from "@/components/ProductDetail";
import { db } from "@/lib/prisma";
import type { ProductDetails } from "@/lib/productDetails";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const product = await db.product.findUnique({
    where: { slug },
  });

  if (!product) {
    return {
      title: "Product not found",
    };
  }

  return {
    title: `${product.name} | Cavli Wireless`,
    description: product.tagline ?? undefined,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  const product = await db.product.findUnique({
    where: { slug },
  });

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
          modelUrl: product.modelUrl,
          details: product.details as unknown as ProductDetails | null,
        }}
      />

      <div
        id="consult"
        className="max-w-7xl mx-auto px-10 sm:px-0 pb-24 scroll-mt-24"
      >
        <ConsultForm />
      </div>
    </>
  );
}
