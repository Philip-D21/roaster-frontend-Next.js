"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import { GET_SHIFTS } from "@/lib/graphql/queries";
import ShiftCard from "@/components/ShiftCard";

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (!token || !userData) {
            router.push("/login");
            return;
        }

        setUser(JSON.parse(userData));
    }, [router]);

    const { data, loading, error, refetch } = useQuery(GET_SHIFTS, {
        skip: !user,
    });

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
    };

    const filteredShifts = data?.shifts?.filter((shift: any) => {
        if (!startDate && !endDate) return true;
        const shiftDate = new Date(shift.date);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        if (start && shiftDate < start) return false;
        if (end && shiftDate > end) return false;
        return true;
    }) || [];

    if (!user) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black">
            <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                                Roster Dashboard
                            </h1>
                            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                                Welcome back, {user.name} ({user.role})
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                    <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                        Filter Shifts
                    </h2>
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="flex-1">
                            <label htmlFor="start-date" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Start Date
                            </label>
                            <input
                                type="date"
                                id="start-date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                            />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="end-date" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                End Date
                            </label>
                            <input
                                type="date"
                                id="end-date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={() => {
                                    setStartDate("");
                                    setEndDate("");
                                }}
                                className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </div>

                {loading && (
                    <div className="text-center text-zinc-600 dark:text-zinc-400">
                        Loading shifts...
                    </div>
                )}

                {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900 dark:bg-red-900/20 dark:text-red-400">
                        Error loading shifts: {error.message}
                    </div>
                )}

                {!loading && !error && (
                    <>
                        <div className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
                            Showing {filteredShifts.length} {filteredShifts.length === 1 ? "shift" : "shifts"}
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredShifts.map((shift: any) => (
                                <ShiftCard
                                    key={shift.id}
                                    shift={shift}
                                    onRefetch={() => refetch()}
                                />
                            ))}
                        </div>
                        {filteredShifts.length === 0 && (
                            <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
                                <p className="text-zinc-600 dark:text-zinc-400">
                                    No shifts found. Try adjusting your filters.
                                </p>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
