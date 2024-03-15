"use client"
import qs from "query-string";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CategoryItemProps {
    label: string;
    value: string;
    courses: number;
}

const CategoryItem = ({ label, value, courses }: CategoryItemProps) => {

    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentCategoryId = searchParams.get("categoryId");
    const currentTitle = searchParams.get("title");
    const isSelective = currentCategoryId === value;

    const onClick = () => {
        const url = qs.stringifyUrl({
            url: pathname,
            query: {
                title: currentTitle,
                categoryId: isSelective ? null : value,
            }
        }, { skipNull: true, skipEmptyString: true });
        router.push(url);
    };

    return (
        <Button onClick={onClick} type="button" variant={'outline'} className={cn(
            "py-2 text-black/75 px-3 text-sm border border-slate-200 flex items-center gap-x-1 hover:border-sky-700 transition",
            isSelective && "border-sky-700 bg-sky-200/20 text-sky-800"
        )} >
            <div className="truncate">
                {label}
            </div>
            <p className="text-gray-700" >
                {`(${courses})`}
            </p>
        </Button>
    );
};

export default CategoryItem;