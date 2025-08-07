import React from "react";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Undo,
  Redo,
  Plus,
  Minus,
} from "lucide-react";
import { useDocumentEditor } from "../../contexts/DocumentEditorContext";
import {
  FONT_FAMILIES,
  FONT_SIZES,
  FORMAT_COMMANDS,
} from "../../constants/editorConstants";
import { Select } from "../Common/Select";
import { Button } from "../Common/Button";

export const EditorToolbar: React.FC = () => {
  const { state, actions } = useDocumentEditor();

  const handleFormat = (command: string, value?: string) => {
    actions.formatText({ command, value });
  };

  const handleZoomChange = (delta: number) => {
    const newZoom = Math.max(25, Math.min(200, state.zoom + delta));
    actions.setZoom(newZoom);
  };

  return (
    <div className="bg-white border-b border-gray-200 p-3">
      <div className="flex items-center space-x-1">
        {/* Font Family */}
        <Select
          value={state.fontFamily}
          onChange={actions.setFontFamily}
          options={FONT_FAMILIES.map((font) => ({ value: font, label: font }))}
          className="w-40"
        />

        {/* Font Size */}
        <Select
          value={state.fontSize.toString()}
          onChange={(value: unknown) => actions.setFontSize(Number(value))}
          options={FONT_SIZES.map((size) => ({
            value: size.toString(),
            label: size.toString(),
          }))}
          className="w-16"
        />

        <div className="w-px h-6 bg-gray-300 mx-2" />

        {/* Text Formatting */}
        <Button
          onClick={() => handleFormat(FORMAT_COMMANDS.BOLD)}
          variant="ghost"
          size="sm"
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </Button>

        <Button
          onClick={() => handleFormat(FORMAT_COMMANDS.ITALIC)}
          variant="ghost"
          size="sm"
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </Button>

        <Button
          onClick={() => handleFormat(FORMAT_COMMANDS.UNDERLINE)}
          variant="ghost"
          size="sm"
          title="Underline (Ctrl+U)"
        >
          <Underline className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        {/* Text Alignment */}
        <Button
          onClick={() => handleFormat(FORMAT_COMMANDS.ALIGN_LEFT)}
          variant="ghost"
          size="sm"
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </Button>

        <Button
          onClick={() => handleFormat(FORMAT_COMMANDS.ALIGN_CENTER)}
          variant="ghost"
          size="sm"
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </Button>

        <Button
          onClick={() => handleFormat(FORMAT_COMMANDS.ALIGN_RIGHT)}
          variant="ghost"
          size="sm"
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </Button>

        <Button
          onClick={() => handleFormat(FORMAT_COMMANDS.ALIGN_JUSTIFY)}
          variant="ghost"
          size="sm"
          title="Justify"
        >
          <AlignJustify className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        {/* Lists */}
        <Button
          onClick={() => handleFormat(FORMAT_COMMANDS.INSERT_UNORDERED_LIST)}
          variant="ghost"
          size="sm"
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </Button>

        <Button
          onClick={() => handleFormat(FORMAT_COMMANDS.INSERT_ORDERED_LIST)}
          variant="ghost"
          size="sm"
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        {/* Undo/Redo */}
        <Button
          onClick={() => handleFormat(FORMAT_COMMANDS.UNDO)}
          variant="ghost"
          size="sm"
          title="Undo (Ctrl+Z)"
        >
          <Undo className="w-4 h-4" />
        </Button>

        <Button
          onClick={() => handleFormat(FORMAT_COMMANDS.REDO)}
          variant="ghost"
          size="sm"
          title="Redo (Ctrl+Y)"
        >
          <Redo className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        {/* Page Break */}
        <Button
          onClick={actions.insertPageBreak}
          variant="primary"
          size="sm"
          title="Insert Page Break"
        >
          Page Break
        </Button>

        {/* Zoom Controls */}
        <div className="flex items-center space-x-1 ml-4">
          <Button
            onClick={() => handleZoomChange(-25)}
            variant="ghost"
            size="sm"
            title="Zoom Out"
            disabled={state.zoom <= 25}
          >
            <Minus className="w-4 h-4" />
          </Button>

          <span className="text-sm w-12 text-center font-medium">
            {state.zoom}%
          </span>

          <Button
            onClick={() => handleZoomChange(25)}
            variant="ghost"
            size="sm"
            title="Zoom In"
            disabled={state.zoom >= 200}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
