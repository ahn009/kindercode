import dynamic from 'next/dynamic'
import Hero from '@/components/sections/Hero'

const LearningMethods = dynamic(
  () => import('@/components/sections/LearningMethods'),
)
const SkillPaths = dynamic(() => import('@/components/sections/SkillPaths'))
const Competitions = dynamic(
  () => import('@/components/sections/Competitions'),
)
const Schools = dynamic(() => import('@/components/sections/Schools'))
const Community = dynamic(() => import('@/components/sections/Community'))
const Pricing = dynamic(() => import('@/components/sections/Pricing'))
const Testimonials = dynamic(
  () => import('@/components/sections/Testimonials'),
)

export default function Home() {
  return (
    <main>
      <Hero />
      <LearningMethods />
      <SkillPaths />
      <Competitions />
      <Schools />
      <Community />
      <Pricing />
      <Testimonials />
    </main>
  )
}
