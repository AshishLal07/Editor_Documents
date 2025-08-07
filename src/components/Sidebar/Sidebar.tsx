import React, { useState } from "react";
import {
  FileText,
  ChevronDown,
  File,
  Search,
  Type,
  Settings,
  Folder,
} from "lucide-react";
import { SidebarMenu } from "./SidebarMenu";
import { ChatHistory } from "./ChatHistory";

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
}) => {
  const [activeItem, setActiveItem] = useState("Workspace");

  const menuItems = [
    { icon: File, label: "Workspace", active: true },
    { icon: Search, label: "Research" },
    { icon: FileText, label: "Translate" },
    { icon: Type, label: "Write" },
    { icon: Settings, label: "Editor" },
    { icon: Folder, label: "Bookmarks" },
  ];

  return (
    <div
      className={`bg-editor-sidebar text-white transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      } flex flex-col h-full`}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-editor-sidebar-dark">
        <div className="flex items-center justify-between">
          <div
            className={`flex items-center ${collapsed ? "justify-center" : ""}`}
          >
            <FileText className="w-6 h-6 text-white" />
            {!collapsed && (
              <span className="ml-2 font-bold text-lg">Vettam AI</span>
            )}
          </div>
          <button
            onClick={onToggleCollapse}
            className="p-1 hover:bg-editor-sidebar-dark rounded transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                collapsed ? "rotate-90" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        {!collapsed && (
          <button className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg mb-4 hover:bg-orange-600 transition-colors font-medium">
            New Chat
          </button>
        )}

        {/* Menu Items */}
        <SidebarMenu
          items={menuItems}
          collapsed={collapsed}
          activeItem={activeItem}
          onItemClick={setActiveItem}
        />
      </div>

      {/* Chat History */}
      {!collapsed && (
        <div className="flex-1 overflow-hidden">
          <ChatHistory />
        </div>
      )}

      {/* User Info / Settings at bottom */}
      {!collapsed && (
        <div className="p-4 border-t border-editor-sidebar-dark">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">U</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">User Account</p>
              <p className="text-xs text-indigo-300 truncate">Free Plan</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
