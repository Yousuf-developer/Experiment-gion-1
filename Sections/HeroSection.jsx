'use client'

import COLOR_SCHEME from '@/utils/colors'
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

  // Hit + Eye animations (restore as in your original file)
  const HIT_ANIMATIONS = ['avatar-hit-01', 'avatar-hit-02']
  const EYE_ANIMATIONS = ['eyes-hit-01', 'eyes-hit-02'] // eye animations restored
  const hitAnimationIndexRef = useRef(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const FLOAT_AMPLITUDE = 0.12
    const FLOAT_SPEED = 1.2
    const ROTATION_LERP = 0.1
    const BOB_LERP = 0.08
    const TILT_AMPLITUDE = 0.03
    const BLINK_INTERVAL_MS = 5000

    const COLOR_SCHEMES = COLOR_SCHEME

    // GUI controls
    const gui = new GUI()
    const guiParams = {
      colorScheme: 'Apple White',
      intensity: 0.35,
      chromaticAberration: 0.012,
      fluidSpeed: 1.8,
      fluidFrequency: 4.5,
      fluidAmplitude: 0.1,
      distortionSpeed: 1.2,
      ringThickness: 0.12,
      glowIntensity: 0.7,
      rimBrightness: 0.75,
      animationSpeed: 1.5,
      centerFlashIntensity: 1.3,
      redShift: 0.008,
      blueShift: -0.008,
      colorSaturation: 0.95,
      turbulence: 0.4,
      pulseIntensity: 0.15,
      triggerDistortion: () => {
        distortionUniforms.distortionTime.value = 0.0
      }
    }

    // Create fluid distortion shader with optimized performance
    const distortionUniforms = {
      time: { value: 0 },
      distortionTime: { value: 7.5 },
      resolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
      distortionCenter: { value: new THREE.Vector2(0.5, 0.5) },
      intensity: { value: guiParams.intensity },
      chromaticAberration: { value: guiParams.chromaticAberration },
      fluidSpeed: { value: guiParams.fluidSpeed },
      fluidFrequency: { value: guiParams.fluidFrequency },
      fluidAmplitude: { value: guiParams.fluidAmplitude },
      distortionSpeed: { value: guiParams.distortionSpeed },
      ringThickness: { value: guiParams.ringThickness },
      glowIntensity: { value: guiParams.glowIntensity },
      rimBrightness: { value: guiParams.rimBrightness },
      centerFlashIntensity: { value: guiParams.centerFlashIntensity },
      redShift: { value: guiParams.redShift },
      blueShift: { value: guiParams.blueShift },
      colorSaturation: { value: guiParams.colorSaturation },
      turbulence: { value: guiParams.turbulence },
      pulseIntensity: { value: guiParams.pulseIntensity },
      color1: { value: COLOR_SCHEMES['Apple White'].color1 },
      color2: { value: COLOR_SCHEMES['Apple White'].color2 },
      color3: { value: COLOR_SCHEMES['Apple White'].color3 }
    }

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `

    const fragmentShader = `
      uniform float time;
      uniform float distortionTime;
      uniform vec2 resolution;
      uniform vec2 distortionCenter;
      uniform float intensity;
      uniform float chromaticAberration;
      uniform float fluidSpeed;
      uniform float fluidFrequency;
      uniform float fluidAmplitude;
      uniform float distortionSpeed;
      uniform float ringThickness;
      uniform float glowIntensity;
      uniform float rimBrightness;
      uniform float centerFlashIntensity;
      uniform float redShift;
      uniform float blueShift;
      uniform float colorSaturation;
      uniform float turbulence;
      uniform float pulseIntensity;
      uniform vec3 color1;
      uniform vec3 color2;
      uniform vec3 color3;
      
      varying vec2 vUv;

      #define PI 3.14159265359

      // Simple random function for organic feel
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }

      // Simple noise function (cheaper than simplex)
      float noise(vec2 p) {
        vec2 ip = floor(p);
        vec2 u = fract(p);
        u = u*u*(3.0-2.0*u);
        
        float res = mix(
          mix(random(ip), random(ip+vec2(1.0,0.0)), u.x),
          mix(random(ip+vec2(0.0,1.0)), random(ip+vec2(1.0,1.0)), u.x), 
          u.y
        );
        return res * 2.0 - 1.0;
      }

      // Fluid wave function
      float fluidWave(vec2 uv, float t) {
        float wave = 0.0;
        
        // Main wave
        wave += sin(uv.x * fluidFrequency + t * fluidSpeed) * fluidAmplitude;
        wave += cos(uv.y * fluidFrequency * 1.3 + t * fluidSpeed * 0.8) * fluidAmplitude * 0.7;
        
        // Add some noise for organic feel
        wave += noise(uv * 2.0 + t * 0.5) * turbulence * 0.3;
        
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
        
        // Create fluid wave effect
        float wave1 = fluidWave(uv, time);
        float wave2 = fluidWave(uv * 0.8 + 0.3, time * 1.3) * 0.6;
        float fluidEffect = (wave1 + wave2) * 0.7;
        
        // Ring progression with fluid modulation
        float ringRadius = t * distortionSpeed;
        ringRadius += fluidEffect * 0.1; // Apply fluid to ring position
        
        // Smooth ring with fluid edges
        float ringDist = abs(dist - ringRadius);
        
        // Create wavy ring edge using sin wave
        float waveEdge = sin(atan(centered.y, centered.x) * 6.0 + time * 2.0) * 0.05;
        float adjustedThickness = ringThickness * (1.0 + waveEdge * pulseIntensity);
        
        float ringMask = smoothstep(adjustedThickness * 1.5, adjustedThickness * 0.3, ringDist);
        ringMask *= smoothstep(2.0, 1.0, ringRadius);
        
        // Add secondary fluid ring
        float innerRingDist = abs(dist - (ringRadius - 0.15 + fluidEffect * 0.05));
        float innerRingMask = smoothstep(ringThickness * 0.9, ringThickness * 0.2, innerRingDist);
        innerRingMask *= smoothstep(2.0, 1.0, ringRadius - 0.15);
        
        // Combine masks
        float totalMask = ringMask + innerRingMask * 0.7;
        totalMask = clamp(totalMask, 0.0, 1.0);
        
        // Fluid distortion with organic movement
        vec2 distortionOffset = dir * totalMask * intensity;
        
        // Add wavy perturbation
        vec2 waveOffset = vec2(
          sin(uv.y * 8.0 + time * 3.0) * 0.001,
          cos(uv.x * 7.0 + time * 2.5) * 0.001
        ) * totalMask * fluidEffect * 2.0;
        
        distortionOffset += waveOffset;
        distortionOffset /= aspectCorrection;
        vec2 distortedUv = uv + distortionOffset;
        distortedUv = clamp(distortedUv, 0.0, 1.0);
        
        // Start with black background
        vec3 color = vec3(0.0);
        
        // Fluid glow calculations
        float outerGlow = smoothstep(ringThickness * 2.0, ringThickness * 0.3, ringDist);
        outerGlow *= smoothstep(2.0, 0.8, ringRadius);
        outerGlow *= smoothstep(0.0, 0.4, t);
        
        float innerGlow = smoothstep(ringThickness * 1.2, ringThickness * 0.4, innerRingDist);
        innerGlow *= smoothstep(2.0, 1.0, ringRadius - 0.15);
        innerGlow *= smoothstep(0.0, 0.5, t);
        
        float rimGlow = smoothstep(ringThickness * 2.5, ringThickness * 0.6, ringDist);
        rimGlow *= smoothstep(2.0, 1.2, ringRadius);
        rimGlow *= smoothstep(0.0, 0.3, t);
        
        // Chromatic aberration
        vec2 caDir = dir;
        float caAmount = chromaticAberration * totalMask;
        
        // Apply colors with chromatic shift
        vec3 glowColor1 = color1 * outerGlow * glowIntensity * 0.8;
        glowColor1.r *= 1.0 + caAmount * redShift * 2.0;
        glowColor1.b *= 1.0 + caAmount * blueShift * 2.0;
        
        vec3 glowColor2 = color2 * innerGlow * glowIntensity * 0.6;
        glowColor2.r *= 1.0 + caAmount * redShift * 1.5;
        glowColor2.b *= 1.0 + caAmount * blueShift * 1.5;
        
        vec3 glowColor3 = color3 * rimGlow * glowIntensity * 0.4;
        glowColor3.r *= 1.0 + caAmount * redShift;
        glowColor3.b *= 1.0 + caAmount * blueShift;
        
        // Combine colors
        color += glowColor1 + glowColor2 + glowColor3;
        
        // White rim with fluid pulse
        float whiteRim = smoothstep(ringThickness * 0.7, ringThickness * 0.15, ringDist);
        whiteRim *= smoothstep(2.0, 1.2, ringRadius);
        whiteRim *= rimBrightness;
        
        // Add pulse effect to rim
        float pulse = sin(time * 5.0 + dist * 20.0) * 0.1 + 1.0;
        whiteRim *= pulse;
        
        color += vec3(whiteRim);
        
        // Center flash
        float centerFlash = smoothstep(0.2, 0.0, dist);
        centerFlash *= smoothstep(0.0, 0.15, t);
        centerFlash *= smoothstep(0.5, 0.2, t);
        color += vec3(centerFlash * centerFlashIntensity);
        
        // Center glow with subtle pulse
        float centerGlow = smoothstep(0.15, 0.0, dist);
        centerGlow *= smoothstep(0.0, 0.6, t);
        centerGlow *= smoothstep(1.8, 0.9, t);
        centerGlow *= 0.5;
        
        // Add pulse to center glow
        float centerPulse = sin(time * 2.0) * 0.1 + 1.0;
        centerGlow *= centerPulse;
        
        color += color1 * centerGlow;
        
        // Add subtle fluid noise overlay
        float fluidNoise = noise(uv * 3.0 + time * 0.5) * 0.05 * totalMask;
        color += vec3(fluidNoise);
        
        // Apply color saturation
        float gray = dot(color, vec3(0.299, 0.587, 0.114));
        color = mix(vec3(gray), color, colorSaturation);
        
        gl_FragColor = vec4(color, 1.0);
      }
    `

    // Add GUI controls
    const colorSchemeFolder = gui.addFolder('Color Scheme')
    colorSchemeFolder.add(guiParams, 'colorScheme', Object.keys(COLOR_SCHEMES)).onChange(schemeName => {
      const scheme = COLOR_SCHEMES[schemeName]
      distortionUniforms.color1.value.copy(scheme.color1)
      distortionUniforms.color2.value.copy(scheme.color2)
      distortionUniforms.color3.value.copy(scheme.color3)
    })

    const distortionFolder = gui.addFolder('Distortion')
    distortionFolder.add(guiParams, 'intensity', 0, 1).onChange(v => distortionUniforms.intensity.value = v)
    distortionFolder.add(guiParams, 'chromaticAberration', 0, 0.03).onChange(v => distortionUniforms.chromaticAberration.value = v)
    distortionFolder.add(guiParams, 'distortionSpeed', 0.5, 2).onChange(v => distortionUniforms.distortionSpeed.value = v)
    distortionFolder.add(guiParams, 'ringThickness', 0.05, 0.3).onChange(v => distortionUniforms.ringThickness.value = v)
    distortionFolder.add(guiParams, 'animationSpeed', 0.5, 2)
    distortionFolder.add(guiParams, 'triggerDistortion').name('Trigger Effect')

    const fluidFolder = gui.addFolder('Fluid Motion')
    fluidFolder.add(guiParams, 'fluidSpeed', 0.5, 3).onChange(v => distortionUniforms.fluidSpeed.value = v)
    fluidFolder.add(guiParams, 'fluidFrequency', 1, 10).onChange(v => distortionUniforms.fluidFrequency.value = v)
    fluidFolder.add(guiParams, 'fluidAmplitude', 0, 0.2).onChange(v => distortionUniforms.fluidAmplitude.value = v)
    fluidFolder.add(guiParams, 'turbulence', 0, 1).onChange(v => distortionUniforms.turbulence.value = v)
    fluidFolder.add(guiParams, 'pulseIntensity', 0, 0.3).onChange(v => distortionUniforms.pulseIntensity.value = v)

    const colorFolder = gui.addFolder('Colors')
    colorFolder.add(guiParams, 'glowIntensity', 0, 1.5).onChange(v => distortionUniforms.glowIntensity.value = v)
    colorFolder.add(guiParams, 'rimBrightness', 0, 1.5).onChange(v => distortionUniforms.rimBrightness.value = v)
    colorFolder.add(guiParams, 'centerFlashIntensity', 0, 2).onChange(v => distortionUniforms.centerFlashIntensity.value = v)
    colorFolder.add(guiParams, 'colorSaturation', 0, 2).onChange(v => distortionUniforms.colorSaturation.value = v)

    const chromaticFolder = gui.addFolder('Chromatic')
    chromaticFolder.add(guiParams, 'redShift', -0.03, 0.03).onChange(v => distortionUniforms.redShift.value = v)
    chromaticFolder.add(guiParams, 'blueShift', -0.03, 0.03).onChange(v => distortionUniforms.blueShift.value = v)

    colorSchemeFolder.open()
    distortionFolder.open()
    fluidFolder.open()

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    )
    camera.position.set(0, 0, 13)

    // Calculate plane size to cover screen
    const distance = 23
    const vFov = (camera.fov * Math.PI) / 180
    const planeHeight = 2 * Math.tan(vFov / 2) * distance
    const planeWidth = planeHeight * camera.aspect

    const bgGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight)
    const bgMaterial = new THREE.ShaderMaterial({
      uniforms: distortionUniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: THREE.DoubleSide
    })

    const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial)
    bgMesh.position.z = -10
    bgMesh.renderOrder = 0
    scene.add(bgMesh)

    // Optimized renderer settings
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    })

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)) // Limit pixel ratio
    renderer.toneMapping = THREE.ReinhardToneMapping
    renderer.toneMappingExposure = 2
    renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(renderer.domElement)

    const textureLoader = new THREE.TextureLoader()
    const matcap = textureLoader.load('/MatCap.jpg')
    if ('colorSpace' in matcap) matcap.colorSpace = THREE.SRGBColorSpace
    const matcapMaterial = new THREE.MeshMatcapMaterial({ matcap })

    scene.add(new THREE.AmbientLight(0xffffff, 0.6))
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(2, 2, 5)
    scene.add(directionalLight)

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.5)
    rimLight.position.set(-2, -1, -3)
    scene.add(rimLight)

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

    const loader = new GLTFLoader()
    const clock = new THREE.Clock()

    loader.load(
      '/model.glb',
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
            action.setEffectiveWeight(1)
            actionsRef.current[clip.name] = action
          })
        }

        model.traverse((child) => {
          if (child.isMesh && child.name !== 'Gio-Eyes') {
            child.material = matcapMaterial
            child.castShadow = true
            child.receiveShadow = true
          }
        })

        model.scale.set(1, 1, 1)
        model.position.z = -1
        model.userData.initialY = model.position.y
        model.renderOrder = 1
        scene.add(model)

        const blinkName =
          Object.keys(actionsRef.current).find((n) => /eyes/i.test(n) || /blink/i.test(n)) ||
          Object.keys(actionsRef.current)[0]

        const playAction = (name, { isClick = false } = {}) => {
          const action = actionsRef.current[name]
          if (!action) return

          if (isClick) playingActionRef.current = true

          action.reset()
          action.setLoop(THREE.LoopOnce, 0)
          action.enabled = true
          action.setEffectiveTimeScale(1)
          action.setEffectiveWeight(1)

          const prev = prevActionRef.current
          if (prev && prev !== action) prev.crossFadeTo(action, 0.25, false)

          action.play()
          prevActionRef.current = action
        }

        // Function to play eye animation synchronized with hit
        const playEyeAnimation = (eyeAnimationName) => {
          const eyeAction = actionsRef.current[eyeAnimationName]
          if (!eyeAction) {
            console.warn(`Eye animation "${eyeAnimationName}" not found`)
            return
          }

          // Reset and configure eye animation
          eyeAction.reset()
          eyeAction.setLoop(THREE.LoopOnce, 0)
          eyeAction.enabled = true
          eyeAction.setEffectiveTimeScale(1)
          eyeAction.setEffectiveWeight(1)
          
          // Play immediately - no crossfade for eye animations
          eyeAction.play()
          
          // Set to idle after animation completes
          eyeAction.clampWhenFinished = true
          eyeAction.paused = false
        }

        //--------------------------------------------------------
        // 🔥 AUTO SHAKE (EVERY 5 SECONDS OF INACTIVITY)
        //--------------------------------------------------------

        let lastInteractionTime = performance.now();
        const SHAKE_INTERVAL = 5000; // 5s

        // Exact animation names from your screenshot
        const HEAD_SHAKE = 'gio-head-shake';
        const EYE_SHAKE = 'gio-eyes-shake';

        // Detect any user interaction
        window.addEventListener('click', () => {
          lastInteractionTime = performance.now();
        });

        // Function to play shake animations together
        const playIdleShake = () => {
          // If a hit or any action is busy, do NOT shake
          if (playingActionRef.current) return;

          // Play head shake
          const head = actionsRef.current[HEAD_SHAKE];
          if (head) {
            playAction(HEAD_SHAKE, { isClick: false });
          }

          // Play eye shake immediately
          const eyes = actionsRef.current[EYE_SHAKE];
          if (eyes) {
            playEyeAnimation(EYE_SHAKE);
          }
        };

        // Check every second if user is idle
        setInterval(() => {
          const now = performance.now();
          const idle = now - lastInteractionTime;

          if (idle > SHAKE_INTERVAL && !playingActionRef.current) {
            playIdleShake();
            lastInteractionTime = performance.now();
          }
        }, 1000);

        // Click handler - triggers both head animation and eye animation
        const clickHandler = () => {
          if (HIT_ANIMATIONS.length === 0) return

          const nextIndex = hitAnimationIndexRef.current % HIT_ANIMATIONS.length
          const nextAnimationName = HIT_ANIMATIONS[nextIndex]
          
          // Get corresponding eye animation
          const eyeAnimationName = EYE_ANIMATIONS[nextIndex] || 
                                 EYE_ANIMATIONS[0] || 
                                 Object.keys(actionsRef.current).find(name => name.includes('eyes'))

          // Play both animations
          playAction(nextAnimationName, { isClick: true })
          
          if (eyeAnimationName) {
            playEyeAnimation(eyeAnimationName)
          }

          // Reset distortion effect to trigger animation
          distortionUniforms.distortionTime.value = 0.0

          hitAnimationIndexRef.current = (nextIndex + 1) % HIT_ANIMATIONS.length
        }

        window.addEventListener('click', clickHandler)
        model.userData._clickHandler = clickHandler

        // Track when animations finish to reset playing state
        let activeAnimationsCount = 0
        
        // Correct animation finish listener
        mixer.addEventListener('finished', (event) => {
          // Reset playing flag when ANY clip finishes
          playingActionRef.current = false;
        });


        if (blinkName) {
          blinkIntervalRef.current = setInterval(() => {
            if (!playingActionRef.current) {
              playAction(blinkName, { isClick: false })
            }
          }, BLINK_INTERVAL_MS)
        }

        const animate = () => {
          rafRef.current = requestAnimationFrame(animate)
          const delta = clock.getDelta()

          if (mixerRef.current) mixerRef.current.update(delta)

          // Update distortion shader
          distortionUniforms.time.value = clock.elapsedTime
          
          // Advance distortion animation
          if (distortionUniforms.distortionTime.value < 3.5) {
            distortionUniforms.distortionTime.value += delta * guiParams.animationSpeed
          }

          if (modelRef.current) {
            const target = targetRotation.current
            model.rotation.x = THREE.MathUtils.lerp(model.rotation.x, target.x, ROTATION_LERP)
            model.rotation.y = THREE.MathUtils.lerp(model.rotation.y, target.y, ROTATION_LERP)

            const elapsed = clock.elapsedTime
            const desiredY = model.userData.initialY + Math.sin(elapsed * FLOAT_SPEED) * FLOAT_AMPLITUDE
            model.position.y = THREE.MathUtils.lerp(model.position.y, desiredY, BOB_LERP)

            const tilt = Math.cos(elapsed * FLOAT_SPEED * 0.6) * TILT_AMPLITUDE
            model.rotation.z = THREE.MathUtils.lerp(model.rotation.z, tilt, ROTATION_LERP * 0.6)
          }

          renderer.render(scene, camera)
        }
        animate()
      },
      undefined,
      (err) => console.error(err)
    )

    const handleResize = () => {
      if (!container) return
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
      distortionUniforms.resolution.value.set(container.clientWidth, container.clientHeight)
      
      // Update plane size on resize
      const distance = 23
      const vFov = (camera.fov * Math.PI) / 180
      const planeHeight = 2 * Math.tan(vFov / 2) * distance
      const planeWidth = planeHeight * camera.aspect
      bgMesh.geometry.dispose()
      bgMesh.geometry = new THREE.PlaneGeometry(planeWidth, planeHeight)
    }
    window.addEventListener('resize', handleResize)

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
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
