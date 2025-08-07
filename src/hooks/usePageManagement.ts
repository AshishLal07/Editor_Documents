import { useCallback } from "react";
import { useDocumentEditor } from "../contexts/DocumentEditorContext";
import { A4_DIMENSIONS } from "../constants/editorConstants";

export const usePageManagement = () => {
  const { state, actions, refs } = useDocumentEditor();
  // Check if content exceeds page height and create new page if needed
  const checkPageOverflow = useCallback(
    (pageId: number) => {
      const pageElement = refs.editorRefs.current[pageId];
      if (!pageElement) return;

      const contentHeight = pageElement.scrollHeight;
      const maxHeight = A4_DIMENSIONS.height - A4_DIMENSIONS.margin * 2;

      if (contentHeight > maxHeight) {
        // Get the current content
        const content = pageElement.innerHTML;

        // Find a good break point (try to break at paragraph or sentence)
        const breakPoint = findOptimalBreakPoint(
          content,
          maxHeight,
          pageElement
        );

        if (breakPoint > 0 && breakPoint < content.length) {
          console.log(refs);

          const firstPart = content.substring(0, breakPoint);
          const secondPart = content.substring(breakPoint);

          // Update current page with first part
          actions.setContent(pageId, firstPart);

          // Create new page with second part
          // const newPageId = Math.max(...state.pages.map((p) => p.id)) + 1;
          const newPageId = Date.now();
          console.log(newPageId, state.pages);
          actions.addPage({
            id: newPageId,
            content: secondPart.trim(),
            wordCount: 0,
            characterCount: 0,
          });

          // Set focus to new page
          setTimeout(() => {
            const newPageElement = refs.editorRefs.current[newPageId];
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
    },
    [state.pages, actions, refs]
  );

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

  // Handle content change with debounced overflow check
  const handleContentChange = useCallback(
    (pageId: number, content: string) => {
      actions.setContent(pageId, content);

      // Debounce the overflow check
      setTimeout(() => {
        checkPageOverflow(pageId);
      }, 500);
    },
    [actions, checkPageOverflow]
  );

  // Navigate to specific page
  const navigateToPage = useCallback(
    (pageId: number) => {
      actions.setCurrentPage(pageId);

      // Focus on the page editor
      setTimeout(() => {
        const pageElement = refs.editorRefs.current[pageId];
        if (pageElement) {
          pageElement.focus();
        }
      }, 100);
    },
    [actions, refs]
  );

  // Get current page data
  const getCurrentPage = useCallback(() => {
    return state.pages.find((page) => page.id === state.currentPage);
  }, [state.pages, state.currentPage]);

  // Get total pages count
  const getTotalPages = useCallback(() => {
    return state.pages.length;
  }, [state.pages.length]);

  // Check if page can be deleted
  const canDeletePage = useCallback(
    (pageId: number) => {
      return state.pages.length > 1;
    },
    [state.pages.length]
  );

  return {
    checkPageOverflow,
    handleContentChange,
    navigateToPage,
    getCurrentPage,
    getTotalPages,
    canDeletePage,
    currentPageId: state.currentPage,
    pages: state.pages,
  };
};
