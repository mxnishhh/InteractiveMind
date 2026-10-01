-- Interactive Minds - Initial Database Seed Data
USE `interactive_minds`;

-- 1. Initial Admin User (Default Password: AdminSecurePass123! - Bcrypt hash generated)
INSERT INTO `admins` (`name`, `email`, `password_hash`, `role`) VALUES
('Administrator', 'admin@interactivemind.in', '$2a$12$H5oPi/pEpNhHC58/P6h00eEjjL96IH6kbOjO.Sx8ifXDyfLGDF5yu', 'superadmin')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- 2. Services (Therapies)
INSERT INTO `services` (`id`, `name`, `slug`, `short_description`, `description`, `who_it_helps`, `benefits`, `approach`, `process_steps`, `skills_supported`, `display_order`, `active`) VALUES
(1, 'Applied Behaviour Analysis (ABA)', 'aba-therapy',
'ABA therapy at Interactive Minds in Patna supports autistic children who may experience difficulties with social interaction and everyday activities. The therapy focuses on breaking down individual goals into smaller, achievable steps, making the learning process more structured and manageable for each child.',
'ABA therapy at Interactive Minds in Patna supports autistic children who may experience difficulties with social interaction and everyday activities. The therapy focuses on breaking down individual goals into smaller, achievable steps, making the learning process more structured and manageable for each child.\n\nEvery child shines in their own way. ABA therapy focuses on nurturing a child\'s self-worth and self-reliance while respecting and preserving their individual uniqueness and creativity.',
'Every child shines in their own way. ABA therapy focuses on nurturing a child\'s self-worth and self-reliance while respecting and preserving their individual uniqueness and creativity.',
'Individualized goal breakdown, structured learning steps, nurturing self-worth, and fostering self-reliance and creativity.',
'Breaking down individual goals into smaller, achievable steps in a supportive, neurodiversity-affirming setting.',
'[]',
'[]', 1, 1),

(2, 'Occupational Therapy', 'occupational-therapy',
'Occupational therapy for children aims to enhance their active participation in meaningful and essential activities in their lives, promoting development, health, and overall well-being across school tasks, play, and self-care.',
'Occupational therapy for children aims to enhance their active participation in meaningful and essential activities in their lives. This therapy promotes children\'s development, health, and overall well-being, encompassing activities such as school tasks, play, and self-care. Interventions are customized based on the child\'s unique needs, considering both disability-related challenges and typical developmental milestones. At Rainbow Children\'s Hospital, our team of specialists is dedicated to optimizing children\'s engagement in everyday activities.\n\nOccupational therapy empowers children to acquire the skills necessary for participating in activities like play, self-care, and social interactions. This includes improving their coordination, fine motor skills, visual and cognitive-perceptual abilities, peer interactions, and handwriting, among others.',
'This holistic approach aids in addressing conditions such as:\n\n• Attention-Deficit Hyperactivity Disorder (ADHD)\n• Autism Spectrum Disorders\n• Cerebral Palsy\n• Developmental coordination disorder\n• Developmental delay\n• Sensory integration dysfunction',
'Empowers children to acquire the skills necessary for participating in activities like play, self-care, and social interactions. This includes improving their coordination, fine motor skills, visual and cognitive-perceptual abilities, peer interactions, and handwriting, among others.',
'Interventions are customized based on the child\'s unique needs, considering both disability-related challenges and typical developmental milestones.',
'["Evaluation and training in self-care", "Evaluation and training in movement", "Enhancing social participation", "Providing education for patients and caregivers", "Assessing and intervening in bedside feeding challenges", "Testing and treating developmental issues"]',
'["Coordination", "Fine Motor Skills", "Visual & Cognitive-Perceptual Abilities", "Peer Interactions", "Handwriting", "Self-Care", "Play Participation", "Social Interactions"]', 2, 1),

(3, 'Speech & Language Therapy', 'speech-therapy',
'Pediatric speech and language therapy focuses on enhancing children\'s communication skills, including both verbal and nonverbal communication. It is important to recognize that speech and language difficulties can sometimes occur alongside mental or behavioral conditions, such as anxiety or attention-deficit/hyperactivity disorder (ADHD). Children facing developmental challenges, such as autism spectrum disorder, may also experience difficulties in expressing themselves verbally.',
'Pediatric speech and language therapy focuses on enhancing children\'s communication skills, including both verbal and nonverbal communication. It is important to recognize that speech and language difficulties can sometimes occur alongside mental or behavioral conditions, such as anxiety or attention-deficit/hyperactivity disorder (ADHD). Children facing developmental challenges, such as autism spectrum disorder, may also experience difficulties in expressing themselves verbally.\n\nAt Interactive Minds, we specialize in providing specifically designed care and therapeutic interventions for children experiencing speech and communication difficulties. Our personalized treatment plans are designed to help unlock each child\'s potential, supporting them in communicating effectively and engaging with the world around them.',
'At Interactive Minds, we specialize in providing specifically designed care and therapeutic interventions for children experiencing speech and communication difficulties. Our personalized treatment plans are designed to help unlock each child\'s potential, supporting them in communicating effectively and engaging with the world around them.',
'Personalized treatment plans focused on verbal and nonverbal communication skills, unlocking potential, and engaging effectively with the world.',
'Specifically designed care and personalized therapeutic interventions in a warm, child-centered clinical environment.',
'[]',
'[]', 3, 1),

(4, 'Special Education', 'special-education',
'Children with special needs are assessed using a functional approach, with an emphasis on understanding their individual abilities, needs, and areas of development.',
'Children with special needs are assessed using a functional approach, with an emphasis on understanding their individual abilities, needs, and areas of development. An individualized educational programme is designed for children receiving special education services, with periodic evaluation to monitor their progress and ensure that the educational approach continues to meet their needs.',
'The role of parents is emphasized throughout the training programme, recognizing their involvement as an important part of the child\'s learning and development. Parents are supported in participating in the educational process and reinforcing learning beyond the structured sessions.',
'Curricular and co-curricular activities are also taught with a special emphasis on inclusion. The programme focuses on enabling children to participate in educational and related activities in an inclusive manner.',
'Multisensory and low-cost teaching-learning materials are designed to increase the effectiveness of the teaching and learning process. These materials are used to make learning more accessible and engaging for children with different learning needs.',
'[]',
'[]', 4, 1),

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
'A detailed pre-therapy assessment forms the foundation of the physiotherapy process at Interactive Minds. Goals are established in consultation with parents, followed by appropriate therapy interventions and regular reviews.',
'A detailed pre-therapy assessment forms the foundation of the physiotherapy process at Interactive Minds. Goals are established in consultation with parents, followed by appropriate therapy interventions and regular reviews. After three months, goals are reassessed and reset as needed to keep the programme aligned with the child\'s needs.',
'Parental counselling is an important part of the process, supporting parents throughout the therapy journey.',
'Physiotherapists also provide home-based management programmes, extending the support beyond the therapy setting and helping children and families continue their management programme at home.',
'Individualized movement interventions, parental counselling, and home-based management programmes.',
'[]',
'[]', 8, 1),

(9, 'Parent Counselling and Training Programme (PCTP)', 'parent-guidance',
'Interactive Minds provides a Parent Counselling and Training Programme (PCTP) designed to empower parents with a better understanding of their child and practical ways to support their development and communication.',
'Interactive Minds: Autism Care and Child Development Center provides a Parent Counselling and Training Programme (PCTP) designed to empower parents with a better understanding of their child and practical ways to support their development and communication.\n\nDuring the PCTP, parents are provided with information on appropriate ways of communicating with their child and methods that can help the child communicate more effectively and appropriately.',
'The PCTP is available for parents, family members, and others who may be the child\'s primary caregivers or who interact with the child on a regular basis.',
'Empowers parents to understand their child\'s autism and unique learning styles, manage challenging situations, develop predictability, and build connections with other parents.',
'Parent counselling and training focusing on communication guidance, group work, predictability, functional cognitive and independent living skills, and daily feedback sessions.',
'[]',
'[]', 9, 1)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- 3. Conditions
INSERT INTO `conditions` (`id`, `name`, `slug`, `short_description`, `description`, `display_order`, `active`) VALUES
(1, 'Autism Spectrum Disorder', 'autism-spectrum-disorder',
'Autism is a neurodevelopmental condition that affects a person\'s ability to communicate and interact with others, often involving challenges with starting and maintaining conversations, intense focus on special interests, and repetitive language or behaviors.',
'Autism is a neurodevelopmental condition that affects a person\'s ability to communicate and interact with others, often involving challenges with starting and maintaining conversations, intense focus on special interests, and repetitive language or behaviors. It\'s called a spectrum because individuals with autism can present with a range of strengths and challenges: some may benefit from support in building social awareness, while others may require continual and comprehensive care.', 1, 1),

(2, 'ADHD', 'adhd',
'Attention-deficit/hyperactivity disorder (ADHD) is a neurodevelopmental condition characterized by difficulty paying attention, staying on task, hyperactivity, restlessness, and impulsivity.',
'Attention-deficit/hyperactivity disorder (ADHD) is a neurodevelopmental condition characterized by symptoms including difficulty paying attention and staying on task, hyperactivity and restlessness, trouble keeping organized, impulsivity, and impatience. Nearly everyone experiences these symptoms from time to time, but with ADHD, they tend to occur persistently, and often to a degree that interferes with daily life.', 2, 1),

(3, 'Dyslexia', 'dyslexia',
'A learning difference affecting reading, spelling, phonological processing, and written expression skills.',
'Dyslexia is a specific learning difference that makes reading, decoding, and writing challenging despite average or high intelligence. Our Special Education and Speech Therapy teams use multi-sensory reading approaches and structured phonics to build reading confidence.', 3, 1),

(4, 'Down Syndrome', 'down-syndrome',
'Down syndrome is a condition in which a person has an extra copy of chromosome 21, which changes how their body and brain develop.',
'Down syndrome is a condition in which a person has an extra copy of chromosome 21. Chromosomes are small "packages" of genes in the body\'s cells, which determine how the body forms and functions.\n\nWhen babies are growing, the extra chromosome changes how their body and brain develop. This can cause both physical and mental challenges.\n\nPeople with Down syndrome often have developmental challenges, such as being slower to learn to speak than other children.', 4, 1),

(5, 'Cerebral Palsy', 'cerebral-palsy',
'Cerebral palsy is a group of conditions that affect movement, balance and posture, caused by damage that occurs to a baby\'s brain, most often before birth.',
'Cerebral palsy is a group of conditions that affect movement, balance and posture. It\'s caused by damage that occurs to a baby\'s brain, most often before birth.\n\nSymptoms appear during infancy or preschool years. Children may have exaggerated reflexes, or their arms, legs and trunk may appear floppy. Cerebral palsy can cause stiff muscles, known as spasticity. Symptoms also can include changes in posture and movements, such as not having a steady walk. Cerebral palsy can make it hard to swallow or focus the eyes. Some children have a combination of these symptoms.\n\nThe effects on function can vary. Some people with cerebral palsy can walk, while others need assistance. Some have intellectual disabilities, but others do not. Some may have epilepsy, blindness or deafness. There is no cure, but treatments can help improve function. The condition generally stays the same over time.', 5, 1)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `short_description` = VALUES(`short_description`), `description` = VALUES(`description`);

-- 4. FAQs
INSERT INTO `faqs` (`id`, `question`, `answer`, `category`, `display_order`, `active`) VALUES
(1, 'What is Interactive Minds?', 'Interactive Minds is an Autism Care & Child Development Centre providing individualized therapy services including ABA Therapy, Occupational Therapy, Speech Therapy, Special Education, Sensory Integration, Physiotherapy, and Parent Guidance.', 'General', 1, 1),
(2, 'How do I get started with an assessment?', 'You can book an assessment by filling out our online Appointment Request form or contacting our center directly. Our intake coordinator will contact you to schedule an initial consultation.', 'Assessment', 2, 1),
(3, 'What age groups do you support?', 'We provide developmental support and therapy programs for toddlers (0-3 years), preschool children (3-5 years), and school-aged children & youth (5+ years).', 'General', 3, 1),
(4, 'Do you involve parents in the therapy process?', 'Yes, parent partnership is central to our philosophy. We offer Parent Guidance sessions, home strategies, and regular progress updates so therapy goals align seamlessly between our center and home.', 'Therapy', 4, 1),
(5, 'Are your therapy plans customized for each child?', 'Absolutely. Every child receives a comprehensive evaluation followed by an individualized intervention plan tailored specifically to their strengths, challenges, and family goals.', 'Therapy', 5, 1)
ON DUPLICATE KEY UPDATE `question` = VALUES(`question`);

-- 5. Team Members (Role-based placeholders preserving existing site structure)
INSERT INTO `team_members` (`id`, `name`, `role`, `specialization`, `bio`, `display_order`, `active`) VALUES
(1, 'Child Development Team', 'Child Development Specialist', 'Pediatric Assessment & Early Intervention', 'Dedicated specialists focused on comprehensive developmental evaluations, milestone tracking, and individualized early intervention strategies.', 1, 1),
(2, 'Therapy Specialist Team', 'Therapy Specialist', 'Occupational & Speech Therapy', 'Experienced therapists skilled in pediatric motor coordination, sensory integration, speech clarity, and functional communication.', 2, 1),
(3, 'Special Education Team', 'Special Education Specialist', 'Individualized Learning & Academic Support', 'Educators providing multi-sensory learning techniques, cognitive skill building, and classroom readiness support.', 3, 1)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- 6. Blog Posts (Initialized empty - 0 fake posts seeded)
-- Content will be published through the Clinical Admin Portal (/admin/dashboard/blog)

