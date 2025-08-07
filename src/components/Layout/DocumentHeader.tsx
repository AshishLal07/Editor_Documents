import React, { useState } from "react";
import { Printer, Download, Save, FileText, Star, Share2 } from "lucide-react";
import { useDocumentEditor } from "../../contexts/DocumentEditorContext";
import { usePrintExport } from "../../hooks/usePrintExport";
import { Button } from "../Common/Button";

export const DocumentHeader: React.FC = () => {
  const { state, actions } = useDocumentEditor();
  const { printDocument, exportToHTML, exportToText } = usePrintExport();
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(state.title);

  const handleTitleEdit = () => {
    if (isEditing) {
      actions.setTitle(tempTitle);
      setIsEditing(false);
    } else {
      setIsEditing(true);
      setTempTitle(state.title);
    }
  };

  const handleTitleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      actions.setTitle(tempTitle);
      setIsEditing(false);
    } else if (e.key === "Escape") {
      setTempTitle(state.title);
      setIsEditing(false);
    }
  };

  const handleExport = () => {
    // Simple export menu - in a real app, this might be a dropdown
    const choice = window.confirm("Export as HTML? (Cancel for Plain Text)");
    if (choice) {
      exportToHTML();
    } else {
      exportToText();
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Document Title */}
        <div className="flex items-center space-x-4">
          <FileText className="w-5 h-5 text-gray-600" />

          {isEditing ? (
            <input
              type="text"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              onBlur={() => {
                actions.setTitle(tempTitle);
                setIsEditing(false);
              }}
              onKeyDown={handleTitleKeyPress}
              className="text-lg font-semibold bg-transparent border-b border-blue-500 outline-none min-w-0 flex-1"
              autoFocus
            />
          ) : (
            <h1
              className="text-lg font-semibold cursor-pointer hover:text-blue-600 transition-colors"
              onClick={handleTitleEdit}
              title="Click to edit title"
            >
              {state.title}
            </h1>
          )}

          {state.isModified && (
            <span className="text-sm text-orange-500 font-medium">
              • Unsaved changes
            </span>
          )}
        </div>

        {/* Document Actions */}
        <div className="flex items-center space-x-2">
          {/* Document Stats */}
          <div className="text-sm text-gray-600 mr-4">
            <span>{state.characterCount} characters</span>
            <span className="mx-2">•</span>
            <span>
              Page {state.currentPage} of {state.pages.length}
            </span>
          </div>

          {/* Action Buttons */}
          <Button
            onClick={actions.saveDocument}
            variant="ghost"
            size="sm"
            title="Save Document (Ctrl+S)"
            className="text-gray-600 hover:text-green-600"
          >
            <Save className="w-4 h-4" />
          </Button>

          <Button
            onClick={handleExport}
            variant="ghost"
            size="sm"
            title="Export Document"
            className="text-gray-600 hover:text-blue-600"
          >
            <Download className="w-4 h-4" />
          </Button>

          <Button
            onClick={() => printDocument()}
            variant="ghost"
            size="sm"
            title="Print Document (Ctrl+P)"
            className="text-gray-600 hover:text-purple-600"
          >
            <Printer className="w-4 h-4" />
          </Button>

          <div className="w-px h-6 bg-gray-300 mx-2" />

          <Button
            variant="ghost"
            size="sm"
            title="Add to Favorites"
            className="text-gray-600 hover:text-yellow-600"
          >
            <Star className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            title="Share Document"
            className="text-gray-600 hover:text-blue-600"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
