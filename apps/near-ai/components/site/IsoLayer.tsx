import IsoCube from "./IsoCube";

type IsoLayerProps = {
  yOffset: number;
  topF?: string;
  leftF?: string;
  rightF?: string;
};

export default function IsoLayer({ yOffset, topF, leftF, rightF }: IsoLayerProps) {
  return (
    <g transform={`translate(0, ${yOffset})`}>
      <IsoCube x={-27.7} y={-16} scale={0.8} topFill={topF} leftFill={leftF} rightFill={rightF} />
      <IsoCube x={27.7} y={-16} scale={0.8} topFill={topF} leftFill={leftF} rightFill={rightF} />
      <IsoCube x={0} y={0} scale={0.8} topFill={topF} leftFill={leftF} rightFill={rightF} />
    </g>
  );
}
