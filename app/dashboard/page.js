'use client'

import { useState } from 'react'
import { useEmail } from '@/contexts/EmailContext'
import { useTheme } from '@/contexts/ThemeContext'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Button from '@/components/ui/Button'
import { 
  HiPlus, 
  HiRefresh, 
  HiTrash, 
  HiMail,
  HiInbox,
  HiSun,
  HiMoon,
  HiSparkles,
  HiClock
} from 'react-icons/hi'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function DashboardPage() {
  const { 
    emails, 
    inboxes, 
    selectedEmail, 
    loading, 
    createInbox, 
    refreshInboxEmails, 
    deleteInbox,
    markEmailAsRead,
    setSelectedEmail 
  } = useEmail()
  
  const { theme, toggleTheme } = useTheme()
  
  const [newInboxName, setNewInboxName] = useState('')
  const [expirationTime, setExpirationTime] = useState('1h')
  const [showCreateForm, setShowCreateForm] = useState(false)

  const handleCreateInbox = async (e) => {
    e.preventDefault()
    if (!newInboxName.trim()) return
    
    try {
      await createInbox(newInboxName, expirationTime)
      setNewInboxName('')
      setShowCreateForm(false)
    } catch (error) {
      console.error('Erreur lors de la création:', error)
    }
  }

  const handleEmailClick = (email) => {
    setSelectedEmail(email)
    if (!email.is_read) {
      markEmailAsRead(email.id)
    }
  }

  const unreadCount = emails.filter(email => !email.is_read).length

  return (
    <div className="h-screen flex bg-gray-50 dark:bg-dark-900">
      {/* Sidebar */}
      <div className="w-80 gmail-sidebar flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-dark-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <HiSparkles className="h-6 w-6 text-primary-500" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                TempMail
              </h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2"
            >
              {theme === 'dark' ? (
                <HiSun className="h-4 w-4" />
              ) : (
                <HiMoon className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <Button
            onClick={() => setShowCreateForm(true)}
            className="w-full"
            size="sm"
          >
            <HiPlus className="h-4 w-4 mr-2" />
            Nouvelle boîte temporaire
          </Button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="p-4 border-b border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-800">
            <form onSubmit={handleCreateInbox} className="space-y-3">
              <input
                type="text"
                placeholder="Nom de la boîte (ex: test, signup...)"
                value={newInboxName}
                onChange={(e) => setNewInboxName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md bg-white dark:bg-dark-700 text-gray-900 dark:text-white text-sm"
                autoFocus
              />
              <select
                value={expirationTime}
                onChange={(e) => setExpirationTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md bg-white dark:bg-dark-700 text-gray-900 dark:text-white text-sm"
              >
                <option value="1h">1 heure</option>
                <option value="1d">1 jour</option>
                <option value="1w">1 semaine</option>
              </select>
              <div className="flex gap-2">
                <Button type="submit" size="sm" className="flex-1">
                  Créer
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowCreateForm(false)}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Inboxes List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            <div className="mb-2 px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Boîtes temporaires ({inboxes.length})
            </div>
            
            {loading && inboxes.length === 0 ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="space-y-1">
                {inboxes.map((inbox) => {
                  const inboxEmails = emails.filter(e => e.inbox_id === inbox.id)
                  const unreadInboxCount = inboxEmails.filter(e => !e.is_read).length
                  
                  return (
                    <div key={inbox.id} className="group relative">
                      <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <HiInbox className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {inbox.name}
                            </span>
                            {unreadInboxCount > 0 && (
                              <span className="bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">
                                {unreadInboxCount}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                            {inbox.email}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <HiClock className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-400">
                              Expire: {format(new Date(inbox.expires_at), 'dd/MM HH:mm', { locale: fr })}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => refreshInboxEmails(inbox.id)}
                            className="p-1"
                          >
                            <HiRefresh className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteInbox(inbox.id)}
                            className="p-1 text-red-500 hover:text-red-600"
                          >
                            <HiTrash className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
                
                {inboxes.length === 0 && !loading && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <HiInbox className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Aucune boîte temporaire</p>
                    <p className="text-xs">Créez-en une pour commencer</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col gmail-main">
        {/* Toolbar */}
        <div className="gmail-toolbar p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Boîte de réception
              </h2>
              {unreadCount > 0 && (
                <span className="bg-primary-500 text-white text-sm px-3 py-1 rounded-full">
                  {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {emails.length} email{emails.length > 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Email List */}
        <div className="flex-1 overflow-hidden flex">
          {/* Email List */}
          <div className="w-1/2 border-r border-gray-200 dark:border-dark-700 overflow-y-auto">
            {loading && emails.length === 0 ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : (
              <div>
                {emails.map((email) => (
                  <div
                    key={email.id}
                    onClick={() => handleEmailClick(email)}
                    className={`email-item p-4 cursor-pointer border-b border-gray-200 dark:border-dark-700 ${
                      selectedEmail?.id === email.id ? 'email-item selected' : ''
                    } ${!email.is_read ? 'email-item unread' : ''}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-medium text-gray-900 dark:text-white text-sm truncate">
                        {email.from_email}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">
                        {format(new Date(email.received_at), 'HH:mm')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-900 dark:text-white font-medium mb-1 truncate">
                      {email.subject || '(Aucun sujet)'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {email.content?.substring(0, 100)}...
                    </p>
                  </div>
                ))}
                
                {emails.length === 0 && !loading && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <HiMail className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Aucun email</p>
                    <p className="text-xs">Les emails apparaîtront ici</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Email Detail */}
          <div className="w-1/2 p-6 bg-white dark:bg-dark-800">
            {selectedEmail ? (
              <div>
                <div className="border-b border-gray-200 dark:border-dark-700 pb-4 mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {selectedEmail.subject || '(Aucun sujet)'}
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <p><span className="font-medium">De:</span> {selectedEmail.from_email}</p>
                    <p><span className="font-medium">À:</span> {selectedEmail.to_email}</p>
                    <p><span className="font-medium">Date:</span> {format(new Date(selectedEmail.received_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}</p>
                  </div>
                </div>
                <div className="prose max-w-none dark:prose-invert">
                  <div className="whitespace-pre-wrap text-sm text-gray-900 dark:text-white">
                    {selectedEmail.content}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <HiMail className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Sélectionnez un email pour le lire</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 