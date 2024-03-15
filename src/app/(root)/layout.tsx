import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import Sidebar from "@/components/shared/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="h-full">
            <header className="h-20 md:pl-56 fixed inset-y-0 w-full z-50" >
                <Navbar />
            </header>
            <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
                <Sidebar />
            </div>
            <main className="md:pl-56 pt-20 min-h-full" >
                {children}
            </main>
            <footer className="w-full md:pl-56 relative bottom-0 border-t" >
                <Footer />
            </footer>
        </div>
    );
};
