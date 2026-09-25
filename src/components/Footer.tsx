import { prisma } from "../lib/prisma";

export default async function Footer() {
  const products = await prisma.product.findMany();
  const exhibitors = await prisma.exhibitor.findMany({ take: 10 });

  return (
    <div className="px-15 py-10 border-t border-[#21334a]">
      <div className=" grid gap-8 md:grid-cols-2 max-w-7xl mx-auto">
        <div>
          <div className="text-lg font-bold">HUBBLE</div>
          <p className="mt-2 max-w-md text-sm">
            Sample full-stack implementation using Next.js, PostgreSQL and
            Prisma.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold">Products</h2>
          <ul className="text-sm py-3">
            {products?.map((p) => (
              <li key={p?.id} className="py-1">
                {/* <Link href={`/products/${p.slug}`}>{p.name}</Link> */}
                {p?.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
