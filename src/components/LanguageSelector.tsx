import { useState, useEffect } from 'react';
import { Search, Globe, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Language } from '../types';
import languagesData from '../data/languages.json';

interface LanguageSelectorProps {
  currentLanguage: Language;
  onSelect: (language: Language) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function LanguageSelector({
  currentLanguage,
  onSelect,
  isOpen,
  onClose
}: LanguageSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLanguages, setFilteredLanguages] = useState<Language[]>(languagesData as Language[]);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    setFilteredLanguages(
      (languagesData as Language[]).filter(lang => 
        lang.name.toLowerCase().includes(term) || 
        lang.type.toLowerCase().includes(term)
      )
    );
  }, [searchTerm]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-center p-4 pt-[10vh] font-sans">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[var(--color-claude-bg)]/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 15 }}
            className="w-full max-w-[600px] bg-[var(--color-claude-surface)] border border-[var(--color-claude-border)] rounded-2xl overflow-hidden relative shadow-xl flex flex-col h-[55vh] min-h-[400px]"
          >
            <div className="p-4 bg-[var(--color-claude-surface)] border-b border-[var(--color-claude-border)]">
              <div className="flex items-center justify-between mb-4 mt-2 px-2">
                <div className="flex items-center gap-2">
                   <div className="bg-[var(--color-claude-sub-alt)] text-[var(--color-claude-text)] p-2 rounded-lg">
                      <Globe className="w-4 h-4" />
                   </div>
                   <h3 className="text-lg font-serif font-semibold text-[var(--color-claude-text)] tracking-tight">Select Language</h3>
                </div>
                <button 
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-[var(--color-claude-sub)] hover:text-[var(--color-claude-text)] hover:bg-[var(--color-claude-bg)] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="relative group px-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[var(--color-claude-sub)] transition-colors" />
                <input
                  type="text"
                  placeholder="Search languages..."
                  className="w-full bg-[var(--color-claude-bg)] border border-[var(--color-claude-border)] focus:border-[var(--color-claude-main)] focus:ring-1 focus:ring-[var(--color-claude-main)] outline-none rounded-xl py-3 pl-11 pr-4 text-base text-[var(--color-claude-text)] placeholder-[var(--color-claude-sub)] transition-all font-sans"
                  autoFocus
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-3 bg-[var(--color-claude-surface)]">
              <div className="flex flex-col gap-1">
                {filteredLanguages.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => {
                      onSelect(lang);
                      onClose();
                    }}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all text-sm group ${
                      currentLanguage.id === lang.id
                        ? 'bg-[var(--color-claude-main)]/10 text-[var(--color-claude-main)] font-semibold'
                        : 'text-[var(--color-claude-sub)] hover:text-[var(--color-claude-text)] hover:bg-[var(--color-claude-bg)] font-medium'
                    }`}
                  >
                    <div className="flex flex-col items-start gap-0.5">
                      <span className={currentLanguage.id === lang.id ? 'text-[var(--color-claude-main)]' : 'text-[var(--color-claude-text)]'}>{lang.name}</span>
                      <span className="text-[11px] opacity-70 tracking-wide uppercase">{lang.type}</span>
                    </div>
                  </button>
                ))}
                {filteredLanguages.length === 0 && (
                  <div className="p-12 flex flex-col items-center justify-center text-center text-[var(--color-claude-sub)] text-sm">
                    <Search className="w-10 h-10 mb-3 opacity-20" />
                    <span>No languages found for "{searchTerm}"</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
