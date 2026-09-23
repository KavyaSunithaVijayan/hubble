import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
  });

  if (!product) notFound();

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
      {product.tagline && (
        <p className="text-xl text-gray-500 mb-8">{product.tagline}</p>
      )}
      <p className="text-lg leading-relaxed">{product.description}</p>
    </main>
  );
}
