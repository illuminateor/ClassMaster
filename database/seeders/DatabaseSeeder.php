<?php

namespace Database\Seeders;

use App\Models\User;
use Spatie\Permission\Models\Role;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create roles if they don't exist
        Role::firstOrCreate(['name' => 'admin']);
        Role::firstOrCreate(['name' => 'user']);
        Role::firstOrCreate(['name' => 'instructor']);

        // User::factory(10)->create();

        $user = User::factory()->create([
            'name' => 'Admin',
            'email' => 'test@example.com',
        ]);

        $user->assignRole('admin');

        $user = User::factory()->create([
            'name' => 'User',
            'email' => 'user@example.com',
        ]);

        $user->assignRole('user');

        $user = User::factory()->create([
            'name' => 'User Two',
            'email' => 'user2@example.com',
        ]);

        $user->assignRole('user');

        $this->call([
            CategorySeeder::class,
            CourseSeeder::class,
        ]);

    }
}
