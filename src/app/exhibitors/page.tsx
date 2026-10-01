import Link from "next/link";
import { db } from "@/lib/prisma";
import ExhibitorCard from "@/components/ExhibitorCard";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 24;

type ExhibitorsPageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function ExhibitorsPage({
  searchParams,
}: ExhibitorsPageProps) {
  const params = await searchParams;

  const currentPage = Math.max(1, Number.parseInt(params.page || "1", 10) || 1);

  const skip = (currentPage - 1) * PAGE_SIZE;

  const [exhibitors, totalExhibitors] = await Promise.all([
    db.exhibitor.findMany({
      skip,
      take: PAGE_SIZE,

      orderBy: {
        companyName: "asc",
      },

      select: {
        id: true,
        companyName: true,
        squareLogo: true,

        boothNo: true,
        hallNo: true,

        Country: {
          select: {
            name: true,
          },
        },

        show: {
          select: {
            name: true,
            startDate: true,
            endDate: true,
          },
        },
      },
    }),

    db.exhibitor.count(),
  ]);

  const totalPages = Math.ceil(totalExhibitors / PAGE_SIZE);

  return (
    <div className="px-10 py-20 md:py-24">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-semibold leading-tight md:text-6xl">
          Exhibitor
          <span className="text-[#4FD1C5]"> Directory</span>
        </h1>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-0 md:py-24">
        {exhibitors.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/3 px-6 py-16 text-center">
            <p className="text-white/50">No exhibitors found.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-15 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {exhibitors.map((exhibitor) => (
                <ExhibitorCard key={exhibitor.id} exhibitor={exhibitor} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-16 flex items-center justify-center gap-2">
                {currentPage > 1 ? (
                  <Link
                    href={`/exhibitors?page=${currentPage - 1}`}
                    className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:border-[#56D6C0]/50 hover:text-[#56D6C0]"
                  >
                    ← Previous
                  </Link>
                ) : (
                  <span className="cursor-not-allowed rounded-lg border border-white/5 px-4 py-2 text-sm text-white/20">
                    ← Previous
                  </span>
                )}

                <div className="flex items-center gap-2">
                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1,
                  ).map((page) => {
                    const isActive = page === currentPage;

                    return (
                      <Link
                        key={page}
                        href={`/exhibitors?page=${page}`}
                        className={`flex h-10 w-10 items-center justify-center rounded-lg border text-sm transition ${
                          isActive
                            ? "border-[#56D6C0] bg-[#56D6C0] text-[#050505]"
                            : "border-white/10 text-white/60 hover:border-[#56D6C0]/50 hover:text-[#56D6C0]"
                        }`}
                      >
                        {page}
                      </Link>
                    );
                  })}
                </div>

                {currentPage < totalPages ? (
                  <Link
                    href={`/exhibitors?page=${currentPage + 1}`}
                    className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:border-[#56D6C0]/50 hover:text-[#56D6C0]"
                  >
                    Next →
                  </Link>
                ) : (
                  <span className="cursor-not-allowed rounded-lg border border-white/5 px-4 py-2 text-sm text-white/20">
                    Next →
                  </span>
                )}
              </div>
            )}

            <p className="mt-6 text-center text-sm text-white/30">
              Showing{" "}
              <span className="text-white/50">
                {skip + 1}–{Math.min(skip + exhibitors.length, totalExhibitors)}
              </span>{" "}
              of <span className="text-white/50">{totalExhibitors}</span>{" "}
              exhibitors
            </p>
          </>
        )}
      </div>
    </div>
  );
}
