// Single source of truth for site copy.
// Sources: Zerror business deck (2026), Zerror brand guidelines (Phase 01) and zerrorstudios.com.

export const studio = {
  name: 'Zerror Studios',
  short: 'Zerror',
  type: 'Multidisciplinary Design Studio',
  descriptor: 'Design-led tech studio',
  founded: 2022,
  tagline: 'Systems. Structure. Precision.',
  email: 'hello@zerrorstudios.com',
  phone: '+91 773 880 2437',
  phoneHref: 'tel:+917738802437',
  address: ['B/32, Elco Arcade, Hill Road', 'Bandra West, Mumbai', 'Maharashtra 400050, India'],
  city: 'Mumbai',
  timezone: 'Asia/Kolkata',
  socials: [
    { label: 'Instagram', href: 'https://www.instagram.com/wearezerrorians/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/zerror-studios-mumbai/' },
  ],
};

export const nav = [
  { label: 'Work', href: '/work' },
  { label: 'Services', href: '/#services' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export const hero = {
  title: 'We build brands that people stop for, remember, and come back to.',
  intro:
    'A multidisciplinary design-led tech studio in Mumbai. Design, development and marketing under one roof, since 2022.',
};

// Deck slides 01–03, written as word segments so key phrases can be emphasised.
export const problem = [
  { t: 'Great ideas often get lost between ' },
  { t: 'design and development.', key: true },
  { t: ' Few can do both, fewer still do it fast.' },
];

export const solution = [
  { t: 'We built Zerror to ' },
  { t: 'erase that gap.', key: true },
  { t: ' When design and tech move as one, ideas don’t just survive, ' },
  { t: 'they shine.', key: true },
];

export const belief =
  'Design shouldn’t fight development, because choosing between beautiful design and reliable tech is outdated. We bring both together: seamlessly, quickly and with intent.';

export const audience = {
  title: ['For founders who', 'dream in beta.'],
  body: [
    'Zerror is a design-led IT consultancy built for modern digital businesses. We operate at the intersection of design, technology and scalability, crafting systems that don’t just look good, they perform.',
    'We believe great digital products are continuously shaped through testing, evolution and adaptability. Our focus is on high-performance experiences that reduce friction, eliminate noise and scale alongside the businesses they serve.',
  ],
};

export const stats = [
  { value: 2022, label: 'Founded in Mumbai', plain: true },
  { value: 100, suffix: '+', label: 'Brands partnered' },
  { value: 200, suffix: '+', label: 'Websites & products shipped' },
  { value: 80, suffix: '+', label: 'Online stores launched' },
];

export const services = [
  {
    id: 'web',
    formation: 'web',
    title: 'Website Design & Development',
    short: 'Websites',
    text: 'Designed and built by the same team, with scroll-led motion and set up for Google and AI search before launch.',
    items: ['Mood boarding', 'UI/UX Design', 'Front & Back End Development', 'Responsive Design', 'Performance & Security'],
  },
  {
    id: 'software',
    formation: 'software',
    title: 'Custom Software Development',
    short: 'Software & tools',
    text: 'Custom CMS, dashboards and internal tools, mapped screen by screen with you and built in stages.',
    items: ['Content Architecture', 'Headless CMS', 'Admin Dashboards', 'Custom Workflows', 'Scalable Systems'],
  },
  {
    id: 'commerce',
    formation: 'commerce',
    title: 'eCommerce Solutions',
    short: 'eCommerce',
    text: 'Custom Shopify builds or Zcom, our own commerce platform. Payments connected and test orders placed before launch.',
    items: ['Store Strategy', 'UX-Led Design', 'Payment & Checkout', 'Platform Development', 'Scalable Infrastructure'],
  },
  {
    id: 'brand',
    formation: 'brand',
    title: 'Branding, Marketing & SEO',
    short: 'Brand & growth',
    text: 'A full identity: logo, colour, type and voice. Followed by social, campaigns and SEO, run monthly.',
    items: ['Brand Identity', 'Visual Systems', 'Digital Marketing', 'SEO Strategy', 'Growth Optimisation'],
  },
];

export const caseStudies = [
  {
    slug: 'rpsg-media',
    number: '01',
    client: 'RPSG Media',
    title: 'Three global publications, one custom publishing ecosystem.',
    category: 'Publishing Group',
    year: 2025,
    images: ['/images/work/rpsg-2.jpg', '/images/work/rpsg-1.jpg', '/images/work/rpsg-3.jpg'],
    metrics: [
      { value: '3M+', label: 'Monthly users' },
      { value: '500+', label: 'Editors publishing' },
      { value: '#1', label: 'Category ranking in 12 months' },
    ],
    overview:
      'RPSG Media partnered with us to launch the India editions of The Hollywood Reporter, Esquire and Robb Report through a completely custom publishing ecosystem built for scale, speed and brand distinction. Instead of relying on restrictive templates, we developed a unified backend with tailored CMS workflows and custom websites for each publication, optimised individually for breaking news, editorial storytelling and luxury curation.',
    scope: ['Custom CMS Development', 'Custom Website Design & Development', 'Editorial Workflow Systems', 'Scalable Backend Infrastructure'],
    problem: [
      'RPSG Media launched three international publishing brands in India, but standard WordPress templates couldn’t support the scale, speed or premium editorial experience required.',
      'Each publication had entirely different operational needs, from breaking news publishing to luxury product curation, while still needing to maintain the prestige and identity of globally recognised media brands.',
    ],
    solution: [
      'We designed and developed a completely custom CMS and custom-built websites for The Hollywood Reporter, Esquire and Robb Report.',
      'While the backend infrastructure remained unified and scalable, every editorial workflow and frontend experience was tailored specifically to each publication’s content style, audience and publishing needs.',
    ],
    outcome: [
      'The platform now supports 500+ editors publishing seamlessly at scale and delivers sophisticated digital experiences to over 3M monthly users.',
      'Within 12 months, all three publications achieved category-leading rankings, powered by infrastructure designed to enable editorial excellence rather than restrict it.',
    ],
  },
  {
    slug: 'manifest',
    number: '02',
    client: 'Manifest',
    title: 'Five years of SEO authority, migrated with zero downtime.',
    category: 'Luxury Wedding Magazine',
    year: 2025,
    images: ['/images/work/manifest-1.jpg', '/images/work/manifest-2.jpg', '/images/work/manifest-3.jpg'],
    metrics: [
      { value: '200%', label: 'Traffic increase post-launch' },
      { value: '0', label: 'Downtime, broken links or data loss' },
      { value: '5 yrs', label: 'Of SEO authority preserved' },
    ],
    overview:
      'Manifest partnered with us to migrate from a restrictive WordPress setup to a fully custom publishing platform built for scalability, performance and long-term growth. The challenge wasn’t just redesigning the experience; it was preserving five years of SEO authority, editorial content, media assets and search rankings without downtime or data loss.',
    scope: ['Custom CMS Development', 'WordPress Migration Infrastructure', 'Website Design & Development', 'SEO & Data Preservation Systems'],
    problem: [
      'Manifest had spent five years building content, SEO authority and editorial infrastructure on WordPress, but the platform had become limiting in both design flexibility and performance.',
      'They needed a modern, fully custom publishing experience without risking years of accumulated data, rankings, URLs and media assets during migration.',
    ],
    solution: [
      'We engineered a fully custom publishing platform alongside a custom migration infrastructure capable of intelligently translating and transferring large-scale content, metadata, media assets and relationships from WordPress without disruption.',
      'Every original URL structure and SEO signal was preserved while the new platform was rebuilt for speed, scalability and editorial flexibility.',
    ],
    outcome: [
      'The migration launched with zero downtime, zero broken links and zero data loss.',
      'Post-launch, traffic increased by 200%, page speeds improved significantly, and the editorial team gained the flexibility to scale and innovate on a modern publishing system built for long-term growth.',
    ],
  },
  {
    slug: 'salman-khan-films',
    number: '03',
    client: 'Salman Khan Films',
    title: 'A cinematic showcase designed to outlast every film cycle.',
    category: 'Film Production House',
    year: 2026,
    images: ['/images/work/skf-2.jpg', '/images/work/skf-1.jpg', '/images/work/skf-3.jpg'],
    metrics: [
      { value: 'Timeless', label: 'Relevant years after launch' },
      { value: '0', label: 'Redesigns across film releases' },
      { value: '100%', label: 'Custom design & motion' },
    ],
    overview:
      'Salman Khan Films partnered with us to create a premium digital showcase reflecting the scale, prestige and timelessness of one of Bollywood’s most recognised production houses. Rather than building a trend-driven entertainment website, the focus was on crafting a refined and cinematic experience designed to remain visually relevant across multiple film cycles.',
    scope: ['Custom Website Design & Development', 'Creative Direction & Digital Experience Design', 'Motion & Interaction Design', 'Responsive Frontend Development'],
    problem: [
      'Salman Khan Films needed a digital presence that reflected their position as one of Bollywood’s leading production houses.',
      'Most entertainment websites rely on design trends that age quickly. The challenge was to build a sophisticated, cinematic experience without sacrificing timelessness.',
    ],
    solution: [
      'We designed and developed a completely custom showcase website rooted in cinematic storytelling and restrained visual design.',
      'Every interaction, from typography and spacing to animations and transitions, was crafted to communicate elegance, confidence and premium positioning without relying on visual excess.',
    ],
    outcome: [
      'The platform remains visually contemporary years after launch, adapting seamlessly across multiple film releases and portfolio updates without requiring a redesign.',
      'The result is a timeless digital experience that reinforces the production house’s prestige while sustaining long-term brand relevance.',
    ],
  },
  {
    slug: 'deveshe-dreams',
    number: '04',
    client: 'Deveshe Dreams',
    title: 'Proprietary commerce for a limited-collection fashion label.',
    category: 'Handcrafted Fashion Label',
    year: 2025,
    images: ['/images/work/deveshe-2.jpg', '/images/work/deveshe-3.jpg', '/images/work/deveshe-1.jpg'],
    metrics: [
      { value: '350%', label: 'Year-over-year revenue growth' },
      { value: '165%', label: 'Traffic growth' },
      { value: '↑ AOV', label: 'Higher average order value' },
    ],
    overview:
      'Deveshe Dreams partnered with us to build a completely custom e-commerce platform reflecting the exclusivity, craftsmanship and intentionality of their limited-collection fashion model. We designed a proprietary platform tailored to their business, combining digital storytelling with custom infrastructure for pre-orders, collection drops, inventory and customer experience.',
    scope: ['Custom E-Commerce Platform Development', 'Custom Storefront Design & Development', 'Inventory & Collection Management Systems', 'Customer Experience & Automation Infrastructure'],
    problem: [
      'Deveshe Dreams operates on limited handcrafted collections with premium positioning, scarcity-based releases and pre-order workflows.',
      'Platforms like Shopify and WooCommerce are designed for volume retail and couldn’t support the brand’s operational model or communicate the artistry central to the experience.',
    ],
    solution: [
      'We engineered a completely custom e-commerce platform tailored to the brand’s workflow and positioning.',
      'Beyond the storefront, the system includes collection-based releases, pre-order handling, real-time inventory tracking, production workflow management, customer automation and analytics, all managed through one backend designed around the business itself.',
    ],
    outcome: [
      'The platform drove 165% traffic growth, 350% year-over-year revenue growth, significantly higher average order values and strong repeat customer retention.',
      'More importantly, every interaction now communicates craftsmanship, scarcity and intentional design.',
    ],
  },
];

export const synthesis = {
  title: [
    { t: 'We build systems designed for ' },
    { t: 'your business.', key: true },
    { t: ' Not websites forced into templates.' },
  ],
  body: 'These aren’t template projects. They’re custom-built infrastructure. In each case, we rejected templates and built exactly what that business needed.',
};

// Full index from zerrorstudios.com/work.
export const projects = [
  { name: 'Disrptve', category: 'Marketing Agency', sector: 'Studios', year: 2025 },
  { name: 'Studio Akto', category: 'Interior Design Studio', sector: 'Studios', year: 2025 },
  { name: 'Bro’s Moving', category: 'Moving & Logistics', sector: 'Services', year: 2026 },
  { name: 'I White Korea', category: 'Korean Beauty Essentials', sector: 'Commerce', year: 2024 },
  { name: 'RPSG Lifestyle Media', category: 'Publishing Group', sector: 'Publishing', year: 2025, slug: 'rpsg-media' },
  { name: 'Salman Khan Films', category: 'Film Production House', sector: 'Entertainment', year: 2026, slug: 'salman-khan-films' },
  { name: 'Point Of', category: 'Brand Consultancy', sector: 'Studios', year: 2025 },
  { name: 'The Hollywood Reporter India', category: 'Entertainment News', sector: 'Publishing', year: 2024, slug: 'rpsg-media' },
  { name: 'Esquire India', category: 'Men’s Style & Culture', sector: 'Publishing', year: 2024, slug: 'rpsg-media' },
  { name: 'Robb Report India', category: 'Luxury Lifestyle', sector: 'Publishing', year: 2025, slug: 'rpsg-media' },
  { name: 'Manifest', category: 'Luxury Wedding Magazine', sector: 'Publishing', year: 2025, slug: 'manifest' },
  { name: 'Deveshe Dreams', category: 'Handcrafted Fashion Label', sector: 'Commerce', year: 2025, slug: 'deveshe-dreams' },
  { name: 'Nahara', category: 'Fine Jewellery', sector: 'Commerce', year: 2026 },
  { name: '25 Rupiya Production', category: 'AI Film Production House', sector: 'Entertainment', year: 2026 },
  { name: 'Shivdutt Das Art Foundation', category: 'Art Foundation', sector: 'Culture', year: 2025 },
  { name: 'WineeMedia', category: 'Social Media Agency', sector: 'Studios', year: 2025 },
  { name: 'Soulcore', category: 'Health & Wellness', sector: 'Services', year: 2026 },
  { name: 'Label Nobo', category: 'Fashion Label', sector: 'Commerce', year: 2026 },
  { name: 'JustNosh', category: 'Gourmet Snacks', sector: 'Commerce', year: 2023 },
  { name: 'Hefty Art', category: 'Art Studio', sector: 'Culture', year: 2022 },
];

export const clients = [
  { name: 'The Hollywood Reporter India', logo: '/images/clients/thr.png', ratio: 3.54 },
  { name: 'Esquire India', logo: '/images/clients/esquire.png', ratio: 6.16 },
  { name: 'Manifest', logo: '/images/clients/manifest.png', ratio: 3.17 },
  { name: 'Robb Report India', logo: '/images/clients/robb-report.png', ratio: 4.89 },
  { name: 'Salman Khan Films', logo: '/images/clients/skf.png', ratio: 1.91 },
  { name: 'Point Of', logo: '/images/clients/point-of.png', ratio: 0.81 },
  { name: 'Disrptve', logo: '/images/clients/disrptve.png', ratio: 6.42 },
  { name: 'JustNosh', logo: '/images/clients/just-nosh.png', ratio: 3.83 },
  { name: 'RP-Sanjiv Goenka Group', logo: '/images/clients/rpsg-group.png', ratio: 3.34 },
  { name: 'Mad Earth', logo: '/images/clients/mad-earth.png', ratio: 1.23 },
  { name: 'RPSG Media', logo: '/images/clients/rpsg-media.png', ratio: 2.0 },
  { name: 'Studio Akto', logo: '/images/clients/studio-akto.png', ratio: 1.66 },
  { name: 'Hefty Art', logo: '/images/clients/hefty-art.png', ratio: 5.8 },
  { name: 'Shivdutt Das Art Foundation', logo: '/images/clients/sdaf.png', ratio: 2.27 },
  { name: 'Nahara', logo: '/images/clients/nahara.png', ratio: 5.33 },
  { name: 'Reside In Being', logo: '/images/clients/reside-in-being.png', ratio: 10 },
];

export const process = [
  { title: 'Prototype', text: 'Prototypes that bring ideas to life. We map the system screen by screen before a line of production code.' },
  { title: 'Build', text: 'Where ideas become usable. Design and engineering move as one team, in stages you can see.' },
  { title: 'Launch', text: 'What gets imagined is what goes live. Search, payments and performance are tested before day one.' },
  { title: 'Refine', text: 'Refine through feedback. Products are shaped by testing, evolution and adaptability, long after launch.' },
];

export const values = ['Creativity', 'Efficiency', 'Entertainment', 'Empathy'];

export const principles = [
  {
    label: 'Vision',
    text: 'Design and technology as one unified system. To create experiences that are visually compelling and structurally intelligent, where every interaction is purposeful, scalable and built to last.',
  },
  {
    label: 'Mission',
    text: 'Designing and building systems that unify creativity and engineering. To deliver solutions that are precise, scalable and performance-driven, executed with clarity and structure.',
  },
  {
    label: 'Philosophy',
    text: 'Design is treated as a system: structured, intentional and built to scale. We simplify complexity into outcomes that are clear, precise and purposeful. Every element exists with reason.',
  },
  {
    label: 'Approach',
    text: 'Every project is approached as a system: interconnected, intentional and designed to scale. We prioritise clarity over excess, crafting solutions that are efficient, impactful and adaptable.',
  },
];

export const team = [
  { name: 'Rohit Tiwari', role: 'Founder & CEO' },
  { name: 'Shreevar Jhunjhunwala', role: 'Head of Business Development' },
  { name: 'Anand Vishwakarma', role: 'CTO' },
  { name: 'Mehak Nayak', role: 'Operations Manager' },
  { name: 'Sunny Kurmi Patel', role: 'Senior Frontend Developer' },
  { name: 'Ayush Kumar Ahirwar', role: 'Junior Fullstack Developer' },
  { name: 'Inderjit Singh', role: 'Three.js Developer' },
  { name: 'Dravya Bansal', role: 'Shopify Developer' },
  { name: 'Shovon Mallick', role: 'UI/UX Designer' },
  { name: 'Sukhveer Kaur', role: 'UI/UX Designer' },
  { name: 'Lingkan Mondal', role: 'UI/UX Designer' },
];

export const cta = {
  title: [
    { t: 'For ' },
    { t: 'founders', em: true },
    { t: ' who move fast & brands that refuse to look ' },
    { t: 'average.', em: true },
  ],
  sub: 'Your next version starts here.',
};

export const projectTypes = ['Website', 'eCommerce', 'Software & tools', 'Branding, marketing & SEO', 'Something else'];
