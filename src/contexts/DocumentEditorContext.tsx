import React, {
  createContext,
  //   useContext,
  useReducer,
  useCallback,
  useRef,
  useContext,
} from "react";
import type {
  DocumentState,
  DocumentPage,
  FormatCommand,
} from "../types/editor.types";
import {
  DEFAULT_EDITOR_SETTINGS,
  //   FORMAT_COMMANDS,
  WORD_COUNT_REGEX,
} from "../constants/editorConstants";

// Action types
type DocumentAction =
  | { type: "SET_CONTENT"; payload: { pageId: number; content: string } }
  | { type: "ADD_PAGE"; payload?: DocumentPage }
  | { type: "DELETE_PAGE"; payload: number }
  | { type: "SET_CURRENT_PAGE"; payload: number }
  | { type: "SET_FONT_SIZE"; payload: number }
  | { type: "SET_FONT_FAMILY"; payload: string }
  | { type: "SET_ZOOM"; payload: number }
  | { type: "SET_TITLE"; payload: string }
  | { type: "MARK_MODIFIED"; payload: boolean }
  | { type: "UPDATE_STATS" };

// Initial state
const initialState: DocumentState = {
  pages: [{ id: 1, content: "", wordCount: 0, characterCount: 0 }],
  currentPage: 1,
  title: "Untitled Document",
  fontSize: DEFAULT_EDITOR_SETTINGS.fontSize,
  fontFamily: DEFAULT_EDITOR_SETTINGS.fontFamily,
  zoom: DEFAULT_EDITOR_SETTINGS.zoom,
  wordCount: 0,
  characterCount: 0,
  isModified: false,
};

// Reducer
const documentReducer = (
  state: DocumentState,
  action: DocumentAction
): DocumentState => {
  switch (action.type) {
    case "SET_CONTENT": {
      const updatedPages = state.pages.map((page: DocumentPage) => {
        if (page.id === action.payload.pageId) {
          const content = action.payload.content;
          const wordCount = (content.match(WORD_COUNT_REGEX) || []).length;
          const characterCount = content.replace(/<[^>]*>/g, "").length;
          return { ...page, content, wordCount, characterCount };
        }
        return page;
      });

      const totalWords = updatedPages.reduce(
        (sum: number, page: DocumentPage) => sum + page.wordCount,
        0
      );
      const totalChars = updatedPages.reduce(
        (sum: number, page: DocumentPage) => sum + page.characterCount,
        0
      );

      return {
        ...state,
        pages: updatedPages,
        wordCount: totalWords,
        characterCount: totalChars,
        isModified: true,
      };
    }

    case "ADD_PAGE": {
      const newId = Math.max(...state.pages.map((p: DocumentPage) => p.id)) + 1;
      const newPage: DocumentPage = action.payload || {
        id: newId,
        content: "",
        wordCount: 0,
        characterCount: 0,
      };
      return {
        ...state,
        pages: [...state.pages, newPage],
        currentPage: newPage.id,
        isModified: true,
      };
    }

    case "DELETE_PAGE": {
      if (state.pages.length <= 1) return state;
      const filteredPages = state.pages.filter(
        (page: DocumentPage) => page.id !== action.payload
      );
      const newCurrentPage = filteredPages[0]?.id || 1;
      return {
        ...state,
        pages: filteredPages,
        currentPage: newCurrentPage,
        isModified: true,
      };
    }

    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: action.payload };

    case "SET_FONT_SIZE":
      return { ...state, fontSize: action.payload, isModified: true };

    case "SET_FONT_FAMILY":
      return { ...state, fontFamily: action.payload, isModified: true };

    case "SET_ZOOM":
      return { ...state, zoom: action.payload };

    case "SET_TITLE":
      return { ...state, title: action.payload, isModified: true };

    case "MARK_MODIFIED":
      return { ...state, isModified: action.payload };

    default:
      return state;
  }
};

// Context
interface DocumentEditorContextType {
  state: DocumentState;
  actions: {
    setContent: (pageId: number, content: string) => void;
    addPage: (page?: DocumentPage) => void;
    deletePage: (pageId: number) => void;
    setCurrentPage: (pageId: number) => void;
    setFontSize: (size: number) => void;
    setFontFamily: (family: string) => void;
    setZoom: (zoom: number) => void;
    setTitle: (title: string) => void;
    formatText: (command: FormatCommand) => void;
    insertPageBreak: () => void;
    saveDocument: () => void;
  };
  refs: {
    editorRefs: React.MutableRefObject<{
      [key: number]: HTMLDivElement | null;
    }>;
  };
}

export const DocumentEditorContext =
  createContext<DocumentEditorContextType | null>(null);

// Provider component
export const DocumentEditorProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [state, dispatch] = useReducer(documentReducer, initialState);
  const editorRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const setContent = useCallback((pageId: number, content: string) => {
    dispatch({ type: "SET_CONTENT", payload: { pageId, content } });
  }, []);

  const addPage = useCallback((page?: DocumentPage) => {
    dispatch({ type: "ADD_PAGE", payload: page });
  }, []);

  const deletePage = useCallback((pageId: number) => {
    dispatch({ type: "DELETE_PAGE", payload: pageId });
  }, []);

  const setCurrentPage = useCallback((pageId: number) => {
    dispatch({ type: "SET_CURRENT_PAGE", payload: pageId });
  }, []);

  const setFontSize = useCallback((size: number) => {
    dispatch({ type: "SET_FONT_SIZE", payload: size });
  }, []);

  const setFontFamily = useCallback((family: string) => {
    dispatch({ type: "SET_FONT_FAMILY", payload: family });
  }, []);

  const setZoom = useCallback((zoom: number) => {
    dispatch({ type: "SET_ZOOM", payload: zoom });
  }, []);

  const setTitle = useCallback((title: string) => {
    dispatch({ type: "SET_TITLE", payload: title });
  }, []);

  const formatText = useCallback(
    (command: FormatCommand) => {
      console.log(command);
      document.execCommand(command.command, false, command.value);
      // Trigger content update for current page
      const currentEditor = editorRefs.current[state.currentPage];
      if (currentEditor) {
        setContent(state.currentPage, currentEditor.innerHTML);
      }
    },
    [state.currentPage, setContent]
  );

  const insertPageBreak = useCallback(() => {
    addPage();
  }, [addPage]);

  const saveDocument = useCallback(() => {
    // Implementation for saving document
    // This could save to localStorage, send to server, etc.
    console.log("Saving document...", state);
    dispatch({ type: "MARK_MODIFIED", payload: false });
  }, [state]);

  const contextValue: DocumentEditorContextType = {
    state,
    actions: {
      setContent,
      addPage,
      deletePage,
      setCurrentPage,
      setFontSize,
      setFontFamily,
      setZoom,
      setTitle,
      formatText,
      insertPageBreak,
      saveDocument,
    },
    refs: {
      editorRefs,
    },
  };
  return (
    <DocumentEditorContext.Provider value={contextValue}>
      {children}
    </DocumentEditorContext.Provider>
  );
};

export const useDocumentEditor = (): DocumentEditorContextType => {
  const context = useContext(DocumentEditorContext);
  if (!context) {
    throw new Error(
      "useDocumentEditor must be used within a DocumentEditorProvider"
    );
  }
  return context;
};
