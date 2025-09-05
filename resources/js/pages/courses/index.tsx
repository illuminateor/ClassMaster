import { destroy } from '@/actions/App/Http/Controllers/CourseController';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type Auth, type BreadcrumbItem, type Category, type User } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Courses',
        href: '/courses',
    },
];

interface Course {
    id: number;
    title: string;
    description: string;
    category: Category;
    user: User;
}

interface IndexProps {
    courses: Course[];
    auth: Auth;
}

export default function Index({ courses }: IndexProps) {
    const { auth } = usePage().props;
    const isAdmin = auth.user?.roles.some((role: { name: string }) => role.name === 'admin');
    const isInstructor = auth.user?.roles.some((role: { name: string }) => role.name === 'instructor');

    const handleDelete = (id: number) => {
        const confirmed = window.confirm('Are you sure you want to delete this category?');
        if (confirmed) {
            router.delete(destroy(id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Courses" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <div className="flex items-center justify-end gap-2 md:flex-row">
                        {(isAdmin || isInstructor) && (
                            <Button asChild>
                                <Link href="/courses/create">Add</Link>
                            </Button>
                        )}
                    </div>
                    <Table>
                        <TableCaption>A list of all courses.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Id</TableHead>
                                <TableHead className="w-full">Title</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {courses.map((course: { id: number; title: string; description: string; category: Category; user: User }) => (
                                <TableRow key={course.id}>
                                    <TableCell className="font-medium">{course.id}</TableCell>
                                    <TableCell>{course.title}</TableCell>
                                    <TableCell>{course.category.name}</TableCell>
                                    <TableCell>{course.user.name}</TableCell>
                                    <TableCell className="flex items-center gap-2">
                                        <Button asChild>
                                            <Link href={`/courses/${course.id}`}>Show</Link>
                                        </Button>
                                        {(isAdmin || auth.user?.id === course.user.id) && (
                                            <>
                                                <Button asChild>
                                                    <Link href={`/courses/${course.id}/edit`}>Edit</Link>
                                                </Button>
                                                <Button onClick={() => handleDelete(course.id)}>Delete</Button>
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
