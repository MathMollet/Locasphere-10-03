import React from 'react';
import { Building2, Users, MessageSquare, FileText, AlertTriangle, Calculator } from 'lucide-react';

const features = [
  {
    name: 'Gestion des biens',
    description: 'Gérez facilement vos propriétés, suivez les loyers et les charges en temps réel.',
    icon: Building2,
  },
  {
    name: 'Gestion des locataires',
    description: 'Centralisez les dossiers locataires et simplifiez la communication.',
    icon: Users,
  },
  {
    name: 'Messagerie intégrée',
    description: 'Communiquez directement avec vos locataires via notre plateforme sécurisée.',
    icon: MessageSquare,
  },
  {
    name: 'Documents numériques',
    description: 'Stockez et gérez tous vos documents importants de manière sécurisée.',
    icon: FileText,
  },
  {
    name: 'Suivi des incidents',
    description: 'Gérez efficacement les demandes d\'intervention et les réparations.',
    icon: AlertTriangle,
  },
  {
    name: 'Gestion comptable',
    description: 'Suivez vos revenus locatifs et vos dépenses en toute simplicité.',
    icon: Calculator,
  },
];

export default function Features() {
  return (
    <div id="features" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-600 font-semibold">Fonctionnalités</h2>
          <p className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
            Tout ce dont vous avez besoin
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Une suite complète d'outils pour simplifier la gestion de vos biens immobiliers
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <div className="absolute flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500 text-white">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="ml-16">
                  <h3 className="text-lg font-medium text-gray-900">{feature.name}</h3>
                  <p className="mt-2 text-base text-gray-500">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}