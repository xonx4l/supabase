import React, { useMemo, useEffect, useState, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AdditiveBlending } from 'three'
import { range } from 'lodash'

let defaultConfig = {
  particles: 20,
  particlesSize: 3,
  goldParticlesSize: 1.5,
  particlesSides: 8,
  particlesBlending: true,
  lightIntensity: 0.3,
  widthRadius: 100,
  widthRatio: 1.2,
  topHeightRadius: 80,
  bottomHeightRadius: 100,
  color: 'white',
  colorGold: '#b89d18',
  xThickness: 7,
  xRandomnessFactor: 2.2,
  xRandomnessShape: 2.2,
  xRandomness: 5,
  yThickness: 20,
  max_speed: 1,
  min_speed: -0.1,
  showGold: true,
}

const useParticlesConfig = (users: any): any => {
  const isWindowUndefined = typeof window === 'undefined'
  if (isWindowUndefined) return null
  const hash = window.location.hash
  const isDebugMode = hash.includes('#debug')
  const [particles, setParticles] = useState<any[]>(users)

  const [config, setConfig] = useState(defaultConfig)

  const handleSetConfig = (name: string, value: any) => {
    setConfig((prevConfig) => ({ ...prevConfig, [name]: value }))
  }

  const init = async () => {
    if (!isDebugMode) return
    const dat = await import('dat.gui')
    const gui = new dat.GUI()
    const particlesFolder = gui.addFolder('Particles')
    const shapeFolder = gui.addFolder('Shape')
    const speedFolder = gui.addFolder('Speed')
    // const trailFolder = gui.addFolder('Trail')
    gui.width = 500
    particlesFolder
      .add(config, 'particles')
      .min(1)
      .max(5000)
      .step(1)
      .name('Count')
      .onChange((value) => {
        handleSetConfig('particles', value)
        setParticles(range(0, value))
      })
    particlesFolder
      .add(config, 'particlesSize')
      .min(1)
      .max(10)
      .step(0.05)
      .name('Size')
      .onChange((value) => handleSetConfig('particlesSize', value))
    particlesFolder
      .add(config, 'goldParticlesSize')
      .min(1)
      .max(10)
      .step(0.05)
      .name('Gold Particles Size')
      .onChange((value) => handleSetConfig('goldParticlesSize', value))
    particlesFolder
      .add(config, 'particlesSides')
      .min(3)
      .max(20)
      .step(1)
      .name('Sides')
      .onChange((value) => handleSetConfig('particlesSides', value))
    particlesFolder
      .add(config, 'lightIntensity')
      .min(0)
      .max(10)
      .step(0.05)
      .name('Light intensity')
      .onChange((value) => handleSetConfig('lightIntensity', value))
    particlesFolder
      .add(config, 'showGold')
      .name('Show Gold Particles')
      .onChange((value) => handleSetConfig('showGold', value))
    particlesFolder
      .add(config, 'particlesBlending')
      .name('Blending')
      .onChange((value) => handleSetConfig('particlesBlending', value))
    shapeFolder
      .add(config, 'widthRadius')
      .min(1)
      .max(200)
      .step(1)
      .name('Width Radius')
      .onChange((value) => handleSetConfig('widthRadius', value))
    shapeFolder
      .add(config, 'widthRatio')
      .min(0.5)
      .max(3)
      .step(0.01)
      .name('Top/Bottom Ratio')
      .onChange((value) => handleSetConfig('widthRatio', value))
    shapeFolder
      .add(config, 'topHeightRadius')
      .min(1)
      .max(200)
      .step(1)
      .name('Height Radius - Top')
      .onChange((value) => handleSetConfig('topHeightRadius', value))
    shapeFolder
      .add(config, 'bottomHeightRadius')
      .min(1)
      .max(200)
      .step(1)
      .name('Height Radius - Bottom')
      .onChange((value) => handleSetConfig('bottomHeightRadius', value))
    shapeFolder
      .add(config, 'xThickness')
      .min(1)
      .max(100)
      .step(0.1)
      .name('Stroke Width')
      .onChange((value) => handleSetConfig('xThickness', value))
    shapeFolder
      .add(config, 'xRandomnessShape')
      .min(0)
      .max(5)
      .step(0.001)
      .name('Randomness shape')
      .onChange((value) => handleSetConfig('xRandomnessShape', value))
    shapeFolder
      .add(config, 'xRandomness')
      .min(0)
      .max(50)
      .step(0.01)
      .name('Randomness')
      .onChange((value) => handleSetConfig('xRandomness', value))
    shapeFolder
      .add(config, 'yThickness')
      .min(1)
      .max(50)
      .step(0.1)
      .name('y thickness')
      .onChange((value) => handleSetConfig('yThickness', value))
    speedFolder
      .add(config, 'min_speed')
      .min(-6)
      .max(6)
      .step(0.01)
      .name('Min speed')
      .onChange((value) => handleSetConfig('min_speed', value))
    speedFolder
      .add(config, 'max_speed')
      .min(-6)
      .max(6)
      .step(0.01)
      .name('Max speed')
      .onChange((value) => handleSetConfig('max_speed', value))

    particlesFolder.open()
    shapeFolder.open()
    speedFolder.open()
  }

  useEffect(() => {
    init()
  }, [])

  return { config, handleSetConfig, particles, setParticles, isDebugMode }
}

const ParticlesDemo = () => {
  const isWindowUndefined = typeof window === 'undefined'
  if (isWindowUndefined) return null

  const canvasRef = React.useRef(null)

  const [animate, setAnimate] = useState<boolean>(true)
  const { config, particles } = useParticlesConfig([{}])

  // stop animation if canvas if is not in viewport
  // to avoid unnecessary computations
  const handleScroll = () => {
    if (canvasRef.current && typeof window !== 'undefined') {
      const rect = (canvasRef.current as HTMLDivElement)?.getBoundingClientRect()
      const isInView = rect.bottom > 0

      setAnimate(isInView)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  /* ThreeJs setup */

  const Geometry = useMemo(
    () => () => <circleGeometry args={[config.particlesSize, config.particlesSides]} />,
    []
  )
  const GoldGeometry = useMemo(
    () => () => <circleGeometry args={[config.goldParticlesSize, config.particlesSides]} />,
    []
  )
  const Material = () =>
    useMemo(
      () => (
        <meshPhysicalMaterial
          color={config.color}
          blending={config.particlesBlending ? AdditiveBlending : undefined}
        />
      ),
      []
    )
  const GoldMaterial = () =>
    useMemo(
      () => (
        <meshPhysicalMaterial
          color={config.colorGold}
          metalness={35}
          blending={config.particlesBlending ? AdditiveBlending : undefined}
        />
      ),
      []
    )

  return (
    <Canvas
      ref={canvasRef}
      dpr={[1, 2]}
      camera={{ fov: 75, position: [0, 0, 300] }}
      className="relative z-30"
    >
      <ambientLight intensity={config.lightIntensity} />
      <group position={[0, 0, 0]} scale={[1, 1, 1]}>
        {/* Animated 8 shape particles */}
        {particles?.map((user: any, index: number) => (
          <Particle
            key={`particle-${user.username ?? index}`}
            user={user}
            config={config}
            animate={animate}
          >
            {/* {config.showGold && Math.random() <= 0.5 ? ( */}
            {false ? (
              <>
                <GoldGeometry />
                <GoldMaterial />
              </>
            ) : (
              <>
                <Geometry />
                <Material />
              </>
            )}
          </Particle>
        ))}
      </group>
    </Canvas>
  )
}

interface Props {
  animate?: boolean
  children: any
  config: any
  user?: any
}

const Particle = ({ animate = true, children, config }: Props) => {
  const particle = useRef<any>(null)

  const pathOffsetShape =
    Math.pow(
      Math.random() * config.xRandomnessShape,
      config.xRandomness - 1 + 1 - config.xRandomness / 2
    ) * config.xThickness

  const pathOffset = pathOffsetShape * (pathOffsetShape < 1 || Math.random() < 0.5 ? 1 : -1)
  const verticalRandomness = Math.random() * (config.yThickness - 1) + 1 - config.yThickness / 2

  const speed = 1 * Math.PI
  // const speed = Math.random() * (config.min_speed - config.max_speed) + config.max_speed

  const circumference = (config.widthRadius * Math.PI * 2) / 100
  const delayOffsetFactor = 100
  const delayOffset = Math.random() * delayOffsetFactor

  useFrame(({ clock }) => {
    if (animate) {
      const timer = clock.getElapsedTime() * speed + delayOffset
      // When the loop count is even, draw bottom 8 shape
      // if odd, draw top 8 shape
      const isEven = Math.floor(timer / circumference) % 2 == 0
      particle.current.position.x = Math.sin(timer) * config.widthRadius
      // particle.current.position.x = isEven
      //   // ? Math.sin(timer) * config.widthRadius * config.widthRatio + pathOffset
      //   ? Math.sin(timer) * config.widthRadius
      //   : Math.sin(timer) * config.widthRadius

      // particle.current.position.y = Math.cos(timer) * config.bottomHeightRadius
      particle.current.position.y = isEven
        ? Math.cos(timer) * config.bottomHeightRadius - config.bottomHeightRadius
        : -Math.cos(timer) * config.bottomHeightRadius + config.bottomHeightRadius
      // particle.current.position.y = isEven
      //   ? Math.cos(timer) * config.bottomHeightRadius -
      //     config.bottomHeightRadius +
      //     verticalRandomness
      //   : -Math.cos(timer) * config.topHeightRadius + config.topHeightRadius + verticalRandomness
    }
  })

  return <mesh ref={particle}>{children}</mesh>
}

export default ParticlesDemo
