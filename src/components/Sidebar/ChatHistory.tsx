import React from "react";
import { Clock, MessageSquare } from "lucide-react";

interface ChatItem {
  id: string;
  title: string;
  date: string;
  preview: string;
}

export const ChatHistory: React.FC = () => {
  // Mock chat history data
  const chatItems: ChatItem[] = [
    {
      id: "1",
      title: "Document Analysis",
      date: "Today",
      preview: "Olga Tellis v. Bombay Municipal Corporation analysis...",
    },
    {
      id: "2",
      title: "Legal Research",
      date: "Yesterday",
      preview: "Constitutional law research on fundamental rights...",
    },
    {
      id: "3",
      title: "Case Summary",
      date: "2 days ago",
      preview: "Supreme Court judgment summary and key points...",
    },
  ];

  const timeGroups = [
    {
      label: "Today",
      items: chatItems.filter((item) => item.date === "Today"),
    },
    {
      label: "Yesterday",
      items: chatItems.filter((item) => item.date === "Yesterday"),
    },
    {
      label: "Previous",
      items: chatItems.filter(
        (item) => !["Today", "Yesterday"].includes(item.date)
      ),
    },
  ];

  return (
    <div className="p-4 border-t border-editor-sidebar-dark">
      <div className="flex items-center mb-3">
        <Clock className="w-4 h-4 mr-2" />
        <h3 className="text-sm font-semibold">Chat History</h3>
      </div>

      <div className="space-y-4 max-h-64 overflow-y-auto">
        {timeGroups.map(
          (group, groupIndex) =>
            group.items.length > 0 && (
              <div key={groupIndex}>
                <div className="text-xs text-indigo-300 font-medium mb-2 px-2">
                  {group.label}
                </div>

                <div className="space-y-1">
                  {group.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-2 rounded cursor-pointer hover:bg-editor-sidebar-dark transition-colors group"
                    >
                      <div className="flex items-start space-x-2">
                        <MessageSquare className="w-3 h-3 mt-1 text-indigo-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-white truncate group-hover:text-orange-200">
                            {item.title}
                          </p>
                          <p className="text-xs text-indigo-300 mt-1 line-clamp-2 group-hover:text-indigo-200">
                            {item.preview}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
        )}

        {chatItems.length === 0 && (
          <div className="text-center py-8">
            <MessageSquare className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
            <p className="text-sm text-indigo-300">No chat history yet</p>
            <p className="text-xs text-indigo-400 mt-1">
              Start a conversation to see your history here
            </p>
          </div>
        )}
      </div>

      {chatItems.length > 5 && (
        <button className="w-full text-xs text-indigo-300 hover:text-white mt-3 py-1 text-center">
          View more...
        </button>
      )}
    </div>
  );
};
