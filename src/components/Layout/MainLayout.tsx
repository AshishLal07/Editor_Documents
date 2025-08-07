import React, { useState } from "react";
import { Sidebar } from "../Sidebar/Sidebar";
import { EditorToolbar } from "../Editor/EditorToolbar";
import { EditorContent } from "../Editor/EditorContent";
import { StatusBar } from "./StatusBar";
import { DocumentHeader } from "./DocumentHeader";

export const MainLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} onToggleCollapse={toggleSidebar} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Document Header */}
        <DocumentHeader />

        {/* Editor Toolbar */}
        <EditorToolbar />

        {/* Editor Content */}
        <EditorContent />

        {/* Status Bar */}
        <StatusBar />
      </div>
    </div>
  );
};
