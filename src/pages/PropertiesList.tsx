import React, { useEffect } from 'react';
import { Home, MapPin, Ruler, Euro, Search } from 'lucide-react';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';

const properties = [
  {
    id: 1,
    title: "Appartement moderne au cœur de Paris",
    location: "Paris 8ème",
    surface: 65,
    price: 1500,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    description: "Magnifique appartement rénové avec goût, cuisine équipée, proche des commerces et transports.",
    rooms: 3,
    bedrooms: 2,
    type: "Appartement",
  },
  {
    id: 2,
    title: "Studio lumineux proche métro",
    location: "Paris 15ème",
    surface: 30,
    price: 900,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    description: "Studio entièrement meublé, idéal pour étudiant ou jeune actif, excellent emplacement.",
    rooms: 1,
    bedrooms: 1,
    type: "Studio",
  },
  {
    id: 3,
    title: "Maison familiale avec jardin",
    location: "Boulogne-Billancourt",
    surface: 120,
    price: 2500,
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
    description: "Belle maison familiale avec jardin privatif, garage et cave. Quartier calme et résidentiel.",
    rooms: 5,
    bedrooms: 3,
    type: "Maison",
  },
];

export default function PropertiesList() {
  // Ajout de l'effet pour remonter en haut de la page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-12">
            <h2 className="text-base text-indigo-600 font-semibold">Biens à louer</h2>
            <p className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
              Trouvez votre prochain logement
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Découvrez notre sélection de biens disponibles à la location
            </p>
          </div>

          {/* Filtres de recherche */}
          <div className="mb-12 bg-white p-6 rounded-lg shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Localisation
                </label>
                <input
                  type="text"
                  placeholder="Ville ou code postal"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de bien
                </label>
                <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                  <option value="">Tous les types</option>
                  <option value="apartment">Appartement</option>
                  <option value="house">Maison</option>
                  <option value="studio">Studio</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Budget max
                </label>
                <input
                  type="number"
                  placeholder="€ / mois"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div className="flex items-end">
                <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 flex items-center justify-center gap-2">
                  <Search className="h-5 w-5" />
                  Rechercher
                </button>
              </div>
            </div>
          </div>

          {/* Liste des biens */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <div key={property.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="relative h-48">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 rounded-full text-sm font-medium">
                      {property.type}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900">{property.title}</h3>
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">{property.description}</p>
                  
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="flex items-center text-gray-500">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm">{property.location}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Ruler className="h-4 w-4 mr-2" />
                      <span className="text-sm">{property.surface} m²</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Home className="h-4 w-4 mr-2" />
                      <span className="text-sm">{property.rooms} pièces</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <span className="text-sm">{property.bedrooms} chambre{property.bedrooms > 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
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
      <Footer />
    </div>
  );
}