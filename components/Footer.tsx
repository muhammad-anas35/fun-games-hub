'use client'

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-b from-primary via-primary-dark to-primary-darker relative mt-auto border-t-3 border-primary/30 shadow-lg">
      <div className="max-w-7xl mx-auto px-8 py-10 pb-5">
        <div className="grid grid-cols-[2fr_1fr_1fr_1.5fr] gap-10 mb-8 pb-8 border-b border-primary/20">
          <div>
            <h3 className="text-white text-xl font-bold mb-3 tracking-wide drop-shadow">Fun Club Games</h3>
            <p className="text-white/80 text-sm">Making learning fun through interactive gameplay</p>
          </div>
          <div>
            <h4 className="text-accent text-base font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 list-none">
              {['About Us', 'Privacy Policy', 'Terms of Service', 'Contact'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-white/70 text-sm no-underline hover:text-accent transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-accent text-base font-semibold mb-3">Resources</h4>
            <ul className="space-y-2 list-none">
              {['Help Center', 'Safety Guidelines', 'Parent Resources', 'FAQ'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-white/70 text-sm no-underline hover:text-accent transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-accent text-base font-semibold mb-3">Connect With Us</h4>
            <div className="flex gap-4">
              {['facebook-f', 'twitter', 'instagram', 'linkedin-in'].map((icon) => (
                <a
                  key={icon}
                  href="https://www.linkedin.com/in/muhammad-anas35/"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-primary transition-all duration-300 hover:scale-110"
                  aria-label={icon}
                >
                  <i className={`fab fa-${icon}`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center text-white/50 text-sm">
          <p>&copy; 2025 Fun Club Games. All rights reserved.</p>
          <div className="flex gap-2 items-center">
            {['Privacy', 'Terms', 'Cookies'].map((item, idx) => (
              <span key={item} className="flex items-center gap-2">
                <a href="https://github.com/muhammad-anas35/muhammad-anas35" className="hover:text-accent transition-colors">{item}</a>
                {idx < 2 && <span>•</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

