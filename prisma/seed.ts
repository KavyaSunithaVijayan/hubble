import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const products = [
        {
            name: "Smart Locking System",
            slug: "smart-locking-system",
            tagline: "Keyless access, fully connected",
            description: "A wireless smart lock system for commercial and residential use, integrated with Hubble's cloud dashboard.",
        },
        {
            name: "Asset Tracker",
            slug: "asset-tracker",
            tagline: "Know where everything is, always",
            description: "Real-time GPS and BLE-based asset tracking for logistics and warehouse management.",
        },
        {
            name: "Environmental Sensor",
            slug: "environmental-sensor",
            tagline: "Monitor temperature, humidity, and air quality",
            description: "Wireless sensors that stream live environmental data to the Hubble platform.",
        },
        {
            name: "Fleet Manager",
            slug: "fleet-manager",
            tagline: "End-to-end fleet visibility",
            description: "A dashboard and device suite for tracking and managing vehicle fleets in real time.",
        },
        {
            name: "Energy Monitor",
            slug: "energy-monitor",
            tagline: "Cut costs with real-time energy insights",
            description: "IoT-based energy consumption monitoring for commercial buildings.",
        },
    ];

    for (const product of products) {
        await prisma.product.upsert({
            where: { slug: product.slug },
            update: {},
            create: product,
        });
    }
}

main()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });