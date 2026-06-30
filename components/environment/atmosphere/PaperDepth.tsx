/** Layered paper depth — fiber, shadow, warmth */
export function PaperDepth() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <div className="atmosphere-paper-fiber absolute inset-0" />
      <div className="atmosphere-paper-shadow absolute inset-0" />
      <div className="atmosphere-grain absolute inset-0" />
    </div>
  );
}
