import React from "react";
import type { LucideIcon } from "lucide-react";

interface MenuItem {
  icon: LucideIcon;
  label: string;
  active?: boolean;
}

interface SidebarMenuProps {
  items: MenuItem[];
  collapsed: boolean;
  activeItem: string;
  onItemClick: (label: string) => void;
}

export const SidebarMenu: React.FC<SidebarMenuProps> = ({
  items,
  collapsed,
  activeItem,
  onItemClick,
}) => {
  return (
    <nav className="space-y-1">
      {items.map((item, index) => {
        const isActive = activeItem === item.label;

        return (
          <div
            key={index}
            className={`flex items-center p-2 rounded cursor-pointer transition-colors ${
              isActive
                ? "bg-editor-sidebar-dark text-white"
                : "text-indigo-200 hover:bg-editor-sidebar-dark hover:text-white"
            }`}
            onClick={() => onItemClick(item.label)}
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && (
              <span className="ml-3 text-sm font-medium">{item.label}</span>
            )}

            {/* Active indicator */}
            {isActive && !collapsed && (
              <div className="ml-auto w-2 h-2 bg-orange-500 rounded-full"></div>
            )}
          </div>
        );
      })}
    </nav>
  );
};
