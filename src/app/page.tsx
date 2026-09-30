
import ConsultForm from "@/components/ConsultForm";
import ProductCard from "@/components/ProductCard";
import { db } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const FEATURED_SLUGS = [
  "hubble-platform",
  "cqm220",
  "cqm211",
  "c41qs",
  "c16qs",
];

export default async function Home() {
  const found = await db.product.findMany({
    where: { slug: { in: FEATURED_SLUGS } },
  });
  const products = FEATURED_SLUGS.map((slug) =>
    found.find((p) => p.slug === slug),
  ).filter((p): p is (typeof found)[number] => Boolean(p));

  return (
    <div className="px-10 py-20 md:px-15 md:py-24">
      <div className="max-w-7xl mx-auto">
        <h4 className="text-[#56D6C0] text-md py-5 uppercase">
          Connected intelligence
        </h4>
        <h1 className="text-4xl font-semibold leading-tight md:text-6xl">
          Build what's next with Hubble.
        </h1>
        <p className="mt-5 max-w-xl text-[#9ca9ba] text-md text-justify">
          A sample responsive landing page demonstrating product routing,
          database-backed exhibitor information and a working consultation flow.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#products"
            className="rounded-md bg-[#56D6C0] hover:bg-[#4bc7b2] px-5 py-3 font-medium text-white"
          >
            Explore Products
          </a>
        </div>
      </div>
      <div
        id="products"
        className="mt-24 sm:mt-36 max-w-7xl mx-auto scroll-mt-24"
      >
        <h4 className="text-[#56D6C0] text-md py-5 uppercase">Products</h4>
        <span className="text-2xl font-semibold">Explore Cavli products</span>
        <ProductCard products={products} />
      </div>

      <div
        id="consult"
        className="mt-24 sm:mt-36 max-w-7xl mx-auto scroll-mt-24"
      >
        <ConsultForm />
      </div>
    </div>
  );
}
