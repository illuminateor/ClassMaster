import { update } from '@/actions/App/Http/Controllers/CourseController';
import { destroy } from '@/actions/App/Http/Controllers/LessonController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Category } from '@/types';
import { Input } from '@headlessui/react';
import { Form, Head, Link, router } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Courses',
        href: '/courses',
    },
    {
        title: 'Edit',
        href: '/courses/edit',
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
    lessons: Lesson[];
}

interface EditProps {
    categories: Category[];
    course: Course;
}

export default function Edit({ categories, course }: EditProps) {
    const handleDelete = (id: number) => {
        const confirmed = window.confirm('Are you sure you want to delete this category?');
        if (confirmed) {
            router.delete(destroy(id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <div className="flex items-center justify-end gap-2 md:flex-row">
                        <Button asChild>
                            <Link href="/courses">Back to courses</Link>
                        </Button>
                    </div>
                    <Form action={update(course.id)} disableWhileProcessing className="mb-4 flex flex-col gap-6">
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-6 p-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="category_id">Category</Label>
                                        <Select name="category_id" defaultValue={course.category_id.toString()}>
                                            <SelectTrigger className="w-full" tabIndex={3}>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id.toString()}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.category_id} className="mt-2" />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="title">Title</Label>
                                        <Input
                                            id="title"
                                            type="text"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="title"
                                            name="title"
                                            placeholder="Name"
                                            defaultValue={course.title}
                                        />
                                        <InputError message={errors.title} className="mt-2" />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="description">Description</Label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            tabIndex={2}
                                            placeholder="Description"
                                            className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                            defaultValue={course.description}
                                        />
                                        <InputError message={errors.description} className="mt-2" />
                                    </div>

                                    <Button type="submit" className="mt-2 w-full" tabIndex={5}>
                                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                        Edit
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                    <div className="flex items-center justify-end gap-2 md:flex-row">
                        <Button asChild>
                            <Link href={`/courses/${course.id}/lessons/create`}>Add lesson</Link>
                        </Button>
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
                                    <TableRow key={course.id}>
                                        <TableCell className="font-medium">{lesson.id}</TableCell>
                                        <TableCell>{lesson.title}</TableCell>
                                        <TableCell className="flex items-center gap-2">
                                            <Button asChild>
                                                <Link href={`/lessons/${lesson.id}`}>Show</Link>
                                            </Button>
                                            <Button asChild>
                                                <Link href={`/lessons/${lesson.id}/edit`}>Edit</Link>
                                            </Button>
                                            <Button onClick={() => handleDelete(lesson.id)}>Delete</Button>
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
