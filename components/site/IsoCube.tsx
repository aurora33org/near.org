type IsoCubeProps = {
  x: number;
  y: number;
  scale?: number;
  topFill?: string;
  leftFill?: string;
  rightFill?: string;
};

export default function IsoCube({ x, y, topFill, leftFill, rightFill, scale = 1 }: IsoCubeProps) {
  const dx = 34.64 * scale;
  const dy = 20 * scale;
  const h = 40 * scale;
  return (
    <g transform={`translate(${x}, ${y})`}>
      <polygon points={`0,0 ${dx},${-dy} 0,${-2 * dy} ${-dx},${-dy}`} fill={topFill ?? "#ffffff"} />
      <polygon points={`${-dx},${-dy} 0,0 0,${h} ${-dx},${h - dy}`} fill={leftFill ?? "#e5e5e5"} />
      <polygon points={`0,0 ${dx},${-dy} ${dx},${h - dy} 0,${h}`} fill={rightFill ?? "#a3a3a3"} />
    </g>
  );
}
