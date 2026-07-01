import { motion } from 'framer-motion'
import { Check, HelpCircle } from 'lucide-react'

export default function Pricing() {
  const tiers = [
    {
      name: 'Starter',
      description: 'Ideal for individual educators and course coordinators.',
      price: 29,
      features: [
        'Up to 5 question papers / month',
        'Basic Bloom taxonomy (3 levels)',
        'Standard PDF templates',
        'Upload materials up to 10MB',
        'Email customer support'
      ],
      cta: 'Start 14-Day Trial',
      popular: false
    },
    {
      name: 'Professional',
      description: 'Perfect for departments, colleges, and schools.',
      price: 99,
      features: [
        'Unlimited question papers',
        'Full Bloom taxonomy (6 levels)',
        'LMS Integration (Canvas, Moodle)',
        'Custom template configuration',
        'Upload materials up to 50MB',
        'Word & LaTeX export support',
        'Priority support (under 4 hours)'
      ],
      cta: 'Upgrade to Professional',
      popular: true
    },
    {
      name: 'Enterprise',
      description: 'Tailored for full universities requiring governance.',
      price: 'Custom',
      features: [
        'Everything in Professional',
        'Custom Bloom taxonomy weightings',
        'Single Sign-On (SSO / SAML)',
        'Dedicated server instance',
        '99.9% uptime SLA guarantee',
        'API access for automated integrations',
        'Dedicated Account Manager'
      ],
      cta: 'Contact University Sales',
      popular: false
    }
  ]

  return (
    <section id="pricing" className="bg-[#09090B] py-24 md:py-32 px-6 md:px-8 border-b border-[#27272A]/40 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4 tracking-tight">
            Predictable Pricing for Any Scale
          </h2>
          <p className="text-[#A1A1AA] text-lg">
            Choose a plan that fits your classroom, department, or complete institution.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`bg-[#18181B] border rounded-2xl p-8 flex flex-col justify-between relative transition-all duration-300 ${
                tier.popular
                  ? 'border-blue-500 shadow-xl shadow-blue-500/5 ring-1 ring-blue-500/20'
                  : 'border-[#27272A] hover:border-zinc-700'
              }`}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute top-0 right-8 -translate-y-1/2">
                  <span className="bg-blue-600 text-white border border-blue-500 text-[10px] font-extrabold tracking-widest uppercase px-3 py-1 rounded-full shadow-md">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Top Details */}
              <div>
                <h3 className="font-display font-bold text-xl text-white mb-2">{tier.name}</h3>
                <p className="text-xs text-[#A1A1AA] mb-6 leading-relaxed min-h-[40px]">{tier.description}</p>
                
                <div className="flex items-baseline gap-1 mb-8">
                  {typeof tier.price === 'number' ? (
                    <>
                      <span className="text-4xl font-display font-extrabold text-white">${tier.price}</span>
                      <span className="text-xs text-[#A1A1AA] font-medium">/ month</span>
                    </>
                  ) : (
                    <span className="text-3xl font-display font-extrabold text-white">{tier.price}</span>
                  )}
                </div>

                <div className="h-px bg-[#27272A] mb-8" />

                {/* Features List */}
                <ul className="flex flex-col gap-4 text-left">
                  {tier.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-3 text-xs text-zinc-300">
                      <div className="p-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <button
                className={`mt-10 w-full py-3 px-4 rounded-lg text-xs font-bold transition-all duration-200 ${
                  tier.popular
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'
                    : 'bg-[#09090B] hover:bg-zinc-950 border border-[#27272A] text-white hover:border-zinc-700'
                }`}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Enterprise Callout */}
        <p className="mt-12 text-center text-xs text-zinc-500 flex items-center justify-center gap-1">
          <HelpCircle className="w-3.5 h-3.5" />
          Need a custom deployment? <a href="#contact" className="text-blue-500 hover:underline">Contact our Enterprise Support team</a>
        </p>

      </div>
    </section>
  )
}
