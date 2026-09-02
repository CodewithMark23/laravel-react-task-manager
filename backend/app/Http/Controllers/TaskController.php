<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function index()
    {
        $tasks = Task::latest()->get();

        return Inertia::render('Tasks/Index', [
            'tasks' => $tasks,
        ]);
    }

    public function store(Request $request)
    {
        Task::create($request->validate([
            'title' => 'required|string|max:255',
        ]));

        return redirect()->back();
    }

    public function update(Request $request, Task $task)
    {
        $task->update([
            'is_done' => $request->boolean('is_done'),
        ]);

        return redirect()->back();
    }

    public function destroy(Task $task)
    {
        $task->delete();

        return redirect()->back();
    }
}
