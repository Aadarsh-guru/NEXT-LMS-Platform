import Image from "next/image";
import Link from "next/link";
import { BookOpen, CheckCircle, IndianRupee } from "lucide-react";
import IconBadge from "../shared/IconBadge";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface CourseCardProps {
    id: string;
    title: string;
    imageUrl: string;
    chaptersLength: number;
    price: number;
    category: string;
    isCoursesPage?: boolean;
};

const CourseCard = ({
    id,
    title,
    imageUrl,
    chaptersLength,
    price,
    category,
    isCoursesPage,
}: CourseCardProps) => {

    return (
        <Link href={`/courses/${id}`}>
            <div className="group transition-all hover:shadow-md overflow-hidden border rounded-lg p-3 h-full">
                <div className="relative w-full aspect-video rounded-md overflow-hidden">
                    <Image
                        fill
                        className="object-cover"
                        alt={title}
                        src={imageUrl}
                    />
                </div>
                <div className="flex flex-col pt-2">
                    <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
                        {title}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {category}
                    </p>
                    <div className="my-3 flex items-center justify-between gap-x-2 text-sm md:text-xs">
                        <div className="flex items-center gap-x-1 text-slate-500">
                            <IconBadge variant={isCoursesPage ? 'success' : 'default'} size="sm" icon={isCoursesPage ? CheckCircle : IndianRupee} />
                            <span className={cn(
                                !isCoursesPage && "text-md md:text-sm font-medium text-slate-700",
                                isCoursesPage && "text-emerald-700"
                            )} >
                                {isCoursesPage ? "Purchased" : price}
                            </span>
                        </div>
                        <div className="flex items-center gap-x-1 text-slate-500">
                            <IconBadge size="sm" icon={BookOpen} />
                            <span>
                                {chaptersLength} {chaptersLength === 1 ? "Chapter" : "Chapters"}
                            </span>
                        </div>
                    </div>
                    <Link href={`/courses/${id}`} >
                        <Button className="w-full text-gray-700" variant={'outline'} >
                            {isCoursesPage ? "Start Course" : "View Course"}
                        </Button>
                    </Link>
                </div>
            </div>
        </Link>
    );
};

export default CourseCard;