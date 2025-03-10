import React from 'react';
import { Home, MapPin, Ruler, Euro } from 'lucide-react';

const properties = [
  {
    id: 1,
    title: "Appartement moderne au cœur de Paris",
    location: "Paris 8ème",
    surface: 65,
    price: 1500,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Studio lumineux proche métro",
    location: "Paris 15ème",
    surface: 30,
    price: 900,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Maison familiale avec jardin",
    location: "Boulogne-Billancourt",
    surface: 120,
    price: 2500,
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
  },
];

export default function Properties() {
  return (
    <div id="properties" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-600 font-semibold">Biens à louer</h2>
          <p className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
            Nos dernières offres
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Découvrez notre sélection de biens disponibles à la location
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <div key={property.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="relative h-48">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900">{property.title}</h3>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-500">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">{property.location}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Ruler className="h-4 w-4 mr-2" />
                    <span className="text-sm">{property.surface} m²</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center text-indigo-600">
                    <Euro className="h-4 w-4 mr-1" />
                    <span className="text-lg font-semibold">{property.price}</span>
                    <span className="text-sm text-gray-500">/mois</span>
                  </div>
                  <button className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100">
                    Voir détails
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}