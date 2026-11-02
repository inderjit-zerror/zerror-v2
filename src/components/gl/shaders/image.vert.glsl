uniform float uVelocity;

varying vec2 vUv;

void main() {
  vUv = uv;
  vec3 p = position;
  // Bend the plane with scroll velocity (units are CSS pixels / plane size).
  p.y += sin(uv.x * 3.14159265) * uVelocity * 0.06;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
