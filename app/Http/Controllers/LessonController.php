<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use App\Http\Requests\StoreLessonRequest;
use App\Http\Requests\UpdateLessonRequest;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Course;

class LessonController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', Lesson::class);

        return Inertia::render('lessons/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLessonRequest $request)
    {
        $this->authorize('create', Lesson::class);

        $data = $request->validated();
        $data['user_id'] = auth()->id();

        $lastPosition = Lesson::where('course_id', $data['course_id'])->max('position');
        $data['position'] = $lastPosition ? $lastPosition + 1 : 1;

        Lesson::create($data);

        return to_route('courses.edit', $data['course_id']);
    }

    /**
     * Display the specified resource.
     */
    public function show(Lesson $lesson)
    {
        $this->authorize('view', $lesson);

        return Inertia::render('lessons/show', [
            'lesson' => $lesson,
            'lessons' => $lesson->course->lessons()->get(['id', 'title']),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Lesson $lesson)
    {
        $this->authorize('update', $lesson);

        return Inertia::render('lessons/edit', [
            'lesson' => $lesson,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLessonRequest $request, Lesson $lesson)
    {
        $this->authorize('update', $lesson);

        $data = $request->validated();

        $lesson->update($data);

        return to_route('courses.edit', $data['course_id']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Lesson $lesson)
    {
        $this->authorize('delete', $lesson);

        $courseId = $lesson->course_id;

        $lesson->delete();

        return to_route('courses.edit', $courseId);
    }

    public function reorder(Course $course, Request $request)
    {
        $this->authorize('update', $course);

        $lessonIds = $request->input('lesson_ids');

        foreach ($lessonIds as $index => $lessonId) {
            Lesson::where('id', $lessonId)->where('course_id', $course->id)->update(['position' => $index + 1]);
        }

        return back();
    }
}
