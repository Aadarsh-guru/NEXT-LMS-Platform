import prisma from "./prisma";

interface PurchasesResult {
    total_purchases: number;
    total_revenue: number;
};

interface UsersResult {
    total: number;
};

const getPurchasesData = async () => {
    try {

        const dailyData: PurchasesResult[] = await prisma.$queryRaw`
    SELECT
        COUNT(*)::INTEGER AS total_purchases,
        SUM(price)::DECIMAL AS total_revenue
    FROM
        "Purchase"
    WHERE
        "createdAt" >= CURRENT_DATE
`;

        const weeklyData: PurchasesResult[] = await prisma.$queryRaw`
    SELECT
        COUNT(*)::INTEGER AS total_purchases,
        SUM(price)::DECIMAL AS total_revenue
    FROM
        "Purchase"
    WHERE
        "createdAt" >= CURRENT_DATE - INTERVAL '1 week'
        AND "createdAt" < CURRENT_DATE
`;

        const monthlyData: PurchasesResult[] = await prisma.$queryRaw`
    SELECT
        COUNT(*)::INTEGER AS total_purchases,
        SUM(price)::DECIMAL AS total_revenue
    FROM
        "Purchase"
    WHERE
        "createdAt" >= CURRENT_DATE - INTERVAL '1 month'
        AND "createdAt" < CURRENT_DATE
`;

        const allTimeData: PurchasesResult[] = await prisma.$queryRaw`
    SELECT
        COUNT(*)::INTEGER AS total_purchases,
        SUM(price)::DECIMAL AS total_revenue
    FROM
        "Purchase"
`;

        const result: {
            daily: { total_purchases: number; total_revenue: number };
            weekly: { total_purchases: number; total_revenue: number };
            monthly: { total_purchases: number; total_revenue: number };
            allTime: { total_purchases: number; total_revenue: number };
        } = {
            daily: {
                total_purchases: Number(dailyData[0].total_purchases),
                total_revenue: Number(dailyData[0].total_revenue)
            },
            weekly: {
                total_purchases: Number(weeklyData[0].total_purchases),
                total_revenue: Number(weeklyData[0].total_revenue)
            },
            monthly: {
                total_purchases: Number(monthlyData[0].total_purchases),
                total_revenue: Number(monthlyData[0].total_revenue)
            },
            allTime: {
                total_purchases: Number(allTimeData[0].total_purchases),
                total_revenue: Number(allTimeData[0].total_revenue)
            }
        };

        return result;
    } catch (error) {
        throw error;
    }
};


const getUsersData = async () => {
    try {
        const dailyData: UsersResult[] = await prisma.$queryRaw`
        SELECT
          COUNT(*)::INTEGER AS total
        FROM
          "User"
        WHERE
          "createdAt" >= CURRENT_DATE
      `;

        const weeklyData: UsersResult[] = await prisma.$queryRaw`
        SELECT
          COUNT(*)::INTEGER AS total
        FROM
          "User"
        WHERE
          "createdAt" >= CURRENT_DATE - INTERVAL '1 week'
          AND "createdAt" < CURRENT_DATE
      `;

        const monthlyData: UsersResult[] = await prisma.$queryRaw`
        SELECT
          COUNT(*)::INTEGER AS total
        FROM
          "User"
        WHERE
          "createdAt" >= CURRENT_DATE - INTERVAL '1 month'
          AND "createdAt" < CURRENT_DATE
      `;

        const allTimeData: UsersResult[] = await prisma.$queryRaw`
        SELECT
          COUNT(*)::INTEGER AS total
        FROM
          "User"
      `;
        const result: {
            daily: number;
            weekly: number;
            monthly: number;
            allTime: number;
        } = {
            daily: dailyData[0].total,
            weekly: weeklyData[0].total,
            monthly: monthlyData[0].total,
            allTime: allTimeData[0].total,
        };
        return result;
    } catch (error) {
        throw error;
    }
};


export {
    getPurchasesData,
    getUsersData,
};