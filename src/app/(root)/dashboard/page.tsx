import { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import { getPurchasesData, getUsersData } from "@/lib/queries";
import RevenueChart from "@/components/dashboard/RevenueChart";
import UsersChart from "@/components/dashboard/UsersChart";

export const metadata: Metadata = {
    title: `Dashboard - Analytics`,
};

const AnalyticsPage = async () => {

    const revenueData = await getPurchasesData();
    const usersData = await getUsersData();

    return (
        <div className="p-6">
            <div className="w-full flex items-center">
                <h3 className="font-bold text-xl lg:text-2xl text-blue-400" >Sells & Revenue</h3>
            </div>
            <div className="mt-5 md:mt-8 w-full md:w-[70%] md:mx-auto">
                <RevenueChart data={revenueData} />
            </div>
            <Separator className="mt-4" />
            <div className="w-full mt-4 flex items-center">
                <h3 className="font-bold text-xl lg:text-2xl text-blue-400" >Users Signup</h3>
            </div>
            <div className="mt-5 md:mt-8 w-full md:w-[70%] md:mx-auto">
                <UsersChart data={usersData} />
            </div>
        </div>
    );
};

export default AnalyticsPage;