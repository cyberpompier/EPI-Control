"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { useController } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ComboboxWithLocalStorageProps {
  name: string;
  control: any;
  placeholder: string;
  emptyMessage: string;
  localStorageKey: string;
  initialItems?: string[];
}

const ComboboxWithLocalStorage: React.FC<ComboboxWithLocalStorageProps> = ({
  name,
  control,
  placeholder,
  emptyMessage,
  localStorageKey,
  initialItems = [],
}) => {
  const {
    field: { value, onChange, ...restField },
  } = useController({
    name,
    control,
  });

  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState<string[]>(initialItems);
  const [inputValue, setInputValue] = React.useState(value || "");

  // Load items from local storage on mount
  React.useEffect(() => {
    const storedItems = localStorage.getItem(localStorageKey);
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    }
  }, [localStorageKey]);

  // Update local storage when items change
  React.useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(items));
  }, [items, localStorageKey]);

  // Update input value when form value changes (e.g., initial load or reset)
  React.useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  const handleSelect = (currentValue: string) => {
    onChange(currentValue === value ? "" : currentValue);
    setInputValue(currentValue);
    setOpen(false);

    // Add to local storage if not already present
    if (!items.includes(currentValue)) {
      setItems((prevItems) => {
        const newItems = [currentValue, ...prevItems.filter(item => item !== currentValue)];
        return newItems.slice(0, 10); // Keep only the last 10 unique items
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue); // Update form field value directly as user types
  };

  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          {...restField}
        >
          {value ? value : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput
            placeholder={placeholder}
            value={inputValue}
            onValueChange={(currentValue) => {
              setInputValue(currentValue);
              onChange(currentValue); // Update form field value as user types
            }}
          />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {filteredItems.map((item) => (
                <CommandItem
                  key={item}
                  value={item}
                  onSelect={() => handleSelect(item)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ComboboxWithLocalStorage;