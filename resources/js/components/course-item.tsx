import { Link } from '@inertiajs/react';
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';

export default function CourseItem() {
    return (
        <Link href="#" className="inline-block text-sm leading-normal text-[#1b1b18] dark:text-[#EDEDEC]">
            <Card className="border-[#19140035] pt-0 leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]">
                <div>
                    <img src="/php-course.jpg" alt="ClassMaster Logo" className="mr-2 inline-block h-auto w-full" />
                </div>
                <CardHeader>
                    <div className="flex justify-between">
                        <div className="flex flex-col gap-1">
                            <CardTitle className="text-xl">Course One</CardTitle>
                            <CardDescription>Technology</CardDescription>
                            <CardDescription>By Intructor</CardDescription>
                        </div>
                        <div className="flex flex-col justify-end">
                            <span className="font-semibold">$20,00</span>
                        </div>
                    </div>
                </CardHeader>
            </Card>
        </Link>
    );
}
