import React from 'react';
import { Clock, TrendingUp, Shield } from 'lucide-react';

const benefits = [
  {
    name: 'Gagnez du temps',
    description: 'Automatisez les tâches répétitives et concentrez-vous sur l\'essentiel.',
    icon: Clock,
  },
  {
    name: 'Optimisez vos revenus',
    description: 'Suivez et optimisez vos revenus locatifs en temps réel.',
    icon: TrendingUp,
  },
  {
    name: 'Sécurisez vos données',
    description: 'Vos données sont stockées de manière sécurisée et conforme au RGPD.',
    icon: Shield,
  },
];

export default function Benefits() {
  return (
    <div id="benefits" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-600 font-semibold">Avantages</h2>
          <p className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
            Pourquoi choisir IZIMO ?
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Des avantages concrets pour une gestion locative efficace
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <div key={benefit.name} className="relative bg-gray-50 p-8 rounded-2xl">
                <div className="absolute -top-4 left-4">
                  <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-xl shadow-lg">
                    <benefit.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-xl font-medium text-gray-900">{benefit.name}</h3>
                  <p className="mt-4 text-base text-gray-500">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}