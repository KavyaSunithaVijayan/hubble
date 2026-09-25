import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ConsultBody = {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    message?: string;
};

export async function POST(req: Request) {
    try {
        const body: ConsultBody = await req.json();

        const name = body.name?.trim();
        const email = body.email?.trim();
        const phone = body.phone?.trim() || null;
        const company = body.company?.trim() || null;
        const message = body.message?.trim();

        if (!name || !email || !message) {
            return NextResponse.json(
                {
                    error: "Name, email, and message are required.",
                },
                { status: 400 }
            );
        }

        if (!EMAIL_REGEX.test(email)) {
            return NextResponse.json(
                {
                    error: "Please enter a valid email address.",
                },
                { status: 400 }
            );
        }

        const consult = await prisma.consultRequest.create({
            data: {
                name,
                email,
                phone,
                company,
                message,
            },
        });

        return NextResponse.json(
            {
                success: true,
                id: consult.id,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("CONSULT API ERROR:", error);

        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Something went wrong. Please try again.",
            },
            { status: 500 }
        );
    }
}
