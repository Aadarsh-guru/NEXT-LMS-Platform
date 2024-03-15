"use client"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { useSearchParams, usePathname, useRouter } from "next/navigation"
import qs from "query-string";
import useDebounce from "@/hooks/useDebounce"

const SearchInput = () => {

    const [value, setValue] = useState("");
    const debouncedValue = useDebounce(value, 1000);

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentCategoryId = searchParams.get("categoryId");

    useEffect(() => {
        const url = qs.stringifyUrl({
            url: pathname,
            query: {
                categoryId: currentCategoryId,
                title: debouncedValue,
            },
        }, { skipNull: true, skipEmptyString: true });
        router.push(url);
    }, [debouncedValue, currentCategoryId, router, pathname]);

    return (
        <div className="relative">
            <Search className="h-4 w-4 absolute top-3 left-3 text-slate-600" />
            <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full md:w-[300px] pl-9 rounded-md bg-slate-100 focus-visible:ring-slate-200"
                placeholder="Search for courses.."
            />
        </div>
    );
};

export default SearchInput;