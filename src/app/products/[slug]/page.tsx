import { prisma } from "@/lib/prisma";
import { MoveLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await prisma?.product?.findUnique({
    where: { slug },
  });

  if (!product) notFound();
  console.log("product", product);

  return (
    <div>
      <div className="max-w-7xl mx-auto py-16 px-10 sm:px-0">
        <Link href="/">
          <div className="flex items-center gap-3 py-10">
            <MoveLeft size={15} />
            <h4>Back to Home</h4>
          </div>
        </Link>
        <h4 className="text-[#56D6C0] text-md py-5 uppercase">
          Hubble Product
        </h4>
        <h1 className="text-4xl font-bold mb-4">{product?.name}</h1>
        {product?.tagline && (
          <p className="text-lg text-[#9ca9ba] mb-8">{product?.tagline}</p>
        )}
        <p className="text-sm leading-relaxed text-[#9ca9ba]">
          {product?.description}
        </p>
      </div>
    </div>
  );
}
