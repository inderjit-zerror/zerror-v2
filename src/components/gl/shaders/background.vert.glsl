varying vec2 vUv;

void main() {
  vUv = uv;
  // Full-screen quad, drawn behind everything regardless of camera.
  gl_Position = vec4(position.xy, 0.9999, 1.0);
}
