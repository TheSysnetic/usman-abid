// Ashima 3D simplex noise (MIT) — https://github.com/ashima/webgl-noise
const simplex = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`;

/** Full-screen quad: positions are already in clip space. */
export const auroraVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

/**
 * A few soft colour glows drifting slowly over the page background, gently
 * domain-warped by noise. Kept dim so text always reads first.
 */
export const auroraFragment = /* glsl */ `
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uScroll;
uniform float uIntensity;
uniform vec3 uBase;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;

varying vec2 vUv;

${simplex}

float glow(vec2 p, vec2 center, float radius) {
  float d = length(p - center);
  return exp(-(d * d) / (radius * radius));
}

void main() {
  float aspect = uResolution.x / uResolution.y;
  vec2 p = vec2(vUv.x * aspect, vUv.y);
  float t = uTime * 0.04;

  // Slow organic wobble so the glows never look like perfect circles.
  p += 0.07 * vec2(snoise(vec3(p * 1.1, t)), snoise(vec3(p * 1.1 + 9.0, t)));

  vec2 a = vec2(aspect * (0.86 + 0.06 * sin(t * 1.3)), 0.92 + 0.05 * cos(t * 1.1) + uScroll * 0.05);
  vec2 b = vec2(aspect * (0.08 + 0.06 * cos(t * 0.9)), 0.12 + 0.06 * sin(t * 1.4));
  vec2 c = vec2(aspect * (0.55 + 0.18 * sin(t * 0.6)) + uPointer.x * 0.06, 0.04 + 0.05 * cos(t * 0.8));

  vec3 col = uColorA * glow(p, a, 0.5) + uColorB * glow(p, b, 0.45) + uColorC * glow(p, c, 0.36) * 0.5;
  col = uBase + col * uIntensity;

  // Dither to avoid banding in the dark gradients.
  float noise = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  col += (noise - 0.5) / 255.0;

  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}
`;

/**
 * Particle typography. Positions are in CSS pixels: page space for the two
 * text formations (so they scroll with the page) and viewport space for the
 * drifting starfield in between.
 */
export const particleVertex = /* glsl */ `
uniform vec2 uResolution;
uniform float uScroll;
uniform float uTime;
uniform float uIntro;
uniform float uMorphA;
uniform float uMorphC;
uniform vec2 uMouse;
uniform float uMouseStrength;
uniform float uPixelRatio;
uniform float uSizeText;
uniform float uSizeDust;

attribute vec2 aTextA;
attribute vec2 aTextC;
attribute vec2 aDust;
attribute vec3 aColorA;
attribute vec3 aColorC;
attribute vec3 aColorDust;
attribute float aRandom;

varying vec3 vColor;
varying float vAlpha;

${simplex}

float stagger(float t, float r) {
  float s = clamp(t * 1.6 - r * 0.6, 0.0, 1.0);
  return s * s * (3.0 - 2.0 * s);
}

void main() {
  float drift = uTime * 0.04;
  vec2 dust = aDust * uResolution
    + vec2(snoise(vec3(aDust * 3.0, drift)), snoise(vec3(aDust * 3.0 + 7.0, drift))) * 48.0;
  vec2 textA = aTextA - vec2(0.0, uScroll);
  vec2 textC = aTextC - vec2(0.0, uScroll);

  float tI = stagger(uIntro, aRandom);
  float tA = stagger(uMorphA, aRandom);
  float tC = stagger(uMorphC, 1.0 - aRandom);

  vec2 p = mix(textA, dust, tA);
  p = mix(p, textC, tC);
  p = mix(dust, p, tI);

  vec3 color = mix(aColorA, aColorDust, tA);
  color = mix(color, aColorC, tC);
  color = mix(aColorDust, color, tI);

  // Swirl while particles are in flight between formations.
  float flight = sin(tI * 3.14159) + sin(tA * 3.14159) + sin(tC * 3.14159);
  vec2 q = p * 0.004 + vec2(uTime * 0.15);
  p += vec2(snoise(vec3(q, 1.0)), snoise(vec3(q, 9.0))) * flight * 70.0;

  // Scatter away from the cursor; the formation springs back as it moves on.
  vec2 d = p - uMouse;
  float falloff = (1.0 - smoothstep(0.0, 110.0, length(d))) * uMouseStrength;
  p += normalize(d + 0.0001) * falloff * 46.0;

  // Text-ness: 1 while part of a word, 0 while drifting as dust.
  float formed = max(tI * (1.0 - tA), tC);
  // Only a fraction of particles stay visible as dust, keeping the field sparse.
  float dustAlpha = aRandom < 0.3 ? 0.28 : 0.0;

  vColor = color;
  vAlpha = mix(dustAlpha, 1.0, formed);
  gl_PointSize = mix(uSizeDust, uSizeText, formed) * uPixelRatio * (1.0 + falloff * 0.5);
  gl_Position = vec4(p.x / uResolution.x * 2.0 - 1.0, 1.0 - p.y / uResolution.y * 2.0, 0.0, 1.0);
}
`;

export const particleFragment = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;

void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.3, d) * vAlpha;
  if (a < 0.01) discard;
  gl_FragColor = vec4(vColor, a);
  #include <colorspace_fragment>
}
`;
