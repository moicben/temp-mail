// Fonction utilitaire pour extraire le texte brut d'un contenu HTML
const extractPlainText = (htmlContent) => {
  if (!htmlContent) return ''
  
  // Retirer les balises HTML et décoder les entités
  let text = htmlContent
    .replace(/<[^>]*>/g, ' ') // Retirer toutes les balises HTML
    .replace(/\s+/g, ' ') // Remplacer plusieurs espaces par un seul
    .replace(/&nbsp;/g, ' ') // Remplacer les espaces insécables
    .replace(/&amp;/g, '&') // Décoder &
    .replace(/&lt;/g, '<') // Décoder <
    .replace(/&gt;/g, '>') // Décoder >
    .replace(/&quot;/g, '"') // Décoder "
    .replace(/&#39;/g, "'") // Décoder '
    .trim()
  
  return text
}

// Fonction pour créer un aperçu intelligent du contenu
const createEmailPreview = (content, maxLength = 100) => {
  if (!content) return '(Aucun contenu)'
  
  // Si c'est du texte brut, l'utiliser directement
  if (!content.includes('<')) {
    return content.length > maxLength 
      ? content.substring(0, maxLength) + '...' 
      : content
  }
  
  // Si c'est du HTML, extraire le texte brut
  const plainText = extractPlainText(content)
  return plainText.length > maxLength 
    ? plainText.substring(0, maxLength) + '...' 
    : plainText || '(Contenu HTML)'
}

const EmailPreview = ({ content, maxLength = 100, className = '' }) => {
  const preview = createEmailPreview(content, maxLength)
  
  return (
    <p className={`text-sm text-gray-600 dark:text-gray-400 truncate ${className}`}>
      {preview}
    </p>
  )
}

export default EmailPreview
export { extractPlainText, createEmailPreview }
