<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Http\Requests\StoreCourseRequest;
use App\Http\Requests\UpdateCourseRequest;
use Inertia\Inertia;
use App\Models\Category;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Course::class);

        $query = Course::with('category', 'user');

        if ($request->has('search') && $request->input('search') !== null) {
            $query->where('title', 'like', '%' . $request->input('search') . '%');
        }

        if ($request->has('category_id') && $request->input('category_id') !== null) {
            $query->where('category_id', $request->input('category_id'));
        }

        $sortOrder = $request->input('sort_order', 'desc');

        if ($sortOrder === 'asc') {
            $query->oldest('created_at');
        } else {
            $query->latest('created_at');
        }

        return Inertia::render('courses/index', [
            'courses' => $query->get(),
            'categories' => Category::all(['id', 'name']),
            'filters' => $request->only(['search', 'category_id', 'sort_order']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', Course::class);

        return Inertia::render('courses/create', [
            'categories' => Category::all(['id', 'name']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCourseRequest $request)
    {
        $this->authorize('create', Course::class);

        auth()->user()->courses()->create($request->validated());

        return to_route('courses.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Course $course)
    {
        $this->authorize('view', $course);

        return Inertia::render('courses/show', [
            'course' => $course->load('category', 'user', 'lessons'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Course $course)
    {
        $this->authorize('update', $course);

        return Inertia::render('courses/edit', [
            'course' => $course->load('category', 'user', 'lessons'),
            'categories' => Category::all(['id', 'name']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCourseRequest $request, Course $course)
    {
        $this->authorize('update', $course);

        $course->update($request->validated());

        return to_route('courses.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Course $course)
    {
        $this->authorize('delete', $course);

        $course->delete();

        return to_route('courses.index');
    }
}
