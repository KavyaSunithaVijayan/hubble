import { Product } from "@/types/page";


export const products: Product[] = [
    {
        slug: "c41qs",
        name: "C41QS",
        category: "LPWA / NB-IoT",
        tagline: "Compact LPWA connectivity for low-power IoT",
        description:
            "C41QS is a compact LPWA IoT module supporting LTE Cat M1 and NB-IoT connectivity. With optional GNSS and integrated eSIM variants, it is designed for connected devices where low power consumption and compact size matter.",
        image:
            "https://d8wojkg2185gh.cloudfront.net/strapi/C41_QS_a3f9c78cdb.glb",
        productUrl:
            "https://www.cavliwireless.com/iot-modules/c-series/c41qs",
        specifications: {
            connectivity: "LTE Cat M1 / NB-IoT",
            speed: "NB2: 127 Kbps DL / 158.5 Kbps UL",
            gnss: "GPS / BeiDou",
            esim: "Optional integrated eSIM",
            formFactor: "LGA",
        },
        features: [
            "Ultra-low power consumption",
            "Integrated GNSS option",
            "Integrated eSIM option",
            "Global cellular bands",
            "Powered by Cavli Hubble",
        ],
    },

    {
        slug: "c10qm",
        name: "C10QM",
        category: "LTE Cat 1",
        tagline: "Reliable LTE connectivity for demanding IoT applications",
        description:
            "C10QM is an LTE Cat 1 IoT module designed for IoT and M2M applications including asset tracking, fleet management, e-mobility and environmental monitoring.",
        image:
            "https://d8wojkg2185gh.cloudfront.net/strapi/C41_QS_a3f9c78cdb.glb",
        productUrl:
            "https://www.cavliwireless.com/iot-modules/c-series/c10qm",
        specifications: {
            connectivity: "LTE Cat 1",
            speed: "10 Mbps DL / 5 Mbps UL",
            gnss: "GPS / GLONASS / BeiDou / Galileo / QZSS",
            esim: "Optional integrated eSIM",
            formFactor: "LGA",
        },
        features: [
            "LTE Cat 1 connectivity",
            "Integrated GNSS",
            "2G fallback",
            "VoLTE support",
            "Cavli Hubble integration",
        ],
    },

    {
        slug: "c11qm",
        name: "C11QM",
        category: "LTE Cat 1",
        tagline: "Industrial LTE connectivity with integrated positioning",
        description:
            "C11QM is an LTE Cat 1 module designed for IoT and M2M applications with integrated GNSS, VoLTE, SMS support and multiple hardware interfaces.",
        image:
            "https://d8wojkg2185gh.cloudfront.net/strapi/C41_QS_a3f9c78cdb.glb",
        productUrl:
            "https://www.cavliwireless.com/iot-modules/c-series/c11qm",
        specifications: {
            connectivity: "LTE Cat 1 / 2G",
            speed: "10 Mbps DL / 5 Mbps UL",
            gnss: "GPS / GLONASS / BeiDou / Galileo / QZSS",
            esim: "Available variants",
            formFactor: "LGA",
        },
        features: [
            "In-built GNSS",
            "2G fallback",
            "VoLTE",
            "USB 2.0",
            "Multiple UART / SPI / I2C interfaces",
        ],
    },

    {
        slug: "c20qm",
        name: "C20QM",
        category: "LTE Cat 4",
        tagline: "High-speed cellular connectivity for IoT and M2M",
        description:
            "C20QM is an LTE Cat 4 module focused on higher data bandwidth while retaining features such as GNSS, optional eSIM and Hubble connectivity.",
        image:
            "https://d8wojkg2185gh.cloudfront.net/strapi/C41_QS_a3f9c78cdb.glb",
        productUrl:
            "https://www.cavliwireless.com/iot-modules/c-series/c20qm",
        specifications: {
            connectivity: "LTE Cat 4",
            speed: "150 Mbps DL / 50 Mbps UL",
            gnss: "GPS / GLONASS / BeiDou / Galileo / QZSS",
            esim: "Optional integrated eSIM",
            formFactor: "LGA",
        },
        features: [
            "LTE Cat 4 connectivity",
            "High-speed data",
            "Integrated GNSS",
            "Optional eSIM",
            "USB and LCD interfaces",
        ],
    },

    {
        slug: "cq16",
        name: "CQ16",
        category: "LTE Cat 1bis",
        tagline: "Efficient LTE connectivity in a compact module",
        description:
            "CQ16 is an LTE Cat 1bis module designed for compact connected products and IoT deployments requiring efficient cellular connectivity.",
        image:
            "https://d8wojkg2185gh.cloudfront.net/strapi/C41_QS_a3f9c78cdb.glb",
        productUrl:
            "https://www.cavliwireless.com/iot-modules/c-series/cq16",
        specifications: {
            connectivity: "LTE Cat 1bis",
            speed: "10 Mbps DL / 5 Mbps UL",
            gnss: "Variant dependent",
            esim: "Variant dependent",
            formFactor: "LGA",
        },
        features: [
            "LTE Cat 1bis",
            "Low power consumption",
            "USB 2.0",
            "DFOTA support",
            "Cavli Hubble integration",
        ],
    },
];

export function getProductBySlug(slug: string) {
    return products.find((product) => product.slug === slug);
}