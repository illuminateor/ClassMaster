import { destroy, index } from '@/actions/App/Http/Controllers/CourseController';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useDebounce } from '@/hooks/use-debounce';
import AppLayout from '@/layouts/app-layout';
import { type Auth, type BreadcrumbItem, type Category, type User } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

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
    created_at: string;
    updated_at: string;
}

interface IndexProps {
    courses: Course[];
    auth: Auth;
    categories: Category[];
    filters: {
        search: string;
        category_id: string;
        sort_order: string;
    };
}

export default function Index({ courses, categories, filters }: IndexProps) {
    const { auth } = usePage().props;
    const isAdmin = auth.user?.roles.some((role: { name: string }) => role.name === 'admin');
    const isInstructor = auth.user?.roles.some((role: { name: string }) => role.name === 'instructor');

    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category_id || '');
    const [sortOrder, setSortOrder] = useState(filters.sort_order || 'desc');

    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        router.get(
            index(),
            {
                search: debouncedSearch,
                category_id: category,
                sort_order: sortOrder,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    }, [debouncedSearch, category, sortOrder]);

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
                    <div className="flex flex-col items-center justify-end gap-2 md:flex-row">
                        <Input
                            placeholder="Search courses..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="max-w-sm md:max-w-xs"
                        />
                        <Select value={category} onValueChange={(value) => setCategory(value === 'all' ? '' : value)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id.toString()}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={sortOrder} onValueChange={(value) => setSortOrder(value)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Sort by Date" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="desc">Newest to Oldest</SelectItem>
                                <SelectItem value="asc">Oldest to Newest</SelectItem>
                            </SelectContent>
                        </Select>
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
                                <TableHead>Created</TableHead>
                                <TableHead>Updated</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {courses.map((course: Course) => (
                                <TableRow key={course.id}>
                                    <TableCell className="font-medium">{course.id}</TableCell>
                                    <TableCell>{course.title}</TableCell>
                                    <TableCell>{course.category.name}</TableCell>
                                    <TableCell>{course.user.name}</TableCell>
                                    <TableCell className="min-w-[100px]">{new Date(course.created_at).toISOString().split('T')[0]}</TableCell>
                                    <TableCell className="min-w-[100px]">{new Date(course.updated_at).toISOString().split('T')[0]}</TableCell>
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
