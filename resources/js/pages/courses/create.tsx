import { store } from '@/actions/App/Http/Controllers/CourseController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Category } from '@/types';
import { Input } from '@headlessui/react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Courses',
        href: '/courses',
    },
    {
        title: 'Add',
        href: '/courses/create',
    },
];

interface CreateProps {
    categories: Category[];
}

export default function Create({ categories }: CreateProps) {
    const { data, setData, processing, errors } = useForm({
        title: '',
        description: '',
        category_id: '',
        thumbnail: null as File | null,
        preview_video_url: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (key === 'thumbnail' && value instanceof File) {
                formData.append(key, value);
            } else if (typeof value === 'object' && value !== null) {
                formData.append(key, JSON.stringify(value));
            } else if (value !== null && value !== undefined) {
                formData.append(key, value);
            }
        });
        router.post(store(), formData, {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <div className="flex items-center justify-end gap-2 md:flex-row">
                        <Button asChild>
                            <Link href="/courses">Back to courses</Link>
                        </Button>
                    </div>
                    <form onSubmit={submit} className="flex flex-col gap-6" encType="multipart/form-data">
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
                                Add
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
