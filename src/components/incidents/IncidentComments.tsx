import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Incident, IncidentComment } from '../../types/incident';
import { User } from '../../types/user';
import { incidentService } from '../../services/incidentService';
import { formatDistanceToNow } from '../../utils/dateUtils';

interface IncidentCommentsProps {
  incident: Incident;
  onUpdateIncident: (incident: Incident) => void;
  currentUser: User | null;
  disabled?: boolean;
}

export default function IncidentComments({
  incident,
  onUpdateIncident,
  currentUser,
  disabled = false
}: IncidentCommentsProps) {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newComment.trim()) return;

    const comment: IncidentComment = {
      id: crypto.randomUUID(),
      authorId: currentUser.id,
      authorName: `${currentUser.firstName} ${currentUser.lastName}`,
      content: newComment.trim(),
      createdAt: new Date().toISOString()
    };

    const updatedIncident = incidentService.addComment(incident.id, comment);
    if (updatedIncident) {
      onUpdateIncident(updatedIncident);
      setNewComment('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Liste des commentaires */}
      <div className="space-y-4">
        {incident.comments?.map((comment) => (
          <div
            key={comment.id}
            className={`flex gap-4 ${
              comment.authorId === currentUser?.id
                ? 'flex-row-reverse'
                : ''
            }`}
          >
            <div
              className={`flex-1 p-4 rounded-lg ${
                comment.authorId === currentUser?.id
                  ? 'bg-indigo-50 dark:bg-indigo-900/50'
                  : 'bg-gray-50 dark:bg-gray-700/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {comment.authorName}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDistanceToNow(new Date(comment.createdAt))}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {comment.content}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Formulaire de nouveau commentaire */}
      {!disabled && (
        <form onSubmit={handleSubmit} className="flex gap-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Écrivez votre commentaire..."
            className="flex-1 min-h-[100px] rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="self-end px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      )}
    </div>
  );
}