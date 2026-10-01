import { Service, Condition, FAQ, TeamMember } from '@/types';

export const SITE = {
  name: "INTERACTIVE MINDS",
  shortName: "IM",
  tagline: "Autism Care & Child Development Centre",
  email: "interactivemindsindia@gmail.com",
  phone: "9031041990",
  phoneSecondary: "9031041991",
  phoneRaw: "+919031041990",
  phoneRawSecondary: "+919031041991",
  whatsappNumber: "+919031041990",
  address: "1st Floor, Hira Shiv Palace, Gudari Bazar, Ashokraj Path, Patna City – 800008, Bihar",
  workingHours: "Mon-Fri: 8:00 AM - 5:00 PM",
  copyright: "© 2026 Interactive Minds - Neurodiversity-affirming therapy for children and youth.",
};

export const NAVIGATION = [
  { label: "Home", href: "/" },
  { label: "Conditions", href: "/conditions" },
  { label: "Therapies", href: "/therapies" },
  { label: "About Us", href: "/about" },
  { label: "Media", href: "/media" },
  { label: "Contact", href: "/contact" },
];

export const HERO = {
  eyebrow: "Autism Care & Child Development Centre",
  title: "Helping Every Child Learn, Grow & Shine",
  description: "Interactive Minds creates a safe, supportive, and encouraging environment where children develop meaningful communication, motor abilities, cognitive learning, and everyday independence.",
  primaryCta: { label: "Book an Assessment", href: "/appointment" },
  secondaryCta: { label: "Explore Our Therapies", href: "/therapies" },
  imageAlt: "Therapist engaged in developmental activities with a child at Interactive Minds",
  imageCaptionTitle: "Interactive Minds Centre Environment",
  imageCaptionSub: "Individualized, child-focused developmental therapy sessions.",
  heroImage: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=1200",
};

export const ABOUT_PAGE = {
  eyebrow: "ABOUT INTERACTIVE MINDS",
  heading: "Accept. Understand. Include. Empower.",
  brandName: "Interactive Minds",
  introParagraph1: "At Interactive Minds, we believe that every child deserves to be accepted for who they are, understood for their unique needs, and included in every part of life.",
  introParagraph2: "We envision a world where differently abled children are not defined by their limitations, but are recognized for their strengths, abilities, and potential. Our aim is to create an environment where every child feels valued, supported, respected, and encouraged to participate.",
  visionLabel: "OUR VISION",
  visionText: "To build an inclusive society that accepts, understands, and includes every differently abled child, creating equal opportunities for them to learn, participate, and thrive.",
  missionLabel: "OUR MISSION",
  missionText: "To empower every differently abled child with the skills, confidence, and independence needed to manage their own daily life.",
  adlLabel: "ACTIVITIES OF DAILY LIVING (ADLS)",
  adlIntro: "At Interactive Minds, we focus on developing functional life skills and Activities of Daily Living (ADLs) such as:",
  adlItems: [
    "Communication",
    "Self-care",
    "Dressing",
    "Feeding",
    "Toileting",
    "Personal hygiene",
    "Mobility",
    "Safety",
    "Participation in home, school, and community activities",
  ],
  purposeLabel: "OUR PURPOSE",
  purposeHeading: "Our ultimate goal is not just therapy—it is independence.",
  purposeText: "We work towards helping every child become as independent, confident, and self-reliant as possible, according to their individual abilities and potential.",
  closingStatement: "Because inclusion begins with acceptance, progress begins with understanding, and independence begins with opportunity.",
  teamEyebrow: "Multidisciplinary Team",
  teamHeading: "Specialist Team Roles",
  teamSubheading: "Our clinicians and educators work as a unified multidisciplinary team to support each child's developmental milestones.",
};

export const APPROACH_PILLARS = [
  {
    title: "UNDERSTAND",
    description: "Recognizing each child’s unique communication style, sensory profile, and personal strengths."
  },
  {
    title: "DEVELOP",
    description: "Nurturing fine and gross motor skills, speech clarity, executive functioning, and social skills."
  },
  {
    title: "EMPOWER",
    description: "Fostering everyday independence and supporting parents with routine home strategies."
  }
];

export const CORE_PRINCIPLES = [
  {
    title: "Child-Centred Care",
    description: "Respecting each child’s unique personality, learning pace, and interests to make therapy engaging and effective."
  },
  {
    title: "Individualized Programs",
    description: "Customized intervention plans built around comprehensive baseline evaluations and structured developmental goals."
  },
  {
    title: "Experienced Professionals",
    description: "A multidisciplinary team dedicated to evidence-informed care and continuous progress tracking."
  },
  {
    title: "Parent Partnership",
    description: "Working hand-in-hand with families to provide actionable home strategies, routine structures, and emotional support."
  }
];

export const THERAPY_JOURNEY = [
  { step: "Step 1", title: "Developmental Assessment", description: "Evaluation of baseline communication, motor skills, and sensory processing needs." },
  { step: "Step 2", title: "Individual Plan", description: "Setting structured, measurable goals tailored specifically for your child." },
  { step: "Step 3", title: "Therapy Sessions", description: "Engaging 1-on-1 and play-guided sessions in a supportive environment." },
  { step: "Step 4", title: "Progress Monitoring", description: "Continuous review and parent coaching for routine home integration." }
];

export const CONSTANT_SERVICES: Service[] = [
  {
    id: 1,
    name: 'ABA Therapy',
    slug: 'aba-therapy',
    short_description: 'Personalized Applied Behavior Analysis designed around your child\'s unique needs, strengths, and developmental goals.',
    description: 'Applied Behavior Analysis (ABA) uses structured and positive teaching approaches to help children develop meaningful skills, functional communication, social interaction, and emotional self-regulation.',
    image_url: '/images/homepage/therapy-aba.jpg',
    who_it_helps: 'Children with Autism Spectrum Disorder (ASD), developmental delays, behavioral challenges, or communication difficulties.',
    benefits: 'Builds functional communication, improves social engagement, reduces disruptive behaviors, enhances learning readiness, supports independence in daily routines.',
    approach: 'Our ABA approach uses Discrete Trial Teaching (DTT), Task Analysis, Positive Reinforcement, and Natural Environment Teaching (NET) in a low-stimulation, child-friendly space.',
    process_steps: [
      'Comprehensive Assessment: Evaluating baseline skills, strengths, and individual needs.',
      'Individualized Plan (IEP): Setting structured, measurable developmental goals.',
      'Therapy Sessions: Engaging 1-on-1 sessions focused on communication and social skills.',
      'Progress Monitoring: Continuous tracking and family parent coaching.'
    ],
    skills_supported: [
      'Functional Communication',
      'Social Interaction & Peer Play',
      'Daily Living & Self-Care Skills',
      'Emotional Self-Regulation'
    ],
    active: true,
    display_order: 1
  },
  {
    id: 2,
    name: 'Occupational Therapy',
    slug: 'occupational-therapy',
    short_description: 'Personalized Occupational Therapy that helps children develop everyday skills, fine & gross motor abilities, coordination, and independence.',
    description: 'Pediatric Occupational Therapy helps children master daily activities such as dressing, eating, writing, playing, and sensory regulation through structured, engaging activities.',
    image_url: '/images/homepage/therapy-occupational.jpg',
    who_it_helps: 'Children experiencing motor delays, handwriting difficulties, sensory sensitivity, balance challenges, or self-care struggles.',
    benefits: 'Enhances fine and gross motor skills, improves sensory processing, builds self-care independence, boosts balance and spatial awareness.',
    approach: 'Sensory-rich environments, play-guided motor exercises, adaptive equipment, and structured routine practice tailored to each age group (0-3 years, 3-5 years, 5+ years).',
    process_steps: [
      'Initial Sensory & Motor Evaluation',
      'Customized Goal Setting for Home and School',
      'Active Play & Therapeutic Skill Building',
      'Parent Coaching & Environmental Adaptation'
    ],
    skills_supported: [
      'Fine Motor Control & Pencil Grip',
      'Gross Motor Balance & Coordination',
      'Sensory Processing & Regulation',
      'Self-Dressing & Hygiene Independence'
    ],
    active: true,
    display_order: 2
  },
  {
    id: 3,
    name: 'Speech Therapy',
    slug: 'speech-therapy',
    short_description: 'Supportive and child-friendly speech therapy designed to help children express themselves, understand language, and build social confidence.',
    description: 'Speech and Language Therapy focuses on expanding vocabulary, articulation, speech clarity, receptive comprehension, and non-verbal communication methods using evidence-based play strategies.',
    image_url: '/images/homepage/therapy-speech.jpg',
    who_it_helps: 'Children with speech delays, articulation errors, stuttering, social communication difficulties, or non-verbal communication needs.',
    benefits: 'Improves speech clarity, expands functional vocabulary, enhances conversational skills, builds confidence in peer interactions.',
    approach: 'Play-based language facilitation, oral-motor exercises, augmentative communication tools, and interactive storytelling.',
    process_steps: [
      'Speech & Language Assessment',
      'Personalized Communication Strategy',
      'Interactive Speech & Play Sessions',
      'Home Practice & Parent Coaching'
    ],
    skills_supported: [
      'Speech Articulation & Clarity',
      'Expressive Vocabulary & Sentence Building',
      'Receptive Language Comprehension',
      'Social Communication & Turn-Taking'
    ],
    active: true,
    display_order: 3
  },
  {
    id: 4,
    name: 'Special Education',
    slug: 'special-education',
    short_description: 'Individualized educational programs designed to support children with diverse learning needs in mastering academic, cognitive, and life skills.',
    description: 'Special Education provides tailored academic strategies, individualized learning plans (IEP), cognitive skill training, and task breakdown so children can thrive in school and everyday environments.',
    image_url: '/images/homepage/therapy-special-education.jpg',
    who_it_helps: 'Children with learning differences, ADHD, dyslexia, developmental delays, or academic frustration.',
    benefits: 'Improves academic learning capabilities, builds cognitive processing skills, fosters learning confidence, supports classroom integration.',
    approach: 'Structured task decomposition, multi-sensory learning techniques, visual schedules, and individualized learning pace.',
    process_steps: [
      'Educational Needs Assessment',
      'Individualized Education Plan (IEP) Creation',
      'Targeted Multi-Sensory Teaching',
      'Progress Review & School Alignment'
    ],
    skills_supported: [
      'Pre-Reading & Functional Literacy',
      'Mathematical Concepts & Problem Solving',
      'Task Focus & Executive Functioning',
      'Classroom Behavioral Adaptations'
    ],
    active: true,
    display_order: 4
  },
  {
    id: 5,
    name: 'Sensory Integration',
    slug: 'sensory-integration',
    short_description: 'Guided play-based therapy designed to help children process sensory input effectively, improve motor coordination, and self-regulate.',
    description: 'Sensory Integration Therapy helps children process tactile, auditory, visual, vestibular, and proprioceptive inputs so they feel calm, grounded, and focused.',
    image_url: '/images/homepage/therapy-sensory.jpg',
    who_it_helps: 'Children who are overly sensitive or under-responsive to sensory stimuli, sound, light, movement, or texture.',
    benefits: 'Promotes emotional self-soothing, reduces sensory overload, enhances body awareness, improves emotional balance.',
    approach: 'Specialized sensory gym environment equipped with swings, tactile tools, weighted equipment, and soothing lighting.',
    process_steps: [
      'Sensory Profile Evaluation',
      'Customized Sensory Diet Design',
      'Guided Sensory Gym Therapy Sessions',
      'Home & School Environment Advice'
    ],
    skills_supported: [
      'Sensory Processing & Tolerance',
      'Vestibular & Proprioceptive Balance',
      'Calming & Self-Regulation',
      'Focus in Busy Environments'
    ],
    active: true,
    display_order: 5
  },
  {
    id: 6,
    name: 'Clinical Psychology',
    slug: 'clinical-psychology',
    short_description: 'Comprehensive psychological assessments, emotional support, and developmental evaluations conducted by specialized clinicians.',
    description: 'Clinical Psychology services include diagnostic evaluations, emotional-behavioral support, cognitive testing, and family psychological counseling in a supportive, confidential setting.',
    image_url: '/images/homepage/therapy-psychology.jpg',
    who_it_helps: 'Children and adolescents navigating emotional, behavioral, social, or developmental challenges.',
    benefits: 'Provides diagnostic clarity, fosters emotional coping skills, supports parent mental health, guides long-term developmental planning.',
    approach: 'Evidence-based cognitive and behavioral strategies, play therapy techniques, and empathetic family consultations.',
    process_steps: [
      'Comprehensive Clinical Evaluation',
      'Diagnostic & Developmental Assessment',
      'Targeted Therapeutic Support',
      'Family Consultation & Review'
    ],
    skills_supported: [
      'Emotional Coping & Regulation',
      'Behavioral Self-Control',
      'Cognitive & Developmental Profile',
      'Parent-Child Bonding'
    ],
    active: true,
    display_order: 6
  },
  {
    id: 7,
    name: 'School Readiness Program',
    slug: 'school-readiness',
    short_description: 'Structured early intervention program helping young children build the social, cognitive, and self-care foundation needed for classroom success.',
    description: 'School Readiness prepares children for formal schooling by nurturing attention span, group participation, following instructions, independence, and foundational literacy/numeracy skills.',
    image_url: '/images/homepage/therapy-school-readiness.jpg',
    who_it_helps: 'Preschool and kindergarten-aged children transitioning into structured school environments.',
    benefits: 'Eases school transitions, builds group interaction confidence, develops independent self-care, fosters listening and task-following abilities.',
    approach: 'Small group interaction, simulated classroom routines, circle time, structured play, and guided peer interaction.',
    process_steps: [
      'Readiness Screening',
      'Small Group Simulated Placement',
      'Interactive Classroom Skills Training',
      'Transition Report & School Guidance'
    ],
    skills_supported: [
      'Following Group Instructions',
      'Peer Sharing & Social Turn-Taking',
      'Independent Desk Work Readiness',
      'Basic Pre-Reading & Counting'
    ],
    active: true,
    display_order: 7
  },
  {
    id: 8,
    name: 'Physiotherapy',
    slug: 'physiotherapy',
    short_description: 'Pediatric physical therapy focused on improving gross motor function, muscle strength, balance, posture, and physical mobility.',
    description: 'Pediatric Physiotherapy helps children build physical strength, improve posture, gain coordination, and overcome movement limitations through fun, targeted exercises.',
    image_url: '/images/homepage/therapy-physiotherapy.jpg',
    who_it_helps: 'Children with physical motor delays, Cerebral Palsy, Down Syndrome, muscle weakness, or postural issues.',
    benefits: 'Builds core and limb muscle strength, improves balance and walking patterns, enhances endurance and coordination.',
    approach: 'Targeted movement exercises, balance boards, posture training, and fun physical activities.',
    process_steps: [
      'Physical Mobility Evaluation',
      'Tailored Exercise Program',
      'Active Physical Therapy Sessions',
      'Home Movement Guidance'
    ],
    skills_supported: [
      'Gross Motor Coordination',
      'Balance & Gait Stability',
      'Muscle Strength & Flexibility',
      'Postural Alignment'
    ],
    active: true,
    display_order: 8
  },
  {
    id: 9,
    name: 'Parent Guidance',
    slug: 'parent-guidance',
    short_description: 'Dedicated consultation and coaching for parents and caregivers to learn practical strategies and adaptations to support their child at home.',
    description: 'Parent Guidance sessions empower parents with positive reinforcement strategies, routine structures, sensory adaptations, and emotional support to navigate their child\'s growth with confidence.',
    image_url: '/images/homepage/therapy-parent-guidance.jpg',
    who_it_helps: 'Parents, guardians, and primary caregivers of children undergoing developmental therapies.',
    benefits: 'Provides actionable home strategies, reduces parental stress, aligns home and therapy goals, strengthens family bonding.',
    approach: 'Collaborative consultations, home routine analysis, strategy modeling, and open Q&A support.',
    process_steps: [
      'Parent Needs & Routine Review',
      'Custom Strategy Formulation',
      'Coaching & Practice Sessions',
      'Ongoing Guidance & Adjustments'
    ],
    skills_supported: [
      'Positive Behavior Strategies',
      'Visual Schedules & Home Routines',
      'Home Communication Facilitation',
      'Parent Stress Management'
    ],
    active: true,
    display_order: 9
  }
];

export const CONSTANT_CONDITIONS: Condition[] = [
  {
    id: 1,
    name: 'Autism Spectrum Disorder',
    slug: 'autism-spectrum-disorder',
    short_description: 'A neurodevelopmental condition affecting communication, social interaction, sensory processing, and behavioral flexibility.',
    description: 'Autism Spectrum Disorder (ASD) is a developmental difference that affects how a person perceives the world, communicates, and interacts with others. At Interactive Minds, we provide neurodiversity-affirming, individualized therapy programs focused on communication, social engagement, sensory comfort, and independence.',
    image_url: 'https://images.unsplash.com/photo-1508847154043-be5407fcaa5a?auto=format&fit=crop&q=80&w=1200',
    active: true,
    display_order: 1
  },
  {
    id: 2,
    name: 'ADHD',
    slug: 'adhd',
    short_description: 'Attention-Deficit/Hyperactivity Disorder impact on focus, impulse control, activity levels, and executive functioning skills.',
    description: 'ADHD affects executive functioning, self-regulation, concentration, and energy management. Our center offers structured behavioral strategies, special education support, and occupational therapy to help children develop focus, task completion skills, and emotional regulation.',
    image_url: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=1200',
    active: true,
    display_order: 2
  },
  {
    id: 3,
    name: 'Dyslexia',
    slug: 'dyslexia',
    short_description: 'A learning difference affecting reading, spelling, phonological processing, and written expression skills.',
    description: 'Dyslexia is a specific learning difference that makes reading, decoding, and writing challenging despite average or high intelligence. Our Special Education and Speech Therapy teams use multi-sensory reading approaches and structured phonics to build reading confidence.',
    image_url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=1200',
    active: true,
    display_order: 3
  },
  {
    id: 4,
    name: 'Down Syndrome',
    slug: 'down-syndrome',
    short_description: 'A genetic condition associated with physical development variations, speech delays, and cognitive learning needs.',
    description: 'Children with Down Syndrome benefit from early, holistic developmental intervention. Interactive Minds offers multidisciplinary care including Speech Therapy, Occupational Therapy, Physiotherapy, and Special Education tailored to foster independence and communication.',
    image_url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=1200',
    active: true,
    display_order: 4
  },
  {
    id: 5,
    name: 'Cerebral Palsy',
    slug: 'cerebral-palsy',
    short_description: 'A group of motor conditions affecting movement, posture, muscle tone, and physical coordination.',
    description: 'Cerebral Palsy impacts body movement, coordination, and posture. Through specialized Physiotherapy and Occupational Therapy, we help children improve mobility, muscle strength, fine motor abilities, and daily self-care independence.',
    image_url: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=1200',
    active: true,
    display_order: 5
  }
];

export const CONSTANT_FAQS: FAQ[] = [
  {
    id: 1,
    question: 'What is Interactive Minds?',
    answer: 'Interactive Minds is an Autism Care & Child Development Centre dedicated to helping children learn, communicate, participate, and become more independent through individualized, neurodiversity-affirming therapies.',
    category: 'General',
    active: true,
    display_order: 1
  },
  {
    id: 2,
    question: 'How do I get started with an assessment?',
    answer: 'You can submit an Appointment Request form through our website or call our center. Our intake coordinator will reach out within 24 hours to schedule an initial consultation and guide you through the process.',
    category: 'Assessment',
    active: true,
    display_order: 2
  },
  {
    id: 3,
    question: 'What age groups do you support?',
    answer: 'We provide specialized developmental support for children from early intervention (0–3 years), preschool age (3–5 years), up to school age and youth (5+ years).',
    category: 'General',
    active: true,
    display_order: 3
  },
  {
    id: 4,
    question: 'Do you involve parents in therapy sessions?',
    answer: 'Yes! Family co-design and parent involvement are central to our philosophy. We offer dedicated Parent Guidance & Coaching sessions to empower parents with practical strategies at home.',
    category: 'Therapy',
    active: true,
    display_order: 4
  },
  {
    id: 5,
    question: 'Are your therapy plans customized for each child?',
    answer: 'Absolutely. Every child receives an individualized assessment and a tailored plan built around their unique strengths, interests, sensory preferences, and developmental goals.',
    category: 'Therapy',
    active: true,
    display_order: 5
  }
];

export const CONSTANT_TEAM: TeamMember[] = [
  {
    id: 1,
    name: 'Child Development Team',
    role: 'Child Development Specialist',
    specialization: 'Pediatric Assessment & Early Intervention',
    bio: 'Dedicated specialists focused on comprehensive developmental evaluations, milestone tracking, and individualized early intervention strategies.',
    active: true,
    display_order: 1
  },
  {
    id: 2,
    name: 'Therapy Specialist Team',
    role: 'Therapy Specialist',
    specialization: 'Occupational & Speech Therapy',
    bio: 'Experienced therapists skilled in pediatric motor coordination, sensory integration, speech clarity, and functional communication.',
    active: true,
    display_order: 2
  },
  {
    id: 3,
    name: 'Special Education Team',
    role: 'Special Education Specialist',
    specialization: 'Individualized Learning & Academic Support',
    bio: 'Educators providing multi-sensory learning techniques, cognitive skill building, and classroom readiness support.',
    active: true,
    display_order: 3
  }
];

export const CTA_SECTION = {
  heading: "Every Child Has Their Own Way to Shine",
  description: "Take the first step towards understanding your child’s developmental needs. Contact our team to schedule a supportive assessment.",
  bookButtonLabel: "Book an Assessment",
  callButtonLabel: "Call 9031041990",
  whatsappButtonLabel: "WhatsApp Us",
};

export const FOOTER = {
  quickNavTitle: "Quick Navigation",
  therapiesTitle: "Our Therapies",
  contactTitle: "Center Details",
  adminLinkText: "Admin Gateway",
};

export const CONTACT_PAGE = {
  eyebrow: "Connect With Us",
  heading: "Contact Interactive Minds",
  description: "Our team provides gentle guidance. Expect a direct connection with our intake coordinator within one business day.",
  cardTitle: "Center Information",
  addressLabel: "Physical Address",
  emailLabel: "Email Address",
  phoneLabel: "Phone Support",
  hoursLabel: "Working Hours",
  formTitle: "Send Us a Message",
  whatsappButtonText: "Chat on WhatsApp",
};

export const APPOINTMENT_PAGE = {
  eyebrow: "Child Development Assessment",
  heading: "Book an Initial Assessment",
  description: "Please fill out the form below to request a developmental evaluation. Our intake coordinator will review your request and contact you to finalize the schedule.",
  formNotice: "* Note: This is an appointment request. Our intake coordinator will contact you to confirm availability.",
  confidentialTitle: "Confidential & Supportive",
  confidentialDesc: "Your family privacy is paramount. All information submitted remains strictly confidential.",
  guaranteeTitle: "No Guaranteed Booking",
  guaranteeDesc: "This is an appointment request. Submission confirms request receipt; slot confirmation follows intake contact.",
  successTitle: "Appointment Request Received",
  submitAnotherText: "Submit Another Request",
};

export const MEDIA_PAGE = {
  eyebrow: "Media & Activity Gallery",
  heading: "Life at Interactive Minds",
  description: "Moments, therapy activities, and community events from our child development centre.",
  emptyTitle: "Media Coming Soon",
  emptyDescription: "We are in the process of curating photos and video highlights of our center routines and activities. Please check back soon!",
};

export const UI_TEXT = {
  learnMore: "Learn More",
  viewAll: "View All",
  readDetails: "Read Program Details",
  readStory: "Read Full Story & Mission",
  contactTeam: "Contact Our Team",
  backToTop: "Back to top",
  loading: "Loading...",
  submit: "Submit",
  saving: "Saving...",
  processing: "Processing...",
  details: "Details",
  view: "View",
  saveChanges: "Save Changes",
};
