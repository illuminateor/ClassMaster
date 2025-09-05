import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { User, type BreadcrumbItem, type Category } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Courses',
        href: '/courses',
    },
    {
        title: 'Show',
        href: '/courses/show',
    },
];

interface Course {
    id: number;
    title: string;
    description: string;
    category_id: number;
    user: User;
    category: Category;
}

interface ShowProps {
    course: Course;
}

export default function Show({ course }: ShowProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Show" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <div className="flex items-center justify-end gap-2 md:flex-row">
                        <Button asChild>
                            <Link href="/courses">Back to courses</Link>
                        </Button>
                    </div>
                    <Card className="mt-4">
                        <CardHeader>
                            <CardTitle>{course.title}</CardTitle>
                            <CardDescription>{course?.category?.name}</CardDescription>
                            <CardDescription>By {course?.user?.name}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>{course.description}</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
