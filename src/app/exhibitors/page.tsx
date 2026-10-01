import Link from "next/link";
import { db } from "@/lib/prisma";
import ExhibitorCard from "@/components/ExhibitorCard";

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
      <div className="mx-auto max-w-7xl px-4 sm:px-0">
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight md:text-6xl">
          Exhibitor
          <span className="text-[#4FD1C5]"> Directory</span>
        </h1>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-10 sm:py-20 sm:px-0 md:py-24">
        {exhibitors.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/3 px-6 py-16 text-center">
            <p className="text-white/50">No exhibitors found.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-15 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {exhibitors?.map((exhibitor) => (
                <ExhibitorCard key={exhibitor.id} exhibitor={exhibitor} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-16 flex flex-col items-center gap-4">
                <div className="flex w-full items-center justify-center gap-1 overflow-x-auto px-2 sm:gap-2 sm:px-0">
                  {currentPage > 1 ? (
                    <Link
                      href={`/exhibitors?page=${currentPage - 1}`}
                      className="flex shrink-0 items-center justify-center rounded-lg border border-white/10 px-3 py-2 text-xs text-white/70 transition hover:border-[#56D6C0]/50 hover:text-[#56D6C0] sm:px-4 sm:text-sm"
                    >
                      <span className="sm:hidden">←</span>
                      <span className="hidden sm:inline">← Previous</span>
                    </Link>
                  ) : (
                    <span className="flex shrink-0 cursor-not-allowed items-center justify-center rounded-lg border border-white/5 px-3 py-2 text-xs text-white/20 sm:px-4 sm:text-sm">
                      <span className="sm:hidden">←</span>
                      <span className="hidden sm:inline">← Previous</span>
                    </span>
                  )}

                  <div className="flex shrink-0 items-center gap-1 sm:gap-2">
                    {Array.from({ length: totalPages }, (_, index) => index + 1)
                      .filter((page) => {
                        if (typeof window === "undefined") {
                          return true;
                        }

                        return true;
                      })
                      .map((page) => {
                        const isActive = page === currentPage;

                        const showMobile =
                          page === 1 ||
                          page === totalPages ||
                          Math.abs(page - currentPage) <= 1;

                        return (
                          <Link
                            key={page}
                            href={`/exhibitors?page=${page}`}
                            className={`
                  ${showMobile ? "flex" : "hidden sm:flex"}
                  h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-xs transition
                  sm:h-10 sm:w-10 sm:text-sm
                  ${
                    isActive
                      ? "border-[#56D6C0] bg-[#56D6C0] text-[#050505]"
                      : "border-white/10 text-white/60 hover:border-[#56D6C0]/50 hover:text-[#56D6C0]"
                  }
                `}
                          >
                            {page}
                          </Link>
                        );
                      })}
                  </div>

                  {currentPage < totalPages ? (
                    <Link
                      href={`/exhibitors?page=${currentPage + 1}`}
                      className="flex shrink-0 items-center justify-center rounded-lg border border-white/10 px-3 py-2 text-xs text-white/70 transition hover:border-[#56D6C0]/50 hover:text-[#56D6C0] sm:px-4 sm:text-sm"
                    >
                      <span className="sm:hidden">→</span>
                      <span className="hidden sm:inline">Next →</span>
                    </Link>
                  ) : (
                    <span className="flex shrink-0 cursor-not-allowed items-center justify-center rounded-lg border border-white/5 px-3 py-2 text-xs text-white/20 sm:px-4 sm:text-sm">
                      <span className="sm:hidden">→</span>
                      <span className="hidden sm:inline">Next →</span>
                    </span>
                  )}
                </div>

                <p className="text-center text-xs text-white/30 sm:text-sm">
                  Showing{" "}
                  <span className="text-white/50">
                    {skip + 1}–
                    {Math.min(skip + exhibitors.length, totalExhibitors)}
                  </span>{" "}
                  of <span className="text-white/50">{totalExhibitors}</span>{" "}
                  exhibitors
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
