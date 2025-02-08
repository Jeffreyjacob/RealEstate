"use client";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useGetAddressSuggestionQuery } from "@/services/addressSuggestionApi";
import { Check } from "lucide-react";
import React, { useState, useRef } from "react";

interface LocationOptionProps {
  value: string;
  onChange: (value: string) => void;
}

const LocationOption: React.FC<LocationOptionProps> = ({ value, onChange }) => {
  const [isCommandVisible, setIsCommandVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data } = useGetAddressSuggestionQuery({ text: value });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    if (!isCommandVisible) setIsCommandVisible(true);
  };

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setIsCommandVisible(false);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      setIsCommandVisible(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <Input
        type="text"
        placeholder="Search address"
        value={value}
        onFocus={() => setIsCommandVisible(true)}
        onChange={handleSearchChange}
        className="w-full"
      />
      {isCommandVisible && (
        <div className="absolute z-10 w-full bg-white border rounded-md shadow-md mt-2">
          <Command>
            <CommandList>
              <CommandEmpty>No Address Found.</CommandEmpty>
              <CommandGroup>
                {data?.results.map((address, index) => (
                  <CommandItem
                    key={index}
                    value={address.formatted}
                    onSelect={() => handleSelect(address.formatted)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === address.formatted ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {address.formatted}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
};

export default LocationOption;
