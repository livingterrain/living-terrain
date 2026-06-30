/** Dust motes — sunlight through a still room */
const motes = [
  { x: 12, y: 18, s: 1.2, d: 0 },
  { x: 28, y: 42, s: 0.8, d: 4 },
  { x: 45, y: 12, s: 1, d: 8 },
  { x: 62, y: 35, s: 0.7, d: 2 },
  { x: 78, y: 22, s: 1.1, d: 12 },
  { x: 88, y: 48, s: 0.9, d: 6 },
  { x: 22, y: 68, s: 0.8, d: 10 },
  { x: 38, y: 82, s: 1, d: 3 },
  { x: 55, y: 58, s: 0.6, d: 14 },
  { x: 72, y: 72, s: 1.2, d: 7 },
  { x: 92, y: 88, s: 0.7, d: 1 },
  { x: 8, y: 52, s: 0.9, d: 9 },
  { x: 33, y: 28, s: 0.6, d: 11 },
  { x: 50, y: 75, s: 1, d: 5 },
  { x: 67, y: 8, s: 0.8, d: 13 },
  { x: 85, y: 62, s: 0.7, d: 15 },
  { x: 18, y: 92, s: 1.1, d: 4 },
  { x: 42, y: 48, s: 0.6, d: 8 },
  { x: 58, y: 92, s: 0.9, d: 2 },
  { x: 75, y: 38, s: 0.8, d: 10 },
  { x: 95, y: 15, s: 1, d: 6 },
  { x: 5, y: 78, s: 0.7, d: 12 },
  { x: 48, y: 5, s: 0.9, d: 7 },
  { x: 82, y: 95, s: 0.6, d: 3 },
];

export function DustMotes() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {motes.map((mote, i) => (
        <span
          key={i}
          className="atmosphere-dust-mote absolute rounded-full bg-charcoal"
          style={{
            left: `${mote.x}%`,
            top: `${mote.y}%`,
            width: `${mote.s}px`,
            height: `${mote.s}px`,
            animationDelay: `${mote.d}s`,
            animationDuration: `${22 + (i % 5) * 4}s`,
          }}
        />
      ))}
    </div>
  );
}
