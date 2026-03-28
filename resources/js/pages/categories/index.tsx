import { destroy } from '@/actions/App/Http/Controllers/CategoryController';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { User, type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categories',
        href: '/categories',
    },
];

interface Category {
    id: number;
    name: string;
}
interface IndexProps {
    categories: Category[];
    auth: {
        user: User & { roles: { name: string }[] };
    };
}

export default function Index({ categories }: IndexProps) {
    // If you want to get auth from usePage, use the correct type:
    const { auth } = usePage<{ auth: IndexProps['auth'] }>().props;

    const isAdmin = auth.user?.roles.some((role: { name: string }) => role.name === 'admin');

    const handleDelete = (id: number) => {
        const confirmed = window.confirm('Are you sure you want to delete this category?');
        if (confirmed) {
            router.delete(destroy(id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categories" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    {isAdmin && (
                        <div className="flex items-center justify-end gap-2 md:flex-row">
                            <Button asChild>
                                <Link href="/categories/create">Add</Link>
                            </Button>
                        </div>
                    )}

                    <Table>
                        <TableCaption>A list of all categories.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Id</TableHead>
                                <TableHead className="w-full">Name</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.map((category: { id: number; name: string }) => (
                                <TableRow key={category.id}>
                                    <TableCell className="font-medium">{category.id}</TableCell>
                                    <TableCell>{category.name}</TableCell>
                                    <TableCell className="flex items-center gap-2">
                                        <Button asChild>
                                            <Link href={`/courses?category_id=${category.id}`}>Show</Link>
                                        </Button>
                                        {isAdmin && (
                                            <>
                                                <Button asChild>
                                                    <Link href={`/categories/${category.id}/edit`}>Edit</Link>
                                                </Button>
                                                <Button onClick={() => handleDelete(category.id)}>Delete</Button>
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
