import { Metadata } from "next";
import prisma from "@/lib/prisma";
import CoursesList from "@/components/courses/CoursesList";
import SearchInput from "@/components/shared/SearchInput";
import CategoryItem from "@/components/categories/CategoryItem";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Home - ${process.env.NEXT_PUBLIC_APP_NAME || 'Aadarsh Guru'}`,
};

interface HomePageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
};

const HomePage = async ({ searchParams }: HomePageProps) => {

  const categories = await prisma.category.findMany({
    orderBy: {
      createdAt: "desc"
    },
    include: {
      courses: {
        where: {
          isPublished: true
        },
        select: {
          id: true
        }
      }
    }
  });

  const categoriesWithCoursesCountFormatted = categories.map(category => ({
    ...category,
    courses: category.courses.length
  }));

  const courses = await prisma.course.findMany({
    where: {
      isPublished: true,
      title: {
        contains: searchParams.title,
      },
      categoryId: searchParams.categoryId,
    },
    include: {
      category: true,
      chapters: {
        where: {
          isPublished: true
        },
        select: {
          id: true
        },
      },
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
          {categoriesWithCoursesCountFormatted.map((item, index) => (
            <CategoryItem
              key={index}
              label={item.name}
              value={item.id}
              courses={item.courses}
            />
          ))}
        </div>
        <CoursesList
          items={courses}
        />
      </div>
    </>
  )
};

export default HomePage;