import { Loader2 } from "lucide-react";

const loading = () => {
    return (
        <div className="w-full min-h-[calc(100vh-80px)] flex justify-center items-center">
            <Loader2 className="animate-spin text-blue-500 h-10 w-10" />
        </div>
    );
};

export default loading;