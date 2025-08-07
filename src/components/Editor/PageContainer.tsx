import React, { useRef, useEffect } from "react";
import { useDocumentEditor } from "../../contexts/DocumentEditorContext";
import { usePageManagement } from "../../hooks/usePageManagement";
import { A4_DIMENSIONS } from "../../constants/editorConstants";
import type { DocumentPage } from "../../types/editor.types";

interface PageContainerProps {
  page: DocumentPage;
  pageNumber: number;
  totalPages: number;
  isActive: boolean;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  page,
  pageNumber,
  totalPages,
  isActive,
}) => {
  const { state, refs } = useDocumentEditor();
  const { handleContentChange } = usePageManagement();
  const contentRef = useRef<HTMLDivElement>(null);

  // Register ref with the document editor
  useEffect(() => {
    if (contentRef.current) {
      refs.editorRefs.current[page.id] = contentRef.current;
    }

    return () => {
      delete refs.editorRefs.current[page.id];
    };
  }, [page.id, refs]);

  // Handle content changes
  const onContentChange = () => {
    if (contentRef.current) {
      const newContent = contentRef.current.innerHTML;
      handleContentChange(page.id, newContent);
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey) {
      switch (e.key.toLowerCase()) {
        case "b":
          e.preventDefault();
          document.execCommand("bold");
          onContentChange();
          break;
        case "i":
          e.preventDefault();
          document.execCommand("italic");
          onContentChange();
          break;
        case "u":
          e.preventDefault();
          document.execCommand("underline");
          onContentChange();
          break;
        case "s":
          e.preventDefault();
          // Save functionality would go here
          break;
      }
    }
  };

  const pageStyles = {
    width: `${A4_DIMENSIONS.width * (state.zoom / 100)}px`,
    minHeight: `${A4_DIMENSIONS.height * (state.zoom / 100)}px`,
    transform: `scale(${state.zoom / 100})`,
    transformOrigin: "top left",
  };

  const contentStyles = {
    fontFamily: state.fontFamily,
    fontSize: `${state.fontSize * (state.zoom / 100)}px`,
    lineHeight: "1.6",
    minHeight: `${(A4_DIMENSIONS.height - 120) * (state.zoom / 100)}px`,
    padding: `${A4_DIMENSIONS.margin * (state.zoom / 100)}px`,
  };

  const headerFooterStyles = {
    fontSize: `${10 * (state.zoom / 100)}px`,
    padding: `${10 * (state.zoom / 100)}px ${
      A4_DIMENSIONS.margin * (state.zoom / 100)
    }px`,
  };

  useEffect(() => {
    // Move cursor to the end of the content
    if (contentRef.current) {
      const el = contentRef.current;
      const range = document.createRange();
      const selection = window.getSelection();

      range.selectNodeContents(el);
      range.collapse(false); // false = end of content
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [page.content]); // Trigger whenever content updates

  return (
    <div
      className={`mb-8 bg-white shadow-lg transition-shadow duration-200 ${
        isActive ? "shadow-xl ring-2 ring-blue-500" : "hover:shadow-xl"
      }`}
      style={pageStyles}
    >
      {/* Page Header */}
      <div
        className="text-center text-gray-500 border-b border-gray-200 bg-gray-50"
        style={headerFooterStyles}
      >
        <div className="font-medium">
          {state.title} - Page {pageNumber}
        </div>
      </div>

      {/* Page Content */}
      <div
        ref={contentRef}
        className="outline-none focus:outline-none page-content"
        contentEditable
        suppressContentEditableWarning={true}
        style={contentStyles}
        dangerouslySetInnerHTML={{ __html: page.content }}
        onInput={onContentChange}
        onFocus={() => {
          // Set this page as active
          if (refs.editorRefs.current[page.id]) {
            // This would trigger the page management hook
          }
        }}
        onKeyDown={handleKeyDown}
        onPaste={(e) => {
          // Handle paste events to maintain formatting
          e.preventDefault();
          const text = e.clipboardData.getData("text/plain");
          console.log(text);
          document.execCommand("insertText", false, text);
          onContentChange();
        }}
        spellCheck={true}
      />

      {/* Page Footer */}
      <div
        className="text-center text-gray-500 border-t border-gray-200 bg-gray-50"
        style={headerFooterStyles}
      >
        <div className="flex justify-between items-center">
          <span>
            Page {pageNumber} of {totalPages}
          </span>
          <span>
            {page.wordCount} words, {page.characterCount} characters
          </span>
        </div>
      </div>

      {/* Page Number Badge (for visual reference) */}
      <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded opacity-75">
        {pageNumber}
      </div>
    </div>
  );
};
