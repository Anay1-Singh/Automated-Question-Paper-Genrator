import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Clock, CheckCircle, FileCode, Shield } from 'lucide-react'

function AnimatedCounter({ value, duration = 1500 }) {
  const [count, setCount] = useState(0)
  const elementRef = useRef(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          let startTime = null
          const startValue = 0
          const endValue = value

          const animate = (timestamp) => {
            if (!startTime) startTime = timestamp
            const progress = Math.min((timestamp - startTime) / duration, 1)
            setCount(Math.floor(progress * (endValue - startValue) + startValue))

            if (progress < 1) {
              requestAnimationFrame(animate)
            }
          }

          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.1 }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current)
      }
    }
  }, [value, duration])

  return <span ref={elementRef}>{count}</span>
}

export default function Stats() {
  const statItems = [
    {
      label: 'Time Saved Per Exam',
      target: 85,
      suffix: '%',
      icon: Clock,
      description: 'Average time reduction for department drafting processes'
    },
    {
      label: 'Curriculum Alignment',
      target: 100,
      suffix: '%',
      icon: CheckCircle,
      description: 'Strict mapping verification of course syllabus benchmarks'
    },
    {
      label: 'Export Formats Supported',
      target: 15,
      suffix: '+',
      icon: FileCode,
      description: 'Syncs with Moodle, Canvas, QTI, and custom Word/LaTeX'
    },
    {
      label: 'Assessment Integrity Audit',
      target: 100,
      suffix: '%',
      icon: Shield,
      description: 'Automated redundancy check and question leak safeguards'
    }
  ]

  return (
    <section className="bg-[#09090B] py-20 px-6 md:px-8 border-b border-[#27272A]/40 relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {statItems.map((item, idx) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-[#18181B] border border-[#27272A] p-6 rounded-xl flex flex-col items-center text-center hover:border-blue-500/30 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                
                <h3 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight mb-2">
                  <AnimatedCounter value={item.target} />
                  <span>{item.suffix}</span>
                </h3>
                
                <span className="text-xs font-semibold text-white mb-1.5 uppercase tracking-wide">
                  {item.label}
                </span>
                
                <p className="text-xs text-[#A1A1AA] leading-normal max-w-[200px]">
                  {item.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
