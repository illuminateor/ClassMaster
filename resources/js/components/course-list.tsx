import CourseItem from './course-item';

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

interface CourseListPros {
    title: string;
    courses: Course[];
}
export default function CourseList({ title, courses }: CourseListPros) {
    return (
        <>
            <h2 className="mb-2 text-2xl font-semibold">{title}</h2>
            <div className="mb-8 grid max-w-5xl grid-cols-1 gap-4 align-middle md:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                    <CourseItem key={course.id} course={course} />
                ))}
            </div>
        </>
    );
}
