import { db } from "@/lib/prisma";
import ExhibitorCard from "@/components/ExhibitorCard";

export const dynamic = "force-dynamic";

export default async function ExhibitorsPage() {
  const exhibitors = await db.exhibitor?.findMany({
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
  });

  return (
    <div className="px-10 py-20 md:py-24">
      <div className="max-w-7xl mx-auto">
        <h4 className="text-[#56D6C0] text-md py-5 uppercase ">
          MMI Connect Exhibitors
        </h4>
        <h1 className="text-4xl font-semibold leading-tight md:text-6xl">
          Exhibitor
          <span className="text-[#56D6C0]"> Directory</span>
        </h1>
      </div>

      <div className="mx-auto max-w-7xl py-20 px-5 sm:px-0 md:py-24">
        {exhibitors?.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/3 px-6 py-16 text-center">
            <p className="text-white/50">No exhibitors found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-15">
            {exhibitors?.map((exhibitor) => (
              <ExhibitorCard key={exhibitor.id} exhibitor={exhibitor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
