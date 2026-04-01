<?php

use App\Http\Controllers\PageController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [PageController::class, 'home'])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return redirect('/courses');
    })->name('dashboard');
    Route::resource('categories', \App\Http\Controllers\CategoryController::class);
    Route::resource('courses', \App\Http\Controllers\CourseController::class);
    Route::get('courses/{course}/lessons/create', [\App\Http\Controllers\LessonController::class, 'create'])->name('lessons.create');
    Route::post('lessons', [\App\Http\Controllers\LessonController::class, 'store'])->name('lessons.store');
    Route::get('lessons/{lesson}', [\App\Http\Controllers\LessonController::class, 'show'])->name('lessons.show');
    Route::get('lessons/{lesson}/edit', [\App\Http\Controllers\LessonController::class, 'edit'])->name('lessons.edit');
    Route::put('lessons/{lesson}', [\App\Http\Controllers\LessonController::class, 'update'])->name('lessons.update');
    Route::delete('lessons/{lesson}', [\App\Http\Controllers\LessonController::class, 'destroy'])->name('lessons.destroy');
    Route::post('courses/{course}/lessons/reorder', [\App\Http\Controllers\LessonController::class, 'reorder'])->name('lessons.reorder');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
