"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="border-b border-[#21334a] bg-gray-950 px-8 py-6 sm:px-15">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" onClick={closeMenu}>
          <h1 className="text-xl font-bold uppercase">Cavli Wireless</h1>
        </Link>

        <nav className="hidden items-center gap-8 text-sm sm:flex sm:text-md">
          <Link
            href="/exhibitors"
            className="relative uppercase text-[#9ca9ba] transition-colors hover:text-[#56D6C0] after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-white after:transition-transform after:duration-500 hover:after:scale-x-100"
          >
            Exhibitor
          </Link>

          <Link
            href="/products"
            className="relative uppercase text-[#9ca9ba] transition-colors hover:text-[#56D6C0] after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-white after:transition-transform after:duration-500 hover:after:scale-x-100"
          >
            Products
          </Link>

          <Link
            href="/#consult"
            className="relative uppercase text-[#9ca9ba] transition-colors hover:text-[#56D6C0] after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-white after:transition-transform after:duration-500 hover:after:scale-x-100"
          >
            Consult Now
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-[#9ca9ba] transition-colors hover:text-[#56D6C0] sm:hidden"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {isOpen && (
        <nav className="mx-auto mt-6 flex max-w-7xl flex-col gap-5 border-t border-[#21334a] pt-6 sm:hidden">
          <Link
            href="/exhibitors"
            onClick={closeMenu}
            className="uppercase text-[#9ca9ba] transition-colors hover:text-[#56D6C0]"
          >
            Exhibitor
          </Link>

          <Link
            href="/products"
            onClick={closeMenu}
            className="uppercase text-[#9ca9ba] transition-colors hover:text-[#56D6C0]"
          >
            Products
          </Link>

          <Link
            href="/#consult"
            onClick={closeMenu}
            className="uppercase text-[#9ca9ba] transition-colors hover:text-[#56D6C0]"
          >
            Consult Now
          </Link>
        </nav>
      )}
    </header>
  );
}
