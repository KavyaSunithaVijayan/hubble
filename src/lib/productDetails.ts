export type ProductDetails = {
    badges: string[];
    formFactors: string[];
    highlights: string[];
    specs: { label: string; value: string }[];
    useCases: string[];
    variants?: { columns: string[]; rows: string[][] };
    resources?: { label: string; url: string }[];
};