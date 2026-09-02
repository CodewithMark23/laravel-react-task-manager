<?php

namespace Database\Seeders;

use App\Models\Task;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // Completed tasks
        Task::create(['title' => 'Finish project presentation', 'is_done' => true]);
        Task::create(['title' => 'Design mockup for app home screen', 'is_done' => true]);
        Task::create(['title' => 'Call mom', 'is_done' => true]);
        Task::create(['title' => 'Gym workout', 'is_done' => true]);

        // Active tasks
        Task::create(['title' => '[Task 1] Send feedback email to team', 'is_done' => false]);
        Task::create(['title' => '[Task 2] Review quarterly report', 'is_done' => false]);
        Task::create(['title' => '[Task 3] Schedule dentist appointment', 'is_done' => false]);
        Task::create(['title' => '[Task 4] Buy groceries (milk, bread, eggs)', 'is_done' => false]);
        Task::create(['title' => '[Task 5] Read Chapter 4 of UX Design book', 'is_done' => false]);
    }
}
