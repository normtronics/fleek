import { useState, useRef, useEffect } from 'react';
import { useThemeJson } from '../hooks/useThemeJson';

export interface DropdownOption {
  value: string;
  label: string;
}

export interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onCreateNew?: (label: string) => void;
  disabled?: boolean;
  className?: string;
  allowCreate?: boolean;
  searchable?: boolean;
}

export function Dropdown({ 
  options, 
  value, 
  placeholder = 'Select an option', 
  onChange, 
  onCreateNew,
  disabled = false,
  className = '',
  allowCreate = false,
  searchable = false
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState<DropdownOption | null>(
    value ? options.find(opt => opt.value === value) || null : null
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { colors, components } = useThemeJson();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update selected option when value prop changes
  useEffect(() => {
    const newSelected = value ? options.find(opt => opt.value === value) || null : null;
    setSelectedOption(newSelected);
  }, [value, options]);

  const handleSelect = (option: DropdownOption) => {
    setSelectedOption(option);
    setIsOpen(false);
    setSearchTerm('');
    onChange?.(option.value);
  };

  const handleCreateNew = () => {
    if (searchTerm.trim() && onCreateNew) {
      onCreateNew(searchTerm.trim());
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const toggleDropdown = () => {
    if (!disabled) {
      const newIsOpen = !isOpen;
      setIsOpen(newIsOpen);
      if (newIsOpen && searchable && inputRef.current) {
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchTerm.trim() && allowCreate && onCreateNew) {
      e.preventDefault();
      const exactMatch = filteredOptions.find(opt => 
        opt.label.toLowerCase() === searchTerm.toLowerCase()
      );
      if (!exactMatch) {
        handleCreateNew();
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  // Filter options based on search term
  const filteredOptions = searchable && searchTerm
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  // Check if we should show "Create new" option
  const shouldShowCreateNew = allowCreate && 
    onCreateNew && 
    searchTerm.trim() && 
    !filteredOptions.some(opt => opt.label.toLowerCase() === searchTerm.toLowerCase());

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div
        className="relative w-full rounded-xl transition-all duration-200 backdrop-blur-sm"
        style={{
          backgroundColor: components.input.background,
          border: `1px solid ${isOpen ? components.input.borderFocus : components.input.border}`,
          boxShadow: isOpen ? components.input.shadowFocus : components.input.shadow,
        }}
      >
        {searchable ? (
          <input
            ref={inputRef}
            type="text"
            className="w-full px-4 py-3 bg-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed pr-10"
            style={{
              color: colors.text.primary,
            }}
            placeholder={selectedOption ? selectedOption.label : placeholder}
            value={searchTerm}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
          />
        ) : (
          <button
            type="button"
            className="w-full px-4 py-3 text-left bg-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed pr-10"
            style={{
              color: selectedOption ? colors.text.primary : colors.text.tertiary,
            }}
            onClick={toggleDropdown}
            disabled={disabled}
          >
            <span className="block truncate">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </button>
        )}
        
        <button
          type="button"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-white/10 rounded"
          onClick={toggleDropdown}
          disabled={disabled}
        >
          <svg
            className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ color: colors.text.tertiary }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div
          className="absolute z-50 w-full mt-1 rounded-xl backdrop-blur-md shadow-lg max-h-60 overflow-auto"
          style={{
            backgroundColor: components.card.background,
            border: `1px solid ${components.card.border}`,
            boxShadow: components.card.shadow,
          }}
        >
          {filteredOptions.length === 0 && !shouldShowCreateNew ? (
            <div className="px-4 py-3 text-center" style={{ color: colors.text.tertiary }}>
              No options found
            </div>
          ) : (
            <>
              {filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors duration-150 first:rounded-t-xl"
                  style={{ color: colors.text.primary }}
                  onClick={() => handleSelect(option)}
                >
                  {option.label}
                </button>
              ))}
              
              {shouldShowCreateNew && (
                <button
                  type="button"
                  className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors duration-150 border-t border-white/10 last:rounded-b-xl"
                  style={{ color: colors.primary['60'] }}
                  onClick={handleCreateNew}
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create "{searchTerm}"
                  </div>
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
} 