import CourseItem from './course-item';

interface CourseListPros {
    title: string;
    courses: [];
}
export default function CourseList({ title, courses }: CourseListPros) {
    return (
        <>
            <h2 className="mb-2 text-2xl font-semibold">{title}</h2>
            <div className="mb-8 grid max-w-5xl grid-cols-1 gap-4 align-middle md:grid-cols-2 lg:grid-cols-3">
                {courses.map(() => (
                    <CourseItem />
                ))}
            </div>
        </>
    );
}
