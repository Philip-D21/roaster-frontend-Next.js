"use client";

import { useMutation } from "@apollo/client/react";
import { PICK_UP_SHIFT } from "@/lib/graphql/mutations";

interface Shift {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    title: string;
    maxAssignments: number;
    currentAssignments: number;
    availableSlots: number;
}

interface ShiftCardProps {
    shift: Shift;
    onRefetch?: () => void;
}

export default function ShiftCard({ shift, onRefetch }: ShiftCardProps) {
    const [pickUpShift, { loading: pickingUp }] = useMutation(PICK_UP_SHIFT, {
        onCompleted: () => {
            onRefetch?.();
        },
        onError: (error) => {
            console.error("Error picking up shift:", error);
            alert(error.message);
        },
    });

    const handlePickUp = async () => {
        try {
            await pickUpShift({
                variables: { shiftId: shift.id },
            });
        } catch (error) {
            // Error handled in onError
        }
    };

    return (
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                        {shift.title}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                        {new Date(shift.date).toLocaleDateString()} • {shift.startTime} - {shift.endTime}
                    </p>
                </div>
                <div className="ml-4 flex flex-col items-end gap-2">
                    <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${shift.availableSlots > 0
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                            }`}
                    >
                        {shift.availableSlots} / {shift.maxAssignments} available
                    </span>
                </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
                {shift.availableSlots > 0 ? (
                    <button
                        onClick={handlePickUp}
                        disabled={pickingUp}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {pickingUp ? "Picking up..." : "Pick Up Shift"}
                    </button>
                ) : (
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">Shift Full</span>
                )}
            </div>

            <div className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
                {shift.currentAssignments} {shift.currentAssignments === 1 ? "person" : "people"} assigned
            </div>
        </div>
    );
}
