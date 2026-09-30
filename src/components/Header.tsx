"use client";

import Link from "next/link";

export default function Header() {
  return (
    <div className="px-8 sm:px-15 py-6 border-b border-[#21334a]  bg-gray-950">
      <div className="flex justify-between items-center max-w-7xl mx-auto gap-8">
        <Link href="/">
          <h1 className="font-bold text-xl uppercase">Cavli Wireless</h1>
        </Link>
        <div className="flex items-center justify-between gap-8 text-sm sm:text-md">
          <Link
            href="/exhibitors"
            className=" uppercase relative text-[#9ca9ba] hover:text-[#56D6C0] after:absolute after:left-0 after:bottom-0 after:h-px after:w-full after:bg-white after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition-transform after:duration-500"
          >
            Exhibitor
          </Link>
          <Link
            href="/#products"
            className="uppercase relative text-[#9ca9ba] hover:text-[#56D6C0] after:absolute after:left-0 after:bottom-0 after:h-px after:w-full after:bg-white after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition-transform after:duration-500"
          >
            Products
          </Link>

          <Link href="/#consult">
            <span className="uppercase relative text-[#9ca9ba] hover:text-[#56D6C0] after:absolute after:left-0 after:bottom-0 after:h-px after:w-full after:bg-white after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition-transform after:duration-500">
              Consult Now
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
