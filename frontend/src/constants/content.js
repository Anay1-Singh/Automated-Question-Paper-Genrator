import { 
  BrainCircuit, 
  Layers, 
  Sliders, 
  FileDown, 
  KeyRound, 
  BarChart4,
  Upload,
  Cpu,
  Sparkles,
  BookOpen,
  Clock,
  Compass,
  CheckCircle,
  Settings
} from "lucide-react";

export const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Bloom's Taxonomy", href: "#blooms-taxonomy" },
  { label: "Benefits", href: "#benefits" },
  { label: "FAQ", href: "#faq" }
];

export const TRUSTED_UNIVERSITIES = [
  { name: "MIT", code: "Massachusetts Institute of Technology" },
  { name: "Stanford", code: "Stanford University" },
  { name: "Oxford", code: "University of Oxford" },
  { name: "Cambridge", code: "University of Cambridge" },
  { name: "Harvard", code: "Harvard University" }
];

export const FEATURES = [
  {
    title: "AI Question Generation",
    description: "Generate diverse questions (MCQs, short answer, long essay) from textbooks, articles, or syllabus documents using advanced NLP models.",
    icon: BrainCircuit
  },
  {
    title: "Bloom's Taxonomy Classification",
    description: "Map questions to cognitive domains (Remembering, Understanding, Applying, Analyzing, Evaluating, Creating) for balanced evaluation.",
    icon: Layers
  },
  {
    title: "Difficulty Analysis",
    description: "Precisely control the complexity structure. Design question sheets with customizable ratios of Easy, Medium, and Hard questions.",
    icon: Sliders
  },
  {
    title: "PDF Export",
    description: "Export beautifully formatted, print-ready question papers containing customized institutional headers and exam details.",
    icon: FileDown
  },
  {
    title: "Answer Key Generation",
    description: "Save grading hours with auto-generated detailed solutions, marking schemes, and reference evaluation rubrics.",
    icon: KeyRound
  },
  {
    title: "Analytics Dashboard",
    description: "Visualize question distributions, cognitive weight allocations, and curriculum coverage through intuitive interactive charts.",
    icon: BarChart4
  }
];

export const STEPS = [
  {
    number: "01",
    title: "Upload Notes",
    description: "Submit syllabus topics, study guides, chapters, or raw text content.",
    icon: Upload
  },
  {
    number: "02",
    title: "AI Analysis",
    description: "AI identifies key concepts, core vocabulary, and important learning themes.",
    icon: Cpu
  },
  {
    number: "03",
    title: "Bloom Classification",
    description: "Cognitive taxonomy mapping resolves learning levels for balanced testing.",
    icon: BookOpen
  },
  {
    number: "04",
    title: "Generate Questions",
    description: "Drafts a robust bank of questions across multiple selected formats.",
    icon: Sparkles
  },
  {
    number: "05",
    title: "Export PDF",
    description: "Format marks, add school branding, and compile the final paper.",
    icon: FileDown
  }
];

export const BENEFITS = [
  {
    title: "Saves Teacher Time",
    description: "Cuts down question paper formulation time by up to 90%, freeing up educators to focus on teaching and mentoring students.",
    icon: Clock,
    metric: "90% Time Saved"
  },
  {
    title: "Balanced Assessments",
    description: "Promotes thorough testing of both low-level recall and high-level evaluation/creation capabilities.",
    icon: Compass,
    metric: "100% Balanced"
  },
  {
    title: "AI-Powered Automation",
    description: "Leverages cutting-edge LLMs to construct grammatically clean, contextually relevant, and original questions.",
    icon: Sparkles,
    metric: "State-of-the-Art"
  },
  {
    title: "Curriculum Aligned",
    description: "Ensure that every question directly maps to a specific syllabus item, standard, or course learning objective.",
    icon: CheckCircle,
    metric: "Aligned Output"
  },
  {
    title: "Easy Customization",
    description: "Allows teachers to quickly regenerate questions, swap options, edit text, and change mark allocations.",
    icon: Settings,
    metric: "Total Control"
  }
];

export const FAQ_DATA = [
  {
    question: "How does the AI align questions with Bloom's Taxonomy?",
    answer: "Our system uses advanced natural language processing (NLP) to parse the semantic intent of learning objectives and source content. It then maps the generated questions to cognitive levels (Remembering, Understanding, Applying, Analyzing, Evaluating, Creating) using action verbs and task complexity schemas."
  },
  {
    question: "What document formats are supported for input?",
    answer: "You can upload PDF documents, Microsoft Word files (.docx), or paste raw text articles. The system processes the contents, extracts key concepts, and drafts appropriate questions based on your specifications."
  },
  {
    question: "Can I customize the question weightages?",
    answer: "Yes. The generator provides an intuitive layout configuration where you can set exact percentage weightages for each Bloom's taxonomy tier and difficulty scale (Easy, Medium, Hard)."
  },
  {
    question: "Is the generated content unique and plagiarism-free?",
    answer: "Yes. All generated questions are compiled dynamically based on your uploaded material, ensuring that assessments are contextual, original, and tailored to your specific coursework."
  },
  {
    question: "How can I export the finalized question papers?",
    answer: "You can export assessments directly to print-ready PDF formats or raw text structures, complete with custom institution headers, marks allocations, instructions, and matching answer keys."
  }
];

export const FOOTER_LINKS = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Workflow", href: "#how-it-works" },
    { label: "Benefits", href: "#benefits" }
  ],
  resources: [
    { label: "Documentation", href: "#" },
    { label: "Bloom's Guide", href: "#" },
    { label: "Case Studies", href: "#" }
  ],
  company: [
    { label: "About Us", href: "#" },
    { label: "Research", href: "#" },
    { label: "Careers", href: "#" }
  ],
  contact: [
    { label: "Support", href: "#" },
    { label: "Contact Sales", href: "#" },
    { label: "Security", href: "#" }
  ]
};
