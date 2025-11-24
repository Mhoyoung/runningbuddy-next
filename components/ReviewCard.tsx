"use client";

import { useState } from "react";

export default function ReviewCard({ item, onClick }: any) {
  return (
    <div
      className="relative cursor-pointer overflow-hidden rounded-lg"
      onClick={onClick}
    >
      {/* 이미지 */}
      <img
        src={item.img}
        alt=""
        className="w-full object-cover rounded-lg"
      />

      {/* Hover 오버레이 */}
      <div
        className="
          absolute inset-0 bg-black/40 opacity-0
          hover:opacity-100 transition-opacity
          flex flex-col justify-end p-3 text-white
        "
      >
        <p className="font-semibold">{item.text}</p>
        <div className="text-sm flex items-center gap-1 mt-1">
          ❤️ {item.likes ?? 0}
        </div>
      </div>
    </div>
  );
}
