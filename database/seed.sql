-- Interactive Minds - Initial Database Seed Data
USE `interactive_minds`;

-- 1. Initial Admin User (Default Password: AdminSecurePass123! - Bcrypt hash generated)
INSERT INTO `admins` (`name`, `email`, `password_hash`, `role`) VALUES
('Administrator', 'admin@interactivemind.in', '$2a$12$H5oPi/pEpNhHC58/P6h00eEjjL96IH6kbOjO.Sx8ifXDyfLGDF5yu', 'superadmin')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- 2. Services (Therapies)
INSERT INTO `services` (`id`, `name`, `slug`, `short_description`, `description`, `who_it_helps`, `benefits`, `approach`, `process_steps`, `skills_supported`, `display_order`, `active`) VALUES
(1, 'ABA Therapy', 'aba-therapy', 
'Personalized Applied Behavior Analysis designed around your child\'s unique needs, strengths, and developmental goals.',
'Applied Behavior Analysis (ABA) uses structured and positive teaching approaches to help children develop meaningful skills, functional communication, social interaction, and emotional self-regulation.',
'Children with Autism Spectrum Disorder (ASD), developmental delays, behavioral challenges, or communication difficulties.',
'Builds functional communication, improves social engagement, reduces disruptive behaviors, enhances learning readiness, supports independence in daily routines.',
'Our ABA approach uses Discrete Trial Teaching (DTT), Task Analysis, Positive Reinforcement, and Natural Environment Teaching (NET) in a low-stimulation, child-friendly space.',
'["Comprehensive Developmental Assessment", "Individualized Intervention Plan", "Structured & Play-Based Sessions", "Continuous Progress Monitoring & Parent Coaching"]',
'["Communication & Expressive Language", "Social Interaction & Play", "Self-Care & Daily Living Skills", "Behavior Regulation & Focus"]', 1, 1),

(2, 'Occupational Therapy', 'occupational-therapy',
'Personalized Occupational Therapy that helps children develop everyday skills, fine & gross motor abilities, coordination, and independence.',
'Pediatric Occupational Therapy helps children master daily activities such as dressing, eating, writing, playing, and sensory regulation through structured, engaging activities.',
'Children experiencing motor delays, handwriting difficulties, sensory sensitivity, balance challenges, or self-regulation struggles.',
'Enhances fine and gross motor skills, improves sensory processing, builds self-care independence, boosts balance and spatial awareness.',
'Sensory-rich environments, play-guided motor exercises, adaptive equipment, and structured routine practice tailored to each age group.',
'["Sensory & Motor Evaluation", "Tailored Goal Setting", "Active Play & Motor Skill Training", "Home & School Integration Guidance"]',
'["Fine & Gross Motor Coordination", "Sensory Integration", "Self-Feeding & Dressing", "Handwriting & Tool Use"]', 2, 1),

(3, 'Speech Therapy', 'speech-therapy',
'Supportive and child-friendly speech therapy designed to help children express themselves, understand language, and build social confidence.',
'Speech and Language Therapy focuses on expanding vocabulary, articulation, speech clarity, receptive comprehension, and non-verbal communication methods using evidence-based play strategies.',
'Children with speech delays, articulation errors, stuttering, social communication difficulties, or non-verbal communication needs.',
'Improves speech clarity, expands functional vocabulary, enhances conversational skills, builds confidence in peer interactions.',
'Play-based language facilitation, oral-motor exercises, augmentative communication tools, and interactive storytelling.',
'["Speech & Language Assessment", "Custom Communication Plan", "Engaging Interactive Speech Sessions", "Family Home Coaching"]',
'["Articulation & Speech Clarity", "Expressive & Receptive Language", "Social Communication & Eye Contact", "Listening Comprehension"]', 3, 1),

(4, 'Special Education', 'special-education',
'Individualized educational programs designed to support children with diverse learning needs in mastering academic, cognitive, and life skills.',
'Special Education provides tailored academic strategies, individualized learning plans (IEP), cognitive skill training, and task breakdown so children can thrive in school and everyday environments.',
'Children with learning differences, ADHD, dyslexia, developmental delays, or academic frustration.',
'Improves academic learning capabilities, builds cognitive processing skills, fosters learning confidence, supports classroom integration.',
'Structured task decomposition, multi-sensory learning techniques, visual schedules, and individualized learning pace.',
'["Educational Needs Assessment", "Individualized Education Plan (IEP)", "Targeted Skill Building Sessions", "School Coordination & Review"]',
'["Reading & Writing Foundations", "Number Concepts & Problem Solving", "Executive Functioning & Focus", "Task Completion & Independence"]', 4, 1),

(5, 'Sensory Integration', 'sensory-integration',
'Guided play-based therapy designed to help children process sensory input effectively, improve motor coordination, and self-regulate.',
'Sensory Integration Therapy helps children process tactile, auditory, visual, vestibular, and proprioceptive inputs so they feel calm, grounded, and focused.',
'Children who are overly sensitive or under-responsive to sensory stimuli, sound, light, movement, or texture.',
'Promotes emotional self-soothing, reduces sensory overload, enhances body awareness, improves emotional balance.',
'Specialized sensory gym environment equipped with swings, tactile tools, weighted equipment, and soothing lighting.',
'["Sensory Profile Evaluation", "Customized Sensory Diet", "Guided Therapy Sessions", "Environment Modification Advice"]',
'["Sensory Processing & Tolerance", "Vestibular & Proprioceptive Balance", "Calming & Self-Regulation", "Focus in Busy Environments"]', 5, 1),

(6, 'Clinical Psychology', 'clinical-psychology',
'Comprehensive psychological assessments, emotional support, and developmental evaluations conducted by specialized clinicians.',
'Clinical Psychology services include diagnostic evaluations, emotional-behavioral support, cognitive testing, and family psychological counseling in a supportive, confidential setting.',
'Children and adolescents navigating emotional, behavioral, social, or developmental challenges.',
'Provides diagnostic clarity, fosters emotional coping skills, supports parent mental health, guides long-term developmental planning.',
'Evidence-based cognitive and behavioral strategies, play therapy techniques, and empathetic family consultations.',
'["Comprehensive Clinical Evaluation", "Diagnostic & Skill Assessment", "Therapeutic Support Sessions", "Family Guidance & Follow-up"]',
'["Emotional Coping & Regulation", "Behavioral Self-Control", "Cognitive Assessment", "Parent-Child Bonding"]', 6, 1),

(7, 'School Readiness Program', 'school-readiness',
'Structured early intervention program helping young children build the social, cognitive, and self-care foundation needed for classroom success.',
'School Readiness prepares children for formal schooling by nurturing attention span, group participation, following instructions, independence, and foundational literacy/numeracy skills.',
'Preschool and kindergarten-aged children transitioning into structured school environments.',
'Eases school transitions, builds group interaction confidence, develops independent self-care, fosters listening and task-following abilities.',
'Small group interaction, simulated classroom routines, circle time, structured play, and guided peer interaction.',
'["Readiness Screening", "Group Simulation Placement", "Interactive School Readiness Training", "Transition Report & Recommendations"]',
'["Following Group Instructions", "Peer Sharing & Social Turn-Taking", "Independent Desk Work Readiness", "Basic Pre-Reading & Counting"]', 7, 1),

(8, 'Physiotherapy', 'physiotherapy',
'Pediatric physical therapy focused on improving gross motor function, muscle strength, balance, posture, and physical mobility.',
'Pediatric Physiotherapy helps children build physical strength, improve posture, gain coordination, and overcome movement limitations through fun, targeted exercises.',
'Children with physical motor delays, Cerebral Palsy, Down Syndrome, muscle weakness, or postural issues.',
'Builds core and limb muscle strength, improves balance and walking patterns, enhances endurance and coordination.',
'Targeted movement exercises, balance boards, posture training, and fun physical activities.',
'["Physical Mobility Assessment", "Custom Movement Plan", "Active Physiotherapy Sessions", "Home Exercise Guidance"]',
'["Gross Motor Coordination", "Balance & Gait Stability", "Muscle Strength & Flexibility", "Postural Control"]', 8, 1),

(9, 'Parent Guidance', 'parent-guidance',
'Dedicated consultation and coaching for parents and caregivers to learn practical strategies and adaptations to support their child at home.',
'Parent Guidance sessions empower parents with positive reinforcement strategies, routine structures, sensory adaptations, and emotional support to navigate their child\'s growth with confidence.',
'Parents, guardians, and primary caregivers of children undergoing developmental therapies.',
'Provides actionable home strategies, reduces parental stress, aligns home and therapy goals, strengthens family bonding.',
'Collaborative consultations, home video review, strategy modeling, and open question-and-answer support.',
'["Parent Need & Home Routine Review", "Strategy Formulation", "Coaching & Practice Sessions", "Ongoing Check-ins & Adaptations"]',
'["Behavior Management Strategies", "Home Routine & Visual Schedules", "Communication Facilitation at Home", "Parent Emotional Well-being"]', 9, 1)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- 3. Conditions
INSERT INTO `conditions` (`id`, `name`, `slug`, `short_description`, `description`, `display_order`, `active`) VALUES
(1, 'Autism Spectrum Disorder', 'autism-spectrum-disorder',
'A neurodevelopmental condition affecting communication, social interaction, sensory processing, and behavioral flexibility.',
'Autism Spectrum Disorder (ASD) is a developmental difference that affects how a person perceives the world, communicates, and interacts with others. At Interactive Minds, we provide neurodiversity-affirming, individualized therapy programs focused on communication, social engagement, sensory comfort, and independence.', 1, 1),

(2, 'ADHD', 'adhd',
'Attention-Deficit/Hyperactivity Disorder impact on focus, impulse control, activity levels, and executive functioning skills.',
'ADHD affects executive functioning, self-regulation, concentration, and energy management. Our center offers structured behavioral strategies, special education support, and occupational therapy to help children develop focus, task completion skills, and emotional regulation.', 2, 1),

(3, 'Dyslexia', 'dyslexia',
'A learning difference affecting reading, spelling, phonological processing, and written expression skills.',
'Dyslexia is a specific learning difference that makes reading, decoding, and writing challenging despite average or high intelligence. Our Special Education and Speech Therapy teams use multi-sensory reading approaches and structured phonics to build reading confidence.', 3, 1),

(4, 'Down Syndrome', 'down-syndrome',
'A genetic condition associated with physical development variations, speech delays, and cognitive learning needs.',
'Children with Down Syndrome benefit from early, holistic developmental intervention. Interactive Minds offers multidisciplinary care including Speech Therapy, Occupational Therapy, Physiotherapy, and Special Education tailored to foster independence and communication.', 4, 1),

(5, 'Cerebral Palsy', 'cerebral-palsy',
'A group of motor conditions affecting movement, posture, muscle tone, and physical coordination.',
'Cerebral Palsy impacts body movement, coordination, and posture. Through specialized Physiotherapy and Occupational Therapy, we help children improve mobility, muscle strength, fine motor abilities, and daily self-care independence.', 5, 1)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- 4. FAQs
INSERT INTO `faqs` (`id`, `question`, `answer`, `category`, `display_order`, `active`) VALUES
(1, 'What is Interactive Minds?', 'Interactive Minds is an Autism Care & Child Development Centre providing individualized therapy services including ABA Therapy, Occupational Therapy, Speech Therapy, Special Education, Sensory Integration, Physiotherapy, and Parent Guidance.', 'General', 1, 1),
(2, 'How do I get started with an assessment?', 'You can book an assessment by filling out our online Appointment Request form or contacting our center directly. Our intake coordinator will contact you to schedule an initial consultation.', 'Assessment', 2, 1),
(3, 'What age groups do you support?', 'We provide developmental support and therapy programs for toddlers (0-3 years), preschool children (3-5 years), and school-aged children & youth (5+ years).', 'General', 3, 1),
(4, 'Do you involve parents in the therapy process?', 'Yes, parent partnership is central to our philosophy. We offer Parent Guidance sessions, home strategies, and regular progress updates so therapy goals align seamlessly between our center and home.', 'Therapy', 4, 1),
(5, 'Are your therapy plans customized for each child?', 'Absolutely. Every child receives a comprehensive evaluation followed by an individualized intervention plan tailored specifically to their strengths, challenges, and family goals.', 'Therapy', 5, 1)
ON DUPLICATE KEY UPDATE `question` = VALUES(`question`);

-- 5. Site Settings
INSERT INTO `site_settings` (`setting_key`, `setting_value`) VALUES
('site_name', 'Interactive Minds'),
('site_tagline', 'Autism Care & Child Development Centre'),
('site_email', 'interactiveminds@gmail.com'),
('site_phone', '(555) 234-5678'),
('whatsapp_number', '+919876543210'),
('site_address', '1st Floor, Hira Shiv Palace, Ashok Rajpath Rd, Gudari Bazar, Khamji Begum Colony, Sadikpur, Patna, Bihar 800008'),
('working_hours', 'Mon-Fri: 8:00 AM - 5:00 PM'),
('hero_heading', 'Helping Every Child Learn, Grow & Shine'),
('hero_subheading', 'Autism Care & Child Development'),
('footer_copyright', '© 2026 Interactive Minds - Neurodiversity-affirming therapy for children and youth.')
ON DUPLICATE KEY UPDATE `setting_value` = VALUES(`setting_value`);

-- 6. Team Members (Role-based placeholders preserving existing site structure)
INSERT INTO `team_members` (`id`, `name`, `role`, `specialization`, `bio`, `display_order`, `active`) VALUES
(1, 'Child Development Team', 'Child Development Specialist', 'Pediatric Assessment & Early Intervention', 'Dedicated specialists focused on comprehensive developmental evaluations, milestone tracking, and individualized early intervention strategies.', 1, 1),
(2, 'Therapy Specialist Team', 'Therapy Specialist', 'Occupational & Speech Therapy', 'Experienced therapists skilled in pediatric motor coordination, sensory integration, speech clarity, and functional communication.', 2, 1),
(3, 'Special Education Team', 'Special Education Specialist', 'Individualized Learning & Academic Support', 'Educators providing multi-sensory learning techniques, cognitive skill building, and classroom readiness support.', 3, 1)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);
