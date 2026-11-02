// Case-study imagery: a pixel-grid reveal that resolves into the photo,
// and a pixel lens under the cursor that turns the image into an Electric Blue duotone.

uniform sampler2D uTexture;
uniform vec2 uPlane;       // plane size (px)
uniform vec2 uImage;       // texture size (px)
uniform float uReveal;     // 0 → 1
uniform float uHover;      // 0 → 1
uniform vec2 uMouse;       // uv
uniform vec3 uBlue;
uniform vec3 uLight;

varying vec2 vUv;

float hash(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

vec2 coverUv(vec2 uv, vec2 plane, vec2 image) {
  float rp = plane.x / plane.y;
  float ri = image.x / image.y;
  vec2 scale = rp > ri ? vec2(1.0, ri / rp) : vec2(rp / ri, 1.0);
  return (uv - 0.5) * scale + 0.5;
}

void main() {
  vec2 aspect = vec2(uPlane.x / uPlane.y, 1.0);
  vec2 uv = coverUv(vUv, uPlane, uImage);
  uv = (uv - 0.5) * (1.0 - uHover * 0.05) + 0.5;

  // Reveal: blocks resolve from coarse to full resolution.
  float blocks = mix(5.0, 260.0, pow(uReveal, 2.2));
  vec2 grid = blocks * aspect;
  vec2 revealUv = (floor(uv * grid) + 0.5) / grid;
  vec2 sampleUv = mix(revealUv, uv, smoothstep(0.92, 1.0, uReveal));

  // Lens: a pixelated duotone circle around the cursor, stepped to the lens grid.
  vec2 lensGrid = vec2(34.0) * aspect;
  vec2 lensCell = (floor(vUv * lensGrid) + 0.5) / lensGrid;
  float lensDist = distance(lensCell * aspect, uMouse * aspect);
  float lens = step(lensDist, 0.2 * uHover);
  vec2 lensUv = (floor(uv * lensGrid) + 0.5) / lensGrid;
  sampleUv = mix(sampleUv, lensUv, lens);

  vec3 col = texture2D(uTexture, sampleUv).rgb;
  float luma = dot(col, vec3(0.299, 0.587, 0.114));
  vec3 duo = mix(uBlue, uLight, smoothstep(0.02, 0.6, luma));
  col = mix(col, duo, lens);

  // Cells pop in at random during the reveal.
  vec2 popGrid = vec2(14.0) * aspect;
  float alpha = step(hash(floor(vUv * popGrid)), uReveal * 1.15);

  gl_FragColor = vec4(col, alpha);
  #include <colorspace_fragment>
}
