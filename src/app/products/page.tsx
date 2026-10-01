import ProductCard from "@/components/product/ProductCard";
import { products } from "@/lib/products";

export default async function ProductListing() {
  return (
    <div className="px-10 py-20 md:py-24">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-semibold leading-tight md:text-6xl">
          Cavli
          <span className="text-[#4FD1C5]"> Products</span>
        </h1>
      </div>

      <div className="mx-auto max-w-7xl py-20 px-5 sm:px-0 md:py-24">
        {products?.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/3 px-6 py-16 text-center">
            <p className="text-white/50">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-15">
            {products?.map((product) => (
              <ProductCard key={product?.slug} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
