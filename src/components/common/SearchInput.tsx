import React, { forwardRef } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isLoading?: boolean;
  onClear?: () => void;
  width?: string;
}

/**
 * Composant de champ de recherche avec icône
 */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    { 
      isLoading = false, 
      onClear, 
      value, 
      width = "w-full", 
      className = "", 
      ...props 
    }, 
    ref
  ) => {
    const hasValue = value && String(value).length > 0;

    return (
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <MagnifyingGlassIcon
            className={`h-5 w-5 ${
              isLoading ? "text-[#5b50ff]" : "text-gray-400"
            }`}
          />
        </div>
        <input
          ref={ref}
          type="text"
          className={`block ${width} pl-10 ${hasValue && onClear ? "pr-10" : "pr-3"} py-2 border ${
            isLoading ? "border-[#5b50ff]" : "border-gray-300"
          } rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#5b50ff] focus:border-[#5b50ff] sm:text-sm transition-colors duration-200 ${className}`}
          value={value}
          {...props}
        />
        {hasValue && onClear && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <button
              type="button"
              onClick={onClear}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        )}
        {isLoading && !hasValue && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <div className="h-4 w-4 border-t-2 border-r-2 border-[#5b50ff] rounded-full animate-spin"></div>
          </div>
        )}
        {isLoading && hasValue && onClear && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-10">
            <div className="h-4 w-4 border-t-2 border-r-2 border-[#5b50ff] rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";

export default SearchInput;