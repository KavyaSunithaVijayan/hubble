type Exhibitor = {
  id: number;
  companyName: string;
  squareLogo: string | null;

  Country: {
    name: string;
  } | null;

  boothNo: string | null;
  hallNo: string | null;

  show: {
    name: string;
    startDate: Date;
    endDate: Date;
  };
};

type Props = {
  exhibitor: Exhibitor;
};

export default function ExhibitorCard({ exhibitor }: Props) {
  const companyName = exhibitor.companyName.trim();

  const initials = companyName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    ?.map((word) => word[0])
    ?.join("")
    .toUpperCase();

  return (
    <div className="border border-[#21334a] rounded-xl px-3 py-4">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white">
        {exhibitor?.squareLogo ? (
          <img
            src={exhibitor?.squareLogo}
            alt={`${companyName} logo`}
            className="h-full w-full object-contain p-2"
          />
        ) : (
          <span className="text-lg font-bold text-[#ff651e]">{initials}</span>
        )}
      </div>

      <div className="relative mt-5">
        <h3 className="line-clamp-2 min-h-14 text-base font-semibold leading-7 text-white">
          {companyName}
        </h3>

        {exhibitor?.Country?.name && (
          <p className="mt-1 text-sm text-white/45">
            {exhibitor?.Country?.name}
          </p>
        )}
      </div>

      <div className="relative mt-5 space-y-2.5 border-t border-white/10 pt-4">
        {exhibitor?.show?.name && (
          <div className="flex items-start justify-between gap-4 text-sm">
            <span className="shrink-0 text-white/40">Show</span>

            <span className="text-right text-xs leading-5 text-white/60">
              {exhibitor?.show?.name}
            </span>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#ff651e] transition-all duration-300 group-hover:w-full" />
    </div>
  );
}
