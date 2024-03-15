"use client";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface UsersChartProps {
    data: {
        daily: number;
        weekly: number;
        monthly: number;
        allTime: number;
    }
};


const UsersChart: React.FC<UsersChartProps> = ({ data }) => {
    const chartData = [
        { name: 'Day', users: data.daily },
        { name: 'Week', users: data.weekly },
        { name: 'Month', users: data.monthly },
        { name: 'All', users: data.allTime },
    ];

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <Tooltip />
                <Bar dataKey="users" fill="#60a5fa" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default UsersChart;
