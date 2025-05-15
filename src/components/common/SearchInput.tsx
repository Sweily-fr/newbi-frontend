import React, { forwardRef } from "react";
import { SearchNormal1, CloseCircle } from "iconsax-react";

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
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <SearchNormal1
            size="20"
            color="rgba(0, 0, 0, 0.5)"
            variant="Outline"
          />
        </div>
        <input
          ref={ref}
          type="text"
          className={`block ${width} pl-11 ${hasValue && onClear ? "pr-10" : "pr-4"} py-3 border ${
            isLoading ? "border-[#5b50ff]" : "border-gray-200"
          } rounded-full leading-5 bg-white placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:ring-1 focus:ring-[#5b50ff] focus:border-[#5b50ff] shadow-sm text-sm transition-colors duration-200 ${className}`}
          value={value}
          {...props}
        />
        {hasValue && onClear && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-4">
            <button
              type="button"
              onClick={onClear}
              className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-0"
            >
              <CloseCircle 
                size="18" 
                color="rgba(0, 0, 0, 0.5)"
                variant="Bulk" 
              />
            </button>
          </div>
        )}
        {isLoading && !hasValue && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-4">
            <div className="h-4 w-4 border-t-2 border-r-2 border-[#5b50ff] rounded-full animate-spin"></div>
          </div>
        )}
        {isLoading && hasValue && onClear && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-11">
            <div className="h-4 w-4 border-t-2 border-r-2 border-[#5b50ff] rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";

export default SearchInput;