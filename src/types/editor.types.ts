export interface DocumentPage {
  id: number;
  content: string;
  wordCount: number;
  characterCount: number;
}

export interface DocumentState {
  pages: DocumentPage[];
  currentPage: number;
  title: string;
  fontSize: number;
  fontFamily: string;
  zoom: number;
  wordCount: number;
  characterCount: number;
  isModified: boolean;
  lastSaved?: Date;
}

export interface EditorSettings {
  autoSave: boolean;
  autoPageBreak: boolean;
  showPageNumbers: boolean;
  showHeaders: boolean;
  showFooters: boolean;
  pageMargin: number;
}

export interface FormatCommand {
  command: string;
  value?: string;
}

export interface PageDimensions {
  width: number;
  height: number;
  margin: number;
}

export interface ExportOptions {
  format: "html" | "pdf" | "docx";
  includeStyles: boolean;
  includePageNumbers: boolean;
}

export interface PrintOptions {
  includeHeaders: boolean;
  includeFooters: boolean;
  pageNumbers: boolean;
  margins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

export type TextAlignment = "left" | "center" | "right" | "justify";
export type ListType = "bulleted" | "numbered";
export type FontWeight = "normal" | "bold";
export type FontStyle = "normal" | "italic";
export type TextDecoration = "none" | "underline";
