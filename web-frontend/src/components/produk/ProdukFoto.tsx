import { useRef, useCallback, useState } from 'react';

interface Props {
  src: string;
  alt: string;
}

const ProdukFoto = ({ src, alt }: Props) => {
  const imgContainerRef = useRef<HTMLDivElement>(null);
  const [magnifierPos, setMagnifierPos] = useState({ x: 0, y: 0, show: false });
  const [bgPos, setBgPos] = useState('0% 0%');

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = imgContainerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setBgPos(`${x}% ${y}%`);
    setMagnifierPos({ x: e.clientX - rect.left, y: e.clientY - rect.top, show: true });
  }, []);

  return (
    <div
      ref={imgContainerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMagnifierPos((p) => ({ ...p, show: false }))}
      className="relative w-full bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-[#dc2626] hover:shadow-md transition-all cursor-crosshair"
      style={{ aspectRatio: '1 / 1' }}
    >
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-contain p-6"
        onError={(e) => {
          const t = e.target as HTMLImageElement;
          if (!t.dataset.errored) {
            t.dataset.errored = '1';
            t.src = 'https://images.unsplash.com/photo-1599599810694-e1b42fc85b72?w=400&h=400&fit=crop&q=80';
          }
        }}
      />
      {magnifierPos.show && (
        <div
          className="absolute w-28 h-28 rounded-full border-2 border-[#dc2626] pointer-events-none shadow-lg overflow-hidden"
          style={{
            left: magnifierPos.x - 56,
            top: magnifierPos.y - 56,
            backgroundImage: `url('${src}')`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: '300% 300%',
            backgroundPosition: bgPos,
          }}
        />
      )}
    </div>
  );
};

export default ProdukFoto;