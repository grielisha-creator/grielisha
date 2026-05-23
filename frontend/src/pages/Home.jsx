import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Building, Phone, Mail, MapPin, FileText, CheckCircle2, Cpu, Sun, Printer, 
  LineChart, BookOpen, Wrench, HardHat, Leaf, Apple, Users, Sparkles, 
  ChevronDown, ChevronUp, ArrowRight, ShieldCheck, Award, Briefcase, 
  Check, Info, DollarSign, HelpCircle, Activity, ShoppingBag
} from 'lucide-react'
import { Link } from 'react-router-dom'

const Home = () => {
  const [activeTab, setActiveTab] = useState('advantage')
  const [expandedPortfolio, setExpandedPortfolio] = useState(null)

  // Gelwo Technologies Company Details
  const companyDetails = [
    { label: "Company Name", value: "GELWO TECHNOLOGIES", icon: <Building className="text-accent" size={18} /> },
    { label: "Registration Number", value: "BN4-9GFKDG7", icon: <FileText className="text-glow" size={18} /> },
    { label: "Business Type", value: "General Supplies & Services", icon: <Briefcase className="text-accent" size={18} /> },
    { label: "Year of Incorporation", value: "18 Jun 2022", icon: <CalendarIcon className="text-glow" size={18} /> },
    { label: "Physical Address", value: "Lwande Apartment Door 52, Kakamega-Kisumu Highway", icon: <MapPin className="text-accent" size={18} /> },
    { label: "Postal Address", value: "P.O. Box 1559-50100, Kakamega", icon: <Mail className="text-glow" size={18} /> },
    { label: "Phone Contacts", value: "079-782-9911 / 0112556940", value2: "Tel: 079-782-9911, 0112556940", icon: <Phone className="text-accent" size={18} /> },
    { label: "Email Address", value: "gelwotech@gmail.com", icon: <Mail className="text-glow" size={18} /> },
    { label: "Tax PIN", value: "P052125735W", icon: <FileText className="text-accent" size={18} /> },
    { label: "IFMIS Number", value: "1013123", icon: <ShieldCheck className="text-glow" size={18} /> },
    { label: "AGPO Certificate", value: "SR/eGP/2025/30144", icon: <Award className="text-accent" size={18} /> },
    { label: "EGP Registration", value: "NT/PPD/2025/DGY/8251", icon: <Award className="text-glow" size={18} /> },
    { label: "Bank Account", value: "Kenya Commercial Bank (KCB) - A/C 1335480404", icon: <DollarSign className="text-accent" size={18} /> }
  ]

  // 14 Services Portfolio
  const servicePortfolio = [
    {
      id: "general-supplies",
      title: "General Supplies and Services",
      icon: <ShoppingBag className="text-accent" size={28} />,
      desc: "Sourcing and bulk logistics of office stationeries, furniture, materials, protective gears, and janitorial supplies.",
      bullets: [
        "Supply and delivery of office stationery and consumables",
        "Supply of office furniture and fittings",
        "Supply and distribution of ICT accessories and operational equipment",
        "Supply of cleaning materials and janitorial supplies",
        "Supply of protective equipment (PPE) and safety gear",
        "Supply of institutional operational and maintenance materials",
        "Supply of school supplies and learning support materials",
        "Supply of printing consumables and office accessories",
        "Procurement support and sourcing services",
        "Bulk order coordination and scheduled delivery services",
        "After-supply client support and product replacement coordination",
        "Institutional supply planning and inventory advisory support"
      ]
    },
    {
      id: "ict-security",
      title: "ICT, Biometric & Security Solutions",
      icon: <Cpu className="text-glow" size={28} />,
      desc: "Supply, installation, integration, and maintenance of computers, networking devices, CCTV systems, and biometric controls.",
      bullets: [
        "Supply of desktop computers, laptops, printers, scanners, and photocopiers",
        "Supply of networking equipment (routers, switches, access points)",
        "Biometric attendance management devices and access control systems",
        "Fingerprint and facial recognition devices",
        "Staff and student identification systems and time management software",
        "Supply of CCTV cameras and surveillance accessories",
        "Installation and configuration of CCTV networks (DVR/NVR systems)",
        "CCTV maintenance, servicing, and remote monitoring upgrades",
        "Data storage devices, backup solutions, and ICT consumables"
      ]
    },
    {
      id: "electrical-services",
      title: "Electrical Equipment & Installation",
      icon: <Wrench className="text-accent" size={28} />,
      desc: "Comprehensive supply, installation, and inspection of electrical grids, panels, lighting, and power backups.",
      bullets: [
        "Electrical cables and wiring materials supply",
        "Switches, sockets, circuit breakers, and electrical panels",
        "Lighting systems, conduits, trunking, and installation accessories",
        "Power backup accessories and surge protection devices",
        "New electrical wiring, rewiring works, and light fittings",
        "Institutional and commercial electrical installations",
        "Backup power connections and security lighting setups",
        "Electrical system inspection, fault diagnosis, and repair",
        "Load balancing, upgrades, and energy efficiency solutions"
      ]
    },
    {
      id: "solar-energy",
      title: "Solar and Renewable Energy Services",
      icon: <Sun className="text-glow" size={28} />,
      desc: "Modern solar configurations, system design, inverters, backup batteries, and solar-powered street lighting.",
      bullets: [
        "Supply of solar panels, mounting structures, and accessories",
        "Solar inverters, charge controllers, and battery storage systems",
        "Solar street lighting and security lighting installations",
        "Solar water pumping systems and hybrid backup integrations",
        "Professional solar system design, sizing, and load engineering",
        "Commissioning and system performance testing",
        "Preventive maintenance, troubleshooting, and repairs",
        "Solar battery testing and replacement coordination",
        "Expansion of existing solar and off-grid power systems"
      ]
    },
    {
      id: "branding-printing",
      title: "Branding, Printing & Communications",
      icon: <Printer className="text-accent" size={28} />,
      desc: "High-quality corporate identities, banners, apparel branding, event setups, and publication prints.",
      bullets: [
        "Branded office stationery and corporate identity materials",
        "Promotional merchandise (T-shirts, caps, reflector jackets, bags)",
        "Event branding materials, roll-up banners, and exhibition displays",
        "Institutional signage, name plates, and directional signboards",
        "Vehicle branding graphics and outdoor marketing billboards",
        "Printing of brochures, flyers, posters, and awareness materials",
        "Production of company profiles, reports, strategic plans, and manuals",
        "Graphic design, artwork development, and brand refresh support",
        "Layout design, visual packaging, and printing logistics"
      ]
    },
    {
      id: "consultancy-research",
      title: "Consultancy, Survey & Research",
      icon: <LineChart className="text-glow" size={28} />,
      desc: "Evidence-based research, Monitoring & Evaluation, strategic planning, policies, and community assessments.",
      bullets: [
        "Strategic planning and organizational restructuring",
        "Policy development and institutional framework design",
        "Governance, integrity, and compliance advisory",
        "Project design, planning, and implementation support",
        "Institutional capacity assessments and performance reviews",
        "Development of monitoring and evaluation (MEL) frameworks",
        "Results-based management systems and indicators",
        "Mid-term reviews, impact evaluations, and learning documentation",
        "Baseline, midline, and end-line surveys",
        "Social audits, community needs assessments, and socio-economic studies",
        "Feasibility studies, stakeholder mapping, and digital data collection",
        "Data cleaning, statistical analysis, and technical report writing"
      ]
    },
    {
      id: "capacity-building",
      title: "Capacity Building & Training",
      icon: <BookOpen className="text-accent" size={28} />,
      desc: "Structured leadership, finance, procurement, and ICT skills development using interactive methodologies.",
      bullets: [
        "Leadership and management development programs",
        "Governance, integrity, and anti-corruption workshops",
        "Public participation and stakeholder engagement training",
        "Board induction and governance effectiveness sessions",
        "Public Financial Management (PFM) and budget planning training",
        "Procurement planning, compliance, and supply chain management",
        "Asset and records management practices",
        "Project planning, logical frameworks, and MEL tracking",
        "Basic & advanced computer applications and digital literacy",
        "Data security awareness and technology adoption",
        "Entrepreneurship, community mobilization, and livelihood training",
        "Environmental awareness and climate resilience workshops"
      ]
    },
    {
      id: "technical-support",
      title: "Technical Support & Systems Maintenance",
      icon: <Wrench className="text-glow" size={28} />,
      desc: "24/7 client systems monitoring, network diagnostics, hardware repairs, server backup, and structured cabling.",
      bullets: [
        "Computer hardware diagnostics, repair, and components replacement",
        "Operating systems installation, software licensing, and configs",
        "Preventive maintenance of computer labs and office equipment",
        "Network troubleshooting, structured cabling, and optimization",
        "Server setup, maintenance, and cloud backup configurations",
        "Biometric, CCTV, and intercom infrastructure integrations",
        "On-site and remote technical support (help-desk assistant)",
        "IT asset condition assessments and upgrades advisory"
      ]
    },
    {
      id: "small-works",
      title: "Small Works & Interior Finishing",
      icon: <HardHat className="text-accent" size={28} />,
      desc: "Office partitioning, tiling, gypsum ceilings, plumbing, masonry, compound drainage, and protective painting.",
      bullets: [
        "Minor building construction works and facility refurbishments",
        "Office partitioning, drywalling, and space optimizations",
        "Installation of decorative gypsum ceilings and wall claddings",
        "Flooring solutions (ceramic tiles, vinyl, terrazzo, carpet panels)",
        "Masonry, tiling, paving, and plumbing setups",
        "Drainage channel improvements, culverts, and minor access roads",
        "Water, sanitation, and hygiene (WASH) facility works",
        "Interior and exterior painting, and repainting maintenance",
        "Protective coatings, wood varnishing, and branded wall graphics"
      ]
    },
    {
      id: "environmental-mitigation",
      title: "Environmental & Climate Services",
      icon: <Leaf className="text-glow" size={28} />,
      desc: "Flood risk reduction, drainage management, soil erosion structures, greening initiatives, and resilience training.",
      bullets: [
        "Flood risk assessment and drainage channel control measures",
        "Construction and rehabilitation of stormwater drainage networks",
        "Culvert installations and surface runoff management",
        "Soil erosion control (gabions, terraces, and retaining walls)",
        "Slope stabilization and environmental bioengineering restoration",
        "Afforestation, tree nurseries, and ecosystem greening programs",
        "Waste management planning and community recycling campaigns",
        "Climate change adaptation support and community sensitization",
        "Disaster risk reduction (DRR) framework advisory"
      ]
    },
    {
      id: "cereals-foodstuff",
      title: "Cereals and Foodstuff Supplies",
      icon: <Apple className="text-accent" size={28} />,
      desc: "Provision of quality grains, dry foodstuffs, maize meal, pulses, and school feeding program logistics.",
      bullets: [
        "Supply of quality maize, maize flour, wheat, and related products",
        "Supply of beans, peas, green grams, and other pulses",
        "Supply of premium rice, sorghum, millet, and grain cereals",
        "Distribution of bulk cooking oils, sugar, and table salt",
        "Bulk foodstuff handling, packaging, and high-standard transport",
        "School feeding program framework supplies",
        "Emergency food relief distribution and community nutrition support",
        "Logistics matching between local cooperatives and public buyers"
      ]
    },
    {
      id: "poultry-feeds",
      title: "Poultry Products & Animal Feeds",
      icon: <CheckCircle2 className="text-glow" size={28} />,
      desc: "Quality animal feeds, livestock concentrates, minerals, poultry supplements, and farm capacity linkages.",
      bullets: [
        "Supply of chick mash, growers mash, layers mash, and broiler starters",
        "Supply of livestock concentrates, minerals, and feed additives",
        "Dairy meal, calf starters, and goat/sheep feed supplies",
        "Logistics coordination for day-old chicks and poultry inputs",
        "Supply of eggs, fresh dressed chicken, and organic farm yields",
        "Animal health advisory, feed planning, and usage workshops",
        "Supply chain logistics for modern institutional farming setups"
      ]
    },
    {
      id: "special-programs",
      title: "Special Programs & Community Development",
      icon: <Users className="text-accent" size={28} />,
      desc: "Youth/women economic empowerment, civic education, public participation forums, and livelihood projects.",
      bullets: [
        "Youth and women economic empowerment initiatives",
        "Skills development training, and small business accelerators",
        "Cooperative development and self-help group capacity building",
        "Civic education, public participation forums, and social auditing",
        "Community-led environmental conservation actions",
        "Educational and healthcare infrastructure support programs",
        "Disaster preparedness, community resilience, and relief programs",
        "Inclusive participatory planning and outreach mobilizations"
      ]
    },
    {
      id: "landscaping-cleaning",
      title: "Landscaping and Cleaning Services",
      icon: <Sparkles className="text-glow" size={28} />,
      desc: "Compound beautification, lawn establishment, office cleaning, post-construction sanitization, and janitorial supplies.",
      bullets: [
        "Landscaping design, soil conditioning, and compound clearing",
        "Lawn establishment, grass planting, and regular grass mowing",
        "Ornamental flower garden design, maintenance, and tree planting",
        "Compound leveling, desilting of estate drains, and bush clearing",
        "Daily, weekly, or monthly office and institutional cleaning",
        "Post-construction and renovation deep-clean services",
        "Sanitary and washroom hygiene supplies and waste management",
        "Supply of commercial cleaning detergents, soaps, and janitor gear",
        "Fumigation and pest control coordination services"
      ]
    }
  ]

  // Team Structure list
  const teamStructure = [
    { role: "Finance & Administration Manager", desc: "Oversees financial planning, budget compliance, contract processing, tax filing, and overall HR admin operations." },
    { role: "Operations Manager", desc: "Coordinates day-to-day general supplies logistics, procurement contracts, client updates, and supply chain timelines." },
    { role: "ICT & Technical Services Manager", desc: "Leads technical design, software setups, CCTV & biometric architectures, network infrastructures, and site installations." },
    { role: "Supplies & Logistics Officer", desc: "Manages store inventory, delivery documentation, bulk order dispatch, and field dispatch safety compliance." },
    { role: "Field Technicians", desc: "A team of certified electricians, solar installers, and IT technicians deploying installations, testing, and service upgrades." },
    { role: "Trainers & Consultants", desc: "Domain specialists delivering MEL projects, capacity training, environmental assessments, and corporate audits." }
  ]

  return (
    <div className="min-h-screen bg-mesh">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-primary/75 backdrop-blur-[1px]"></div>
        {/* Animated Cyber Glow Backdrops */}
        <div className="absolute top-20 left-10 w-80 h-80 bg-glow/15 rounded-full filter blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/15 rounded-full filter blur-[100px] animate-pulse delay-1000"></div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 text-sm text-[#00E5FF]">
              <Sparkles size={16} className="animate-spin duration-3000" />
              <span>General Supplies • ICT • Renewable Energy • Consultancy</span>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black tracking-tight text-white mb-6 uppercase">
              <span className="block text-glow">GELWO</span>
              <span className="block text-accent text-glow-accent -mt-2">TECHNOLOGIES</span>
            </h1>
            
            <p className="text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10 font-light leading-relaxed">
              Delivering high-integrity supply logistics, modern security & network infrastructures, electrical/solar configurations, and community development services across Kenya.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/shop"
                className="bg-accent hover:bg-orange-600 text-white px-8 py-4 rounded-full font-bold transition-all transform hover:scale-105 neon-glow-accent flex items-center gap-2 group"
              >
                Browse Marketplace
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#services"
                className="glass hover:bg-white/10 text-white px-8 py-4 rounded-full font-bold transition-all transform hover:scale-105 border border-white/20 flex items-center gap-2"
              >
                Our Service Portfolio
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Corporate Summary & Details */}
      <section className="py-20 relative bg-black/40 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Left: Background, Vision, Mission, Values */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-extrabold text-glow mb-4">Company Background</h2>
                <p className="text-gray-300 leading-relaxed text-base">
                  Gelwo Technologies is a registered Kenyan enterprise providing integrated general supplies, ICT and security solutions, renewable energy services, consultancy, training, and community development support services. Strategically located along the Kisumu–Kakamega Highway, we provide efficient logistics, technical services, and timely delivery of goods and services across Western Kenya and beyond.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-dark p-6 rounded-2xl border border-white/5 hover:border-glow/30 transition-colors">
                  <h3 className="text-xl font-bold text-[#00E5FF] mb-2">Our Vision</h3>
                  <p className="text-gray-400 text-sm">
                    To become a trusted leader in supplies, technology solutions, renewable energy services, and institutional capacity development in Kenya and the region.
                  </p>
                </div>
                <div className="glass-dark p-6 rounded-2xl border border-white/5 hover:border-accent/30 transition-colors">
                  <h3 className="text-xl font-bold text-accent mb-2">Our Mission</h3>
                  <p className="text-gray-400 text-sm">
                    To deliver quality products, innovative technological solutions, professional consultancy, and community-focused services that enhance institutional efficiency and sustainable development.
                  </p>
                </div>
              </div>

              {/* Core Values */}
              <div className="glass p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <ShieldCheck size={20} className="text-[#00E5FF]" /> Core Values
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {['Integrity', 'Professionalism', 'Innovation', 'Reliability', 'Customer Focus', 'Sustainability'].map((val, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-gray-300 text-sm">
                      <Check className="text-accent" size={16} />
                      <span>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right: Company Details Grid */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass p-8 rounded-3xl relative"
            >
              <div className="absolute top-0 right-0 p-4">
                <span className="text-[10px] uppercase font-bold tracking-widest bg-accent text-white px-2 py-0.5 rounded">Compliance Details</span>
              </div>
              <h2 className="text-2xl font-bold text-glow mb-6">Corporate Details</h2>
              <div className="divide-y divide-white/10">
                {companyDetails.map((detail, idx) => (
                  <div key={idx} className="py-3.5 flex items-start gap-4">
                    <div className="mt-0.5 p-1 rounded bg-white/5 border border-white/10 shrink-0">
                      {detail.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">{detail.label}</p>
                      <p className="text-white font-medium text-sm md:text-base break-words mt-0.5">{detail.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 14 Interactive Services Portfolio */}
      <section id="services" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-glow mb-4">Our Service Portfolio</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              We leverage certified technical capacity and local logistically-sound networks to execute contracts across 14 vital segments. Click any card to view detailed services.
            </p>
          </div>

          {/* Grid of 14 Portfolios */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicePortfolio.map((item, index) => {
              const isExpanded = expandedPortfolio === item.id
              return (
                <motion.div
                  key={item.id}
                  layout="position"
                  onClick={() => setExpandedPortfolio(isExpanded ? null : item.id)}
                  className={`glass-dark rounded-2xl p-6 border transition-all cursor-pointer select-none relative group h-fit ${
                    isExpanded 
                      ? 'border-[#00E5FF] shadow-[0_0_20px_rgba(0,229,255,0.2)] bg-black/60 md:col-span-2 lg:col-span-2' 
                      : 'border-white/5 hover:border-accent/40'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10 group-hover:scale-105 transition-transform duration-300">
                      {item.icon}
                    </div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                      {index + 1 < 10 ? `0${index + 1}` : index + 1}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    {item.desc}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs font-semibold text-glow-accent group-hover:underline">
                    <span>{isExpanded ? "Collapse Details" : "View Detailed Services"}</span>
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-6 pt-6 border-t border-white/10 overflow-hidden"
                        onClick={(e) => e.stopPropagation()} // Prevent collapse when clicking inner content
                      >
                        <h4 className="text-xs uppercase font-extrabold tracking-widest text-[#00E5FF] mb-3">Service Scope & Support</h4>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {item.bullets.map((bullet, bIdx) => (
                            <li key={bIdx} className="flex items-start gap-2 text-gray-300 text-xs leading-normal">
                              <CheckCircle2 size={12} className="text-accent shrink-0 mt-0.5" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Organizational Structure & Management */}
      <section className="py-20 relative bg-black/35 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-glow mb-4">Organizational Structure & Leadership</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our operational layout ensures seamless procurement execution, site engineering setups, and certified consultation delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            
            {/* Left Column: Management Core Card */}
            <div className="glass p-8 rounded-3xl flex flex-col justify-between border-t-2 border-t-accent">
              <div>
                <span className="text-[10px] bg-accent/20 text-accent font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Administration</span>
                <h3 className="text-2xl font-bold text-white mt-4 mb-2">Management Team</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Gelwo Technologies is steered by a dynamic multi-disciplinary team ensuring prompt delivery, financial controls, and high safety standards in all contracts.
                </p>
              </div>

              <div className="space-y-4">
                {['Finance & Administration Manager', 'Operations Manager', 'Technical Manager', 'Projects Coordinator'].map((role, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center font-bold text-accent text-sm">
                      {idx + 1}
                    </div>
                    <span className="text-white font-medium text-sm">{role}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Middle & Right Columns: Diagram / Flow Cards */}
            <div className="lg:col-span-2 glass-dark p-8 rounded-3xl border border-white/5 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-glow mb-6 flex items-center gap-2">
                  <Info size={18} className="text-[#00E5FF]" /> Operations Tree Structure
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teamStructure.map((item, idx) => (
                    <div key={idx} className="p-4 bg-white/5 rounded-2xl border border-white/10 relative hover:bg-white/10 transition-colors">
                      <h4 className="text-sm font-extrabold text-white mb-1 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]"></span>
                        {item.role}
                      </h4>
                      <p className="text-gray-400 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 p-4 rounded-xl bg-[#00E5FF]/5 border border-[#00E5FF]/20 text-xs text-gray-300 flex items-center gap-3">
                <ShieldCheck className="text-[#00E5FF] shrink-0" size={24} />
                <span>Our field crews and consultants are registered and hold active certifications with relevant local regulatory authorities.</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Tabbed Competitive Advantage, QA, HSE, CSR & Certificates */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Tab buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {[
              { id: 'advantage', label: 'Competitive Advantage' },
              { id: 'capacity', label: 'Equipment & Capacity' },
              { id: 'quality', label: 'Quality & HSE Commitment' },
              { id: 'csr', label: 'CSR & Community' },
              { id: 'statutory', label: 'Statutory Compliance' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all ${
                  activeTab === tab.id 
                    ? 'bg-accent text-white shadow-lg neon-glow-accent' 
                    : 'bg-white/5 text-gray-400 hover:text-white border border-white/10 hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content area */}
          <div className="glass p-8 rounded-3xl min-h-[300px]">
            <AnimatePresence mode="wait">
              {activeTab === 'advantage' && (
                <motion.div
                  key="advantage"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-bold text-white">Why Partner with GELWO TECHNOLOGIES?</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Our capabilities are distinctively designed to secure contracts and execute projects with top efficiency:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { title: "Partner Network", desc: "Established direct linkages with leading manufacturers and distributors ensuring genuine, high-quality supplies." },
                      { title: "Technical Expertise", desc: "Internal team composed of licensed electrical installers, certified network engineers, and registered consultants." },
                      { title: "Optimized Sourcing", desc: "Leverage advanced transport and logistics networks, meaning prompt order dispatch and delivery." },
                      { title: "Statutory Standards", desc: "Rigorous compliance with public procurement regulations, KRA audits, AGPO, and local government frameworks." }
                    ].map((adv, idx) => (
                      <div key={idx} className="flex gap-3">
                        <Check className="text-[#00E5FF] mt-1 shrink-0" size={18} />
                        <div>
                          <h4 className="font-bold text-white">{adv.title}</h4>
                          <p className="text-gray-400 text-sm">{adv.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'capacity' && (
                <motion.div
                  key="capacity"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-bold text-white">Equipment & Operational Capacity</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Gelwo Technologies has established operational tools, software platforms, and strategic alliances to execute works of diverse scales:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      "ICT Installation & Diagnostic Equipment",
                      "Solar Array Alignment & Load Measurement Tools",
                      "Full Electrical Testing & Installation Toolkits",
                      "Joint Branding & Printing Machinery Partnerships",
                      "Dedicated Logistics & Fleet Vehicles Support",
                      "A Panel of On-Call Technical Engineers & Consultants"
                    ].map((cap, idx) => (
                      <div key={idx} className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center gap-3">
                        <Wrench className="text-accent" size={18} />
                        <span className="text-white font-medium text-sm">{cap}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'quality' && (
                <motion.div
                  key="quality"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                >
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-[#00E5FF]">Quality Assurance Policy</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      We operate a strict Quality Management System (QMS). Before shipping any stationery, electronics, or starting solar configurations, our officers execute a mandatory testing check. We make certain all supply items are authentic, covered by manufacturer warranties, and match technical bid specs exactly.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-accent">HSE Commitment</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Safety is core to our operations. We maintain strict compliance with OSHA standards for minor works, cabling installations, and solar setups. Personal Protective Equipment (PPE) is mandatory, environmental mitigations are observed, and waste recycling/disposal is implemented as part of ecological preservation.
                    </p>
                  </div>
                </motion.div>
              )}

              {activeTab === 'csr' && (
                <motion.div
                  key="csr"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-bold text-white">Corporate Social Responsibility (CSR)</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Gelwo Technologies believes in sustainable local community development. We invest part of our resources in:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { title: "Youth Skills Development", desc: "Funding local youths with digital literacy certifications and solar technician internships." },
                      { title: "Ecosystem Greening", desc: "Sponsoring local tree planting campaigns along Kakamega county catchments and river banks." },
                      { title: "Supplier Support", desc: "Prioritizing local cooperative societies for supply links like cereal and animal feeds." }
                    ].map((csr, idx) => (
                      <div key={idx} className="p-5 bg-white/5 rounded-2xl border border-white/5">
                        <h4 className="font-bold text-accent mb-2">{csr.title}</h4>
                        <p className="text-gray-400 text-sm">{csr.desc}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'statutory' && (
                <motion.div
                  key="statutory"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-bold text-white">Statutory Compliance & Certificates</h3>
                  <p className="text-gray-300">
                    We maintain valid registrations with national statutory boards and are fully cleared to supply government, county, and private institutions:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      "Certificate of Registration",
                      "KRA PIN Certificate",
                      "Tax Compliance Certificate",
                      "AGPO Certificate (Youth)",
                      "NCA Registration Certificate",
                      "Single Business Permit",
                      "KCB Bank Verification",
                      "Professional Certifications"
                    ].map((cert, idx) => (
                      <div key={idx} className="p-3 bg-white/5 rounded-lg border border-white/10 text-center flex flex-col items-center justify-center">
                        <Award className="text-[#00E5FF] mb-2" size={20} />
                        <span className="text-xs text-white font-medium">{cert}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* Target Clients & Contact Information */}
      <section className="py-20 relative bg-black/45 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            
            {/* Target Clients */}
            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-3xl font-extrabold text-glow">Target Clientele</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Gelwo Technologies supplies products and executes technical solutions for:
              </p>
              <div className="space-y-3">
                {[
                  "National Government Ministries and Agencies",
                  "County Governments & Decentralized Units",
                  "NG-CDF Committees & Constituency Funds",
                  "Non-Governmental Organizations (NGOs) & Development Partners",
                  "Educational Institutions (Schools, Colleges, Labs)",
                  "Agricultural Programs & Cooperative Farmer Groups",
                  "Corporate Enterprises & Private Businesses",
                  "Church Organizations & Community Initiatives"
                ].map((client, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle2 className="text-accent shrink-0" size={16} />
                    <span>{client}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact details & Form */}
            <div className="lg:col-span-7 glass p-8 rounded-3xl flex flex-col justify-between border border-white/15">
              <div>
                <h2 className="text-2xl font-bold text-glow mb-2">Connect With Us</h2>
                <p className="text-gray-400 text-xs mb-6">Drop us a message for supply tenders, installation service quotes, or general inquiries.</p>
              </div>

              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Your Name</label>
                    <input type="text" placeholder="John Doe" className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-[#00E5FF] focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Email Address</label>
                    <input type="email" placeholder="john@example.com" className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-[#00E5FF] focus:outline-none" />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Subject</label>
                  <input type="text" placeholder="General Supplies Sourcing Quote" className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-[#00E5FF] focus:outline-none" />
                </div>

                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Message Detail</label>
                  <textarea rows="4" placeholder="Briefly describe your requirements..." className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-[#00E5FF] focus:outline-none resize-none"></textarea>
                </div>

                <button type="submit" className="w-full btn-premium py-3 text-sm font-bold flex items-center justify-center gap-2">
                  <span>Send Inquiry</span>
                  <ArrowRight size={16} />
                </button>
              </form>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
                <div className="flex gap-2 items-center">
                  <Phone className="text-accent" size={16} />
                  <span className="text-xs text-gray-300">079-782-9911 / 0112556940</span>
                </div>
                <div className="flex gap-2 items-center">
                  <Mail className="text-[#00E5FF]" size={16} />
                  <span className="text-xs text-gray-300">gelwotech@gmail.com</span>
                </div>
                <div className="flex gap-2 items-center">
                  <MapPin className="text-accent" size={16} />
                  <span className="text-xs text-gray-300">Lwande Apt Door 52, Kakamega</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}

// Inline fallback for missing calendar icon
const CalendarIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
)

export default Home
