import { db } from "@/lib/prisma";

const MMI_GRAPHQL_URL = "https://mmiconnect.in/graphql";

const GROUP = "ep-blr-2026";
const PAGE_SIZE = 100;

const QUERY = `
  query getExhibitorListForGroup(
    $where: [WhereExpression!]
    $first: Int
    $after: Int
    $categoryIds: [Int]
    $keyword: String
    $group: String
  ) {
    catalogueQueries {
      exhibitorsWithWishListGroup(
        first: $first
        where: $where
        after: $after
        categoryIds: $categoryIds
        keyword: $keyword
        group: $group
      ) {
        totalCount

        exhibitors {
          customer {
            id
            companyName
            country
            squareLogo
            userId
            showId

            exhibitorDetail {
              exhibitorType
              sponsorship
              boothNo
              hallNo
            }

            show {
              showName
              startDate
              endDate
            }
          }
        }
      }
    }
  }
`;

type MmiCustomer = {
    id: number;
    companyName: string;
    country: string | null;
    squareLogo: string | null;
    userId: string | null;
    showId: number;

    exhibitorDetail: {
        exhibitorType: string | null;
        sponsorship: string | null;
        boothNo: string | null;
        hallNo: string | null;
    } | null;

    show: {
        showName: string;
        startDate: string | null;
        endDate: string | null;
    } | null;
};

type MmiResponse = {
    data?: {
        catalogueQueries?: {
            exhibitorsWithWishListGroup?: {
                totalCount: number;
                exhibitors: Array<{
                    customer: MmiCustomer | null;
                }>;
            };
        };
    };

    errors?: Array<{
        message: string;
    }>;
};

function parseDate(value: string | null | undefined): Date {
    if (!value) {
        return new Date();
    }

    const date = new Date(value);

    return Number.isNaN(date.getTime()) ? new Date() : date;
}

async function fetchExhibitors(after: number) {
    const response = await fetch(MMI_GRAPHQL_URL, {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },

        body: JSON.stringify({
            operationName: "getExhibitorListForGroup",

            variables: {
                where: [],
                group: GROUP,
                first: PAGE_SIZE,
                after,
            },

            query: QUERY,
        }),

        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error(
            `MMI request failed: ${response.status} ${response.statusText}`,
        );
    }

    const json = (await response.json()) as MmiResponse;

    if (json.errors?.length) {
        throw new Error(
            json.errors.map((error) => error.message).join(", "),
        );
    }

    const result =
        json.data?.catalogueQueries?.exhibitorsWithWishListGroup;

    if (!result) {
        throw new Error("Invalid response from MMI GraphQL API");
    }

    return result;
}

export async function scrapeMmiExhibitors() {
    const allExhibitors: MmiCustomer[] = [];

    let after = -1;
    let totalCount = 0;

    /*
     * ---------------------------------------------------------
     * 1. Fetch all exhibitors from MMI
     * ---------------------------------------------------------
     */

    while (true) {
        const result = await fetchExhibitors(after);

        totalCount = result.totalCount;

        if (!result.exhibitors.length) {
            break;
        }

        for (const item of result.exhibitors) {
            if (item.customer) {
                allExhibitors.push(item.customer);
            }
        }

        console.log(
            `MMI scraper: fetched ${allExhibitors.length}/${totalCount}`,
        );

        if (allExhibitors.length >= totalCount) {
            break;
        }

        /*
         * MMI pagination starts at -1.
         * Move forward by the number of records returned.
         */
        after += result.exhibitors.length;
    }

    /*
     * ---------------------------------------------------------
     * 2. Create/update Show records
     * ---------------------------------------------------------
     *
     * Existing DB schema:
     *
     * Show {
     *   id
     *   name
     *   startDate
     *   endDate
     * }
     *
     * MMI showId is used directly as Show.id.
     */

    const uniqueShows = new Map<number, MmiCustomer["show"]>();

    for (const exhibitor of allExhibitors) {
        if (exhibitor.show) {
            uniqueShows.set(exhibitor.showId, exhibitor.show);
        }
    }

    let showsSaved = 0;

    for (const [showId, show] of uniqueShows) {
        if (!show) {
            continue;
        }

        await db.show.upsert({
            where: {
                id: showId,
            },

            update: {
                name: show.showName,
                startDate: parseDate(show.startDate),
                endDate: parseDate(show.endDate),
            },

            create: {
                id: showId,
                name: show.showName,
                startDate: parseDate(show.startDate),
                endDate: parseDate(show.endDate),
            },
        });

        showsSaved++;
    }

    /*
     * ---------------------------------------------------------
     * 3. Create/update exhibitors
     * ---------------------------------------------------------
     *
     * Existing DB schema:
     *
     * Exhibitor {
     *   id
     *   companyName
     *   countryId
     *   showId
     *   squareLogo
     *   userId
     *   boothNo
     *   hallNo
     * }
     *
     * We use MMI customer.id as Exhibitor.id.
     */

    let saved = 0;
    let skipped = 0;
    let countriesCreated = 0;

    for (const customer of allExhibitors) {
        /*
         * Make sure the Show exists.
         */
        const show = await db.show.findUnique({
            where: {
                id: customer.showId,
            },
        });

        if (!show) {
            console.warn(
                `Skipping exhibitor ${customer.id}: show ${customer.showId} not found`,
            );

            skipped++;
            continue;
        }

        /*
         * -------------------------------------------------------
         * Country
         * -------------------------------------------------------
         *
         * MMI gives us:
         *
         * country: "India"
         *
         * Your DB uses:
         *
         * Country {
         *   id
         *   name
         * }
         *
         * So create/find the country first.
         */

        let countryId: number | null = null;

        const countryName = customer.country?.trim();

        if (countryName) {
            const country = await db.country.upsert({
                where: {
                    name: countryName,
                },

                update: {},

                create: {
                    name: countryName,
                },
            });

            countryId = country.id;

            /*
             * This is only approximate counting because upsert
             * doesn't tell us whether the record was newly created.
             */
            countriesCreated++;
        }

        /*
         * -------------------------------------------------------
         * Exhibitor
         * -------------------------------------------------------
         */

        await db.exhibitor.upsert({
            where: {
                id: customer.id,
            },

            update: {
                companyName: customer.companyName.trim(),
                countryId,
                squareLogo: customer.squareLogo,
                userId: customer.userId,
                showId: show.id,

                boothNo:
                    customer.exhibitorDetail?.boothNo ?? null,

                hallNo:
                    customer.exhibitorDetail?.hallNo ?? null,
            },

            create: {
                id: customer.id,
                companyName: customer.companyName.trim(),
                countryId,
                squareLogo: customer.squareLogo,
                userId: customer.userId,
                showId: show.id,

                boothNo:
                    customer.exhibitorDetail?.boothNo ?? null,

                hallNo:
                    customer.exhibitorDetail?.hallNo ?? null,
            },
        });

        saved++;
    }

    /*
     * ---------------------------------------------------------
     * 4. Return scraper result
     * ---------------------------------------------------------
     */

    return {
        success: true,
        group: GROUP,

        totalCount,
        fetched: allExhibitors.length,

        showsSaved,
        exhibitorsSaved: saved,
        skipped,

        countriesProcessed: countriesCreated,
    };
}