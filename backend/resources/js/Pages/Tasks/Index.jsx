import React, { useState } from 'react';
import { useForm, router, Head } from '@inertiajs/react';

// Format a datetime-local string (YYYY-MM-DDTHH:MM) into a readable label
function formatDateTimeLabel(dt) {
    if (!dt) return null;
    const date = new Date(dt);
    if (isNaN(date.getTime())) return null;
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
}

export default function Index({ tasks = [] }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        title: '',
        description: '',
        date_time: '',
    });

    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editForm, setEditForm] = useState({
        title: '',
        description: '',
        date_time: '',
    });

    function addTask(e) {
        e.preventDefault();

        post('/tasks', {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    }

    function toggleTask(task) {
        // Cancel any active edit when toggling
        if (editingTaskId === task.id) setEditingTaskId(null);

        router.patch(`/tasks/${task.id}`, {
            is_done: !task.is_done,
        }, {
            preserveScroll: true,
        });
    }

    function deleteTask(id) {
        if (confirm('Delete this task?')) {
            router.delete(`/tasks/${id}`, {
                preserveScroll: true,
            });
        }
    }

    function startEditing(task) {
        setEditingTaskId(task.id);
        setEditForm({
            title: task.title,
            description: task.description || '',
            date_time: task.date_time || '',
        });
    }

    function saveEditing(e, id) {
        e.preventDefault();
        if (!editForm.title.trim()) return;

        router.patch(`/tasks/${id}`, editForm, {
            preserveScroll: true,
            onSuccess: () => setEditingTaskId(null),
        });
    }

    function cancelEditing() {
        setEditingTaskId(null);
    }

    const activeTasks = tasks.filter((t) => !t.is_done);
    const completedTasks = tasks.filter((t) => t.is_done);

    // Inline edit form — only for active tasks
    function renderEditForm(task) {
        return (
            <form
                key={task.id}
                onSubmit={(e) => saveEditing(e, task.id)}
                className="p-4 bg-slate-50/90 flex flex-col gap-3 border-b border-slate-100"
            >
                <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Edit Task</div>

                <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    placeholder="Task title..."
                    className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-indigo-500"
                    required
                />

                <textarea
                    rows="2"
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    placeholder="Description..."
                    className="border border-slate-300 rounded-lg px-3 py-2 text-xs bg-white focus:outline-none focus:border-indigo-500 resize-none"
                    required
                />

                <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                    <div className="flex-1 w-full">
                        <label className="text-xs text-slate-500 mb-1 block">Date & Time</label>
                        <input
                            type="datetime-local"
                            value={editForm.date_time}
                            onChange={(e) => setEditForm({ ...editForm, date_time: e.target.value })}
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs bg-white focus:outline-none focus:border-indigo-500 text-slate-700"
                            required
                        />
                    </div>
                    <div className="flex gap-2 sm:mt-5">
                        <button
                            type="button"
                            onClick={cancelEditing}
                            className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-200 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-3 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </form>
        );
    }

    // Task row rendering
    function renderTaskRow(task, isCompleted = false) {
        const timeLabel = formatDateTimeLabel(task.date_time);

        return (
            <div
                key={task.id}
                className={`px-4 py-3 flex items-start sm:items-center justify-between transition group ${isCompleted ? 'hover:bg-slate-50/50' : 'hover:bg-slate-50/80'
                    }`}
            >
                {/* Left: Checkbox/Check + Title + Description */}
                <div className="flex items-start gap-3 min-w-0 flex-1 mr-3">
                    <button
                        type="button"
                        onClick={() => toggleTask(task)}
                        className={`mt-0.5 sm:mt-0 w-4 h-4 flex items-center justify-center shrink-0 transition ${isCompleted
                                ? 'rounded-full border border-slate-300 text-slate-400 hover:border-slate-500'
                                : 'rounded border-2 border-slate-300 hover:border-slate-400 bg-white'
                            }`}
                    >
                        {isCompleted && (
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </button>

                    <div className="min-w-0 flex-1">
                        <span
                            onClick={() => toggleTask(task)}
                            className={`text-sm font-medium block truncate cursor-pointer select-none ${isCompleted ? 'line-through text-slate-400' : 'text-slate-700'
                                }`}
                        >
                            {task.title}
                        </span>
                        {task.description && (
                            <p className={`text-xs mt-0.5 line-clamp-2 ${isCompleted ? 'line-through text-slate-400' : 'text-slate-500'}`}>
                                {task.description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Right: Time + Edit (active only) + Delete */}
                <div className="flex items-center gap-2.5 shrink-0">
                    {timeLabel && (
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                            <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {timeLabel}
                        </span>
                    )}

                    {/* Edit — only for active tasks */}
                    {!isCompleted && (
                        <button
                            type="button"
                            onClick={() => startEditing(task)}
                            className="text-slate-400 hover:text-indigo-600 p-1 rounded transition"
                            title="Edit task"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </button>
                    )}

                    {/* Delete — always visible */}
                    <button
                        type="button"
                        onClick={() => deleteTask(task.id)}
                        className={`text-slate-400 hover:text-rose-600 p-1 rounded transition ${isCompleted ? 'opacity-0 group-hover:opacity-100' : ''}`}
                        title="Delete task"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#eceef2] py-12 px-4 flex items-center justify-center font-sans antialiased text-slate-800">
            <Head title="Today's Tasks" />

            <div className="w-full max-w-3xl bg-white rounded-3xl shadow-sm border border-slate-200/80 p-8 sm:p-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
                        TODAY'S TASKS
                    </h1>
                    <span className="text-sm font-medium text-slate-500">You can do it!</span>
                </div>

                {/* Add Task Form — description and date_time always visible and required */}
                <form onSubmit={addTask} className="mb-8 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/60 flex flex-col gap-3">
                    <div>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="Task title..."
                            disabled={processing}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-slate-400 bg-white"
                            required
                        />
                        {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
                    </div>

                    <div>
                        <textarea
                            rows="2"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Description..."
                            disabled={processing}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-slate-400 bg-white resize-none"
                            required
                        />
                        {errors.description && <p className="text-xs text-rose-500 mt-1">{errors.description}</p>}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 items-end">
                        <div className="flex-1 w-full">
                            <label className="text-xs text-slate-500 mb-1 block">Date & Time</label>
                            <input
                                type="datetime-local"
                                value={data.date_time}
                                onChange={(e) => setData('date_time', e.target.value)}
                                disabled={processing}
                                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-slate-400 bg-white"
                                required
                            />
                            {errors.date_time && <p className="text-xs text-rose-500 mt-1">{errors.date_time}</p>}
                        </div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="border border-slate-200 hover:bg-slate-50 disabled:opacity-50 text-slate-800 font-medium px-5 py-2.5 rounded-xl text-sm flex items-center gap-1.5 transition bg-white shrink-0"
                        >
                            + Add Task
                        </button>
                    </div>
                </form>

                {/* Active Tasks */}
                <div className="mb-6">
                    <h2 className="text-sm font-semibold text-slate-700 mb-3">
                        Tasks ({activeTasks.length})
                    </h2>
                    <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 bg-white">
                        {activeTasks.length === 0 ? (
                            <div className="p-5 text-center text-sm text-slate-400">No active tasks. Add one above!</div>
                        ) : (
                            activeTasks.map((task) =>
                                editingTaskId === task.id
                                    ? renderEditForm(task)
                                    : renderTaskRow(task, false)
                            )
                        )}
                    </div>
                </div>

                {/* Completed Tasks */}
                {completedTasks.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                            COMPLETED ({completedTasks.length})
                        </h2>
                        <div className="divide-y divide-slate-100 bg-white border border-slate-200 rounded-2xl overflow-hidden">
                            {completedTasks.map((task) => renderTaskRow(task, true))}
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="pt-6 border-t border-slate-100 text-xs text-slate-400 flex justify-between items-center">
                    <span>Task Manager</span>
                    <span>{completedTasks.length} of {tasks.length} tasks completed</span>
                </div>
            </div>
        </div>
    );
}
