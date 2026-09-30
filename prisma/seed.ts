import { prisma } from "../src/lib/prisma";
import products from "./cavli-products.json";

async function main() {
    await prisma.product.deleteMany({
        where: { slug: { notIn: products.map((p) => p.slug) } },
    });

    for (const product of products) {
        await prisma.product.upsert({
            where: { slug: product.slug },
            update: product,
            create: product,
        });
    }

    console.log(`Seeded ${products.length} products`);
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());