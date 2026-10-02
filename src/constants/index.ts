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
  { label: "About", href: "/#about" },
  { label: "Therapies", href: "/#therapies" },
  { label: "Conditions", href: "/#conditions" },
  { label: "Approach", href: "/#approach" },
  { label: "Journey", href: "/#journey" },
  { label: "Team", href: "/#team" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/#appointment" },
];

export const HERO = {
  eyebrow: "Autism Care & Child Development Centre",
  title: "Helping Every Child Learn, Grow & Shine",
  description: "Interactive Minds creates a safe, supportive, and encouraging environment where children develop meaningful communication, motor abilities, cognitive learning, and everyday independence.",
  primaryCta: { label: "Book an Assessment", href: "/#appointment" },
  secondaryCta: { label: "Explore Our Therapies", href: "/#therapies" },
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
    name: 'Applied Behaviour Analysis (ABA)',
    slug: 'aba-therapy',
    short_description: 'ABA therapy at Interactive Minds in Patna supports autistic children who may experience difficulties with social interaction and everyday activities. The therapy focuses on breaking down individual goals into smaller, achievable steps, making the learning process more structured and manageable for each child.',
    description: 'ABA therapy at Interactive Minds in Patna supports autistic children who may experience difficulties with social interaction and everyday activities. The therapy focuses on breaking down individual goals into smaller, achievable steps, making the learning process more structured and manageable for each child.\n\nEvery child shines in their own way. ABA therapy focuses on nurturing a child\'s self-worth and self-reliance while respecting and preserving their individual uniqueness and creativity.',
    image_url: '/images/homepage/therapy-aba.jpg',
    who_it_helps: 'Every child shines in their own way. ABA therapy focuses on nurturing a child\'s self-worth and self-reliance while respecting and preserving their individual uniqueness and creativity.',
    benefits: 'Individualized goal breakdown, structured learning steps, nurturing self-worth, and fostering self-reliance and creativity.',
    approach: 'Breaking down individual goals into smaller, achievable steps in a supportive, neurodiversity-affirming setting.',
    process_steps: [],
    skills_supported: [],
    active: true,
    display_order: 1
  },
  {
    id: 2,
    name: 'Occupational Therapy',
    slug: 'occupational-therapy',
    short_description: "Occupational therapy for children aims to enhance their active participation in meaningful and essential activities in their lives, promoting development, health, and overall well-being across school tasks, play, and self-care.",
    description: "Occupational therapy for children aims to enhance their active participation in meaningful and essential activities in their lives. This therapy promotes children's development, health, and overall well-being, encompassing activities such as school tasks, play, and self-care. Interventions are customized based on the child's unique needs, considering both disability-related challenges and typical developmental milestones. At Rainbow Children's Hospital, our team of specialists is dedicated to optimizing children's engagement in everyday activities.\n\nOccupational therapy empowers children to acquire the skills necessary for participating in activities like play, self-care, and social interactions. This includes improving their coordination, fine motor skills, visual and cognitive-perceptual abilities, peer interactions, and handwriting, among others.",
    image_url: '/images/homepage/therapy-occupational.jpg',
    who_it_helps: "This holistic approach aids in addressing conditions such as:\n\n• Attention-Deficit Hyperactivity Disorder (ADHD)\n• Autism Spectrum Disorders\n• Cerebral Palsy\n• Developmental coordination disorder\n• Developmental delay\n• Sensory integration dysfunction",
    benefits: 'Empowers children to acquire the skills necessary for participating in activities like play, self-care, and social interactions. This includes improving their coordination, fine motor skills, visual and cognitive-perceptual abilities, peer interactions, and handwriting, among others.',
    approach: "Interventions are customized based on the child's unique needs, considering both disability-related challenges and typical developmental milestones.",
    process_steps: [
      'Evaluation and training in self-care',
      'Evaluation and training in movement',
      'Enhancing social participation',
      'Providing education for patients and caregivers',
      'Assessing and intervening in bedside feeding challenges',
      'Testing and treating developmental issues'
    ],
    skills_supported: [
      'Coordination',
      'Fine Motor Skills',
      'Visual & Cognitive-Perceptual Abilities',
      'Peer Interactions',
      'Handwriting',
      'Self-Care',
      'Play Participation',
      'Social Interactions'
    ],
    closing_text: 'Through our occupational therapy services, we assist children in overcoming barriers and acquiring the necessary skills to actively engage in the activities that are meaningful to them.',
    active: true,
    display_order: 2
  },
  {
    id: 3,
    name: 'Speech & Language Therapy',
    slug: 'speech-therapy',
    short_description: 'Pediatric speech and language therapy focuses on enhancing children\'s communication skills, including both verbal and nonverbal communication. It is important to recognize that speech and language difficulties can sometimes occur alongside mental or behavioral conditions, such as anxiety or attention-deficit/hyperactivity disorder (ADHD). Children facing developmental challenges, such as autism spectrum disorder, may also experience difficulties in expressing themselves verbally.',
    description: 'Pediatric speech and language therapy focuses on enhancing children\'s communication skills, including both verbal and nonverbal communication. It is important to recognize that speech and language difficulties can sometimes occur alongside mental or behavioral conditions, such as anxiety or attention-deficit/hyperactivity disorder (ADHD). Children facing developmental challenges, such as autism spectrum disorder, may also experience difficulties in expressing themselves verbally.\n\nAt Interactive Minds, we specialize in providing specifically designed care and therapeutic interventions for children experiencing speech and communication difficulties. Our personalized treatment plans are designed to help unlock each child\'s potential, supporting them in communicating effectively and engaging with the world around them.',
    image_url: '/images/homepage/therapy-speech.jpg',
    who_it_helps: 'At Interactive Minds, we specialize in providing specifically designed care and therapeutic interventions for children experiencing speech and communication difficulties. Our personalized treatment plans are designed to help unlock each child\'s potential, supporting them in communicating effectively and engaging with the world around them.',
    benefits: 'Personalized treatment plans focused on verbal and nonverbal communication skills, unlocking potential, and engaging effectively with the world.',
    approach: 'Specifically designed care and personalized therapeutic interventions in a warm, child-centered clinical environment.',
    process_steps: [],
    skills_supported: [],
    active: true,
    display_order: 3
  },
  {
    id: 4,
    name: 'Special Education',
    slug: 'special-education',
    short_description: 'Children with special needs are assessed using a functional approach, with an emphasis on understanding their individual abilities, needs, and areas of development.',
    description: 'Children with special needs are assessed using a functional approach, with an emphasis on understanding their individual abilities, needs, and areas of development. An individualized educational programme is designed for children receiving special education services, with periodic evaluation to monitor their progress and ensure that the educational approach continues to meet their needs.',
    image_url: '/images/homepage/therapy-special-education.jpg',
    who_it_helps: 'The role of parents is emphasized throughout the training programme, recognizing their involvement as an important part of the child\'s learning and development. Parents are supported in participating in the educational process and reinforcing learning beyond the structured sessions.',
    benefits: 'Curricular and co-curricular activities are also taught with a special emphasis on inclusion. The programme focuses on enabling children to participate in educational and related activities in an inclusive manner.',
    approach: 'Multisensory and low-cost teaching-learning materials are designed to increase the effectiveness of the teaching and learning process. These materials are used to make learning more accessible and engaging for children with different learning needs.',
    process_steps: [],
    skills_supported: [],
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
    short_description: 'A detailed pre-therapy assessment forms the foundation of the physiotherapy process at Interactive Minds. Goals are established in consultation with parents, followed by appropriate therapy interventions and regular reviews.',
    description: 'A detailed pre-therapy assessment forms the foundation of the physiotherapy process at Interactive Minds. Goals are established in consultation with parents, followed by appropriate therapy interventions and regular reviews. After three months, goals are reassessed and reset as needed to keep the programme aligned with the child\'s needs.',
    image_url: '/images/homepage/therapy-physiotherapy.jpg',
    who_it_helps: 'Parental counselling is an important part of the process, supporting parents throughout the therapy journey.',
    benefits: 'Physiotherapists also provide home-based management programmes, extending the support beyond the therapy setting and helping children and families continue their management programme at home.',
    approach: 'Individualized movement interventions, parental counselling, and home-based management programmes.',
    process_steps: [],
    skills_supported: [],
    active: true,
    display_order: 8
  },
  {
    id: 9,
    name: 'Parent Counselling and Training Programme (PCTP)',
    slug: 'parent-guidance',
    short_description: 'Interactive Minds provides a Parent Counselling and Training Programme (PCTP) designed to empower parents with a better understanding of their child and practical ways to support their development and communication.',
    description: 'Interactive Minds: Autism Care and Child Development Center provides a Parent Counselling and Training Programme (PCTP) designed to empower parents with a better understanding of their child and practical ways to support their development and communication.\n\nDuring the PCTP, parents are provided with information on appropriate ways of communicating with their child and methods that can help the child communicate more effectively and appropriately.',
    image_url: '/images/homepage/therapy-parent-guidance.jpg',
    who_it_helps: 'The PCTP is available for parents, family members, and others who may be the child\'s primary caregivers or who interact with the child on a regular basis.',
    benefits: 'Empowers parents to understand their child\'s autism and unique learning styles, manage challenging situations, develop predictability, and build connections with other parents.',
    approach: 'Parent counselling and training focusing on communication guidance, group work, predictability, functional cognitive and independent living skills, and daily feedback sessions.',
    process_steps: [],
    skills_supported: [],
    active: true,
    display_order: 9
  }
];

export const CONSTANT_CONDITIONS: Condition[] = [
  {
    id: 1,
    name: 'Autism Spectrum Disorder',
    slug: 'autism-spectrum-disorder',
    short_description: 'Autism is a neurodevelopmental condition that affects a person\'s ability to communicate and interact with others, often involving challenges with starting and maintaining conversations, intense focus on special interests, and repetitive language or behaviors.',
    description: 'Autism is a neurodevelopmental condition that affects a person\'s ability to communicate and interact with others, often involving challenges with starting and maintaining conversations, intense focus on special interests, and repetitive language or behaviors. It\'s called a spectrum because individuals with autism can present with a range of strengths and challenges: some may benefit from support in building social awareness, while others may require continual and comprehensive care.',
    image_url: 'https://images.unsplash.com/photo-1508847154043-be5407fcaa5a?auto=format&fit=crop&q=80&w=1200',
    active: true,
    display_order: 1
  },
  {
    id: 2,
    name: 'ADHD',
    slug: 'adhd',
    short_description: 'Attention-deficit/hyperactivity disorder (ADHD) is a neurodevelopmental condition characterized by difficulty paying attention, staying on task, hyperactivity, restlessness, and impulsivity.',
    description: 'Attention-deficit/hyperactivity disorder (ADHD) is a neurodevelopmental condition characterized by symptoms including difficulty paying attention and staying on task, hyperactivity and restlessness, trouble keeping organized, impulsivity, and impatience. Nearly everyone experiences these symptoms from time to time, but with ADHD, they tend to occur persistently, and often to a degree that interferes with daily life.',
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
    short_description: 'Down syndrome is a condition in which a person has an extra copy of chromosome 21, which changes how their body and brain develop.',
    description: 'Down syndrome is a condition in which a person has an extra copy of chromosome 21. Chromosomes are small "packages" of genes in the body\'s cells, which determine how the body forms and functions.\n\nWhen babies are growing, the extra chromosome changes how their body and brain develop. This can cause both physical and mental challenges.\n\nPeople with Down syndrome often have developmental challenges, such as being slower to learn to speak than other children.',
    image_url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=1200',
    active: true,
    display_order: 4
  },
  {
    id: 5,
    name: 'Cerebral Palsy',
    slug: 'cerebral-palsy',
    short_description: 'Cerebral palsy is a group of conditions that affect movement, balance and posture, caused by damage that occurs to a baby\'s brain, most often before birth.',
    description: 'Cerebral palsy is a group of conditions that affect movement, balance and posture. It\'s caused by damage that occurs to a baby\'s brain, most often before birth.\n\nSymptoms appear during infancy or preschool years. Children may have exaggerated reflexes, or their arms, legs and trunk may appear floppy. Cerebral palsy can cause stiff muscles, known as spasticity. Symptoms also can include changes in posture and movements, such as not having a steady walk. Cerebral palsy can make it hard to swallow or focus the eyes. Some children have a combination of these symptoms.\n\nThe effects on function can vary. Some people with cerebral palsy can walk, while others need assistance. Some have intellectual disabilities, but others do not. Some may have epilepsy, blindness or deafness. There is no cure, but treatments can help improve function. The condition generally stays the same over time.',
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
    answer: 'Yes! Family co-design and parent involvement are central to our philosophy. We offer dedicated Parent Counselling & Training Programme (PCTP) sessions to empower parents with practical strategies at home.',
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
