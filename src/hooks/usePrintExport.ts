import { useCallback } from "react";
import { useDocumentEditor } from "../contexts/DocumentEditorContext";
import { A4_DIMENSIONS } from "../constants/editorConstants";
import type { ExportOptions, PrintOptions } from "../types/editor.types";

export const usePrintExport = () => {
  const { state } = useDocumentEditor();

  // Generate print-ready HTML
  const generatePrintHTML = useCallback(
    (
      options: PrintOptions = {
        includeHeaders: true,
        includeFooters: true,
        pageNumbers: true,
        margins: { top: 40, bottom: 40, left: 40, right: 40 },
      }
    ) => {
      const { includeHeaders, includeFooters, pageNumbers, margins } = options;

      const pageStyles = `
      width: ${A4_DIMENSIONS.width}px;
      min-height: ${A4_DIMENSIONS.height}px;
      padding: ${margins.top}px ${margins.right}px ${margins.bottom}px ${margins.left}px;
      font-family: ${state.fontFamily};
      font-size: ${state.fontSize}px;
      page-break-after: always;
      background: white;
      box-shadow: none;
      margin: 0;
      position: relative;
    `;

      const headerStyles = `
      text-align: center;
      font-size: 10px;
      color: #666;
      margin-bottom: 20px;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
    `;

      const footerStyles = `
      position: absolute;
      bottom: ${margins.bottom}px;
      left: ${margins.left}px;
      right: ${margins.right}px;
      text-align: center;
      font-size: 10px;
      color: #666;
      border-top: 1px solid #eee;
      padding-top: 10px;
    `;

      const printPages = state.pages
        .map(
          (page, index) => `
      <div class="print-page" style="${pageStyles}">
        ${
          includeHeaders
            ? `
          <div class="page-header" style="${headerStyles}">
            ${state.title} ${pageNumbers ? `- Page ${index + 1}` : ""}
          </div>
        `
            : ""
        }
        
        <div class="page-content" style="min-height: ${
          A4_DIMENSIONS.height - margins.top - margins.bottom - 80
        }px;">
          ${page.content}
        </div>
        
        ${
          includeFooters
            ? `
          <div class="page-footer" style="${footerStyles}">
            ${pageNumbers ? `Page ${index + 1} of ${state.pages.length}` : ""}
          </div>
        `
            : ""
        }
      </div>
    `
        )
        .join("");

      return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${state.title}</title>
          <style>
            @media print {
              body { 
                margin: 0; 
                padding: 0; 
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
              }
              .print-page { 
                page-break-after: always; 
                page-break-inside: avoid;
              }
            }
            
            @media screen {
              body {
                background: #f5f5f5;
                margin: 0;
                padding: 20px;
              }
              .print-page {
                margin-bottom: 20px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
            }
            
            body { 
              font-family: ${state.fontFamily}; 
            }
            
            .page-content {
              overflow: hidden;
              word-wrap: break-word;
            }
            
            .page-content p {
              margin: 1em 0;
            }
            
            .page-content h1, .page-content h2, .page-content h3 {
              page-break-after: avoid;
            }
          </style>
        </head>
        <body>
          ${printPages}
        </body>
      </html>
    `;
    },
    [state]
  );

  // Print document
  const printDocument = useCallback(
    (options?: PrintOptions) => {
      const printHTML = generatePrintHTML(options);

      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(printHTML);
        printWindow.document.close();

        // Wait for content to load, then print
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print();
            printWindow.close();
          }, 500);
        };
      }
    },
    [generatePrintHTML]
  );

  // Export to HTML
  const exportToHTML = useCallback(
    (
      options: ExportOptions = {
        format: "html",
        includeStyles: true,
        includePageNumbers: true,
      }
    ) => {
      const { includeStyles, includePageNumbers } = options;

      const exportContent = state.pages
        .map(
          (page, index) => `
      <div class="page" data-page="${index + 1}">
        ${includePageNumbers ? `<h3>Page ${index + 1}</h3>` : ""}
        <div class="page-content">
          ${page.content}
        </div>
      </div>
    `
        )
        .join("");

      const styles = includeStyles
        ? `
      <style>
        body { 
          font-family: ${state.fontFamily}; 
          font-size: ${state.fontSize}px; 
          line-height: 1.6;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .page { 
          margin-bottom: 50px; 
          padding: 20px; 
          border: 1px solid #ddd;
          background: white;
          border-radius: 4px;
        }
        .page h3 {
          margin-top: 0;
          color: #666;
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
        }
        .page-content p {
          margin: 1em 0;
        }
        .page-content ul, .page-content ol {
          margin: 1em 0;
          padding-left: 30px;
        }
      </style>
    `
        : "";

      const fullHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${state.title}</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          ${styles}
        </head>
        <body>
          <h1>${state.title}</h1>
          <div class="document-stats">
            <p><strong>Pages:</strong> ${state.pages.length}</p>
            <p><strong>Words:</strong> ${state.wordCount}</p>
            <p><strong>Characters:</strong> ${state.characterCount}</p>
          </div>
          <hr>
          ${exportContent}
        </body>
      </html>
    `;

      const blob = new Blob([fullHTML], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${state.title
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase()}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    [state]
  );

  // Export to plain text
  const exportToText = useCallback(() => {
    const textContent = state.pages
      .map((page, index) => {
        const plainText = page.content
          .replace(/<[^>]*>/g, "") // Remove HTML tags
          .replace(/&nbsp;/g, " ") // Replace non-breaking spaces
          .replace(/&amp;/g, "&") // Replace HTML entities
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, '"')
          .trim();

        return `--- Page ${index + 1} ---\n\n${plainText}\n\n`;
      })
      .join("");

    const fullText = `${state.title}\n${"=".repeat(
      state.title.length
    )}\n\n${textContent}`;

    const blob = new Blob([fullText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${state.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [state]);

  // Get document statistics
  const getDocumentStats = useCallback(() => {
    return {
      pages: state.pages.length,
      words: state.wordCount,
      characters: state.characterCount,
      charactersWithSpaces: state.pages.reduce(
        (sum, page) => sum + page.content.replace(/<[^>]*>/g, "").length,
        0
      ),
      paragraphs: state.pages.reduce((sum, page) => {
        const paragraphs = page.content.split(/<\/p>|<br\s*\/?>/i).length - 1;
        return sum + Math.max(1, paragraphs);
      }, 0),
    };
  }, [state]);

  return {
    printDocument,
    exportToHTML,
    exportToText,
    generatePrintHTML,
    getDocumentStats,
  };
};
