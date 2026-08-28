'use client';

export default function AshokaChakra({
  size = 16,
  className = '',
  stroke = '#1E3A8A',
  opacity = 0.62,
}: {
  size?: number;
  className?: string;
  stroke?: string;
  opacity?: number;
}) {
  // 24-spoke subtle wheel — outline only, no fill, low opacity per spec.
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
      style={{ opacity }}
    >
      <circle cx="12" cy="12" r="8.6" stroke={stroke} strokeWidth="0.65" fill="none" />
      <circle cx="12" cy="12" r="1.25" fill={stroke} opacity={0.95} />
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * 15 * Math.PI) / 180;
        const x1 = 12 + 1.9 * Math.cos(angle);
        const y1 = 12 + 1.9 * Math.sin(angle);
        const x2 = 12 + 8.2 * Math.cos(angle);
        const y2 = 12 + 8.2 * Math.sin(angle);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth="0.45" strokeLinecap="round" />;
      })}
    </svg>
  );
}
