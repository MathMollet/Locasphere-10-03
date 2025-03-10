import React from 'react';
import { Check } from 'lucide-react';

const tiers = [
  {
    name: 'Essentiel',
    price: 9.99,
    description: 'Parfait pour débuter',
    features: [
      'Jusqu\'à 3 biens',
      'Gestion des locataires',
      'Documents numériques',
      'Messagerie intégrée',
      'Support par email',
    ],
  },
  {
    name: 'Pro',
    price: 24.99,
    description: 'Pour les propriétaires actifs',
    features: [
      'Biens illimités',
      'Toutes les fonctionnalités Essentiel',
      'Gestion comptable avancée',
      'Statistiques détaillées',
      'Support prioritaire',
      'API disponible',
    ],
  },
  {
    name: 'Entreprise',
    price: null,
    description: 'Pour les professionnels',
    features: [
      'Toutes les fonctionnalités Pro',
      'Personnalisation avancée',
      'Multi-utilisateurs',
      'Formation dédiée',
      'Account manager dédié',
      'SLA garanti',
    ],
  },
];

export default function Pricing() {
  return (
    <div id="pricing" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-indigo-600 font-semibold">Tarifs</h2>
          <p className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
            Des offres adaptées à vos besoins
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Choisissez l'offre qui correspond le mieux à votre activité
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <div
              key={tier.name}
              className={`relative bg-white p-8 rounded-2xl shadow-sm flex flex-col ${
                index === 1 ? 'md:scale-105 md:shadow-lg md:z-10' : ''
              }`}
            >
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">{tier.name}</h3>
                <p className="mt-4 text-base text-gray-500">{tier.description}</p>
                <p className="mt-8">
                  <span className="text-4xl font-bold text-gray-900">
                    {tier.price ? `${tier.price}€` : 'Sur devis'}
                  </span>
                  {tier.price && <span className="text-base font-medium text-gray-500">/mois</span>}
                </p>
                <ul className="mt-8 space-y-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                      <span className="ml-3 text-base text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button 
                className={`mt-8 w-full rounded-md py-3 px-4 text-sm font-semibold transition-colors ${
                  index === 1
                    ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                    : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                }`}
              >
                Commencer
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}