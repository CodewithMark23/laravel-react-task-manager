<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $tasks = Task::latest()->get()->map(function ($task) {
            return array_merge($task->toArray(), [
                // Format date_time for the HTML datetime-local input (YYYY-MM-DDTHH:MM)
                'date_time' => $task->date_time
                    ? $task->date_time->format('Y-m-d\TH:i')
                    : null,
            ]);
        });

        if ($request->wantsJson() && ! $request->header('X-Inertia')) {
            return response()->json($tasks);
        }

        return Inertia::render('Tasks/Index', [
            'tasks' => $tasks,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'date_time'   => 'nullable|date',
        ]);

        $task = Task::create($validated);

        if ($request->wantsJson() && ! $request->header('X-Inertia')) {
            return response()->json($task, 201);
        }

        return redirect()->back();
    }

    public function update(Request $request, Task $task)
    {
        $validated = $request->validate([
            'title'       => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'date_time'   => 'nullable|date',
            'is_done'     => 'sometimes|boolean',
        ]);

        $task->update($validated);

        if ($request->wantsJson() && ! $request->header('X-Inertia')) {
            return response()->json($task);
        }

        return redirect()->back();
    }

    public function destroy(Request $request, Task $task)
    {
        $task->delete();

        if ($request->wantsJson() && ! $request->header('X-Inertia')) {
            return response()->noContent();
        }

        return redirect()->back();
    }
}
