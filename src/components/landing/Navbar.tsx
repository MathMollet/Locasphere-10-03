import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Building2 } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleLogoClick = () => {
    if (location.pathname !== '/') {
      navigate('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={handleLogoClick}
          >
            <Building2 className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">IZIMO</span>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => handleNavigation('benefits')}
              className="text-gray-600 hover:text-gray-900"
            >
              Avantages
            </button>
            <button 
              onClick={() => handleNavigation('features')}
              className="text-gray-600 hover:text-gray-900"
            >
              Fonctionnalités
            </button>
            <button 
              onClick={() => handleNavigation('pricing')}
              className="text-gray-600 hover:text-gray-900"
            >
              Tarif
            </button>
            <button 
              onClick={() => handleNavigation('about')}
              className="text-gray-600 hover:text-gray-900"
            >
              À propos
            </button>
            <button 
              onClick={() => navigate('/properties-list')}
              className="text-gray-600 hover:text-gray-900"
            >
              Biens à louer
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="text-gray-600 hover:text-gray-900"
            >
              Contact
            </button>
            <button
              onClick={() => navigate('/login')}
              className="ml-4 px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
            >
              Connexion
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}