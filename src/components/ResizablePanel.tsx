/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Resizeable } from "react-resizeable";

interface ResizablePanelProps {
  children: React.ReactNode;
  initialWidth: number;
  initialHeight: number;
}

const ResizablePanel: React.FC<ResizablePanelProps> = ({ children, initialWidth, initialHeight }) => {
  const [width, setWidth] = useState<number>(initialWidth);
  const [height, setHeight] = useState<number>(initialHeight);

  const onResize = (event: any, { size }: any) => {
    setWidth(size.width);
    setHeight(size.height);
  };

  return (
    <Resizeable width={width} height={height} onResize={onResize}>
      <div style={{ width: `${width}px`, height: `${height}px` }}>
        {children}
      </div>
    </Resizeable>
  );
};

export default ResizablePanel;
