import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  const toggleFAQ = (index) => {
    if (openIndex === index) {
      setOpenIndex(null)
    } else {
      setOpenIndex(index)
    }
  }

  const faqs = [
    {
      question: "How does the AI map questions to Bloom's Taxonomy?",
      answer: "Our engine uses custom natural language processing (NLP) models trained on academic curriculum guides. It analyzes action verbs (e.g., 'critique' vs 'define') and the complexity of the subject matter to align each question precisely with the appropriate cognitive level (Remember, Understand, Apply, Analyze, Evaluate, Create)."
    },
    {
      question: "Can we upload custom university templates and blueprints?",
      answer: "Yes. In the Professional and Enterprise tiers, you can upload your university's exact layout guidelines, section requirements (e.g., Part A/B/C), marks weightages, and core course blueprints. The engine generates candidate papers that strictly match these rules."
    },
    {
      question: "Does it support LaTeX mathematical equations and code formatting?",
      answer: "Absolutely. PaperMind full-featured editor supports LaTeX syntax compilation for math-heavy sciences and engineering fields. It also automatically highlights and formats code snippets for computer science and programming assessments."
    },
    {
      question: "What file formats are supported for study materials?",
      answer: "You can upload files in PDF, DOCX, TXT, and Markdown formats. You can also paste raw lecture transcripts, syllabus outline points, or course notes directly into our text box interface."
    },
    {
      question: "How does LMS integration work?",
      answer: "We support exporting question papers in standard QTI 2.1 / 3.0 formats, which can be imported directly into Canvas, Blackboard, Moodle, and D2L Brightspace. You can also sync papers to your courses via LTI integration."
    },
    {
      question: "Is my university study material kept private?",
      answer: "Yes, security and privacy are central. PaperMind does not use university material to train general public models. All uploaded documents are encrypted at rest and in transit, and are scoped solely to your department or university instance."
    }
  ]

  return (
    <section id="faq" className="bg-[#09090B] py-24 md:py-32 px-6 md:px-8 border-b border-[#27272A]/40 relative">
      <div className="max-w-4xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-[#A1A1AA] text-lg">
            Answers to common questions about our AI question generation engine.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="flex flex-col gap-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx
            return (
              <div
                key={idx}
                className="bg-[#18181B] border border-[#27272A] rounded-xl overflow-hidden transition-all duration-300 hover:border-zinc-700"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full py-5 px-6 flex items-center justify-between text-left focus:outline-none focus-visible:bg-[#27272A]/20"
                  aria-expanded={isOpen}
                >
                  <span className="font-display font-semibold text-sm sm:text-base text-white tracking-tight">
                    {faq.question}
                  </span>
                  <div className={`p-1 text-zinc-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-500' : ''}`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>

                {/* Animated Accordion Content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-[#A1A1AA] leading-relaxed border-t border-[#27272A]/40">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
