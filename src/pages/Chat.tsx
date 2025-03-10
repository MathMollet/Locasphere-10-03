import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useChat } from '../hooks/useChat';
import { useApplications } from '../hooks/useApplications';
import { useProperties } from '../hooks/useProperties';
import { useTenants } from '../hooks/useTenants';
import ChatContactList from '../components/chat/ChatContactList';
import ChatMessages from '../components/chat/ChatMessages';
import ChatInput from '../components/chat/ChatInput';
import ChatHeader from '../components/chat/ChatHeader';
import EmptyState from '../components/chat/EmptyState';
import CreateConversationModal from '../components/chat/CreateConversationModal';

export default function Chat() {
  const location = useLocation();
  const { applications } = useApplications();
  const { properties } = useProperties();
  const { tenants } = useTenants();
  const {
    contacts,
    selectedContact,
    setSelectedContact,
    messages,
    newMessage,
    setNewMessage,
    sendMessage,
    createOrGetContactForApplicant,
    isCreateModalOpen,
    setIsCreateModalOpen,
    createConversation,
    deleteConversation,
  } = useChat();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const applicantId = searchParams.get('applicant');
    const tenantId = searchParams.get('tenant');

    if (applicantId) {
      const application = applications.find(app => app.id === applicantId.replace('applicant_', ''));
      if (application) {
        const property = properties.find(p => p.id === application.propertyId);
        const contact = createOrGetContactForApplicant(
          application.id,
          `${application.applicant.firstName} ${application.applicant.lastName}`,
          property?.name || 'Bien inconnu'
        );
        setSelectedContact(contact);
      }
    } else if (tenantId) {
      const contact = contacts.find(c => c.id === tenantId);
      if (contact) {
        setSelectedContact(contact);
      }
    }
  }, [location.search, contacts, applications, properties, createOrGetContactForApplicant, setSelectedContact]);

  return (
    <div className="h-full flex">
      <div className="w-80 flex-shrink-0">
        <ChatContactList
          contacts={contacts}
          selectedContact={selectedContact}
          onSelectContact={setSelectedContact}
          onCreateConversation={() => setIsCreateModalOpen(true)}
          onDeleteConversation={deleteConversation}
        />
      </div>
      
      {selectedContact ? (
        <div className="flex-1 flex flex-col">
          <ChatHeader contact={selectedContact} />
          <ChatMessages
            messages={messages}
            selectedContact={selectedContact}
          />
          <ChatInput
            value={newMessage}
            onChange={setNewMessage}
            onSend={() => sendMessage(newMessage)}
          />
        </div>
      ) : (
        <EmptyState />
      )}

      <CreateConversationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateConversation={createConversation}
        tenants={tenants}
        applications={applications}
        properties={properties}
      />
    </div>
  );
}