import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  searchTerm: string;
  selectedCategory: string;
}

export default function FAQAccordion({ items, searchTerm, selectedCategory }: FAQAccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  // Grouper les questions par catégorie
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, FAQItem[]>);

  // Filtrer les questions selon le terme de recherche
  const filterItems = (items: FAQItem[]) => {
    let filtered = items;
    
    // Filtrer par catégorie si une catégorie est sélectionnée
    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    // Filtrer par terme de recherche si présent
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.question.toLowerCase().includes(searchLower) ||
        item.answer.toLowerCase().includes(searchLower)
      );
    }
    
    return filtered;
  };

  return (
    <div className="space-y-6">
      {Object.entries(groupedItems).map(([category, categoryItems]) => {
        const filteredItems = filterItems(categoryItems);
        if (filteredItems.length === 0) return null;

        return (
          <div key={category} className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {category}
            </h3>
            <div className="space-y-1">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-full flex justify-between items-center px-4 py-3 text-left bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <span className="font-medium text-gray-900 dark:text-white">
                      {item.question}
                    </span>
                    {openItems.includes(item.id) ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                  {openItems.includes(item.id) && (
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50">
                      <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}