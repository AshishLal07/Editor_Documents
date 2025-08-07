import React, { useState, useRef, useCallback, useEffect } from "react";
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
  Link,
  Image,
  FileText,
  Download,
  Printer,
  Save,
  Undo,
  Redo,
  Type,
  Palette,
  Plus,
  Minus,
  ChevronDown,
  File,
  Folder,
  Search,
  Settings,
} from "lucide-react";

// Document Editor Platform Component
const DocumentEditorPlatform = () => {
  const [content, setContent] = useState("");
  const [pages, setPages] = useState([{ id: 1, content: "" }]);
  const [currentPage, setCurrentPage] = useState(1);
  const [fontSize, setFontSize] = useState(12);
  const [fontFamily, setFontFamily] = useState("Times New Roman");
  const [zoom, setZoom] = useState(100);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // A4 dimensions in pixels (at 96 DPI)
  const A4_WIDTH = 794; // 210mm
  const A4_HEIGHT = 1123; // 297mm
  const PAGE_MARGIN = 40;

  // Font families
  const fontFamilies = [
    "Times New Roman",
    "Arial",
    "Calibri",
    "Georgia",
    "Verdana",
    "Helvetica",
  ];

  // Font sizes
  const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72];

  // Format text functions
  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    saveContent();
  };

  // Save content to current page
  const saveContent = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setPages((prev) =>
        prev.map((page) =>
          page.id === currentPage ? { ...page, content: newContent } : page
        )
      );
    }
  };

  // Find optimal break point in content
  const findOptimalBreakPoint = (
    content: string,
    maxHeight: number,
    element: HTMLElement
  ): number => {
    // Create a temporary element to measure content height
    const tempElement = element.cloneNode(false) as HTMLElement;
    tempElement.style.position = "absolute";
    tempElement.style.visibility = "hidden";
    tempElement.style.height = "auto";
    element.parentNode?.appendChild(tempElement);

    let breakPoint = 0;
    let low = 0;
    let high = content.length;

    // Binary search for optimal break point
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const testContent = content.substring(0, mid);

      tempElement.innerHTML = testContent;
      const testHeight = tempElement.scrollHeight;

      if (testHeight <= maxHeight) {
        breakPoint = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    // Clean up
    element.parentNode?.removeChild(tempElement);

    // Try to break at natural points (paragraph, sentence, word)
    return findNaturalBreakPoint(content, breakPoint);
  };

  // Find natural break points (paragraph > sentence > word)
  const findNaturalBreakPoint = (
    content: string,
    maxBreakPoint: number
  ): number => {
    if (maxBreakPoint <= 0) return 0;
    if (maxBreakPoint >= content.length) return content.length;

    // Look for paragraph breaks (</p>, <br>, \n)
    const paragraphBreaks = [
      content.lastIndexOf("</p>", maxBreakPoint),
      content.lastIndexOf("<br>", maxBreakPoint),
      content.lastIndexOf("<br/>", maxBreakPoint),
      content.lastIndexOf("<br />", maxBreakPoint),
    ];

    const lastParagraphBreak = Math.max(...paragraphBreaks);
    if (lastParagraphBreak > maxBreakPoint * 0.7) {
      return (
        lastParagraphBreak +
        (content.charAt(lastParagraphBreak) === "<"
          ? content.indexOf(">", lastParagraphBreak) + 1
          : 1)
      );
    }

    // Look for sentence breaks (. ! ?)
    const sentenceBreaks = [
      content.lastIndexOf(". ", maxBreakPoint),
      content.lastIndexOf("! ", maxBreakPoint),
      content.lastIndexOf("? ", maxBreakPoint),
    ];

    const lastSentenceBreak = Math.max(...sentenceBreaks);
    if (lastSentenceBreak > maxBreakPoint * 0.8) {
      return lastSentenceBreak + 2;
    }

    // Look for word breaks (spaces)
    const lastSpaceBreak = content.lastIndexOf(" ", maxBreakPoint);
    if (lastSpaceBreak > maxBreakPoint * 0.9) {
      return lastSpaceBreak + 1;
    }

    // If no good break point found, use the max break point
    return maxBreakPoint;
  };

  // Check if content exceeds page height and create new page
  const checkPageOverflow = useCallback(() => {
    const currentPageElement = pageRefs.current[currentPage];
    if (currentPageElement) {
      const contentHeight = currentPageElement.scrollHeight;
      const maxHeight = A4_HEIGHT - PAGE_MARGIN * 2;

      if (contentHeight > maxHeight) {
        // Create new page
        const newPageId = pages.length + 1;
        setPages((prev) => [...prev, { id: newPageId, content: "" }]);
        const breakPoint = findOptimalBreakPoint(
          currentPageElement.innerHTML,
          maxHeight,
          currentPageElement
        );

        // Move overflow content to new page
        // This is a simplified approach - in production, you'd want more sophisticated text splitting
        const currentContent = currentPageElement.innerHTML;
        // const midPoint = Math.floor(currentContent.length / 2);
        const firstHalf = currentContent.substring(0, breakPoint);
        const secondHalf = currentContent.substring(breakPoint);

        setPages((prev) =>
          prev.map((page) => {
            if (page.id === currentPage) {
              return { ...page, content: firstHalf };
            }
            if (page.id === newPageId) {
              return { ...page, content: secondHalf };
            }
            return page;
          })
        );

        // Set focus to new page
        setTimeout(() => {
          const newPageElement = pageRefs.current[newPageId];
          if (newPageElement) {
            newPageElement.focus();
            // Place cursor at the beginning
            const range = document.createRange();
            const selection = window.getSelection();
            range.setStart(newPageElement, 0);
            range.collapse(true);
            selection?.removeAllRanges();
            selection?.addRange(range);
          }
        }, 100);
      }
    }
  }, [currentPage, pages.length]);

  // Handle content change
  const handleContentChange = () => {
    saveContent();
    // Debounce page overflow check
    setTimeout(checkPageOverflow, 100);
  };

  // Insert page break
  const insertPageBreak = () => {
    const newPageId = pages.length + 1;
    setPages((prev) => [...prev, { id: newPageId, content: "" }]);
    setCurrentPage(newPageId);
  };

  // Print functionality
  const handlePrint = () => {
    const printContent = pages
      .map(
        (page, index) => `
      <div class="print-page" style="
        width: ${A4_WIDTH}px;
        min-height: ${A4_HEIGHT}px;
        padding: ${PAGE_MARGIN}px;
        font-family: ${fontFamily};
        font-size: ${fontSize}px;
        page-break-after: always;
        background: white;
        box-shadow: none;
        margin: 0;
      ">
        <div class="page-header" style="
          text-align: center;
          font-size: 10px;
          color: #666;
          margin-bottom: 20px;
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
        ">
          Document Title - Page ${index + 1}
        </div>
        <div class="page-content">
          ${page.content}
        </div>
        <div class="page-footer" style="
          position: absolute;
          bottom: ${PAGE_MARGIN}px;
          left: ${PAGE_MARGIN}px;
          right: ${PAGE_MARGIN}px;
          text-align: center;
          font-size: 10px;
          color: #666;
          border-top: 1px solid #eee;
          padding-top: 10px;
        ">
          Page ${index + 1} of ${pages.length}
        </div>
      </div>
    `
      )
      .join("");

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Document Print</title>
            <style>
              @media print {
                body { margin: 0; padding: 0; }
                .print-page { page-break-after: always; }
              }
              body { font-family: ${fontFamily}; }
            </style>
          </head>
          <body>
            ${printContent}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Export to HTML
  const handleExport = () => {
    const exportContent = pages
      .map(
        (page, index) => `
      <div class="page" data-page="${index + 1}">
        <h3>Page ${index + 1}</h3>
        ${page.content}
      </div>
    `
      )
      .join("");

    const fullHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Exported Document</title>
          <style>
            body { font-family: ${fontFamily}; font-size: ${fontSize}px; }
            .page { margin-bottom: 50px; padding: 20px; border: 1px solid #ddd; }
          </style>
        </head>
        <body>
          ${exportContent}
        </body>
      </html>
    `;

    const blob = new Blob([fullHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-indigo-900 text-white transition-all duration-300 ${
          sidebarCollapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-indigo-800">
          <div className="flex items-center justify-between">
            <div
              className={`flex items-center ${
                sidebarCollapsed ? "justify-center" : ""
              }`}
            >
              <FileText className="w-6 h-6" />
              {!sidebarCollapsed && (
                <span className="ml-2 font-bold">Vettam AI</span>
              )}
            </div>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1 hover:bg-indigo-800 rounded"
            >
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  sidebarCollapsed ? "rotate-90" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Sidebar Menu */}
        <div className="p-4">
          {!sidebarCollapsed && (
            <button className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg mb-4 hover:bg-orange-600">
              New Chat
            </button>
          )}

          <nav className="space-y-2">
            {[
              { icon: File, label: "Workspace", active: true },
              { icon: Search, label: "Research" },
              { icon: FileText, label: "Translate" },
              { icon: Type, label: "Write" },
              { icon: Settings, label: "Editor" },
              { icon: Folder, label: "Bookmarks" },
            ].map((item, index) => (
              <div
                key={index}
                className={`flex items-center p-2 rounded cursor-pointer hover:bg-indigo-800 ${
                  item.active ? "bg-indigo-800" : ""
                }`}
              >
                <item.icon className="w-5 h-5" />
                {!sidebarCollapsed && (
                  <span className="ml-3">{item.label}</span>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Chat History */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-indigo-800">
            <h3 className="text-sm font-semibold mb-2">Chat History</h3>
            <div className="space-y-2 text-sm">
              <div className="p-2 bg-indigo-800 rounded">Today</div>
              <div className="p-1 text-indigo-300 cursor-pointer hover:text-white">
                Lorem ipsum dolor sit amet
              </div>
              <div className="p-1 text-indigo-300 cursor-pointer hover:text-white">
                Lorem ipsum dolor sit amet
              </div>
              <div className="p-1 text-indigo-300 cursor-pointer hover:text-white">
                Lorem ipsum dolor sit amet
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-white border-b border-gray-200 p-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-semibold">
                Olga Tellis v. Bombay Municipal Corporation (1985).docx
              </h1>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>900 characters</span>
                <span>Page 1 of {pages.length}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrint}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <Printer className="w-4 h-4" />
              </button>
              <button
                onClick={handleExport}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <Download className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded">
                <Save className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Formatting Toolbar */}
          <div className="flex items-center space-x-1 border-t pt-3">
            {/* Font Family */}
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="px-3 py-1 border rounded text-sm"
            >
              {fontFamilies.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>

            {/* Font Size */}
            <select
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="px-2 py-1 border rounded text-sm w-16"
            >
              {fontSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>

            <div className="w-px h-6 bg-gray-300 mx-2" />

            {/* Text Formatting */}
            <button
              onClick={() => formatText("bold")}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => formatText("italic")}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              onClick={() => formatText("underline")}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <Underline className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-2" />

            {/* Alignment */}
            <button
              onClick={() => formatText("justifyLeft")}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => formatText("justifyCenter")}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              onClick={() => formatText("justifyRight")}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <AlignRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => formatText("justifyFull")}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <AlignJustify className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-2" />

            {/* Lists */}
            <button
              onClick={() => formatText("insertUnorderedList")}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => formatText("insertOrderedList")}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <ListOrdered className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-2" />

            {/* Undo/Redo */}
            <button
              onClick={() => formatText("undo")}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              onClick={() => formatText("redo")}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <Redo className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-2" />

            {/* Page Break */}
            <button
              onClick={insertPageBreak}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Page Break
            </button>

            {/* Zoom */}
            <div className="flex items-center space-x-1 ml-4">
              <button
                onClick={() => setZoom(Math.max(25, zoom - 25))}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-sm w-12 text-center">{zoom}%</span>
              <button
                onClick={() => setZoom(Math.min(200, zoom + 25))}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 overflow-auto bg-gray-50 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Pages */}
            {pages.map((page, index) => (
              <div
                key={page.id}
                className="mb-8 bg-white shadow-lg"
                style={{
                  width: `${A4_WIDTH * (zoom / 100)}px`,
                  minHeight: `${A4_HEIGHT * (zoom / 100)}px`,
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: "top left",
                  margin: "0 auto 50px auto",
                }}
              >
                {/* Page Header */}
                <div
                  className="text-center text-xs text-gray-500 border-b border-gray-200 px-10 py-2"
                  style={{ fontSize: `${10 * (zoom / 100)}px` }}
                >
                  Olga Tellis v. Bombay Municipal Corporation (1985) - Page{" "}
                  {index + 1}
                </div>

                {/* Page Content */}
                <div
                  ref={(el) => {
                    pageRefs.current[page.id] = el;
                  }}
                  className="p-10 outline-none"
                  contentEditable
                  style={{
                    fontFamily,
                    fontSize: `${fontSize}px`,
                    lineHeight: "1.6",
                    minHeight: `${(A4_HEIGHT - 120) * (zoom / 100)}px`,
                  }}
                  dangerouslySetInnerHTML={{ __html: page.content }}
                  onInput={handleContentChange}
                  onFocus={() => setCurrentPage(page.id)}
                />

                {/* Page Footer */}
                <div
                  className="text-center text-xs text-gray-500 border-t border-gray-200 px-10 py-2"
                  style={{ fontSize: `${10 * (zoom / 100)}px` }}
                >
                  Page {index + 1} of {pages.length}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Bar */}
        <div className="bg-white border-t border-gray-200 px-4 py-2 text-sm text-gray-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span>
                Page {currentPage} of {pages.length}
              </span>
              <span>
                Words:{" "}
                {
                  content
                    .replace(/<[^>]*>/g, "")
                    .split(/\s+/)
                    .filter((word) => word.length > 0).length
                }
              </span>
              <span>Characters: {content.replace(/<[^>]*>/g, "").length}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentEditorPlatform;
