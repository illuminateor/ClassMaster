import { destroy } from '@/actions/App/Http/Controllers/LessonController';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { User, type BreadcrumbItem, type Category } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';

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

interface Lesson {
    id: number;
    title: string;
    description: string;
    course_id: number;
}

interface Course {
    id: number;
    title: string;
    description: string;
    category_id: number;
    user: User;
    category: Category;
    lessons: Lesson[];
}

interface ShowProps {
    course: Course;
}

export default function Show({ course }: ShowProps) {
    const { auth } = usePage().props;
    const isAdmin = auth.user?.roles.some((role: { name: string }) => role.name === 'admin');

    const handleDelete = (id: number) => {
        const confirmed = window.confirm('Are you sure you want to delete this category?');
        if (confirmed) {
            router.delete(destroy(id));
        }
    };
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
                    <div className="mt-4 flex items-center justify-end gap-2 md:flex-row">
                        {(isAdmin || auth.user?.id === course.user.id) && (
                            <Button asChild>
                                <Link href={`/courses/${course.id}/lessons/create`}>Add lesson</Link>
                            </Button>
                        )}
                    </div>
                    <Table>
                        <TableCaption>A list of course lessons.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Id</TableHead>
                                <TableHead className="w-full">Title</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {course?.lessons &&
                                course.lessons.map((lesson) => (
                                    <TableRow key={lesson.id}>
                                        <TableCell className="font-medium">{lesson.id}</TableCell>
                                        <TableCell>{lesson.title}</TableCell>
                                        <TableCell className="flex items-center gap-2">
                                            <Button asChild>
                                                <Link href={`/lessons/${lesson.id}`}>Show</Link>
                                            </Button>
                                            {(isAdmin || auth.user?.id === course.user.id) && (
                                                <>
                                                    <Button asChild>
                                                        <Link href={`/lessons/${lesson.id}/edit`}>Edit</Link>
                                                    </Button>
                                                    <Button onClick={() => handleDelete(lesson.id)}>Delete</Button>
                                                </>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
