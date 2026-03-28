const englishWords = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
  "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
  "people", "into", "year", "your", "good", "some", "could", "them", "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
  "back", "after", "use", "two", "how", "our", "work", "first", "well", "way", "even", "new", "want", "because", "any", "these", "give", "day", "most", "us"
];

const jsWords = [
  "const", "let", "var", "function", "return", "if", "else", "switch", "case", "break", "continue", "for", "while", "do", "try", "catch", "finally", "throw", "import", "export",
  "async", "await", "Promise", "resolve", "reject", "then", "catch", "native", "window", "document", "console", "log", "warn", "error", "info", "debug", "map", "filter", "reduce", "forEach",
  "Object", "Array", "String", "Number", "Boolean", "Symbol", "BigInt", "undefined", "null", "NaN", "Infinity", "this", "super", "constructor", "class", "extends", "implements", "interface", "type", "enum"
];

const dictionaries: Record<string, string[]> = {
  en: englishWords,
  js: jsWords,
};

export function generateWords(languageId: string, count: number = 50): string[] {
  const dictionary = dictionaries[languageId] || englishWords;
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * dictionary.length);
    result.push(dictionary[randomIndex]);
  }
  return result;
}

export function generateQuotes(): string[] {
  return [
    "The only way to do great work is to love what you do.",
    "Innovation distinguishes between a leader and a follower.",
    "Your time is limited, so don't waste it living someone else's life.",
    "Stay hungry, stay foolish.",
    "The best way to predict the future is to invent it."
  ];
}
