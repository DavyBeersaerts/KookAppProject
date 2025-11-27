"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";
import { TRANSLATIONS } from "@/lib/constants";

interface Ingredient {
  id: string;
  canonicalKey: string;
  names: {
    en: string;
    nl: string;
  };
  synonyms?: {
    en?: string[];
    nl?: string[];
  };
  category?: string;
  defaultUnit?: string;
}

interface IngredientAutocompleteProps {
  value: string;
  onChange: (value: string, ingredientId?: string) => void;
  onSelect?: (ingredient: Ingredient) => void;
  placeholder?: string;
  className?: string;
}

export function IngredientAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder,
  className,
}: IngredientAutocompleteProps) {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<Ingredient[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCreatePrompt, setShowCreatePrompt] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowCreatePrompt(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchIngredients = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setShowCreatePrompt(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/ingredients?q=${encodeURIComponent(searchQuery)}&locale=${language}`
      );
      const data = await response.json();
      
      if (data.ingredients && data.ingredients.length > 0) {
        setSuggestions(data.ingredients);
        setShowCreatePrompt(false);
      } else {
        setSuggestions([]);
        setShowCreatePrompt(true);
      }
      setIsOpen(true);
    } catch (error) {
      console.error("Failed to search ingredients:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (newValue: string) => {
    setQuery(newValue);
    onChange(newValue);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      searchIngredients(newValue);
    }, 300);
  };

  const handleSelect = (ingredient: Ingredient) => {
    const displayName = ingredient.names[language] || ingredient.names.en;
    setQuery(displayName);
    onChange(displayName, ingredient.id);
    setIsOpen(false);
    setShowCreatePrompt(false);
    
    if (onSelect) {
      onSelect(ingredient);
    }
  };

  const handleCreateNew = () => {
    onChange(query);
    setIsOpen(false);
    setShowCreatePrompt(false);
  };

  return (
    <div ref={wrapperRef} className={`relative ${className || ""}`}>
      <Input
        type="text"
        value={query}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() => {
          if (query.trim()) {
            searchIngredients(query);
          }
        }}
        placeholder={placeholder || t.searchIngredients}
        className="w-full"
      />
      
      {isOpen && (suggestions.length > 0 || showCreatePrompt) && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {loading && (
            <div className="px-4 py-2 text-sm text-gray-500">{t.loading}</div>
          )}
          
          {!loading && suggestions.length > 0 && (
            <ul className="py-1">
              {suggestions.map((ingredient) => {
                const displayName = ingredient.names[language] || ingredient.names.en;
                const altName = language === "en" ? ingredient.names.nl : ingredient.names.en;
                
                return (
                  <li
                    key={ingredient.id}
                    onClick={() => handleSelect(ingredient)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <div className="font-medium">{displayName}</div>
                    {altName && altName !== displayName && (
                      <div className="text-xs text-gray-500">{altName}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
          
          {!loading && showCreatePrompt && (
            <div className="px-4 py-3 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">
                {t.createIngredientPrompt} <strong>{query}</strong>
              </p>
              <Button
                type="button"
                onClick={handleCreateNew}
                variant="outline"
                size="sm"
                className="w-full"
              >
                {t.createNewIngredient}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
