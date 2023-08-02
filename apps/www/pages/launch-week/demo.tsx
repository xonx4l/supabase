import { useState, useEffect } from 'react'
import Head from 'next/head'

import DefaultLayout from '~/components/Layouts/Default'
import { useTheme } from 'common/Providers'
import ParticlesDemo from '../../components/LaunchWeek/8/AnimatedParticles/demo/ParticlesDemo'

export default function Demo() {
  const { isDarkMode, toggleTheme } = useTheme()
  const [initialDarkMode] = useState(isDarkMode)

  useEffect(() => {
    toggleTheme(true)
    document.body.className = 'dark bg-[#020405]'
    return () => {
      document.body.className = ''
      toggleTheme(initialDarkMode)
    }
  }, [])

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>
      <div className="absolute inset-0 z-0">
        <ParticlesDemo />
      </div>
    </>
  )
}
