/**
 * Simple Chart Components for Farm Manager
 * Lightweight charts without external dependencies
 */

import { useState, useEffect } from "react";

// Bar Chart Component
export function BarChart({ data, height = 200, color = "emerald" }) {
    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        setTimeout(() => setAnimated(true), 100);
    }, []);

    if (!data || !data.length) {
        return <div className="text-center text-slate-500 py-8">No data available</div>;
    }

    const max = Math.max(...data.map((d) => d.value));
    const colorClasses = {
        emerald: "bg-emerald-500 hover:bg-emerald-600",
        sky: "bg-sky-500 hover:bg-sky-600",
        amber: "bg-amber-500 hover:bg-amber-600",
        rose: "bg-rose-500 hover:bg-rose-600",
    };

    return (
        <div className="w-full" style={{ height: `${height}px` }}>
            <div className="flex items-end justify-between h-full gap-2 px-2">
                {data.map((item, index) => {
                    const percentage = (item.value / max) * 100;

                    return (
                        <div
                            key={index}
                            className="flex-1 flex flex-col items-center gap-2 group"
                        >
                            <div className="relative w-full flex-1 flex items-end">
                                <div className="w-full relative group">
                                    <div
                                        className={`w-full rounded-t-lg transition-all duration-700 ${colorClasses[color]} relative`}
                                        style={{
                                            height: animated ? `${percentage}%` : "0%",
                                            transitionDelay: `${index * 50}ms`,
                                        }}
                                    >
                                        {/* Tooltip */}
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                            {item.value.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-xs text-slate-600 font-medium text-center truncate w-full">
                                {item.label}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// Line Chart Component
export function LineChart({ data, height = 200, color = "emerald" }) {
    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        setTimeout(() => setAnimated(true), 100);
    }, []);

    if (!data || !data.length) {
        return <div className="text-center text-slate-500 py-8">No data available</div>;
    }

    const max = Math.max(...data.map((d) => d.value));
    const min = Math.min(...data.map((d) => d.value));
    const range = max - min;

    const points = data
        .map((item, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - (((item.value - min) / range) * 100 || 0);
            return `${x},${y}`;
        })
        .join(" ");

    const colorClasses = {
        emerald: "stroke-emerald-500",
        sky: "stroke-sky-500",
        amber: "stroke-amber-500",
        rose: "stroke-rose-500",
    };

    return (
        <div className="w-full" style={{ height: `${height}px` }}>
            <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
                {/* Grid lines */}
                {[0, 25, 50, 75, 100].map((y) => (
                    <line
                        key={y}
                        x1="0"
                        y1={y}
                        x2="100"
                        y2={y}
                        stroke="#e2e8f0"
                        strokeWidth="0.2"
                    />
                ))}

                {/* Line */}
                <polyline
                    points={points}
                    fill="none"
                    className={`${colorClasses[color]} transition-all duration-700`}
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                        strokeDasharray: animated ? "none" : "200",
                        strokeDashoffset: animated ? "0" : "200",
                    }}
                />

                {/* Data points */}
                {data.map((item, index) => {
                    const x = (index / (data.length - 1)) * 100;
                    const y = 100 - (((item.value - min) / range) * 100 || 0);

                    return (
                        <g key={index}>
                            <circle
                                cx={x}
                                cy={y}
                                r="1.5"
                                className={`fill-white ${colorClasses[color]} transition-all duration-700`}
                                strokeWidth="0.5"
                                style={{
                                    opacity: animated ? 1 : 0,
                                    transitionDelay: `${700 + index * 50}ms`,
                                }}
                            />
                        </g>
                    );
                })}
            </svg>

            {/* Labels */}
            <div className="flex justify-between mt-2">
                {data.map((item, index) => (
                    <div key={index} className="text-xs text-slate-600 text-center flex-1">
                        {item.label}
                    </div>
                ))}
            </div>
        </div>
    );
}

// Donut Chart Component
export function DonutChart({ data, size = 200 }) {
    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        setTimeout(() => setAnimated(true), 100);
    }, []);

    if (!data || !data.length) {
        return <div className="text-center text-slate-500 py-8">No data available</div>;
    }

    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = -90;

    return (
        <div className="flex flex-col items-center gap-4">
            <svg width={size} height={size} viewBox="0 0 100 100" className="transform -rotate-90">
                <circle
                    cx="50"
                    cy="50"
                    r="35"
                    fill="none"
                    stroke="#f1f5f9"
                    strokeWidth="20"
                />

                {data.map((item, index) => {
                    const percentage = (item.value / total) * 100;
                    const angle = (percentage / 100) * 360;
                    const x = 50 + 35 * Math.cos((currentAngle * Math.PI) / 180);
                    const y = 50 + 35 * Math.sin((currentAngle * Math.PI) / 180);

                    const endAngle = currentAngle + angle;
                    const x2 = 50 + 35 * Math.cos((endAngle * Math.PI) / 180);
                    const y2 = 50 + 35 * Math.sin((endAngle * Math.PI) / 180);

                    const largeArcFlag = angle > 180 ? 1 : 0;
                    const path = `M 50 50 L ${x} ${y} A 35 35 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

                    currentAngle = endAngle;

                    return (
                        <path
                            key={index}
                            d={path}
                            fill={item.color}
                            className="transition-all duration-700"
                            style={{
                                opacity: animated ? 0.9 : 0,
                                transitionDelay: `${index * 100}ms`,
                            }}
                        />
                    );
                })}

                {/* Center hole */}
                <circle cx="50" cy="50" r="20" fill="white" />
            </svg>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-3">
                {data.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                        />
                        <div className="text-xs">
                            <div className="font-medium text-slate-900">{item.label}</div>
                            <div className="text-slate-500">
                                {((item.value / total) * 100).toFixed(1)}%
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Progress Ring Component
export function ProgressRing({ value, max = 100, size = 120, color = "emerald", label }) {
    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        setTimeout(() => setAnimated(true), 100);
    }, []);

    const percentage = (value / max) * 100;
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    const colorClasses = {
        emerald: "stroke-emerald-500",
        sky: "stroke-sky-500",
        amber: "stroke-amber-500",
        rose: "stroke-rose-500",
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <svg width={size} height={size} viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke="#f1f5f9"
                    strokeWidth="8"
                />

                {/* Progress circle */}
                <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    className={`${colorClasses[color]} transition-all duration-1000`}
                    strokeWidth="8"
                    strokeLinecap="round"
                    style={{
                        strokeDasharray: circumference,
                        strokeDashoffset: animated ? offset : circumference,
                        transform: "rotate(-90deg)",
                        transformOrigin: "50% 50%",
                    }}
                />

                {/* Center text */}
                <text
                    x="50"
                    y="50"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-2xl font-bold fill-slate-900"
                >
                    {percentage.toFixed(0)}%
                </text>
            </svg>
            {label && <div className="text-sm text-slate-600 font-medium">{label}</div>}
        </div>
    );
}
