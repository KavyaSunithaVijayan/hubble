"use client";

import Link from "next/link";

export default function Header() {
  return (
    <div className="px-15 py-6 border-b border-[#21334a]">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Link href="/">
          <h1 className="font-bold text-2xl">Hubble</h1>
        </Link>
        <div className="flex items-center justify-between gap-8 text-md">
          <Link href="/#products">
            <span className="cursor-pointer hover:underline text-[#9ca9ba] hover:text-white">
              Products
            </span>
          </Link>
          <Link href="/#consult">
            <span className=" hover:text-white cursor-pointer text-[#9ca9ba]">
              Consult Now
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
