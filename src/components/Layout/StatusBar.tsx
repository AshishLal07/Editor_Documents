import React from "react";
import { useDocumentEditor } from "../../contexts/DocumentEditorContext";
import { usePageManagement } from "../../hooks/usePageManagement";
import { usePrintExport } from "../../hooks/usePrintExport";

export const StatusBar: React.FC = () => {
  const { state } = useDocumentEditor();
  const { currentPageId } = usePageManagement();
  const { getDocumentStats } = usePrintExport();

  const stats = getDocumentStats();
  const currentPage = state.pages.find((p) => p.id === currentPageId);

  return (
    <div className="bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex items-center justify-between text-sm text-gray-600">
        {/* Left Side - Document Stats */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4">
            <span>
              Page {state.pages.findIndex((p) => p.id === currentPageId) + 1} of{" "}
              {state.pages.length}
            </span>

            <span className="text-gray-400">|</span>

            <span>Words: {stats.words}</span>

            <span className="text-gray-400">|</span>

            <span>Characters: {stats.characters}</span>

            <span className="text-gray-400">|</span>

            <span>With spaces: {stats.charactersWithSpaces}</span>
          </div>
        </div>

        {/* Center - Current Page Info */}
        <div className="flex items-center space-x-4">
          {currentPage && (
            <>
              <span>Current page: {currentPage.wordCount} words</span>

              <span className="text-gray-400">|</span>

              <span>{currentPage.characterCount} characters</span>
            </>
          )}
        </div>

        {/* Right Side - App Status */}
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${
                state.isModified ? "bg-orange-500" : "bg-green-500"
              }`}
            />
            <span>{state.isModified ? "Modified" : "Saved"}</span>
          </span>

          <span className="text-gray-400">|</span>

          <span>Zoom: {state.zoom}%</span>

          <span className="text-gray-400">|</span>

          <span>
            {state.fontFamily} {state.fontSize}pt
          </span>
        </div>
      </div>
    </div>
  );
};
