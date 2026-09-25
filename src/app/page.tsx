import ConsultForm from "@/components/ConsultForm";
import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const products = await prisma.product.findMany();
  return (
    <div className="px-10 py-20 md:px-15 md:py-24">
      <div className="max-w-7xl mx-auto">
        <h4 className="text-[#56D6C0] text-md py-5 uppercase">
          Connected intelligence
        </h4>
        <h1 className="text-4xl font-semibold leading-tight md:text-6xl">
          Build what's next with Hubble.
        </h1>
        <p className="mt-5 max-w-xl text-base text-[#9ca9ba] md:text-md text-justify">
          A sample responsive landing page demonstrating product routing,
          database-backed exhibitor information and a working consultation flow.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#products"
            className="rounded-md bg-[#56D6C0] px-5 py-3 font-medium text-white"
          >
            Explore Products
          </a>
        </div>
      </div>
      <div id="products" className="mt-36 max-w-7xl mx-auto scroll-mt-24">
        <h4 className="text-[#56D6C0] text-md py-5 uppercase">Products</h4>
        <span className="text-2xl font-semibold">Explore Hubble</span>
        <ProductCard products={products} />
      </div>

      <div id="consult" className="mt-36 max-w-7xl mx-auto scroll-mt-24">
        <ConsultForm />
      </div>
    </div>
  );
}
