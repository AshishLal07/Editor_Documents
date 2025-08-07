import { type PageDimensions } from "../types/editor.types";

// A4 page dimensions (at 96 DPI)
export const A4_DIMENSIONS: PageDimensions = {
  width: 794, // 210mm in pixels
  height: 1123, // 297mm in pixels
  margin: 40, // Default margin
};

// Font families available in the editor
export const FONT_FAMILIES = [
  "Times New Roman",
  "Arial",
  "Calibri",
  "Georgia",
  "Verdana",
  "Helvetica",
  "Courier New",
  "Comic Sans MS",
] as const;

// Font sizes available in the editor
export const FONT_SIZES = [
  8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 32, 36, 48, 72,
] as const;

// Zoom levels
export const ZOOM_LEVELS = [25, 50, 75, 100, 125, 150, 175, 200] as const;

// Default editor settings
export const DEFAULT_EDITOR_SETTINGS = {
  fontSize: 12,
  fontFamily: "Times New Roman" as const,
  zoom: 100,
  autoSave: true,
  autoPageBreak: true,
  showPageNumbers: true,
  showHeaders: true,
  showFooters: true,
  pageMargin: 40,
};

// Format commands for execCommand
export const FORMAT_COMMANDS = {
  BOLD: "bold",
  ITALIC: "italic",
  UNDERLINE: "underline",
  ALIGN_LEFT: "justifyLeft",
  ALIGN_CENTER: "justifyCenter",
  ALIGN_RIGHT: "justifyRight",
  ALIGN_JUSTIFY: "justifyFull",
  INSERT_UNORDERED_LIST: "insertUnorderedList",
  INSERT_ORDERED_LIST: "insertOrderedList",
  UNDO: "undo",
  REDO: "redo",
  REMOVE_FORMAT: "removeFormat",
  INSERT_HTML: "insertHTML",
} as const;

// Keyboard shortcuts
export const KEYBOARD_SHORTCUTS = {
  BOLD: "Ctrl+B",
  ITALIC: "Ctrl+I",
  UNDERLINE: "Ctrl+U",
  SAVE: "Ctrl+S",
  PRINT: "Ctrl+P",
  UNDO: "Ctrl+Z",
  REDO: "Ctrl+Y",
  SELECT_ALL: "Ctrl+A",
} as const;

// Page break HTML
export const PAGE_BREAK_HTML =
  '<div class="page-break" style="page-break-before: always;"></div>';

// Word count regex
export const WORD_COUNT_REGEX = /\S+/g;
