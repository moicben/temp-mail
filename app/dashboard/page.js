'use client'

import { useState, useEffect } from 'react'
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
  HiMenuAlt3,
  HiX
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
    refreshAllInboxes,
    deleteInbox,
    markEmailAsRead,
    setSelectedEmail 
  } = useEmail()
  
  const { theme, toggleTheme } = useTheme()
  
  const [newInboxName, setNewInboxName] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleCreateInbox = async (e) => {
    e.preventDefault()
    if (!newInboxName.trim()) return
    
    try {
      await createInbox(newInboxName)
      setNewInboxName('')
      setShowCreateForm(false)
    } catch (error) {
      console.error('Erreur lors de la création:', error)
    }
  }

  const handleEmailClick = (email) => {
    console.log('📧 Email cliqué:', email)
    setSelectedEmail(email)
    if (!email.is_read) {
      markEmailAsRead(email.id)
    }
    // Fermer la sidebar sur mobile après sélection d'email
    if (window.innerWidth < 1024) {
      setSidebarOpen(false)
    }
  }

  const unreadCount = emails.filter(email => !email.is_read).length

  // Debug selectedEmail
  useEffect(() => {
    console.log('🎯 selectedEmail a changé:', selectedEmail)
  }, [selectedEmail])

  // Fermer la sidebar sur redimensionnement
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false)
      }
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="h-screen flex bg-gray-50 dark:bg-dark-900 relative">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative lg:translate-x-0 z-50 lg:z-auto
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        w-80 lg:w-72 xl:w-80 2xl:w-96 
        gmail-sidebar flex flex-col h-full
      `}>
        {/* Mobile Close Button */}
        <div className="lg:hidden absolute top-4 right-4 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="p-2"
          >
            <HiX className="h-5 w-5" />
          </Button>
        </div>

        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-dark-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <img src="/favicon.png" alt="TempMail" className="h-6 w-6" />
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
            Créer un email temporaire
          </Button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="p-4 border-b border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-800">
            <form onSubmit={handleCreateInbox} className="space-y-3">
              <input
                type="text"
                placeholder="Email complet (ex: arpan.shah@anypsd.com) ou juste le nom"
                value={newInboxName}
                onChange={(e) => setNewInboxName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md bg-white dark:bg-dark-700 text-gray-900 dark:text-white text-sm"
                autoFocus
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                💡 Entrez une adresse complète ou juste le nom (un domaine sera choisi automatiquement)
              </p>
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
      <div className="flex-1 flex flex-col gmail-main min-w-0">
        {/* Mobile Header & Toolbar */}
        <div className="gmail-toolbar p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2"
              >
                <HiMenuAlt3 className="h-5 w-5" />
              </Button>
              
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Boîte de réception
              </h2>
              {unreadCount > 0 && (
                <span className="bg-primary-500 text-white text-sm px-3 py-1 rounded-full">
                  {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
                </span>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={refreshAllInboxes}
                disabled={loading}
                className="hidden sm:flex items-center gap-2"
              >
                <HiRefresh className="h-4 w-4" />
                <span className="hidden md:inline">Actualiser tout</span>
              </Button>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
              {emails.length} email{emails.length > 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Email Content Area */}
        <div className="flex-1 overflow-hidden flex">
          {/* Email List */}
          <div className={`
            ${selectedEmail 
              ? 'w-full md:w-1/3 lg:w-2/5 xl:w-1/3 hidden md:block' 
              : 'w-full'
            }
            border-r border-gray-200 dark:border-dark-700 overflow-y-auto
          `}>
            {loading && emails.length === 0 ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : (
              <div>
                {emails.map((email) => {
                  const emailInbox = inboxes.find(inbox => inbox.id === email.inbox_id)
                  
                  return (
                    <div
                      key={email.id}
                      onClick={() => handleEmailClick(email)}
                      className={`email-item p-4 cursor-pointer border-b border-gray-200 dark:border-dark-700 ${
                        selectedEmail?.id === email.id ? 'email-item selected' : ''
                      } ${!email.is_read ? 'email-item unread' : ''}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900 dark:text-white text-sm truncate">
                              {email.from_email}
                            </span>
                            {emailInbox && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 flex-shrink-0">
                                <HiInbox className="h-3 w-3 mr-1" />
                                {emailInbox.name}
                              </span>
                            )}
                          </div>
                        </div>
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
                  )
                })}
                
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
          {selectedEmail && (
            <div className={`
              ${selectedEmail 
                ? 'w-full md:w-2/3 lg:w-3/5 xl:w-2/3' 
                : 'hidden'
              }
              p-4 md:p-6 bg-white dark:bg-dark-800 overflow-y-auto
            `}>
              <div>
                {/* Back button for mobile */}
                <div className="md:hidden mb-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedEmail(null)}
                    className="flex items-center gap-2"
                  >
                    <HiX className="h-4 w-4" />
                    Retour à la liste
                  </Button>
                </div>

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
                <div className="overflow-auto max-h-96 lg:max-h-none lg:flex-1">
                  {selectedEmail.content && selectedEmail.content.includes('<!DOCTYPE html>') ? (
                    <div 
                      className="text-sm"
                      dangerouslySetInnerHTML={{ __html: selectedEmail.content }}
                    />
                  ) : (
                    <div className="whitespace-pre-wrap text-sm text-gray-900 dark:text-white">
                      {selectedEmail.content || 'Aucun contenu'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Placeholder when no email selected */}
          {!selectedEmail && (
            <div className="hidden md:flex flex-1 items-center justify-center text-gray-500 dark:text-gray-400 bg-white dark:bg-dark-800">
              <div className="text-center">
                <HiMail className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Sélectionnez un email pour le lire</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 