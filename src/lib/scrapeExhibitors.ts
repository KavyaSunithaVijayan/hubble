import { prisma } from "../lib/prisma";

const ENDPOINT = "https://mmiconnect.in/graphql";
const GROUP = "ep-blr-2026";
const PAGE_SIZE = 100;

const QUERY = `query getProductListForGroup($where: [WhereExpression!], $first: Int, $after: Int, $group: String) {
  catalogueQueries {
    likedProduct(first: $first, where: $where, after: $after, group: $group) {
      totalCount
      products {
        product {
          id
          productName
          productType
          productImage
          specialType
          showId
          exhibitor { id }
        }
      }
    }
  }
}`;

type ApiProduct = {
    id: number;
    productName: string;
    productType: string | null;
    productImage: string | null;
    specialType: string | null;
    showId: number;
    exhibitor: { id: number };
};

type ApiPage = {
    totalCount: number;
    products: { product: ApiProduct }[];
};

async function fetchPage(after: number): Promise<ApiPage> {
    const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            operationName: "getProductListForGroup",
            query: QUERY,
            variables: { where: [], first: PAGE_SIZE, after, group: GROUP },
        }),
    });
    if (!res.ok) throw new Error(`MMI API returned ${res.status}`);
    const json = await res.json();
    if (json.errors) throw new Error(JSON.stringify(json.errors));
    return json.data.catalogueQueries.likedProduct;
}

export async function scrapeExhibitorProducts() {
    // 1. Fetch every page
    const all = new Map<number, ApiProduct>();
    let after = -1;
    let total = Infinity;

    while (all.size < total) {
        const page = await fetchPage(after);
        total = page.totalCount;
        if (page.products.length === 0) break;

        const sizeBefore = all.size;
        for (const p of page.products) all.set(p.product.id, p.product);
        if (all.size === sizeBefore) break; // nothing new, stop to avoid a loop
        after += page.products.length;
    }

    const products = [...all.values()];

    // 2. Save products, linked to their exhibitor
    for (const p of products) {
        const data = {
            productName: p.productName.trim(),
            productType: p.productType,
            productImage: p.productImage,
            specialType: p.specialType,
            showId: p.showId,
            exhibitorId: p.exhibitor.id,
        };
        await prisma.exhibitorProduct.upsert({
            where: { id: p.id },
            update: data,
            create: { id: p.id, ...data },
        });
    }

    return { fetched: products.length, reportedTotal: total };
}