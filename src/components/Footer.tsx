import { db } from "@/lib/prisma";

export default async function Footer() {
  const exhibitors = await db.exhibitor.findMany({
    take: 10,

    orderBy: {
      companyName: "asc",
    },

    select: {
      id: true,
      companyName: true,

      Country: {
        select: {
          name: true,
        },
      },

      boothNo: true,
      hallNo: true,
    },
  });

  return (
    <footer className="border-t border-[#21334a] bg-gray-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-6 text-lg font-semibold">Exhibitors</h2>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {exhibitors.map((exhibitor) => (
            <div key={exhibitor.id}>
              <p className="text-sm font-medium">{exhibitor.companyName}</p>

              {exhibitor.Country?.name && (
                <p className="text-xs text-gray-400">
                  {exhibitor.Country.name}
                </p>
              )}

              {exhibitor.boothNo && (
                <p className="text-xs text-gray-400">
                  Booth: {exhibitor.boothNo}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
