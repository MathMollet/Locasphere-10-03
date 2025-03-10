import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PageHeader from '../components/common/PageHeader';
import FAQSearch from '../components/faq/FAQSearch';
import FAQAccordion from '../components/faq/FAQAccordion';

// Questions pour les propriétaires
const ownerFAQItems = [
  {
    id: '1',
    question: 'Qu\'est ce qu\'Izimo ?',
    answer: 'Izimo est une plateforme de gestion locative 100% digitale. Elle permet au propriétaire et au locataire de centraliser toutes les informations nécessaires pour une location sans pépin.',
    category: 'Général'
  },
  {
    id: '2',
    question: 'Combien de bien puis-je créer ?',
    answer: 'C\'est illimité ! Vous pouvez créer autant de bien que vous n\'en posséder.',
    category: 'Création de bien'
  },
  {
    id: '3',
    question: 'Pourquoi dois-je renseigner toutes ces informations sur mon bien ?',
    answer: 'Les informations renseignées sur le bien serviront lors de plusieurs étapes :\n- Elles vous faciliteront la création des annonces avec des copier coller\n- Elles donneront les informations nécessaires aux locataires\n- Elles permettront de générer les contrats et documents en automatique',
    category: 'Création de bien'
  },
  {
    id: '4',
    question: 'Comment les locataires vont trouver mon bien sur Izimo ?',
    answer: 'Les locataires peuvent chercher les biens par critères ou avec la référence unique que nous vous fournissons. Cette référence est très importante, n\'oubliez pas de la mettre sur vos annonces.',
    category: 'Recherche de locataires'
  }
];

// Questions pour les locataires
const tenantFAQItems = [
  {
    id: '1',
    question: 'Qu\'est ce qu\'Izimo ?',
    answer: 'Izimo est une plateforme de gestion locative 100% digitale. Elle permet au propriétaire et au locataire de centraliser toutes les informations nécessaires pour une location sans pépin.',
    category: 'Général'
  },
  {
    id: '2',
    question: 'Comment puis-je trouver le bien que j\'ai vu sur une annonce ?',
    answer: 'Vous pouvez rechercher les biens de deux façons dans l\'onglet "Recherche de bien" :\n- Avec la référence mentionnée sur l\'annonce. Copier la référence dans la recherche.\n- Avec les critères de recherche. Définissez vos critères et trouver le bien qu\'il vous faut.',
    category: 'Rechercher un bien'
  },
  {
    id: '3',
    question: 'Pourquoi je ne peux pas envoyer mon dossier sur un bien qui me plaît ?',
    answer: 'Pour envoyer votre dossier au propriétaire vous devez renseigner tous les champs sur votre dossier. Cela évite par la suite des allers retours entre vous et le propriétaire. Tout le monde gagne du temps.',
    category: 'Envoi de dossier'
  }
];

export default function FAQ() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Sélectionner les questions selon le rôle
  const faqItems = user?.role === 'tenant' ? tenantFAQItems : ownerFAQItems;

  // Extraire les catégories uniques
  const categories = Array.from(new Set(faqItems.map(item => item.category))).sort();

  return (
    <div className="p-4 sm:p-6">
      <PageHeader
        title="Foire aux questions"
        description="Trouvez rapidement des réponses à vos questions"
      />

      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <FAQSearch
            searchTerm={searchTerm}
            onSearch={setSearchTerm}
            selectedCategory={selectedCategory}
            categories={categories}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        <FAQAccordion
          items={faqItems}
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
        />
      </div>
    </div>
  );
}