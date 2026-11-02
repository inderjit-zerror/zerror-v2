// Flat, graphic shading: shadows take the hue of the background
// so cubes stay tonal on Electric Blue, Ink and Off-White alike.

uniform vec3 uColor;
uniform vec3 uAccent;
uniform vec3 uBg;
uniform float uFogNear;
uniform float uFogFar;

varying vec3 vNormal;
varying float vAccent;
varying float vDepth;
varying float vGlow;

void main() {
  vec3 n = normalize(vNormal);
  vec3 light = normalize(vec3(0.35, 0.75, 0.6));
  float diffuse = dot(n, light) * 0.5 + 0.5;

  vec3 base = mix(uColor, uAccent, smoothstep(0.35, 0.65, vAccent));
  float lit = 0.42 + 0.58 * diffuse;
  lit = mix(lit, 1.0, smoothstep(0.55, 1.0, n.z) * 0.45);
  vec3 col = mix(uBg, base, lit);
  col = mix(col, base, vGlow * 0.6);

  float fog = smoothstep(uFogNear, uFogFar, vDepth);
  col = mix(col, uBg, fog * 0.9);

  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}
