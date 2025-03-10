export function formatDistanceToNow(date: Date): string {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'À l\'instant';
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}j`;
  
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

export function formatDate(date: string | undefined): string {
  if (!date) return 'Non renseigné';
  return new Date(date).toLocaleDateString('fr-FR');
}

export function formatMessageTime(date: Date): string {
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}