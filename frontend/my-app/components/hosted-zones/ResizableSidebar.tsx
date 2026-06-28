"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_WIDTH = 204;
const MIN_WIDTH = 200;
const MAX_WIDTH = 560;

type ResizableSidebarProps = {
  children: React.ReactNode;
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
};

export default function ResizableSidebar({
  children,
  defaultWidth = DEFAULT_WIDTH,
  minWidth = MIN_WIDTH,
  maxWidth = MAX_WIDTH,
}: ResizableSidebarProps) {
  const [width, setWidth] = useState(defaultWidth);
  const [isResizing, setIsResizing] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1280px)");
    const update = () => setIsDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const clampWidth = useCallback(
    (nextWidth: number) => Math.min(maxWidth, Math.max(minWidth, nextWidth)),
    [maxWidth, minWidth],
  );

  useEffect(() => {
    if (!isResizing) {
      return;
    }

    function handleMouseMove(event: MouseEvent) {
      const container = containerRef.current?.parentElement;
      if (!container) {
        return;
      }

      const { right } = container.getBoundingClientRect();
      setWidth(clampWidth(right - event.clientX));
    }

    function handleMouseUp() {
      setIsResizing(false);
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [clampWidth, isResizing]);

  return (
    <div
      ref={containerRef}
      className="w-full shrink-0 self-stretch xl:sticky xl:top-6 xl:flex xl:h-[calc(100vh-9rem)] xl:max-h-[calc(100vh-9rem)] xl:self-start xl:overflow-hidden"
      style={isDesktop ? { width } : undefined}
    >
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize sidebar"
        onMouseDown={(event) => {
          event.preventDefault();
          setIsResizing(true);
        }}
        className={`group relative hidden w-1 shrink-0 cursor-col-resize bg-aws-main-border/40 transition-colors hover:bg-aws-accent/60 xl:block ${
          isResizing ? "bg-aws-accent/60" : ""
        }`}
      >
        <span className="absolute inset-y-0 -left-1.5 w-4" />
      </div>
      <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}
