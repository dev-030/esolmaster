// ─── Editor Mode ──────────────────────────────────────────────────────────────
// Used by all editor components to control create / edit / disabled state.

export type EditorMode = "create" | "edit" | "disabled";

// ─── Vocabulary Suggestion ────────────────────────────────────────────────────
// Represents a vocab word from the pool used for auto-suggest dropdowns.

export type VocabSuggestion = {
  id: string;
  wordName: string;
  definition: string;
  imageUrl?: string;
};