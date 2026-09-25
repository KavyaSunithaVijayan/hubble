import { MoveRight } from "lucide-react";
import Link from "next/link";

type Product = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
};

export default function ProductCard({ products }: { products: Product[] }) {
  if (products?.length === 0) {
    return <p className="py-6 text-[#9ca9ba]">No products yet.</p>;
  }

  return (
    <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products?.map((p) => (
        <Link
          key={p?.id}
          href={`/products/${p?.slug}`}
          className="rounded-xl border border-gray-400 p-6 hover:border-[#56D6C0] bg-white/5 transition-all duration-300 ease-out hover:-translate-y-1"
        >
          <h3 className="text-xl font-semibold">{p?.name}</h3>
          <p className="mt-2 text-[#56D6C0]">{p?.tagline}</p>
          <span className="mt-4 text-sm font-medium text-[#9ca9ba] flex items-center gap-3">
            View details <MoveRight size={15} />
          </span>
        </Link>
      ))}
    </div>
  );
}
