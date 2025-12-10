// DistortionShader.js - iOS AirDrop-like distortion effect
export const DistortionShader = {
  uniforms: {
    tDiffuse: { value: null }, // Scene texture
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    uHeadPosition: { value: new THREE.Vector2(0.5, 0.5) },
    uWaveAmplitude: { value: 0.1 },
    uWaveFrequency: { value: 10.0 },
    uDistortionStrength: { value: 0.15 },
    uBlurRadius: { value: 0.01 }
  },

  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform vec2 uMouse;
    uniform vec2 uResolution;
    uniform vec2 uHeadPosition;
    uniform float uWaveAmplitude;
    uniform float uWaveFrequency;
    uniform float uDistortionStrength;
    uniform float uBlurRadius;
    
    varying vec2 vUv;
    
    // Convert HSV to RGB
    vec3 hsv2rgb(vec3 c) {
      vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
      vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
      return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }
    
    // Simple noise function
    float noise(vec2 p) {
      return sin(p.x * 10.0) * cos(p.y * 10.0) * 0.5 + 0.5;
    }
    
    // Circular wave function
    float circularWave(vec2 uv, vec2 center, float time, float frequency, float amplitude) {
      float dist = distance(uv, center);
      return sin(dist * frequency - time * 2.0) * exp(-dist * 4.0) * amplitude;
    }
    
    // Radial blur
    vec4 radialBlur(sampler2D tex, vec2 uv, vec2 center, float radius) {
      vec4 color = vec4(0.0);
      float samples = 16.0;
      float angleStep = 6.28318530718 / samples;
      
      for(float i = 0.0; i < samples; i++) {
        float angle = i * angleStep;
        vec2 offset = vec2(cos(angle), sin(angle)) * radius;
        color += texture2D(tex, uv + offset);
      }
      
      return color / samples;
    }
    
    // AirDrop-style distortion
    vec2 airdropDistortion(vec2 uv, vec2 headPos, float time) {
      vec2 distorted = uv;
      
      // Stretch effect based on vertical position
      float stretch = pow(uv.y, 6.0) * 0.1 * sin(time * 0.5);
      distorted.x += (uv.x - 0.5) * stretch;
      
      // Add subtle wave distortion
      float wave1 = sin(uv.x * 20.0 + time * 2.0) * 0.003;
      float wave2 = cos(uv.y * 15.0 + time * 1.5) * 0.002;
      distorted += vec2(wave1, wave2);
      
      // Circular wave from head position
      float wave = circularWave(uv, headPos, time, 25.0, 0.02);
      distorted += vec2(wave, wave);
      
      return distorted;
    }
    
    void main() {
      // Normalized pixel coordinates
      vec2 uv = vUv;
      
      // Adjust head position (assuming head is near center)
      vec2 headPos = uHeadPosition;
      headPos.y = 1.0 - headPos.y; // Flip Y if needed
      
      // Apply distortion
      vec2 distortedUV = airdropDistortion(uv, headPos, uTime);
      
      // Apply radial blur near edges
      float edgeDist = distance(uv, vec2(0.5, 0.5));
      float blurAmount = smoothstep(0.3, 0.7, edgeDist) * uBlurRadius;
      
      // Sample with distortion and blur
      vec4 color;
      if (blurAmount > 0.001) {
        color = radialBlur(tDiffuse, distortedUV, vec2(0.5, 0.5), blurAmount);
      } else {
        color = texture2D(tDiffuse, distortedUV);
      }
      
      // Add chromatic aberration at edges
      float chromaStrength = smoothstep(0.4, 0.8, edgeDist) * 0.003;
      if (chromaStrength > 0.0) {
        vec2 chromaOffset = vec2(chromaStrength, -chromaStrength);
        float r = texture2D(tDiffuse, distortedUV + chromaOffset).r;
        float g = texture2D(tDiffuse, distortedUV).g;
        float b = texture2D(tDiffuse, distortedUV - chromaOffset).b;
        color.rgb = mix(color.rgb, vec3(r, g, b), chromaStrength * 10.0);
      }
      
      // Add subtle glow/highlight near the head
      float highlight = smoothstep(0.2, 0.1, distance(uv, headPos)) * 0.3;
      color.rgb += vec3(highlight, highlight * 0.8, 0.0);
      
      gl_FragColor = color;
    }
  `
};