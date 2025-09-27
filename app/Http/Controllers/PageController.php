<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class PageController extends Controller
{
    public function home()
    {
        $courses = \App\Models\Course::with('category', 'user')->latest()->take(6)->get();

        return inertia('home', [
            'categories' => Category::all(['id', 'name']),
            'courses' => $courses,
        ]);
    }
}
