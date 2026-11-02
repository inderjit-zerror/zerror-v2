// The modular grid behind every page: theme colour, a grid that surfaces
// around the cursor, a pixel trail on the grid cells and fine grain.

#define TRAIL 16

uniform vec3 uBg;
uniform vec3 uCell;
uniform vec2 uRes;          // CSS pixels
uniform float uTime;
uniform float uGrid;        // cell size in CSS pixels
uniform vec2 uMouse;        // CSS pixels, origin bottom-left
uniform float uMouseActive;
uniform vec3 uTrail[TRAIL]; // xy: CSS pixels, z: strength

varying vec2 vUv;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

void main() {
  vec2 px = vUv * uRes;
  // Anchor the grid to the centre so it stays symmetric at every width.
  vec2 g = (px - uRes * 0.5) / uGrid;
  vec2 cell = floor(g);
  vec2 f = fract(g);

  // Hairline grid, only visible near the cursor.
  vec2 edge = min(f, 1.0 - f) * uGrid;
  float line = 1.0 - smoothstep(0.0, 1.0, min(edge.x, edge.y));
  float spot = (1.0 - smoothstep(0.0, uGrid * 5.0, distance(px, uMouse))) * uMouseActive;
  float gridAlpha = line * (0.022 + spot * 0.13);

  // Pixel trail: cells near recent pointer positions flip on, with a dithered edge.
  vec2 cellCentre = (cell + 0.5) * uGrid + uRes * 0.5;
  float trail = 0.0;
  for (int i = 0; i < TRAIL; i++) {
    float d = distance(cellCentre, uTrail[i].xy);
    trail = max(trail, (1.0 - smoothstep(uGrid * 0.4, uGrid * 1.6, d)) * uTrail[i].z);
  }
  float on = step(hash(cell + 7.13), trail);

  vec3 col = uBg;
  col = mix(col, uCell, gridAlpha);
  col = mix(col, uCell, on * 0.09);

  // Grain.
  float grain = hash(px + fract(uTime * 0.37) * 311.0) - 0.5;
  col += grain * 0.009;

  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}
