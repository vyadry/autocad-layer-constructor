import React from 'react';
import { LINETYPES_CATALOG } from '../autocad/linetypes';

interface LinetypePreviewProps {
  lineType: string;
  className?: string;
  strokeColor?: string;
}

export const LinetypePreview: React.FC<LinetypePreviewProps> = ({
  lineType,
  className = 'w-16 h-3',
  strokeColor = 'currentColor',
}) => {
  const info = LINETYPES_CATALOG.find(
    (lt) => lt.name.toLowerCase() === lineType.trim().toLowerCase()
  );
  const dashArray = info ? info.strokeDasharray : 'none';

  return (
    <svg className={className} viewBox="0 0 80 8" fill="none">
      <line
        x1="0"
        y1="4"
        x2="80"
        y2="4"
        stroke={strokeColor}
        strokeWidth="2"
        strokeDasharray={dashArray}
      />
    </svg>
  );
};
