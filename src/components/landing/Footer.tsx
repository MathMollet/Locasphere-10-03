import React from 'react';
import { Building2, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-indigo-500" />
              <span className="text-2xl font-bold text-white">IZIMO</span>
            </div>
            <p className="mt-4 text-base text-gray-400">
              Simplifiez la gestion de vos biens immobiliers avec notre plateforme tout-en-un.
            </p>
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-gray-400">
                <Mail className="h-5 w-5" />
                <span>contact@izimo.fr</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Phone className="h-5 w-5" />
                <span>01 23 45 67 89</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="h-5 w-5" />
                <span>123 rue de la Paix, 75000 Paris</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Produit</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#features" className="text-gray-400 hover:text-white">Fonctionnalités</a></li>
              <li><a href="#benefits" className="text-gray-400 hover:text-white">Avantages</a></li>
              <li><a href="#pricing" className="text-gray-400 hover:text-white">Tarifs</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Légal</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Mentions légales</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Politique de confidentialité</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">CGU</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800">
          <p className="text-base text-gray-400 text-center">
            © {new Date().getFullYear()} IZIMO. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}