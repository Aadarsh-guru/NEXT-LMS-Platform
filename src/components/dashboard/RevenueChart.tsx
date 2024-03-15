"use client";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueChartProps {
    data: {
        daily: {
            total_purchases: number;
            total_revenue: number;
        };
        weekly: {
            total_purchases: number;
            total_revenue: number;
        };
        monthly: {
            total_purchases: number;
            total_revenue: number;
        };
        allTime: {
            total_purchases: number;
            total_revenue: number;
        };
    }
};

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
    const chartData = [
        { name: 'Day', ...data.daily },
        { name: 'Week', ...data.weekly },
        { name: 'Month', ...data.monthly },
        { name: 'All', ...data.allTime },
    ];

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} >
                <XAxis dataKey={'name'} />
                <Tooltip />
                <Bar dataKey="total_purchases" stackId="a" fill="#6b7280 " name="Purchases" />
                <Bar dataKey="total_revenue" stackId="a" fill="#60a5fa" activeBar name="Revenue" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default RevenueChart;