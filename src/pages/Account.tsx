import React from 'react';
import { User, PencilIcon, CheckIcon, XIcon, Lock, UserCircle, Bell } from 'lucide-react';
import InputField from '../components/forms/InputField';
import { useAccount } from '../hooks/useAccount';
import PasswordChangeForm from '../components/account/PasswordChangeForm';
import NotificationPreferences from '../components/account/NotificationPreferences';
import ProfilePhoto from '../components/account/ProfilePhoto';

export default function Account() {
  const { user, isEditing, updateUser, toggleEdit, saveChanges } = useAccount();

  const getProfileTypeLabel = () => {
    switch (user.role) {
      case 'admin':
        return 'Admin';
      case 'owner':
        return 'Propriétaire';
      case 'tenant':
        return 'Locataire';
      default:
        return 'Non défini';
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mon compte</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Gérez vos informations personnelles
          </p>
        </div>
        <div className="flex items-center gap-4">
          {isEditing ? (
            <>
              <button
                onClick={saveChanges}
                className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
              >
                <CheckIcon className="h-4 w-4" />
                Sauvegarder
              </button>
              <button
                onClick={toggleEdit}
                className="inline-flex items-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
              >
                <XIcon className="h-4 w-4" />
                Annuler
              </button>
            </>
          ) : (
            <button
              onClick={toggleEdit}
              className="inline-flex items-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
            >
              <PencilIcon className="h-4 w-4" />
              Modifier
            </button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <ProfilePhoto
          avatarUrl={user.avatarUrl}
          onPhotoChange={(url) => updateUser({ avatarUrl: url })}
          disabled={!isEditing}
        />

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm ring-1 ring-gray-900/5">
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-indigo-50 rounded-full">
                <User className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Informations personnelles
                </h2>
                <p className="text-sm text-gray-500">
                  Gérez vos informations de profil
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-indigo-50 dark:bg-indigo-900/50 rounded-lg">
                <UserCircle className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Type de profil
                  </p>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400">
                    {getProfileTypeLabel()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <InputField
                  label="Nom"
                  value={user.lastName}
                  onChange={(value) => updateUser({ lastName: value })}
                  disabled={!isEditing}
                  required
                />
                <InputField
                  label="Prénom"
                  value={user.firstName}
                  onChange={(value) => updateUser({ firstName: value })}
                  disabled={!isEditing}
                  required
                />
              </div>
              <InputField
                label="Email"
                type="email"
                value={user.email}
                onChange={(value) => updateUser({ email: value })}
                disabled={!isEditing}
                required
              />
            </div>
          </div>
        </div>

        <NotificationPreferences
          preferences={user.notificationPreferences || { email: false, push: false }}
          onUpdate={(preferences) => updateUser({ notificationPreferences: preferences })}
          disabled={!isEditing}
        />

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm ring-1 ring-gray-900/5">
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-indigo-50 rounded-full">
                <Lock className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Sécurité
                </h2>
                <p className="text-sm text-gray-500">
                  Modifiez votre mot de passe
                </p>
              </div>
            </div>

            <PasswordChangeForm />
          </div>
        </div>
      </div>
    </div>
  );
}