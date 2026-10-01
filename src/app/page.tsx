"use client";

import ConsultForm from "@/components/ConsultForm";
import ProductCard from "@/components/product/ProductCard";
import { products } from "@/lib/products";
import { useEffect, useState } from "react";

const LINE1 = "Connect. Manage. Scale";
const LINE2A = "with ";
const LINE2B = "Cavli.";
const TOTAL = LINE1.length + LINE2A.length + LINE2B.length;

export default function Home() {
  const [count, setCount] = useState(0);

  const featuredProducts = products?.slice(0, 3);

  useEffect(() => {
    if (count >= TOTAL) return;
    const t = setTimeout(() => setCount((c) => c + 1), 70);
    return () => clearTimeout(t);
  }, [count]);

  const l1 = LINE1.slice(0, count);
  const l2a = LINE2A.slice(0, Math.max(0, count - LINE1.length));
  const l2b = LINE2B.slice(
    0,
    Math.max(0, count - LINE1.length - LINE2A.length),
  );
  const cursor = (
    <span className="ml-1 inline-block h-[0.9em] w-[3px] translate-y-[0.1em] animate-pulse bg-[#4FD1C5]" />
  );

  return (
    <div className="px-10 py-20 md:px-15 md:py-24">
      <div className="mx-auto max-w-7xl">
        <p className="mb-4 text-sm uppercase tracking-wide text-[#4FD1C5]">
          Cellular IoT, Simplified
        </p>

        <h1
          aria-label="Connect. Manage. Scale with Cavli."
          className="min-h-[2.5em] text-4xl font-semibold leading-tight md:text-6xl"
        >
          <span aria-hidden="true">
            {l1}
            {count <= LINE1.length && cursor}
            <br />
            {l2a}
            <span className="text-[#4FD1C5]">{l2b}</span>
            {count > LINE1.length && cursor}
          </span>
        </h1>

        <p className="mt-5 max-w-xl text-sm sm:text-md text-justify text-[#9ca9ba]">
          Seamless cellular connectivity and intelligent IoT solutions designed
          to connect devices, simplify deployment, and power the next generation
          of connected products.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="/products"
            className="rounded-md bg-[#56D6C0] px-5 py-3 font-medium text-white hover:bg-[#4bc7b2]"
          >
            Explore Products
          </a>
        </div>
      </div>

      <div
        id="products"
        className="mx-auto mt-24 max-w-7xl scroll-mt-24 sm:mt-36"
      >
        <h4 className="py-5 text-md uppercase text-[#56D6C0]">Products</h4>

        <span className="text-xl sm:text-2xl font-semibold">
          Explore Cavli Products
        </span>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredProducts?.map((product) => (
            <ProductCard key={product?.slug} product={product} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <a
            href="/products"
            className="rounded-md text-[#56D6C0] px-5 py-3 font-medium hover:text-[#247a6c] "
          >
            Explore More →
          </a>
        </div>
      </div>

      <div
        id="consult"
        className="mx-auto mt-24 max-w-7xl scroll-mt-24 sm:mt-36"
      >
        <ConsultForm />
      </div>
    </div>
  );
}
