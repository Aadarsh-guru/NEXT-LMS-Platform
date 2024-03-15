import Link from "next/link";
import Image from "next/image";
import SidebarRoutes from "./SidebarRoutes";

const Sidebar = async () => {

    return (
        <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm">
            <div className="h-20 w-full flex items-center px-6 border-b">
                <Link className="w-full h-full flex gap-2 items-center" href={'/'} >
                    <Image
                        height={40}
                        width={40}
                        alt="logo"
                        className="rounded-full border-2 border-sky-700 border-opacity-75"
                        src={'/logo.png'}
                    />
                    <h2 className="text-xl font-bold text-sky-700 text-opacity-75" >EduFlex</h2>
                </Link>
            </div>
            <div className="flex flex-col w-full">
                <SidebarRoutes />
            </div>
        </div>
    );
};

export default Sidebar;