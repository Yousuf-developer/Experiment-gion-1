'use client'

import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import GUI from 'lil-gui'

const HeroSection = () => {
  const containerRef = useRef(null)
  const modelRef = useRef(null)
  const mixerRef = useRef(null)
  const actionsRef = useRef({})
  const prevActionRef = useRef(null)
  const targetRotation = useRef({ x: 0, y: 0 })
  const rafRef = useRef(null)
  const playingActionRef = useRef(false)
  const blinkIntervalRef = useRef(null)

  const HIT_ANIMATIONS = ['avatara-hit-01']
  const hitAnimationIndexRef = useRef(0)

  // Reduced color schemes for performance
  const COLOR_SCHEMES = {
    'RBW Frosted': {
      color1: new THREE.Vector3(0.95, 0.97, 1.0),
      color2: new THREE.Vector3(0.8, 0.3, 0.35),
      color3: new THREE.Vector3(0.4, 0.55, 1.0)
    },
    'Pure White': {
      color1: new THREE.Vector3(0.95, 0.97, 1.0),
      color2: new THREE.Vector3(1.0, 0.85, 0.88),
      color3: new THREE.Vector3(0.9, 0.95, 1.0)
    },
    'Ice Blue': {
      color1: new THREE.Vector3(0.4, 0.7, 1.0),
      color2: new THREE.Vector3(1.0, 0.5, 0.6),
      color3: new THREE.Vector3(0.3, 0.9, 0.95)
    },
    'Fire Orange': {
      color1: new THREE.Vector3(1.0, 0.4, 0.1),
      color2: new THREE.Vector3(1.0, 0.7, 0.0),
      color3: new THREE.Vector3(1.0, 0.2, 0.3)
    }
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Optimized constants
    const FLOAT_AMPLITUDE = 0.12
    const FLOAT_SPEED = 1.2
    const ROTATION_LERP = 0.1
    const BOB_LERP = 0.08
    const TILT_AMPLITUDE = 0.03
    const BLINK_INTERVAL_MS = 5000

    // GUI controls - removed unused blur parameters
    const gui = new GUI()
    const guiParams = {
      colorScheme: 'RBW Frosted',
      intensity: 0.45,
      chromaticAberration: 0.015,
      waveSpeed: 2.0,
      waveFrequency: 5.0,
      waveAmplitude: 0.15,
      distortionSpeed: 1.2,
      ringThickness: 0.15,
      glowIntensity: 0.6,
      rimBrightness: 0.8,
      animationSpeed: 1.5,
      centerFlashIntensity: 1.5,
      redShift: 0.015,
      blueShift: -0.015,
      colorSaturation: 0.9,
      turbulenceIntensity: 0.3,
      turbulenceSpeed: 1.5,
      triggerDistortion: () => {
        distortionUniforms.distortionTime.value = 0.0
      }
    }

    // Optimized uniforms - removed unused blur uniforms
    const distortionUniforms = {
      time: { value: 0 },
      distortionTime: { value: 7.5 },
      resolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
      distortionCenter: { value: new THREE.Vector2(0.5, 0.5) },
      intensity: { value: guiParams.intensity },
      chromaticAberration: { value: guiParams.chromaticAberration },
      waveSpeed: { value: guiParams.waveSpeed },
      waveFrequency: { value: guiParams.waveFrequency },
      waveAmplitude: { value: guiParams.waveAmplitude },
      distortionSpeed: { value: guiParams.distortionSpeed },
      ringThickness: { value: guiParams.ringThickness },
      glowIntensity: { value: guiParams.glowIntensity },
      rimBrightness: { value: guiParams.rimBrightness },
      centerFlashIntensity: { value: guiParams.centerFlashIntensity },
      redShift: { value: guiParams.redShift },
      blueShift: { value: guiParams.blueShift },
      colorSaturation: { value: guiParams.colorSaturation },
      turbulenceIntensity: { value: guiParams.turbulenceIntensity },
      turbulenceSpeed: { value: guiParams.turbulenceSpeed },
      color1: { value: COLOR_SCHEMES['RBW Frosted'].color1 },
      color2: { value: COLOR_SCHEMES['RBW Frosted'].color2 },
      color3: { value: COLOR_SCHEMES['RBW Frosted'].color3 }
    }

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `

    // OPTIMIZED FRAGMENT SHADER - Same visual result but faster
    const fragmentShader = `
      precision lowp float;
      
      uniform float time;
      uniform float distortionTime;
      uniform vec2 resolution;
      uniform vec2 distortionCenter;
      uniform float intensity;
      uniform float chromaticAberration;
      uniform float waveSpeed;
      uniform float waveFrequency;
      uniform float waveAmplitude;
      uniform float distortionSpeed;
      uniform float ringThickness;
      uniform float glowIntensity;
      uniform float rimBrightness;
      uniform float centerFlashIntensity;
      uniform float redShift;
      uniform float blueShift;
      uniform float colorSaturation;
      uniform float turbulenceIntensity;
      uniform float turbulenceSpeed;
      uniform vec3 color1;
      uniform vec3 color2;
      uniform vec3 color3;
      
      varying vec2 vUv;

      #define PI 3.14159265359

      // Optimized noise function - fewer operations
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        
        return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
      }

      // Optimized turbulence with fewer iterations
      float turbulence(vec2 p, float t, float scale) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;
        
        // Reduced from 3 to 2 iterations for performance
        for(int i = 0; i < 2; i++) {
          value += abs(noise(p * frequency + t * 0.3)) * amplitude;
          amplitude *= 0.5;
          frequency *= 2.0;
        }
        return value * scale;
      }

      // Optimized fluid wave with fewer calculations
      float fluidWave(vec2 p, float t, float speed, float freq, float amp) {
        // Reduced number of waves from 3 to 2
        float wave = sin(p.x * freq + t * speed) * amp;
        wave += sin(p.y * freq * 1.3 + t * speed * 0.8) * amp * 0.7;
        
        // Simplified turbulence
        wave += turbulence(p * 1.5, t * turbulenceSpeed, turbulenceIntensity * 0.25);
        
        return wave;
      }

      void main() {
        vec2 uv = vUv;
        float t = distortionTime;
        
        // Aspect ratio correction
        float aspect = resolution.x / resolution.y;
        vec2 aspectCorrection = vec2(aspect, 1.0);
        
        // Center calculation
        vec2 centered = (uv - distortionCenter) * aspectCorrection;
        float dist = length(centered);
        vec2 dir = normalize(centered + vec2(0.0001));
        
        // Optimized wave calculation - fewer layers
        float wave1 = fluidWave(uv * 2.0, time * 1.5, waveSpeed * 0.8, waveFrequency * 1.2, waveAmplitude * 0.8);
        float wave2 = fluidWave(uv * 1.5 + 0.5, time * 1.2, waveSpeed * 1.1, waveFrequency * 0.9, waveAmplitude * 0.6);
        float combinedWave = (wave1 + wave2) * 0.5; // Changed from 3 to 2 waves
        
        // Ring progression
        float ringProgress = t * distortionSpeed;
        float ringRadius = ringProgress + combinedWave * 0.15;
        
        // Ring mask
        float ringDist = abs(dist - ringRadius);
        float ringMask = smoothstep(ringThickness * 1.5, ringThickness * 0.3, ringDist);
        ringMask *= smoothstep(2.0, 1.0, ringRadius);
        
        // Secondary wave (simplified)
        float innerWave = sin(dist * waveFrequency - time * waveSpeed * 2.0) * 0.1;
        float innerRingMask = smoothstep(ringThickness * 0.8, ringThickness * 0.2, abs(dist - (ringRadius - 0.15 + innerWave)));
        innerRingMask *= smoothstep(2.0, 1.0, ringRadius - 0.15);
        
        // Combine masks
        float totalMask = ringMask + innerRingMask * 0.7;
        totalMask = clamp(totalMask, 0.0, 1.0);
        
        // Apply distortion (optimized)
        vec2 distortionOffset = dir * totalMask * intensity;
        distortionOffset += vec2(
          sin(uv.y * 8.0 + time * 2.5) * 0.001,
          cos(uv.x * 6.0 + time * 2.0) * 0.001
        ) * totalMask * 0.5; // Reduced frequency
        
        distortionOffset /= aspectCorrection;
        vec2 distortedUv = uv + distortionOffset;
        distortedUv = clamp(distortedUv, 0.0, 1.0);
        
        // Color calculations
        vec3 color = vec3(0.0);
        
        // Glow patterns (optimized)
        float outerGlow = smoothstep(ringThickness * 2.0, ringThickness * 0.3, ringDist);
        outerGlow *= smoothstep(2.0, 0.8, ringRadius);
        outerGlow *= smoothstep(0.0, 0.4, t);
        
        float innerGlow = smoothstep(ringThickness * 1.2, ringThickness * 0.4, abs(dist - (ringRadius - 0.1)));
        innerGlow *= smoothstep(2.0, 1.0, ringRadius - 0.1);
        innerGlow *= smoothstep(0.0, 0.5, t);
        
        float rimGlow = smoothstep(ringThickness * 2.5, ringThickness * 0.6, ringDist);
        rimGlow *= smoothstep(2.0, 1.2, ringRadius);
        rimGlow *= smoothstep(0.0, 0.3, t);
        
        // Apply chromatic aberration (simplified)
        vec2 caDir = normalize(centered + vec2(0.0001));
        float caAmount = chromaticAberration * totalMask;
        
        // Combine colors with optimized calculations
        vec3 glowColor1 = color1 * outerGlow * glowIntensity * 0.8;
        vec3 glowColor2 = color2 * innerGlow * glowIntensity * 0.6;
        vec3 glowColor3 = color3 * rimGlow * glowIntensity * 0.4;
        
        // Apply chromatic shift (simplified)
        color.r = glowColor1.r * (1.0 + caAmount * redShift) + 
                 glowColor2.r * (1.0 + caAmount * redShift * 0.8) + 
                 glowColor3.r * (1.0 + caAmount * redShift * 0.6);
        color.g = glowColor1.g + glowColor2.g + glowColor3.g;
        color.b = glowColor1.b * (1.0 + caAmount * blueShift) + 
                 glowColor2.b * (1.0 + caAmount * blueShift * 0.8) + 
                 glowColor3.b * (1.0 + caAmount * blueShift * 0.6);
        
        // White rim
        float whiteRim = smoothstep(ringThickness * 0.8, ringThickness * 0.15, ringDist);
        whiteRim *= smoothstep(2.0, 1.2, ringRadius);
        whiteRim *= rimBrightness;
        whiteRim += sin(dist * 16.0 - time * 4.0) * 0.08 * rimBrightness; // Reduced frequency
        color += vec3(whiteRim);
        
        // Center flash
        float centerFlash = smoothstep(0.2, 0.0, dist);
        centerFlash *= smoothstep(0.0, 0.15, t);
        centerFlash *= smoothstep(0.5, 0.2, t);
        centerFlash += sin(t * 8.0) * 0.08 * smoothstep(0.0, 0.2, t); // Reduced frequency
        color += vec3(centerFlash * centerFlashIntensity);
        
        // Center glow
        float centerGlow = smoothstep(0.15, 0.0, dist);
        centerGlow *= smoothstep(0.0, 0.6, t);
        centerGlow *= smoothstep(1.8, 0.9, t);
        centerGlow *= 0.5;
        centerGlow += sin(time * 1.5) * 0.04 * smoothstep(0.0, 0.3, t); // Reduced frequency
        color += color1 * centerGlow;
        
        // Apply color saturation
        float gray = dot(color, vec3(0.299, 0.587, 0.114));
        color = mix(vec3(gray), color, colorSaturation);
        
        gl_FragColor = vec4(color, 1.0);
      }
    `

    // Add GUI controls (simplified)
    const colorSchemeFolder = gui.addFolder('Color Scheme')
    colorSchemeFolder.add(guiParams, 'colorScheme', Object.keys(COLOR_SCHEMES)).onChange(schemeName => {
      const scheme = COLOR_SCHEMES[schemeName]
      distortionUniforms.color1.value.copy(scheme.color1)
      distortionUniforms.color2.value.copy(scheme.color2)
      distortionUniforms.color3.value.copy(scheme.color3)
    })
    
    const distortionFolder = gui.addFolder('Fluid Distortion')
    distortionFolder.add(guiParams, 'intensity', 0, 1).onChange(v => distortionUniforms.intensity.value = v)
    distortionFolder.add(guiParams, 'chromaticAberration', 0, 0.05).onChange(v => distortionUniforms.chromaticAberration.value = v)
    distortionFolder.add(guiParams, 'waveSpeed', 0.5, 3).onChange(v => distortionUniforms.waveSpeed.value = v)
    distortionFolder.add(guiParams, 'waveFrequency', 1, 10).onChange(v => distortionUniforms.waveFrequency.value = v)
    distortionFolder.add(guiParams, 'waveAmplitude', 0, 0.3).onChange(v => distortionUniforms.waveAmplitude.value = v)
    distortionFolder.add(guiParams, 'distortionSpeed', 0.5, 3).onChange(v => distortionUniforms.distortionSpeed.value = v)
    distortionFolder.add(guiParams, 'ringThickness', 0.05, 0.3).onChange(v => distortionUniforms.ringThickness.value = v)
    distortionFolder.add(guiParams, 'turbulenceIntensity', 0, 1).onChange(v => distortionUniforms.turbulenceIntensity.value = v)
    distortionFolder.add(guiParams, 'turbulenceSpeed', 0.5, 3).onChange(v => distortionUniforms.turbulenceSpeed.value = v)
    distortionFolder.add(guiParams, 'animationSpeed', 0.5, 3)
    distortionFolder.add(guiParams, 'triggerDistortion').name('Trigger Effect')
    
    const colorFolder = gui.addFolder('Colors')
    colorFolder.add(guiParams, 'glowIntensity', 0, 2).onChange(v => distortionUniforms.glowIntensity.value = v)
    colorFolder.add(guiParams, 'rimBrightness', 0, 2).onChange(v => distortionUniforms.rimBrightness.value = v)
    colorFolder.add(guiParams, 'centerFlashIntensity', 0, 3).onChange(v => distortionUniforms.centerFlashIntensity.value = v)
    colorFolder.add(guiParams, 'colorSaturation', 0, 2).onChange(v => distortionUniforms.colorSaturation.value = v)
    
    const chromaticFolder = gui.addFolder('Chromatic Aberration')
    chromaticFolder.add(guiParams, 'redShift', -0.05, 0.05).onChange(v => distortionUniforms.redShift.value = v)
    chromaticFolder.add(guiParams, 'blueShift', -0.05, 0.05).onChange(v => distortionUniforms.blueShift.value = v)

    colorSchemeFolder.open()
    distortionFolder.open()

    // Scene setup
    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    )
    camera.position.set(0, 0, 13)

    // Plane geometry
    const distance = 23
    const vFov = (camera.fov * Math.PI) / 180
    const planeHeight = 2 * Math.tan(vFov / 2) * distance
    const planeWidth = planeHeight * camera.aspect
    
    const bgGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight)
    const bgMaterial = new THREE.ShaderMaterial({
      uniforms: distortionUniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: THREE.DoubleSide,
      transparent: true,
      precision: 'mediump' // Medium precision for better performance
    })
    
    const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial)
    bgMesh.position.z = -10
    scene.add(bgMesh)

    // Optimized renderer settings
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true, 
      powerPreference: 'high-performance',
      precision: 'mediump',
      depth: false, // Disable depth for 2D effect
      stencil: false
    })
    
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)) // Limit pixel ratio
    renderer.toneMapping = THREE.ReinhardToneMapping
    renderer.toneMappingExposure = 1.5 // Reduced from 2.0
    renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(renderer.domElement)

    // Load matcap texture
    const textureLoader = new THREE.TextureLoader()
    const matcap = textureLoader.load('/MatCap.jpg')
    if ('colorSpace' in matcap) matcap.colorSpace = THREE.SRGBColorSpace
    const matcapMaterial = new THREE.MeshMatcapMaterial({ matcap })

    // Simplified lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.8))
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(2, 2, 5)
    scene.add(directionalLight)

    // Mouse movement
    const mouse = new THREE.Vector2()
    const onMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.y = (event.clientY / window.innerHeight) * 2 - 1
      targetRotation.current = {
        x: mouse.y * Math.PI * 0.25,
        y: mouse.x * Math.PI * 0.25
      }
    }
    window.addEventListener('mousemove', onMouseMove)

    // Load model
    const loader = new GLTFLoader()
    const clock = new THREE.Clock()

    // Frame rate limiting
    let lastFrameTime = 0
    const targetFPS = 60
    const frameInterval = 1000 / targetFPS

    loader.load(
      '/head2.glb',
      (gltf) => {
        const model = gltf.scene
        modelRef.current = model

        const mixer = new THREE.AnimationMixer(model)
        mixerRef.current = mixer
        actionsRef.current = {}

        if (gltf.animations && gltf.animations.length > 0) {
          gltf.animations.forEach((clip) => {
            const action = mixer.clipAction(clip)
            action.clampWhenFinished = true
            action.enabled = true
            actionsRef.current[clip.name] = action
          })
        }

        // Apply matcap material
        model.traverse((child) => {
          if (child.isMesh && child.name !== 'Gio-Eyes') {
            child.material = matcapMaterial
            child.castShadow = false // Disable shadows for performance
            child.receiveShadow = false
          }
        })

        model.scale.set(1, 1, 1)
        model.position.z = -1
        model.userData.initialY = model.position.y
        scene.add(model)

        const blinkName = Object.keys(actionsRef.current).find((n) => /eyes/i.test(n) || /blink/i.test(n)) || Object.keys(actionsRef.current)[0]

        const playAction = (name, { isClick = false } = {}) => {
          const action = actionsRef.current[name]
          if (!action) return

          if (isClick) playingActionRef.current = true

          action.reset()
          action.setLoop(THREE.LoopOnce, 0)
          action.play()
          prevActionRef.current = action
        }

        // Click handler
        const clickHandler = () => {
          if (HIT_ANIMATIONS.length === 0) return

          const nextIndex = hitAnimationIndexRef.current % HIT_ANIMATIONS.length
          const nextAnimationName = HIT_ANIMATIONS[nextIndex]

          playAction(nextAnimationName, { isClick: true })
          distortionUniforms.distortionTime.value = 0.0
          hitAnimationIndexRef.current = (nextIndex + 1) % HIT_ANIMATIONS.length
        }

        window.addEventListener('click', clickHandler)
        model.userData._clickHandler = clickHandler

        mixer.addEventListener('finished', () => {
          playingActionRef.current = false
        })

        if (blinkName) {
          blinkIntervalRef.current = setInterval(() => {
            if (!playingActionRef.current) {
              playAction(blinkName, { isClick: false })
            }
          }, BLINK_INTERVAL_MS)
        }

        // Animation loop with frame limiting
        const animate = (currentTime) => {
          rafRef.current = requestAnimationFrame(animate)
          
          // Frame limiting
          const deltaTime = currentTime - lastFrameTime
          if (deltaTime < frameInterval) return
          lastFrameTime = currentTime
          
          const delta = clock.getDelta()

          if (mixerRef.current) mixerRef.current.update(delta)

          // Update shader time
          distortionUniforms.time.value = clock.elapsedTime
          
          // Update distortion animation
          if (distortionUniforms.distortionTime.value < 3.5) {
            distortionUniforms.distortionTime.value += delta * guiParams.animationSpeed
          }

          // Update model position and rotation
          if (modelRef.current) {
            const target = targetRotation.current
            const model = modelRef.current
            
            // Optimized lerp calculations
            model.rotation.x += (target.x - model.rotation.x) * ROTATION_LERP
            model.rotation.y += (target.y - model.rotation.y) * ROTATION_LERP

            const elapsed = clock.elapsedTime
            const desiredY = model.userData.initialY + Math.sin(elapsed * FLOAT_SPEED) * FLOAT_AMPLITUDE
            model.position.y += (desiredY - model.position.y) * BOB_LERP

            const tilt = Math.cos(elapsed * FLOAT_SPEED * 0.6) * TILT_AMPLITUDE
            model.rotation.z += (tilt - model.rotation.z) * ROTATION_LERP * 0.6
          }

          renderer.render(scene, camera)
        }
        animate(0)
      },
      undefined,
      (err) => console.error(err)
    )

    // Handle resize
    const handleResize = () => {
      if (!container) return
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
      distortionUniforms.resolution.value.set(container.clientWidth, container.clientHeight)
      
      // Update plane size
      const distance = 23
      const vFov = (camera.fov * Math.PI) / 180
      const planeHeight = 2 * Math.tan(vFov / 2) * distance
      const planeWidth = planeHeight * camera.aspect
      
      bgMesh.geometry.dispose()
      bgMesh.geometry = new THREE.PlaneGeometry(planeWidth, planeHeight)
    }
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      gui.destroy()
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', onMouseMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (modelRef.current && modelRef.current.userData._clickHandler)
        window.removeEventListener('click', modelRef.current.userData._clickHandler)
      if (blinkIntervalRef.current) clearInterval(blinkIntervalRef.current)
      if (mixerRef.current) mixerRef.current.stopAllAction()
      if (renderer && renderer.domElement && container.contains(renderer.domElement))
        container.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <section ref={containerRef} className="w-full h-screen relative">
      <div className="absolute top-1/2 right-1/5 z-20 text-white text-[24px] flex flex-col gap-2 -translate-y-1/2">
        <h1 className="font-lay-normal tracking-[-1%] leading-[90%]">Gionatan Nese</h1>
        <h1 className="tracking-[-1%] font-lay-normal leading-[90%]">Multi-Disciplinary Designer</h1>
      </div>

      <div className="absolute bottom-1/10 left-[64%] z-20 text-xl text-white text-[14px] flex flex-col gap-7 -translate-y-1/2">
        <h1 className="font-lay-normal tracking-[-1%] leading-[120%]">
          Turning bold ideas into <br /> ambitious cool Stuff that <br /> actually sticks.
        </h1>
        <h1 className="tracking-[-1%] font-lay-normal leading-[120%]">
          Currently at <br /> DashDigital Studio
        </h1>
      </div>
    </section>
  )
}

export default HeroSection