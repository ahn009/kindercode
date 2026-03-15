import { Link } from '@/i18n/navigation'
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react'

const footerLinks = {
  learn: [
    { href: '#', label: 'Coding Courses' },
    { href: '#', label: 'Skill Paths' },
    { href: '#', label: 'Competitions' },
    { href: '#', label: 'Projects' },
  ],
  community: [
    { href: '#', label: 'Forums' },
    { href: '#', label: 'Events' },
    { href: '#', label: 'Blog' },
    { href: '#', label: 'Help Center' },
  ],
  company: [
    { href: '#', label: 'About Us' },
    { href: '#', label: 'Careers' },
    { href: '#', label: 'Press' },
    { href: '/contact', label: 'Contact' },
  ],
}

const footerNav = [
  { href: '/', label: 'Home' },
  { href: '#', label: 'How it Works' },
  { href: '/#learning', label: 'Learning Methods' },
  { href: '/#skills', label: 'Skill Paths' },
  { href: '/#competitions', label: 'Competitions' },
  { href: '/#schools', label: 'For Schools' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/#community', label: 'Community' },
]

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-[#1e3c72] to-[#2d3748] text-white pt-16 pb-8">
      {/* Top gradient border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4A90E2] via-[#FFD93D] via-[#FF6B6B] to-[#6BCB77]" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* Brand Section */}
          <div className="footer-section">
            <h4 className="text-xl font-bold mb-5 flex items-center gap-2 text-white">
              <span className="text-2xl">🚀</span> KinderCode
            </h4>
            <p className="text-white/70 leading-relaxed mb-5">
              Making coding fun and accessible for kids everywhere. Join the future of education today.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <Link 
                  key={i}
                  href="#" 
                  className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#4A90E2] hover:-translate-y-1 hover:rotate-[360deg] transition-all duration-300 border-2 border-transparent hover:border-[#FFD93D]"
                  aria-label="Social"
                >
                  <Icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Learn Links */}
          <div className="footer-section">
            <h4 className="text-lg font-bold mb-5 text-white">Learn</h4>
            <ul className="space-y-3">
              {footerLinks.learn.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-white/70 hover:text-[#FFD93D] hover:translate-x-1 transition-all duration-300 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Links */}
          <div className="footer-section">
            <h4 className="text-lg font-bold mb-5 text-white">Community</h4>
            <ul className="space-y-3">
              {footerLinks.community.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-white/70 hover:text-[#FFD93D] hover:translate-x-1 transition-all duration-300 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="footer-section">
            <h4 className="text-lg font-bold mb-5 text-white">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-white/70 hover:text-[#FFD93D] hover:translate-x-1 transition-all duration-300 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-white/10 pt-8">
          {/* Footer Navigation */}
          <nav className="flex flex-wrap justify-center gap-4 md:gap-8 mb-6">
            {footerNav.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="relative text-white/80 font-semibold text-sm hover:text-[#FFD93D] transition-colors duration-300 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFD93D] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Copyright */}
          <p className="text-center text-white/60 text-sm">
            &copy; {new Date().getFullYear()} KinderCode. All rights reserved. |{' '}
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link> |{' '}
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link> |{' '}
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}