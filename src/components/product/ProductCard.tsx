import Link from "next/link";
import { Product } from "@/types/page";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="border border-[#21334a] rounded-2xl bg-[#0D1B2D] transition-all duration-300 hover:-translate-y-3 "
    >
      <div className="p-6">
        <div className="w-full">
          <div className=" flex flex-col mx-auto text-center h-30 w-30 items-center justify-center rounded-2xl border border-white/10">
            <span className="text-3xl font-bold tracking-tight text-white/80">
              {product.name}
            </span>
          </div>
        </div>

        <p className="mt-4 text-xs font-medium text-[#56D6C0]">
          {product?.tagline}
        </p>

        <p className="mt-4 line-clamp-3 text-sm leading-6 text-white/50">
          {product?.description}
        </p>

        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm text-white/40">Explore product</span>

          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60 transition group-hover:border-[#ff651e]/50 group-hover:text-[#ff651e]">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
