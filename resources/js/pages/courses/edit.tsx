import { update } from '@/actions/App/Http/Controllers/CourseController';
import { destroy, reorder } from '@/actions/App/Http/Controllers/LessonController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Category } from '@/types';
import { DndContext, type DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Input } from '@headlessui/react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';

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
    thumbnail: string | null;
    preview_video_url: string | null;
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

    const { data, setData, processing, errors } = useForm({
        title: course.title,
        description: course.description,
        category_id: course.category_id.toString(),
        thumbnail: null as File | string | null,
        preview_video_url: course.preview_video_url || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('_method', 'PUT');
        Object.entries(data).forEach(([key, value]) => {
            if (key === 'thumbnail' && value instanceof File) {
                formData.append(key, value);
            } else if (typeof value === 'object' && value !== null) {
                formData.append(key, JSON.stringify(value));
            } else if (value !== null && value !== undefined) {
                formData.append(key, value);
            }
        });
        router.post(update(course.id), formData, {
            forceFormData: true,
        });
    };

    const handleClearThumbnail = () => {
        router.patch(
            `/courses/${course.id}`,
            { ...data, thumbnail: null },
            {
                preserveScroll: true,
            },
        );
    };

    const [lessons, setLessons] = useState<Lesson[]>(course.lessons);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setLessons((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over?.id);
                const newItems = arrayMove(items, oldIndex, newIndex);
                router.post(
                    reorder({ course: course.id }),
                    {
                        lesson_ids: newItems.map((lesson) => lesson.id),
                    },
                    {
                        preserveScroll: true,
                    },
                );
                return newItems;
            });
        }
    };

    const SortableTableRow = ({ lesson }: { lesson: Lesson }) => {
        const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: lesson.id });

        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
        };

        return (
            <TableRow ref={setNodeRef} style={style} {...attributes} {...listeners} className="hover:cursor-pointer">
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
        );
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
                    <form onSubmit={submit} className="mb-4 flex flex-col gap-6" encType="multipart/form-data">
                        <div className="grid gap-6 p-4">
                            <div className="grid gap-2">
                                <Label htmlFor="category_id">Category</Label>
                                <Select name="category_id" value={data.category_id} onValueChange={(value) => setData('category_id', value)}>
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
                                    value={data.title}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('title', e.target.value)}
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
                                    value={data.description}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('description', e.target.value)}
                                />
                                <InputError message={errors.description} className="mt-2" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="thumbnail">Thumbnail</Label>
                                {course.thumbnail && (
                                    <div className="relative h-32 w-32">
                                        <img src={`/storage/${course.thumbnail}`} alt="Thumbnail" className="h-full w-full object-cover" />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={handleClearThumbnail}
                                            className="absolute top-0 right-0"
                                        >
                                            Clear
                                        </Button>
                                    </div>
                                )}
                                <Input
                                    id="thumbnail"
                                    type="file"
                                    tabIndex={3}
                                    name="thumbnail"
                                    className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground hover:file:bg-primary/90"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('thumbnail', e.target.files?.[0] || null)}
                                />
                                <InputError message={errors.thumbnail} className="mt-2" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="preview_video_url">Preview Video URL</Label>
                                <Input
                                    id="preview_video_url"
                                    type="url"
                                    tabIndex={4}
                                    name="preview_video_url"
                                    placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                                    value={data.preview_video_url}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('preview_video_url', e.target.value)}
                                />
                                <InputError message={errors.preview_video_url} className="mt-2" />
                            </div>

                            <Button type="submit" className="mt-2 w-full" tabIndex={5}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Edit
                            </Button>
                        </div>
                    </form>
                    <div className="flex items-center justify-end gap-2 md:flex-row">
                        <Button asChild>
                            <Link href={`/courses/${course.id}/lessons/create`}>Add lesson</Link>
                        </Button>
                    </div>
                    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                        <SortableContext items={lessons.map((lesson) => lesson.id)} strategy={verticalListSortingStrategy}>
                            <Table>
                                <TableCaption>A list of course lessons</TableCaption>
                                <TableCaption>Drag and drop lessons to order them</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">Id</TableHead>
                                        <TableHead className="w-full">Title</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {lessons.map((lesson) => (
                                        <SortableTableRow key={lesson.id} lesson={lesson} />
                                    ))}
                                </TableBody>
                            </Table>
                        </SortableContext>
                    </DndContext>
                </div>
            </div>
        </AppLayout>
    );
}
