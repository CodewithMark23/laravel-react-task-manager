import React from 'react';
import { useForm, router, Head } from '@inertiajs/react';

export default function Index({ tasks = [] }) {
    const { data, setData, post, processing, reset } = useForm({
        title: '',
    });

    function addTask(e) {
        e.preventDefault();
        if (!data.title.trim()) return;

        post('/tasks', {
            preserveScroll: true,
            onSuccess: () => reset('title'),
        });
    }

    function toggleTask(task) {
        router.patch(`/tasks/${task.id}`, {
            is_done: !task.is_done,
        }, {
            preserveScroll: true,
        });
    }

    function deleteTask(id) {
        router.delete(`/tasks/${id}`, {
            preserveScroll: true,
        });
    }

    // Category styling helper
    function getTaskCategory(title = '') {
        const lower = title.toLowerCase();
        if (lower.includes('work') || lower.includes('report') || lower.includes('email') || lower.includes('presentation') || lower.includes('mockup')) {
            return { name: 'Work', bg: 'bg-rose-50 text-rose-700', dot: 'bg-rose-500' };
        }
        if (lower.includes('home') || lower.includes('groceries') || lower.includes('milk') || lower.includes('clean')) {
            return { name: 'Home', bg: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' };
        }
        return { name: 'Personal', bg: 'bg-blue-50 text-blue-600', dot: 'bg-blue-500' };
    }

    // Time label helper
    function getTaskTime(task) {
        if (task.title.toLowerCase().includes('presentation')) return '9:00 AM - 10:30 AM';
        if (task.title.toLowerCase().includes('report') || task.title.toLowerCase().includes('email')) return '1:00 PM';
        if (task.title.toLowerCase().includes('dentist')) return '3:30 PM';
        if (task.title.toLowerCase().includes('groceries') || task.title.toLowerCase().includes('book')) return '6:00 PM';
        if (task.title.toLowerCase().includes('mockup')) return '11:00 AM';
        if (task.title.toLowerCase().includes('mom')) return '2:15 PM';
        if (task.title.toLowerCase().includes('gym')) return '5:00 PM';

        const hours = (task.id % 12) + 1;
        return `${hours}:00 PM`;
    }

    const activeTasks = tasks.filter((t) => !t.is_done);
    const completedTasks = tasks.filter((t) => t.is_done);

    return (
        <div className="min-h-screen bg-[#eceef2] py-12 px-4 flex items-center justify-center font-sans antialiased text-slate-800">
            <Head title="Today's Tasks" />

            <div className="w-full max-w-3xl bg-white rounded-3xl shadow-sm border border-slate-200/80 p-8 sm:p-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
                        TODAY'S TASKS
                    </h1>
                    <span className="text-sm font-medium text-slate-500">
                        You can do it!
                    </span>
                </div>

                {/* Top Input Row */}
                <form onSubmit={addTask} className="flex gap-3 mb-8">
                    <input
                        type="text"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        placeholder="Add a new task..."
                        disabled={processing}
                        className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-slate-400 bg-white"
                    />
                    <button
                        type="submit"
                        disabled={processing || !data.title.trim()}
                        className="border border-slate-200 hover:bg-slate-50 disabled:opacity-50 text-slate-800 font-medium px-4 py-2.5 rounded-xl text-sm flex items-center gap-1.5 transition bg-white shadow-xs"
                    >
                        <span className="text-base leading-none font-normal">+</span>
                        <span>Add Task</span>
                    </button>
                </form>

                {/* Active Tasks Section */}
                <div className="mb-6">
                    <h2 className="text-sm font-semibold text-slate-700 mb-3">
                        Tasks ({activeTasks.length})
                    </h2>
                    <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 bg-white">
                        {activeTasks.length === 0 ? (
                            <div className="p-5 text-center text-sm text-slate-400">
                                No active tasks. Add one above!
                            </div>
                        ) : (
                            activeTasks.map((task) => {
                                const cat = getTaskCategory(task.title);
                                const time = getTaskTime(task);
                                return (
                                    <div
                                        key={task.id}
                                        className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/80 transition group"
                                    >
                                        {/* Left: Checkbox + Title */}
                                        <div className="flex items-center gap-3 min-w-0 flex-1 mr-3">
                                            <button
                                                type="button"
                                                onClick={() => toggleTask(task)}
                                                className="w-4 h-4 rounded border-2 border-slate-300 hover:border-slate-400 transition flex items-center justify-center shrink-0 bg-white"
                                            />
                                            <span
                                                onClick={() => toggleTask(task)}
                                                className="text-sm text-slate-700 cursor-pointer select-none truncate"
                                            >
                                                {task.title}
                                            </span>
                                        </div>

                                        {/* Right: Badge + Time + Delete Icon */}
                                        <div className="flex items-center gap-3 shrink-0">
                                            <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1.5 ${cat.bg}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${cat.dot}`}></span>
                                                {cat.name}
                                            </span>

                                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                                <span className="text-slate-300">•</span>
                                                {time}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() => deleteTask(task.id)}
                                                className="text-slate-400 hover:text-slate-600 p-1 rounded transition"
                                                title="Delete task"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Completed Section */}
                {completedTasks.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                            COMPLETED ({completedTasks.length})
                        </h2>
                        <div className="divide-y divide-slate-100 bg-white">
                            {completedTasks.map((task) => {
                                const cat = getTaskCategory(task.title);
                                const time = getTaskTime(task);
                                return (
                                    <div
                                        key={task.id}
                                        className="px-4 py-2.5 flex items-center justify-between hover:bg-slate-50/50 transition group"
                                    >
                                        {/* Left: Checked Circle + Title */}
                                        <div className="flex items-center gap-3 min-w-0 flex-1 mr-3">
                                            <button
                                                type="button"
                                                onClick={() => toggleTask(task)}
                                                className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-slate-400 hover:border-slate-500 shrink-0"
                                            >
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </button>
                                            <span
                                                onClick={() => toggleTask(task)}
                                                className="text-sm line-through text-slate-400 cursor-pointer select-none truncate"
                                            >
                                                {task.title}
                                            </span>
                                        </div>

                                        {/* Right: Category + Time + Delete */}
                                        <div className="flex items-center gap-3 shrink-0">
                                            <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1.5 ${cat.bg}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${cat.dot}`}></span>
                                                {cat.name}
                                            </span>

                                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                                <span className="text-slate-300">•</span>
                                                {time}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() => deleteTask(task.id)}
                                                className="text-slate-400 hover:text-slate-600 p-1 rounded transition opacity-0 group-hover:opacity-100"
                                                title="Delete task"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Bottom Footer */}
                <div className="pt-6 border-t border-slate-100 text-xs text-slate-400 flex justify-between items-center">
                    <span>Task Manager</span>
                    <span>{completedTasks.length} of {tasks.length} tasks completed</span>
                </div>
            </div>
        </div>
    );
}
