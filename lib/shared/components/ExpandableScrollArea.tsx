import { Box, ScrollArea } from "@chakra-ui/react";
import { useRef, useEffect, useState, ReactNode } from "react";

export interface ExpandableScrollAreaProps {
  children: ReactNode;
  autoScroll?: boolean;
  padding?: number;
  scrollbarVariant?: "always" | "hover";
  scrollbarSize?: "sm" | "md" | "lg";
}

export function ExpandableScrollArea({ 
  children, 
  autoScroll = true, 
  scrollbarVariant = "hover",
  scrollbarSize = "sm"
}: ExpandableScrollAreaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<number>(0);

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  useEffect(() => {
    if (autoScroll && scrollRef.current && containerHeight > 0) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [children, containerHeight, autoScroll]);

  return (
    <Box ref={containerRef} flex="1" width="full" height="full" overflow="hidden">
      {containerHeight > 0 && (
        <ScrollArea.Root height={`${containerHeight}px`} size={scrollbarSize} variant={scrollbarVariant}>
          <ScrollArea.Viewport ref={scrollRef}>
            <ScrollArea.Content paddingEnd="5">
              {children}
            </ScrollArea.Content>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar />
        </ScrollArea.Root>
      )}
    </Box>
  );
}

export function AutoScrollArea({ 
  children, 
}: { children: ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [children]);

  return (
    <ScrollArea.Root height="full" size="sm" variant="hover">
      <ScrollArea.Viewport ref={scrollRef}>
        <ScrollArea.Content paddingEnd="4">
          {children}
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar />
    </ScrollArea.Root>
  );
}
