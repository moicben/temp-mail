import { useState } from 'react'
import Button from '@/components/ui/Button'
import { HiEye, HiCode } from 'react-icons/hi'

// Fonction utilitaire pour détecter le contenu HTML
const isHTMLContent = (content) => {
  if (!content || typeof content !== 'string') return false
  
  // Vérifier différents indicateurs de contenu HTML
  const htmlIndicators = [
    '<!DOCTYPE html>',
    '<html',
    '<HTML',
    '<head>',
    '<HEAD>',
    '<body>',
    '<BODY>',
    '<div',
    '<DIV',
    '<p>',
    '<P>',
    '<span',
    '<SPAN',
    '<table',
    '<TABLE',
    '<td',
    '<TD',
    '<tr',
    '<TR',
    '<img',
    '<IMG',
    '<br>',
    '<BR>',
    '<br/>',
    '<BR/>',
    '<a href',
    '<A HREF',
    '&lt;',
    '&gt;',
    '&amp;',
    '&nbsp;',
    '&quot;',
    '<strong>',
    '<STRONG>',
    '<em>',
    '<EM>',
    '<b>',
    '<B>',
    '<i>',
    '<I>',
    '<u>',
    '<U>',
    '<ul>',
    '<UL>',
    '<ol>',
    '<OL>',
    '<li>',
    '<LI>',
    '<h1>',
    '<H1>',
    '<h2>',
    '<H2>',
    '<h3>',
    '<H3>',
    '<h4>',
    '<H4>',
    '<h5>',
    '<H5>',
    '<h6>',
    '<H6>',
    'style=',
    'STYLE=',
    'class=',
    'CLASS='
  ]
  
  return htmlIndicators.some(indicator => content.toLowerCase().includes(indicator.toLowerCase()))
}

// Fonction utilitaire pour nettoyer le HTML (protection de base)
const sanitizeHTML = (html) => {
  if (!html) return ''
  
  // Nettoyer les scripts et autres éléments dangereux
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
  sanitized = sanitized.replace(/javascript:/gi, '')
  sanitized = sanitized.replace(/on\w+\s*=/gi, '')
  sanitized = sanitized.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
  sanitized = sanitized.replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
  sanitized = sanitized.replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '')
  sanitized = sanitized.replace(/<input\b[^<]*\/?>/gi, '')
  sanitized = sanitized.replace(/<button\b[^<]*(?:(?!<\/button>)<[^<]*)*<\/button>/gi, '')
  
  return sanitized
}

const EmailContent = ({ content, className = '' }) => {
  const [viewMode, setViewMode] = useState('rendered') // 'rendered' ou 'source'
  
  if (!content) {
    return (
      <div className={`text-gray-500 dark:text-gray-400 italic ${className}`}>
        Aucun contenu
      </div>
    )
  }

  const isHTML = isHTMLContent(content)

  return (
    <div className={className}>
      {/* Toggle pour voir le code source si c'est du HTML */}
      {isHTML && (
        <div className="mb-4 flex gap-2">
          <Button
            variant={viewMode === 'rendered' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('rendered')}
            className="flex items-center gap-2"
          >
            <HiEye className="h-4 w-4" />
            Rendu
          </Button>
          <Button
            variant={viewMode === 'source' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('source')}
            className="flex items-center gap-2"
          >
            <HiCode className="h-4 w-4" />
            Code source
          </Button>
        </div>
      )}      {/* Contenu de l'email */}
      <div className="overflow-auto max-h-96 lg:max-h-none">
        {isHTML && viewMode === 'rendered' ? (
          <div 
            className="email-content prose prose-sm max-w-none dark:prose-invert prose-blue
                       prose-headings:text-gray-900 dark:prose-headings:text-gray-100
                       prose-p:text-gray-700 dark:prose-p:text-gray-300
                       prose-a:text-blue-600 dark:prose-a:text-blue-400
                       prose-strong:text-gray-900 dark:prose-strong:text-gray-100
                       prose-code:text-gray-900 dark:prose-code:text-gray-100
                       prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800
                       prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300
                       prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-600"
            dangerouslySetInnerHTML={{ __html: sanitizeHTML(content) }}
          />
        ) : (
          <div className="whitespace-pre-wrap text-sm text-gray-900 dark:text-white font-mono bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            {content}
          </div>
        )}
      </div>
    </div>
  )
}

export default EmailContent
