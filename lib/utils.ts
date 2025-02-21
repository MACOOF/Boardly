import { Camera, Color } from "@/types/canvas";
import { clsx, type ClassValue } from "clsx"
import React from "react";
import { twMerge } from "tailwind-merge"

const COLORS = [
  "#FF5733", // Red-Orange
  "#33FF57", // Green
  "#3357FF", // Blue
  "#F1C40F", // Yellow
  "#8E44AD", // Purple
  "#1ABC9C", // Turquoise
  "#E74C3C", // Red
  "#16A085", // Dark Green
  "#2C3E50", // Dark Blue
  "#F39C12", // Amber
  "#DB2777", // Pink
];


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function connectionIdToColor(connectionId: number):string {
  const index = connectionId % COLORS.length;
  return COLORS[index];
}

export function pointerEventToCanvasPoint(
  e:React.PointerEvent,
  camera:Camera,
){
  return {
    x:Math.round(e.clientX) - camera.x,
    y:Math.round(e.clientY) - camera.y
  }
}

export function colotToCss(color:Color){
  return `#${color.r.toString(16).padStart(2,"0")}${color.g.toString(16).padStart(2,"0")}${color.b.toString(16).padStart(2,"0")}`;
}