import { Link } from '@inertiajs/react';
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';

interface Course {
    id: number;
    title: string;
    description: string;
    thumbnail: string;
    category: {
        name: string;
    };
    user: {
        name: string;
    };
}

export default function CourseItem({ course }: { course: Course }) {
    // Truncate description to 50 characters
    const shortDescription = course.description.length > 50 ? course.description.slice(0, 50) + '...' : course.description;

    return (
        <Link href={`/courses/${course.id}`} className="inline-block text-sm leading-normal text-[#1b1b18] dark:text-[#EDEDEC]">
            <Card className="border-[#19140035] pt-0 leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]">
                <div>
                    <img
                        src={course.thumbnail ? `/storage/${course.thumbnail}` : '/php-course.jpg'}
                        alt={course.title}
                        className="mr-2 inline-block h-auto w-full"
                    />
                </div>
                <CardHeader>
                    <div className="flex justify-between">
                        <div className="flex flex-col gap-1">
                            <CardTitle className="text-xl">{course.title}</CardTitle>
                            <CardDescription>{shortDescription}</CardDescription>
                            <CardDescription>By {course.user.name}</CardDescription>
                        </div>
                        <div className="flex flex-col justify-end">
                            <span className="font-semibold">$20,00</span>
                        </div>
                    </div>
                </CardHeader>
            </Card>
        </Link>
    );
}
