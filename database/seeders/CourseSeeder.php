<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\User;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user1 = User::factory()->create([
            'name' => 'Instructor',
            'email' => 'instructor@example.com',
        ]);

        $user1->assignRole('instructor');

        $user2 = User::factory()->create([
            'name' => 'Instructor Two',
            'email' => 'instructor2@example.com',
        ]);

        $user2->assignRole('instructor');

        Course::factory()->count(5)->create(['user_id' => $user1->id]);
        Course::factory()->count(5)->create(['user_id' => $user2->id]);
    }
}
