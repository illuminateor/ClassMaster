<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Course>
 */
class CourseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(),
            'description' => fake()->paragraph(),
            'category_id' => $this->faker->optional()->randomElement(\App\Models\Category::pluck('id')->toArray()) ?? \App\Models\Category::factory(),
            'user_id' => $this->faker->optional()->randomElement(\App\Models\User::pluck('id')->toArray()) ?? \App\Models\User::factory(),
        ];
    }
}
