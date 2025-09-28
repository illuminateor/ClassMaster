import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { BookOpen, MonitorPlay } from 'lucide-react';

interface Lesson {
    id: number;
    title: string;
    description: string;
    course_id: number;
    video_url: string;
}

interface ShowProps {
    lesson: Lesson;
    lessons: Lesson[];
}

function getYouTubeId(url: string): string | null {
    try {
        const parsedUrl = new URL(url);

        // Case: https://www.youtube.com/watch?v=VIDEO_ID
        if (parsedUrl.hostname.includes('youtube.com')) {
            if (parsedUrl.searchParams.has('v')) {
                return parsedUrl.searchParams.get('v');
            }
            // Case: https://www.youtube.com/embed/VIDEO_ID
            const paths = parsedUrl.pathname.split('/');
            const embedIndex = paths.indexOf('embed');
            if (embedIndex !== -1 && paths[embedIndex + 1]) {
                return paths[embedIndex + 1];
            }
        }

        // Case: https://youtu.be/VIDEO_ID
        if (parsedUrl.hostname.includes('youtu.be')) {
            return parsedUrl.pathname.slice(1); // remove leading "/"
        }

        return null; // not a valid YouTube video URL
    } catch {
        return null; // invalid URL
    }
}

export default function Show({ lesson, lessons }: ShowProps) {
    const courseId = lesson.course_id;
    const videoId = getYouTubeId(lesson.video_url);
    const width = '100%';
    const height = 380 * (width === '100%' ? 16 / 9 : 9 / 16); // Maintain 16:9 aspect ratio

    if (!videoId) {
        return <p>Invalid YouTube URL</p>;
    }
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Courses',
            href: '/courses',
        },
        {
            title: 'Course Details',
            href: '/courses/' + courseId,
        },
        {
            title: 'Show Lesson',
            href: '/lessons/show',
        },
    ];

    const navItems =
        lessons.length > 0
            ? [
                  {
                      title: 'Back to Course',
                      href: '/courses/' + courseId,
                      icon: BookOpen,
                  },
                  ...lessons.map((lessonItem) => ({
                      title: lessonItem.title,
                      href: `/lessons/${lessonItem.id}`,
                      icon: MonitorPlay,
                  })),
              ]
            : [
                  {
                      title: 'Back to Course',
                      href: '/courses/' + courseId,
                      icon: BookOpen,
                  },
              ];

    return (
        <AppLayout breadcrumbs={breadcrumbs} navItems={navItems}>
            <Head title="Add" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <div className="flex items-center justify-end gap-2 md:flex-row">
                        <Button asChild>
                            <Link href={`/courses/${courseId}`}>Back to course</Link>
                        </Button>
                    </div>
                    <div className="flex-1 p-4">
                        {videoId && (
                            <iframe
                                width={width}
                                height={height}
                                src={`https://www.youtube.com/embed/${videoId}`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        )}
                        <h1 className="text-2xl font-bold">{lesson.title}</h1>
                        <p className="mt-4">{lesson.description}</p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
