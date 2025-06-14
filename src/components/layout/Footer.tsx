import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { SubscriptionContext } from "../../context/SubscriptionContext.context";
import { useContext } from "react";

export const Footer = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { hasActiveSubscription } = useContext(SubscriptionContext);
  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-4 sm:px-6 lg:px-8">
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Newbi par Sweily
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Simplifiez votre gestion d'entreprise avec nos outils innovants.
            </p>
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Newbi par Sweily. Tous droits
              réservés.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Produits
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to={
                    isAuthenticated
                      ? hasActiveSubscription
                        ? "/factures"
                        : "/outils"
                      : "/auth"
                  }
                  className="text-gray-600 hover:text-indigo-600 text-sm transition-colors"
                >
                  Facturation
                </Link>
              </li>
              <li>
                <Link
                  to={
                    isAuthenticated
                      ? hasActiveSubscription
                        ? "/devis"
                        : "/outils"
                      : "/auth"
                  }
                  className="text-gray-600 hover:text-indigo-600 text-sm transition-colors"
                >
                  Devis
                </Link>
              </li>
              <li>
                <Link
                  to={
                    isAuthenticated
                      ? hasActiveSubscription
                        ? "/signatures-email"
                        : "/outils"
                      : "/auth"
                  }
                  className="text-gray-600 hover:text-indigo-600 text-sm transition-colors"
                >
                  Signatures Email
                </Link>
              </li>
              <li>
                <Link
                  to={
                    isAuthenticated
                      ? hasActiveSubscription
                        ? "/blog-seo-optimizer"
                        : "/outils"
                      : "/auth"
                  }
                  className="text-gray-600 hover:text-indigo-600 text-sm transition-colors"
                >
                  Optimisation blog SEO
                </Link>
              </li>
              <li>
                <Link
                  to={isAuthenticated ? "/outils" : "/auth"}
                  className="text-gray-600 hover:text-indigo-600 text-sm transition-colors"
                >
                  Tous nos outils
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Ressources
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/blog" className="text-gray-600 hover:text-[#5b50ff] text-sm transition-colors">
                  Blog
                </Link>
              </li>
              {/* <li>
                <a href="/guides" className="text-gray-600 hover:text-indigo-600 text-sm transition-colors">
                  Guides pratiques
                </a>
              </li>
              <li>
                <a href="/case-studies" className="text-gray-600 hover:text-indigo-600 text-sm transition-colors">
                  Études de cas
                </a>
              </li> */}
              <li>
                <Link
                  to="/#faq-section"
                  onClick={(e) => {
                    e.preventDefault();
                    // Si vous êtes déjà sur la page d'accueil
                    if (
                      window.location.pathname === "/" ||
                      window.location.pathname === ""
                    ) {
                      const faqSection = document.getElementById("faq-section");
                      if (faqSection) {
                        faqSection.scrollIntoView({ behavior: "smooth" });
                      }
                    } else {
                      // Si vous n'êtes pas sur la page d'accueil, naviguer d'abord
                      navigate("/");
                      // Attendre que la navigation soit terminée avant de faire défiler
                      setTimeout(() => {
                        const faqSection =
                          document.getElementById("faq-section");
                        if (faqSection) {
                          faqSection.scrollIntoView({ behavior: "smooth" });
                        }
                      }, 300);
                    }
                  }}
                  className="text-gray-600 hover:text-[#5b50ff] text-sm transition-colors"
                >
                  FAQ
                </Link>
              </li>
              {hasActiveSubscription && (
                <li>
                  <a
                    href="https://chat.whatsapp.com/FGLms8EYhpv1o5rkrnIldL"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-[#5b50ff] text-sm transition-colors flex items-center"
                  >
                    Communauté
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-3 h-3 ml-1"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Légal
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="/mentions-legales"
                  className="text-gray-600 hover:text-indigo-600 text-sm transition-colors"
                >
                  Mentions légales
                </a>
              </li>
              <li>
                <a
                  href="/politique-de-confidentialite"
                  className="text-gray-600 hover:text-indigo-600 text-sm transition-colors"
                >
                  Politique de confidentialité
                </a>
              </li>
              <li>
                <a href="/conditions-generales-de-vente" className="text-gray-600 hover:text-indigo-600 text-sm transition-colors">
                  CGV
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-gray-600 hover:text-indigo-600 text-sm transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="/preferences-cookies"
                  className="text-gray-600 hover:text-indigo-600 text-sm transition-colors"
                >
                  Préférences cookies
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row px-4 sm:px-6 lg:px-8 justify-between items-center">
          <div className="flex space-x-6 mb-4 md:mb-0">
            {/* <a href="https://twitter.com" className="text-gray-400 hover:text-indigo-600" aria-label="Twitter">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="https://linkedin.com" className="text-gray-400 hover:text-indigo-600" aria-label="LinkedIn">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            <a href="https://facebook.com" className="text-gray-400 hover:text-indigo-600" aria-label="Facebook">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a> */}
          </div>
          <div className="text-gray-500 text-sm">
            Conçu avec ❤️ en France par{" "}
            <a
              href="https://www.sweily.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-700 transition-colors"
            >
              Sweily
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
