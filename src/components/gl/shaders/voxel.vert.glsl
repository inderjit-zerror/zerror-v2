// Voxel instances. Positions come from a CPU spring simulation (aOffset);
// the shader adds pointer repulsion, the click shockwave and the tumble rotation.

attribute vec4 aOffset;   // xyz: centre (group space), w: cube size
attribute vec3 aAxis;     // tumble axis
attribute vec2 aState;    // x: tumble angle, y: accent mix

uniform vec3 uPointer;        // pointer on the z = 0 plane (world)
uniform float uPointerForce;
uniform float uPointerRadius;
uniform vec4 uShock;          // xy: origin, z: age (s), w: strength

varying vec3 vNormal;
varying float vAccent;
varying float vDepth;
varying float vGlow;

mat3 rotateAxis(vec3 axis, float angle) {
  float s = sin(angle);
  float c = cos(angle);
  float oc = 1.0 - c;
  return mat3(
    oc * axis.x * axis.x + c,          oc * axis.x * axis.y + axis.z * s, oc * axis.z * axis.x - axis.y * s,
    oc * axis.x * axis.y - axis.z * s, oc * axis.y * axis.y + c,          oc * axis.y * axis.z + axis.x * s,
    oc * axis.z * axis.x + axis.y * s, oc * axis.y * axis.z - axis.x * s, oc * axis.z * axis.z + c
  );
}

void main() {
  vec4 world = modelMatrix * vec4(aOffset.xyz, 1.0);

  // Pointer: push cubes away in the plane and lift them towards the camera.
  vec2 toPointer = world.xy - uPointer.xy;
  float dist = length(toPointer);
  vec2 dir = toPointer / max(dist, 1e-4);
  float influence = (1.0 - smoothstep(0.0, uPointerRadius, dist)) * uPointerForce;
  world.xy += dir * influence * 0.32;
  world.z += influence * 0.85;

  // Click shockwave: a ring travelling outwards.
  vec2 toShock = world.xy - uShock.xy;
  float shockDist = length(toShock);
  float ring = uShock.z * 5.5;
  float life = 1.0 - clamp(uShock.z / 1.4, 0.0, 1.0);
  float band = exp(-pow((shockDist - ring) * 2.2, 2.0)) * life * uShock.w;
  world.xy += (toShock / max(shockDist, 1e-4)) * band * 0.25;
  world.z += band * 0.7;

  float glow = clamp(influence + band, 0.0, 1.0);
  mat3 tumble = rotateAxis(aAxis, aState.x);
  vec3 local = tumble * (position * aOffset.w * (1.0 + glow * 0.3));
  vec3 transformed = world.xyz + mat3(modelMatrix) * local;

  vec4 mvPosition = viewMatrix * vec4(transformed, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  vNormal = normalize(mat3(modelMatrix) * (tumble * normal));
  vAccent = aState.y;
  vDepth = -mvPosition.z;
  vGlow = glow;
}
