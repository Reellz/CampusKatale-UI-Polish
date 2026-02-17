import "@fontsource-variable/lexend";
import logo from "../assets/footer-logo.png";
import whatsappIcon from "../assets/WhatsApp.png";
import phoneIcon from "../assets/Phone.png";
import { getImageUrl } from "../utils/imageUtils";

function Footer() {
  return (
    <footer className="bg-[#177529] text-white font-[Lexend] mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Column 1: Logo & Contact */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src={getImageUrl(logo)}
                alt="Campus Katale Logo"
                className="w-[120px] h-auto"
              />
            </div>
            <div className="space-y-4 text-sm">
              <p className="font-bold text-base mb-4">Contact Us:</p>
              
              {/* WhatsApp Contact */}
              <div className="flex items-center gap-3">
                <img
                  src={getImageUrl(whatsappIcon)}
                  alt="WhatsApp"
                  className="w-6 h-6 object-contain"
                />
                <span><a href="https://wa.me/256701234567" className="hover:text-[#97C040] transition-colors">+256 701 234567</a></span>
              </div>
              
              {/* Phone Contact */}
              <div className="flex items-center gap-3">
                <img
                  src={getImageUrl(phoneIcon)}
                  alt="Phone"
                  className="w-6 h-6 object-contain"
                />
                <span><a href="tel:+256771234567" className="hover:text-[#97C040] transition-colors">+256 771 234567</a></span>
              </div>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-[#97C040] transition">Home</a></li>
              <li><a href="/categories" className="hover:text-[#97C040] transition">Categories</a></li>
              <li><a href="/privacy" className="hover:text-[#97C040] transition">Privacy</a></li>
              <li><a href="/terms" className="hover:text-[#97C040] transition">Terms & Conditions</a></li>
            </ul>
          </div>

          {/* Column 3: More Links */}
          <div>
            <ul className="space-y-2 text-sm">
              <li><a href="/faq" className="hover:text-[#97C040] transition">FAQs</a></li>
              <li><a href="/terms" className="hover:text-[#97C040] transition">Terms of Use</a></li>
              <li><a href="/disclaimer" className="hover:text-[#97C040] transition">Disclaimer</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 text-center py-4 text-sm">
          ©{new Date().getFullYear()}. All Rights Reserved. Campus Katale
        </div>
      </div>
    </footer>
  );
}

export default Footer;
