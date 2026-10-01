export type Product = {
    slug: string;
    name: string;
    category: string;
    tagline: string;
    description: string;
    image: string;
    productUrl: string;
    specifications: {
        connectivity: string;
        speed: string;
        gnss: string;
        esim: string;
        formFactor: string;
    };
    features: string[];
};