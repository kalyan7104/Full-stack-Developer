import { useState } from 'react';

interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

interface ParsedTransaction {
  amount: number;
  description: string;
  type: 'income' | 'expense';
  category_id: string;
  category: Category;
  ai_confidence: number;
  date?: string;
}

export const useAITransactionParser = (categories: Category[]) => {
  const [loading, setLoading] = useState(false);

  const parseTransaction = async (input: string): Promise<ParsedTransaction | null> => {
    setLoading(true);
    
    try {
      // Enhanced AI parsing logic
      let amount = 0;
      let description = input.trim();
      let type: 'income' | 'expense' = 'expense';
      let categoryName = 'Other';
      let confidence = 0.8;
      let transactionDate = new Date().toISOString().split('T')[0]; // Today by default

      // Multi-transaction parsing support
      const multiPattern = /(.+?)\s*\$(\d+\.?\d*)\s*(?:and|,)\s*(.+?)\s*\$(\d+\.?\d*)/i;
      const multiMatch = input.match(multiPattern);
      
      if (multiMatch) {
        // For now, just take the first transaction
        description = multiMatch[1].trim();
        amount = parseFloat(multiMatch[2]);
        confidence = 0.9;
      } else {
        // Single transaction parsing
        const amountMatch = input.match(/\$?(\d+\.?\d*)/);
        if (amountMatch) {
          amount = parseFloat(amountMatch[1]);
        }
      }

      // Smart date parsing
      const datePatterns = [
        { pattern: /yesterday/i, days: -1 },
        { pattern: /last\s+friday/i, days: -((new Date().getDay() + 2) % 7) || -7 },
        { pattern: /last\s+monday/i, days: -((new Date().getDay() + 6) % 7) || -7 },
        { pattern: /last\s+week/i, days: -7 },
        { pattern: /(\d{1,2})\/(\d{1,2})/i, custom: true },
      ];

      for (const datePattern of datePatterns) {
        if (datePattern.pattern.test(input)) {
          if (datePattern.custom) {
            const match = input.match(datePattern.pattern);
            if (match) {
              const [, month, day] = match;
              const year = new Date().getFullYear();
              const date = new Date(year, parseInt(month) - 1, parseInt(day));
              transactionDate = date.toISOString().split('T')[0];
            }
          } else {
            const date = new Date();
            date.setDate(date.getDate() + (datePattern.days || 0));
            transactionDate = date.toISOString().split('T')[0];
          }
          break;
        }
      }

      // Income detection
      const incomeKeywords = ['salary', 'paid', 'income', 'bonus', 'refund', 'cashback', 'dividend', 'freelance', 'paycheck'];
      if (incomeKeywords.some(keyword => input.toLowerCase().includes(keyword))) {
        type = 'income';
        categoryName = 'Income';
        confidence = 0.95;
      }

      // Enhanced category detection
      const categoryMappings = [
        { keywords: ['coffee', 'starbucks', 'cafe', 'espresso', 'latte'], category: 'Food & Dining', icon: '☕' },
        { keywords: ['food', 'restaurant', 'dinner', 'lunch', 'breakfast', 'pizza', 'burger', 'chinese', 'italian', 'mexican'], category: 'Food & Dining', icon: '🍽️' },
        { keywords: ['grocery', 'whole foods', 'supermarket', 'trader joes', 'walmart', 'costco'], category: 'Groceries', icon: '🛒' },
        { keywords: ['gas', 'gasoline', 'fuel', 'shell', 'chevron', 'exxon'], category: 'Transportation', icon: '⛽' },
        { keywords: ['uber', 'lyft', 'taxi', 'bus', 'train', 'metro', 'parking'], category: 'Transportation', icon: '🚗' },
        { keywords: ['amazon', 'purchase', 'shopping', 'buy', 'bought'], category: 'Shopping', icon: '🛍️' },
        { keywords: ['netflix', 'spotify', 'subscription', 'hulu', 'disney', 'prime'], category: 'Entertainment', icon: '🎬' },
        { keywords: ['watch', 'phone', 'laptop', 'samsung', 'apple', 'electronics'], category: 'Electronics', icon: '📱' },
        { keywords: ['rent', 'mortgage', 'utilities', 'electric', 'water', 'internet'], category: 'Bills', icon: '🏠' },
        { keywords: ['doctor', 'hospital', 'pharmacy', 'medicine', 'health'], category: 'Healthcare', icon: '🏥' },
        { keywords: ['gym', 'fitness', 'yoga', 'sports'], category: 'Fitness', icon: '💪' },
      ];

      for (const mapping of categoryMappings) {
        if (mapping.keywords.some(keyword => input.toLowerCase().includes(keyword))) {
          categoryName = mapping.category;
          confidence = Math.min(confidence + 0.1, 1.0);
          
          // Create category if it doesn't exist
          let category = categories.find(c => c.name === categoryName);
          if (!category) {
            category = {
              id: `temp-${Date.now()}`,
              name: categoryName,
              color: '#3B82F6',
              icon: mapping.icon
            };
          }
          break;
        }
      }

      const category = categories.find(c => c.name === categoryName) || 
                     categories.find(c => c.name === 'Other') ||
                     { id: 'temp-other', name: 'Other', color: '#6B7280', icon: '📄' };

      return {
        amount,
        description,
        type,
        category_id: category.id,
        category,
        ai_confidence: confidence,
        date: transactionDate
      };
    } catch (error) {
      console.error('Error parsing transaction:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { parseTransaction, loading };
};