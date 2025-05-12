"use client";

import { useKelasProgress } from "@/lib/hooks/useKelasProgress";
import { useEffect, useRef, useState } from "react";

export const KelasProgressInfo = ({ kelasId }: { kelasId: string }) => {
  const { percent, isLoading } = useKelasProgress(kelasId);
  const [animatedPercent, setAnimatedPercent] = useState(0);
  const requestRef = useRef<number>();

  useEffect(() => {
    if (isLoading || percent === 0) return;

    let start: number | null = null;
    const duration = 1000; // 1 detik animasi
    const target = percent;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3); // easing

      const newPercent = Math.min(target, Math.round(easeOut(progress / duration) * target));

      setAnimatedPercent(newPercent);

      if (progress < duration) {
        requestRef.current = requestAnimationFrame(animate);
      }
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [percent, isLoading]);

  if (isLoading) {
    return <p className="text-sm text-gray-400">Loading...</p>;
  }

  const radius = 25;
  const stroke = 5;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (animatedPercent / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
        <circle
          stroke="#e5e7eb" // gray-200
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="#10b981" // green-500
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          style={{ transition: "stroke-dashoffset 0.2s linear" }}
        />
      </svg>
      <div className="absolute text-center text-xs font-semibold text-sky-200">{animatedPercent}%</div>
    </div>
  );
};
