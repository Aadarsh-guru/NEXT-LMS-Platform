"use client";
import { Lock, PlayCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface CourseSidebarItemProps {
    label: string;
    id: string;
    courseId: string;
    isLocked: boolean;
};

const CourseSidebarItem = ({
    label,
    id,
    courseId,
    isLocked,
}: CourseSidebarItemProps) => {

    const pathname = usePathname();
    const router = useRouter();

    const Icon = isLocked ? Lock : PlayCircle;
    const isActive = pathname?.includes(id);

    const onClick = () => {
        if (!isLocked) {
            router.push(`/courses/${courseId}/chapters/${id}`);
        }
    };

    return (
        <button
            onClick={onClick}
            type="button"
            className={cn(
                "flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
                isActive && "text-slate-700 bg-slate-200/20 hover:bg-slate-200/20 hover:text-slate-700",
            )}
        >
            <div className="flex items-center gap-x-2 py-4">
                <Icon
                    size={22}
                    className={cn(
                        "text-slate-500",
                    )}
                />
                {label}
            </div>
            <div className={cn(
                "ml-auto opacity-0 border-2 border-slate-700 h-full transition-all",
            )} />
        </button>
    );
};

export default CourseSidebarItem;