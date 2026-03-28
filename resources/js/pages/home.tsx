import { index } from '@/actions/App/Http/Controllers/CourseController';
import CourseList from '@/components/course-list';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useDebounce } from '@/hooks/use-debounce';
import { dashboard, login, register } from '@/routes';
import { type Category, type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';

import { Menu } from 'lucide-react';
import React, { useState } from 'react';

interface Course {
    id: number;
    title: string;
    description: string;
    thumbnail: string;
    category: {
        name: string;
    };
    user: {
        name: string;
    };
}

interface HomeProps {
    courses: Course[];
    categories?: Category[];
}

export default function Home({ courses, categories }: HomeProps) {
    const { auth } = usePage<SharedData>().props;
    // Add state for search query and category

    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [sortOrder] = useState('desc');

    const debouncedSearch = useDebounce(search, 500);

    // Handle search submit
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
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
    };

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-between gap-4">
                        <div>
                            <Link
                                href="/"
                                className="flex flex-col items-center gap-2 rounded-sm border border-transparent px-5 py-1.5 align-middle text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                            >
                                <img src="/classmaster-logo.png" alt="ClassMaster Logo" className="mr-2 inline-block h-auto w-12" />
                                ClassMaster
                            </Link>
                        </div>
                        {/* Desktop navbar */}
                        <div className="hidden items-center gap-2 lg:flex">
                            {/* Search form */}
                            <form onSubmit={handleSearch} className="flex items-center gap-2">
                                <input
                                    type="text"
                                    placeholder="Search courses..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="rounded border px-2 py-1 text-sm"
                                />
                                {categories && categories.length > 0 && (
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="rounded border px-2 py-1 text-sm"
                                    >
                                        <option value="all">All Categories</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                )}
                                <Button type="submit" size="sm" className="ml-1">
                                    Search
                                </Button>
                            </form>
                            <Link
                                href="/courses"
                                className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                            >
                                Browse
                            </Link>
                            <Link
                                href="/categories"
                                className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                            >
                                Categories
                            </Link>
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={register()}
                                        className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                            <ThemeToggle />
                        </div>
                        {/* Mobile navbar */}
                        <div className="flex items-center gap-2 lg:hidden">
                            <ThemeToggle />
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline" size="icon">
                                        <Menu className="h-[1.2rem] w-[1.2rem]" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right">
                                    {/* Mobile search form */}
                                    <form onSubmit={handleSearch} className="mb-4 flex flex-col items-center gap-2">
                                        <input
                                            type="text"
                                            placeholder="Search courses..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="w-full rounded border px-2 py-1 text-sm"
                                        />
                                        {categories && categories.length > 0 && (
                                            <select
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value)}
                                                className="w-full rounded border px-2 py-1 text-sm"
                                            >
                                                {categories.map((cat) => (
                                                    <option key={cat.id} value={cat.id}>
                                                        {cat.name}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                        <Button type="submit" size="sm" className="w-full">
                                            Search
                                        </Button>
                                    </form>
                                    <nav className="mt-8 flex flex-col items-center justify-center gap-2">
                                        <SheetClose asChild>
                                            <Link
                                                href="/courses"
                                                className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                            >
                                                Browse
                                            </Link>
                                        </SheetClose>
                                        <SheetClose asChild>
                                            <Link
                                                href="#"
                                                className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                            >
                                                Categories
                                            </Link>
                                        </SheetClose>
                                        {auth.user ? (
                                            <SheetClose asChild>
                                                <Link
                                                    href={dashboard()}
                                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                                >
                                                    Dashboard
                                                </Link>
                                            </SheetClose>
                                        ) : (
                                            <>
                                                <SheetClose asChild>
                                                    <Link
                                                        href={login()}
                                                        className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                                    >
                                                        Log in
                                                    </Link>
                                                </SheetClose>
                                                <SheetClose asChild>
                                                    <Link
                                                        href={register()}
                                                        className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                                    >
                                                        Sign Up
                                                    </Link>
                                                </SheetClose>
                                            </>
                                        )}
                                    </nav>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </nav>
                </header>
                <div className="opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main>
                        <div className="relative mb-4 w-full py-10 text-[#1b1b18] dark:text-[#EDEDEC]">
                            <h1 className="mb-4 text-6xl font-bold">Learn on your schedule</h1>
                            <p className="mb-8 font-semibold">Feeling overwhelmed? Get started on one of our comprehensive courses</p>
                            <p className="text-center">
                                <Link
                                    href="/courses"
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-center leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Browse courses
                                </Link>
                            </p>
                        </div>
                        <CourseList title="Popular courses" courses={courses} />
                        <CourseList title="Newest courses" courses={courses} />
                        <div className="relative mb-4 w-full py-10 text-[#1b1b18] dark:text-[#EDEDEC]">
                            <p className="text-center">
                                <Link
                                    href="/courses"
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-center leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    More courses
                                </Link>
                            </p>
                        </div>
                    </main>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
            <footer className="flex justify-center gap-4 bg-gray-200 p-10 text-gray-800 dark:bg-gray-800 dark:text-white">
                <span className="">ClassMaster &copy; 2025</span>
            </footer>
        </>
    );
}
