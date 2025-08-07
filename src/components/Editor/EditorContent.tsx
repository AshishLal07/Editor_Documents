import React from "react";
import { useDocumentEditor } from "../../contexts/DocumentEditorContext";
import { usePageManagement } from "../../hooks/usePageManagement";
import { PageContainer } from "./PageContainer";

export const EditorContent: React.FC = () => {
  const { state } = useDocumentEditor();
  const { currentPageId } = usePageManagement();

  return (
    <div className="flex-1 overflow-auto bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-8">
          {state.pages.map((page, index) => (
            <PageContainer
              key={page.id}
              page={page}
              pageNumber={index + 1}
              totalPages={state.pages.length}
              isActive={page.id === currentPageId}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
