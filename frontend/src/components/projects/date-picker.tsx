"use client";

import { CalendarIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

function formatDate(date: Date | undefined) {
    if (!date) {
        return "";
    }

    return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

function isValidDate(date: Date | undefined) {
    if (!date) {
        return false;
    }
    return !isNaN(date.getTime());
}

export function Calendar28({ formDate, setFormDate, label }: {
    formDate: Date | undefined;
    setFormDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
    label?: string;
}) {
    const [open, setOpen] = React.useState(false);
    const [month, setMonth] = React.useState<Date | undefined>(formDate);
    const [value, setValue] = React.useState(formatDate(formDate));

    // Set date range: today to 10 years from now
    const today = new Date();
    const tenYearsFromNow = new Date();
    tenYearsFromNow.setFullYear(today.getFullYear() + 10);

    return (
        <div className="flex flex-col gap-3">
            <Label htmlFor="date" className="px-1">
                {label || "Date"}
            </Label>
            <div className="relative flex gap-2">
                <Input
                    id="date"
                    value={value}
                    placeholder="June 01, 2025"
                    className="bg-background pr-10"
                    onChange={(e) => {
                        const newDate = new Date(e.target.value);
                        setValue(e.target.value);
                        if (isValidDate(newDate)) {
                            setFormDate(newDate);
                            setMonth(newDate);
                        }
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "ArrowDown") {
                            e.preventDefault();
                            setOpen(true);
                        }
                    }}
                />
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            id="date-picker"
                            variant="ghost"
                            className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                        >
                            <CalendarIcon className="size-3.5" />
                            <span className="sr-only">Select date</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="end"
                        alignOffset={-8}
                        sideOffset={10}
                    >
                        <Calendar
                            mode="single"
                            defaultMonth={month}
                            numberOfMonths={2}
                            selected={formDate}
                            onSelect={(date) => {
                                setOpen(false);
                                setFormDate(date);
                                setValue(formatDate(date));
                            }}
                            className="rounded-lg border shadow-sm"
                        />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}
