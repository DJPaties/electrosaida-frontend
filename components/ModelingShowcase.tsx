// components/ModelingShowcase.tsx
'use client';

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function ModelingShowcase() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const rect = sectionRef.current?.getBoundingClientRect();
            if (!rect) return;

            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;

            setMousePos({ x, y });
        };

        const section = sectionRef.current;
        if (section) {
            section.addEventListener('mousemove', handleMouseMove);
        }

        return () => {
            section?.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative w-full min-h-[600px] my-16 bg-gradient-to-br from-[#ffe6cc] via-[#e0f7fa] to-[#ccffe6] rounded-2xl overflow-hidden shadow-xl px-6 py-16"
        >
            {/* Floating Background Blobs with mouse-based parallax */}
            <div
                className="absolute w-96 h-96 bg-yellow-200 rounded-full filter blur-3xl opacity-30 z-0"
                style={{
                    top: `${30 + mousePos.y * 10}%`,
                    left: `${-10 + mousePos.x * 100}%`,
                    transition: 'top 0.1s, left 0.1s',
                }}
            />
            <div
                className="absolute w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-30 z-0"
                style={{
                    bottom: `${10 + (1 - mousePos.y) * 20}%`,
                    right: `${-10 + (1 - mousePos.x) * 20}%`,
                    transition: 'bottom 0.1s, right 0.1s',
                }}
            />

            <h2 className="relative z-10 text-center text-4xl font-extrabold text-gray-800 mb-10">3D Modeling Showcase</h2>

            <div className="relative z-10 w-full h-[420px]">
                {Array.from({ length: 9 }).map((_, index) => {
                    const positions = [
                        { top: '15%', left: '20%' },
                        { top: '10%', left: '40%' },
                        { top: '30%', left: '70%' },
                        { top: '60%', left: '15%' },
                        { top: '50%', left: '50%' },
                        { top: '65%', left: '75%' },
                        { top: '-20%', left: '80%' },
                        { top: '-20%', left: '0%' },
                        { top: '65%', left: '30%' },
                    ];

                    return (
                        <div
                            key={index}
                            className="absolute transition-transform duration-500 ease-in-out hover:scale-110 hover:z-30"
                            style={{
                                ...positions[index],
                                transform: `rotate(${index % 2 === 0 ? '-' : ''}${10 + index * 2}deg) translate(${(mousePos.x - 0.5) * 10}px, ${(mousePos.y - 0.5) * 10}px)`,
                                zIndex: 10 - index,
                            }}
                        >
                            <Image
                                src={`/assets/modeling/blender-${index + 1}.webp`}
                                alt={`3D model ${index + 1}`}
                                width={250}
                                height={250}
                                className="rounded-xl shadow-xl"
                            />
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
