"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value?: string;
  onChange?: (date: string) => void;
  disabled?: boolean;
}

export function DatePicker({ value, onChange, disabled }: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [displayDate, setDisplayDate] = React.useState<Date>(
    value ? new Date(value + "T00:00:00Z") : new Date(),
  );

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setDisplayDate(
      new Date(displayDate.getFullYear(), displayDate.getMonth() - 1),
    );
  };

  const handleNextMonth = () => {
    setDisplayDate(
      new Date(displayDate.getFullYear(), displayDate.getMonth() + 1),
    );
  };

  const handleSelectDate = (day: number) => {
    const selected = new Date(
      displayDate.getFullYear(),
      displayDate.getMonth(),
      day,
    );
    const dateStr = selected.toISOString().split("T")[0];
    onChange?.(dateStr);
    setIsOpen(false);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Select date...";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const monthName = displayDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const daysInMonth = getDaysInMonth(displayDate);
  const firstDay = getFirstDayOfMonth(displayDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "w-full px-6 py-4 rounded-[1.5rem] neo-pressed text-gray-800 font-medium text-left transition-all",
          disabled && "opacity-50 cursor-not-allowed",
        )}
      >
        {formatDate(value)}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute bottom-full left-0 mb-3 z-[101] w-80 p-6 rounded-[2rem] neo-flat shadow-2xl"
            >
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 rounded-lg hover:neo-pressed"
                >
                  <ChevronLeft className="w-5 h-5 text-[#4A6E91]" />
                </button>
                <h3 className="text-sm font-bold text-gray-800 min-w-40 text-center">
                  {monthName}
                </h3>
                <button
                  onClick={handleNextMonth}
                  className="p-2 rounded-lg hover:neo-pressed"
                >
                  <ChevronRight className="w-5 h-5 text-[#4A6E91]" />
                </button>
              </div>

              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-1 mb-3">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                  <div
                    key={day}
                    className="text-center text-[10px] font-bold text-gray-500 uppercase tracking-wider py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {emptyDays.map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {days.map((day) => {
                  const isSelected =
                    value &&
                    new Date(value + "T00:00:00Z").toDateString() ===
                      new Date(
                        displayDate.getFullYear(),
                        displayDate.getMonth(),
                        day,
                      ).toDateString();

                  return (
                    <motion.button
                      key={day}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSelectDate(day)}
                      className={cn(
                        "aspect-square rounded-lg text-sm font-semibold",
                        isSelected
                          ? "neo-vibrant text-white shadow-lg scale-105"
                          : "neo-pressed text-gray-700 hover:bg-black/5",
                      )}
                    >
                      {day}
                    </motion.button>
                  );
                })}
              </div>

              {/* Today Button */}
              <button
                onClick={() => {
                  const today = new Date().toISOString().split("T")[0];
                  onChange?.(today);
                  setDisplayDate(new Date());
                  setIsOpen(false);
                }}
                className="w-full mt-6 px-4 py-2 rounded-lg neo-pressed text-xs font-bold uppercase tracking-widest text-[#4A6E91] hover:text-[#24292E] transition-colors"
              >
                Today
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
