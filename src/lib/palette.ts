// Pure, stateless helpers that map a scrap id to its visual representation.
// Ids are 1-based; `total` is the number of distinct scrap types so colors and
// greys can be spread evenly across the available range.

/** Distinct, evenly-spaced hue for a scrap in color view. */
export function colorForScrap(id: number, total: number): string {
  if (total <= 0) return "hsl(0 0% 80%)";
  const hue = Math.round(((id - 1) / total) * 360);
  return `hsl(${hue} 65% 60%)`;
}

/** Evenly-spaced grey for a scrap in greyscale view. */
export function greyForScrap(id: number, total: number): string {
  if (total <= 1) return "hsl(0 0% 70%)";
  // Keep away from pure white/black so the corner integer stays legible.
  const lightness = Math.round(20 + ((id - 1) / (total - 1)) * 60);
  return `hsl(0 0% ${lightness}%)`;
}

// A small rotating set of hatch directions/spacings for pattern view. Repeating
// this set keeps patterns distinguishable without needing real fabric images.
const PATTERN_ANGLES = [45, 135, 0, 90, 22.5, 112.5, 67.5, 157.5];
const PATTERN_GAPS = [8, 10, 12, 14];

/**
 * CSS `background` value: a hatch pattern layered over `base` so pattern view
 * stays distinct even when two scraps share a similar hue.
 */
export function patternForScrap(id: number, base: string): string {
  const angle = PATTERN_ANGLES[(id - 1) % PATTERN_ANGLES.length];
  const gap = PATTERN_GAPS[(id - 1) % PATTERN_GAPS.length];
  return `repeating-linear-gradient(${angle}deg, rgba(0,0,0,0.28) 0 2px, transparent 2px ${gap}px), ${base}`;
}

// Default swatches offered when adding scraps in base mode — a spread of
// distinct, fabric-friendly hues cycled by position.
const DEFAULT_SWATCHES = [
  "#e05a5a",
  "#e0975a",
  "#e0d15a",
  "#7bbf5a",
  "#5ab0bf",
  "#5a76e0",
  "#8f5ae0",
  "#e05ab0",
];

/** A pleasant starting color for the Nth (0-based) scrap added in base mode. */
export function defaultSwatch(index: number): string {
  return DEFAULT_SWATCHES[index % DEFAULT_SWATCHES.length];
}
