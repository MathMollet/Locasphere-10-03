import React from 'react';
import { Users, Target, History } from 'lucide-react';

export default function About() {
  return (
    <div id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-600 font-semibold">À propos</h2>
          <p className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
            Notre histoire et notre mission
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            IZIMO est né de la volonté de simplifier la gestion locative pour tous
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
                <History className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">Notre Histoire</h3>
              <p className="mt-4 text-base text-gray-500">
                Fondé en 2023, IZIMO est le fruit de l'expertise combinée de professionnels 
                de l'immobilier et de la technologie.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
                <Target className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">Notre Mission</h3>
              <p className="mt-4 text-base text-gray-500">
                Simplifier la gestion locative en offrant des outils innovants et 
                accessibles à tous les propriétaires.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
                <Users className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">Notre Équipe</h3>
              <p className="mt-4 text-base text-gray-500">
                Une équipe passionnée de professionnels dédiés à votre réussite et 
                à votre satisfaction.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}