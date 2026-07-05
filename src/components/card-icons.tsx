import type { IconSet } from "@/lib/card-types";

export type IconName =
  | "mail"
  | "phone"
  | "globe"
  | "linkedin"
  | "twitter"
  | "instagram"
  | "pin";

// Simple path data on a 24x24 grid, rendered differently per icon set.
const PATHS: Record<IconName, { stroke?: string[]; fill?: string[] }> = {
  mail: {
    stroke: ["M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z", "m3.5 7 8.5 6 8.5-6"],
    fill: ["M3 7.2 12 13.5 21 7.2V17a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7.2zM4 6h16c.3 0 .6.14.79.36L12 12 3.21 6.36C3.4 6.14 3.7 6 4 6z"],
  },
  phone: {
    stroke: ["M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a1.5 1.5 0 0 1-1.6 1.5C10.5 18.6 5.4 13.5 5 5.1A1.5 1.5 0 0 1 6.5 3.5z"],
    fill: ["M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a1.5 1.5 0 0 1-1.6 1.5C10.5 18.6 5.4 13.5 5 5.1A1.5 1.5 0 0 1 6.5 3.5z"],
  },
  globe: {
    stroke: ["M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z", "M3 12h18", "M12 3c2.5 2.4 3.8 5.6 3.8 9s-1.3 6.6-3.8 9c-2.5-2.4-3.8-5.6-3.8-9S9.5 5.4 12 3z"],
    fill: ["M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm-1 2.1v5.9H5.1A7 7 0 0 1 11 5.1zm2 0a7 7 0 0 1 5.9 5.9H13V5.1zm-7.9 7.9H11v5.9a7 7 0 0 1-5.9-5.9zm7.9 5.9v-5.9h5.9a7 7 0 0 1-5.9 5.9z"],
  },
  linkedin: {
    stroke: ["M5 9.5v9", "M5 5.4v.1", "M10 18.5v-5.2a3.3 3.3 0 0 1 6.6 0v5.2", "M10 9.5v9"],
    fill: ["M6.2 4.2a1.6 1.6 0 1 1 0 3.2 1.6 1.6 0 0 1 0-3.2zM4.8 9h2.8v10H4.8V9zm5 0h2.7v1.4h.04A3 3 0 0 1 15.2 8.8c2.9 0 3.4 1.9 3.4 4.3V19h-2.8v-5.2c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V19H9.8V9z"],
  },
  twitter: {
    stroke: ["M4 4l7.1 9.3L4.4 20h2.1l5.6-5.8L16.6 20H20l-7.4-9.7L18.9 4h-2.1l-5 5.2L8 4H4z"],
    fill: ["M4 4l7.1 9.3L4.4 20h2.1l5.6-5.8L16.6 20H20l-7.4-9.7L18.9 4h-2.1l-5 5.2L8 4H4z"],
  },
  instagram: {
    stroke: ["M8 3.5h8A4.5 4.5 0 0 1 20.5 8v8a4.5 4.5 0 0 1-4.5 4.5H8A4.5 4.5 0 0 1 3.5 16V8A4.5 4.5 0 0 1 8 3.5z", "M12 8.3a3.7 3.7 0 1 0 0 7.4 3.7 3.7 0 0 0 0-7.4z", "M16.9 7.1v.01"],
    fill: ["M8 3.5h8A4.5 4.5 0 0 1 20.5 8v8a4.5 4.5 0 0 1-4.5 4.5H8A4.5 4.5 0 0 1 3.5 16V8A4.5 4.5 0 0 1 8 3.5zm4 4.8a3.7 3.7 0 1 0 0 7.4 3.7 3.7 0 0 0 0-7.4zm0 1.8a1.9 1.9 0 1 1 0 3.8 1.9 1.9 0 0 1 0-3.8zm5-3.2a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"],
  },
  pin: {
    stroke: ["M12 21s-6.5-5.3-6.5-10.5a6.5 6.5 0 0 1 13 0C18.5 15.7 12 21 12 21z", "M12 12.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"],
    fill: ["M12 21s-6.5-5.3-6.5-10.5a6.5 6.5 0 0 1 13 0C18.5 15.7 12 21 12 21zm0-8.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"],
  },
};

export function CardIcon({
  name,
  set,
  color,
  size = 16,
}: {
  name: IconName;
  set: IconSet;
  color: string;
  size?: number;
}) {
  const paths = PATHS[name];

  if (set === "filled") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
        {(paths.fill ?? paths.stroke ?? []).map((d, i) => (
          <path key={i} d={d} fill={color} fillRule="evenodd" />
        ))}
      </svg>
    );
  }

  if (set === "phosphor") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
        {(paths.fill ?? []).map((d, i) => (
          <path key={i} d={d} fill={color} opacity={0.22} fillRule="evenodd" />
        ))}
        {(paths.stroke ?? []).map((d, i) => (
          <path key={i} d={d} fill="none" stroke={color} strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
        ))}
      </svg>
    );
  }

  // "minimal" and "rounded" are stroke-based; rounded uses heavier round caps.
  const width = set === "rounded" ? 2.1 : 1.5;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      {(paths.stroke ?? []).map((d, i) => (
        <path key={i} d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
      ))}
    </svg>
  );
}
