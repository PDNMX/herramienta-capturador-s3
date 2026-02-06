"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { createPortal } from "react-dom";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  value?: string | null;
  disabled?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
}

interface DropdownPosition {
  top: number;
  left: number;
  width: number;
  openAbove: boolean;
}

export const Combobox: React.FC<ComboboxProps> = ({
  options,
  onChange,
  placeholder = "Selecciona una opción",
  value,
  disabled = false,
  searchPlaceholder = "Buscar...",
  emptyMessage = "No se encontraron resultados.",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [position, setPosition] = useState<DropdownPosition>({
    top: 0,
    left: 0,
    width: 0,
    openAbove: false,
  });

  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Map<number, HTMLLIElement>>(new Map());

  const filteredOptions = useMemo(
    () =>
      options.filter((option) =>
        option.label.toLowerCase().includes(search.toLowerCase())
      ),
    [options, search]
  );

  // Calculate dropdown position based on trigger element
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const dropdownMaxHeight = 300; // max-h-60 = 240px + search bar ~60px
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const openAbove =
      spaceBelow < dropdownMaxHeight && spaceAbove > spaceBelow;

    setPosition({
      top: openAbove ? rect.top : rect.bottom + 4,
      left: rect.left,
      width: rect.width,
      openAbove,
    });
  }, []);

  // Close on outside click (checks both trigger and portal dropdown)
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedInsideTrigger = triggerRef.current?.contains(target);
      const clickedInsideDropdown = dropdownRef.current?.contains(target);

      if (!clickedInsideTrigger && !clickedInsideDropdown) {
        setIsOpen(false);
        setSearch("");
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Reposition on scroll/resize while open
  useEffect(() => {
    if (!isOpen) return;

    updatePosition();

    const handleRepositionEvents = () => {
      updatePosition();
    };

    window.addEventListener("scroll", handleRepositionEvents, true);
    window.addEventListener("resize", handleRepositionEvents);

    return () => {
      window.removeEventListener("scroll", handleRepositionEvents, true);
      window.removeEventListener("resize", handleRepositionEvents);
    };
  }, [isOpen, updatePosition]);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Small delay to ensure portal is mounted
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [isOpen]);

  // Reset highlight when filter changes
  useEffect(() => {
    setHighlightedIndex(filteredOptions.length > 0 ? 0 : -1);
  }, [filteredOptions.length, search]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0) {
      const el = itemRefs.current.get(highlightedIndex);
      if (el) {
        el.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex]);

  const handleSelect = useCallback(
    (optionValue: string) => {
      onChange(optionValue);
      setSearch("");
      setIsOpen(false);
      setHighlightedIndex(-1);
    },
    [onChange]
  );

  const handleToggle = useCallback(() => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
      if (isOpen) {
        setSearch("");
        setHighlightedIndex(-1);
      }
    }
  }, [disabled, isOpen]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
          e.preventDefault();
          setIsOpen(true);
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (
            highlightedIndex >= 0 &&
            highlightedIndex < filteredOptions.length
          ) {
            handleSelect(filteredOptions[highlightedIndex].value);
          }
          break;
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          setSearch("");
          setHighlightedIndex(-1);
          break;
        case "Home":
          e.preventDefault();
          setHighlightedIndex(0);
          break;
        case "End":
          e.preventDefault();
          setHighlightedIndex(filteredOptions.length - 1);
          break;
      }
    },
    [isOpen, filteredOptions, highlightedIndex, handleSelect]
  );

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value),
    [options, value]
  );

  const listboxId = useRef(
    `combobox-listbox-${Math.random().toString(36).slice(2, 9)}`
  ).current;

  // Dropdown content rendered via portal
  const dropdownContent = isOpen ? (
    <div
      ref={dropdownRef}
      className="fixed z-[9999] rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 duration-100"
      role="dialog"
      aria-label="Opciones"
      style={{
        top: position.openAbove ? undefined : `${position.top}px`,
        bottom: position.openAbove
          ? `${window.innerHeight - position.top + 4}px`
          : undefined,
        left: `${position.left}px`,
        width: `${position.width}px`,
      }}
      onKeyDown={handleKeyDown}
    >
      {/* Search input */}
      <div className="flex items-center gap-2 border-b px-3 py-2">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground"
          aria-label="Buscar opciones"
          aria-controls={listboxId}
          aria-activedescendant={
            highlightedIndex >= 0
              ? `${listboxId}-option-${highlightedIndex}`
              : undefined
          }
          role="searchbox"
          autoComplete="off"
        />
      </div>

      {/* Options list */}
      <ul
        ref={listRef}
        id={listboxId}
        role="listbox"
        aria-label="Opciones disponibles"
        className="max-h-60 overflow-auto p-1"
      >
        {filteredOptions.length === 0 ? (
          <li className="relative flex select-none items-center justify-center rounded-sm px-2 py-4 text-sm text-muted-foreground">
            {emptyMessage}
          </li>
        ) : (
          filteredOptions.map((option, index) => {
            const isSelected = value === option.value;
            const isHighlighted = index === highlightedIndex;

            return (
              <li
                key={option.value}
                id={`${listboxId}-option-${index}`}
                ref={(el) => {
                  if (el) itemRefs.current.set(index, el);
                  else itemRefs.current.delete(index);
                }}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(option.value)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={cn(
                  "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
                  isHighlighted && "bg-accent text-accent-foreground",
                  isSelected && !isHighlighted && "bg-accent/50",
                  !isHighlighted &&
                    !isSelected &&
                    "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4 flex-shrink-0",
                    isSelected ? "opacity-100" : "opacity-0"
                  )}
                />
                <span className="truncate flex-1">{option.label}</span>
              </li>
            );
          })
        )}
      </ul>
    </div>
  ) : null;

  return (
    <div onKeyDown={handleKeyDown}>
      <Button
        ref={triggerRef}
        type="button"
        variant="outline"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={isOpen ? listboxId : undefined}
        disabled={disabled}
        className="w-full justify-between min-h-[2.25rem] h-auto py-1.5 font-normal"
        onClick={handleToggle}
      >
        <span
          className="truncate flex-1 text-left mr-2"
          title={selectedOption?.label}
        >
          {selectedOption ? (
            selectedOption.label
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </span>
        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
      </Button>

      {typeof window !== "undefined" &&
        createPortal(dropdownContent, document.body)}
    </div>
  );
};
