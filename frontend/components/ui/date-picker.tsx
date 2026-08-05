"use client";

import * as React from "react";
import { format, parse, isValid } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DatePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  placeholder?: string;
  min?: string;
  className?: string;
}

export function DatePicker({
  value,
  onChange,
  onBlur,
  disabled = false,
  placeholder = "Seleccionar fecha",
  min,
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const selectedDate = React.useMemo(() => {
    if (!value) return undefined;
    const parsed = parse(value, "yyyy-MM-dd", new Date());
    return isValid(parsed) ? parsed : undefined;
  }, [value]);

  const minDate = React.useMemo(() => {
    if (!min) return undefined;
    const parsed = parse(min, "yyyy-MM-dd", new Date());
    return isValid(parsed) ? parsed : undefined;
  }, [min]);

  const handleSelect = (date: Date | undefined) => {
    if (!date) return;
    onChange?.(format(date, "yyyy-MM-dd"));
    setOpen(false);
    onBlur?.();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          onBlur={onBlur}
          className={cn(
            "w-full h-10 justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
          {selectedDate ? (
            <span className="capitalize">
              {format(selectedDate, "d 'de' MMMM 'de' yyyy", { locale: es })}
            </span>
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          locale={es}
          disabled={minDate ? (date) => date < minDate : undefined}
          defaultMonth={selectedDate ?? minDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
