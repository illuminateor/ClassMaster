import { update } from '@/actions/App/Http/Controllers/LessonController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Input } from '@headlessui/react';
import { Form, Head, Link } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

interface Lesson {
    id: number;
    title: string;
    description: string;
    course_id: number;
    video_url: string;
}

interface CreateProps {
    lesson: Lesson;
}

export default function Edit({ lesson }: CreateProps) {
    const courseId = window.location.pathname.split('/')[2];
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Courses',
            href: '/courses',
        },
        {
            title: 'Edit Course Details',
            href: '/courses/' + courseId + '/edit',
        },
        {
            title: 'Add',
            href: '/courses/' + courseId + '/lessons/create',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <div className="flex items-center justify-end gap-2 md:flex-row">
                        <Button asChild>
                            <Link href={`/courses/${courseId}/edit`}>Back to course</Link>
                        </Button>
                    </div>
                    <Form action={update(lesson.id)} disableWhileProcessing className="flex flex-col gap-6">
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-6 p-4">
                                    <input type="hidden" name="course_id" value={courseId} />
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
                                            placeholder="Title"
                                            defaultValue={lesson.title}
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
                                            defaultValue={lesson.description}
                                        />
                                        <InputError message={errors.description} className="mt-2" />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="video_url">Video Url</Label>
                                        <Input
                                            id="video_url"
                                            type="text"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="video_url"
                                            name="video_url"
                                            placeholder="Video Url (eg youtube link)"
                                            defaultValue={lesson.video_url}
                                        />
                                        <InputError message={errors.video_url} className="mt-2" />
                                    </div>

                                    <Button type="submit" className="mt-2 w-full" tabIndex={5}>
                                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                        Add
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </div>
        </AppLayout>
    );
}
