"use client";

import React from "react";

export default function Logo({ className = "w-10 h-10", dark = false }) {
  // A premium geometric logo representation: 6 interlocking nodes/layers representing Bloom's Taxonomy levels, connected via elegant curves
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} transition-colors duration-500`}
    >
      {/* Central neural flower core */}
      <circle
        cx="50"
        cy="50"
        r="10"
        className={dark ? "fill-white" : "fill-black"}
      />
      
      {/* Bloom's levels - 6 symmetric orbiting nodes */}
      <circle
        cx="50"
        cy="22"
        r="6"
        className={dark ? "fill-white/80" : "fill-black/80"}
      />
      <circle
        cx="74"
        cy="36"
        r="6"
        className={dark ? "fill-white/80" : "fill-black/80"}
      />
      <circle
        cx="74"
        cy="64"
        r="6"
        className={dark ? "fill-white/80" : "fill-black/80"}
      />
      <circle
        cx="50"
        cy="78"
        r="6"
        className={dark ? "fill-white/80" : "fill-black/80"}
      />
      <circle
        cx="26"
        cy="64"
        r="6"
        className={dark ? "fill-white/80" : "fill-black/80"}
      />
      <circle
        cx="26"
        cy="36"
        r="6"
        className={dark ? "fill-white/80" : "fill-black/80"}
      />

      {/* Orbiting connecting lines */}
      <circle
        cx="50"
        cy="50"
        r="28"
        className={dark ? "stroke-white/20" : "stroke-black/20"}
        strokeWidth="1.5"
        strokeDasharray="4 4"
      />

      {/* Starburst/Bloom lines linking center to nodes */}
      <path
        d="M50 50L50 28M50 50L74 36M50 50L74 64M50 50L50 72M50 50L26 64M50 50L26 36"
        className={dark ? "stroke-white/30" : "stroke-black/30"}
        strokeWidth="1"
      />

      {/* Outer elegant ring */}
      <circle
        cx="50"
        cy="50"
        r="44"
        className={dark ? "stroke-white/10" : "stroke-black/10"}
        strokeWidth="1"
      />
    </svg>
  );
}
