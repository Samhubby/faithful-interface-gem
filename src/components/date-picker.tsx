import * as React from "react";
import { format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DatePickerProps {
  /** ISO date string (YYYY-MM-DD) */
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disablePast?: boolean;
  className?: string;
}

/** A calendar-driven date picker that emits YYYY-MM-DD strings. */
export function DatePicker({ value, onChange, placeholder = "Pick a date", disablePast, className }: DatePickerProps) {
  const date = value ? parseISO(value) : undefined;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground", className)}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => onChange(d ? format(d, "yyyy-MM-dd") : "")}
          disabled={disablePast ? (d) => d < today : undefined}
          initialFocus
          className={cn("p-3 pointer-events-auto")}
        />
      </PopoverContent>
    </Popover>
  );
}
