'use client'

import { createContext, useContext, useReducer, useEffect } from 'react'
import { tempMailAPI } from '@/lib/tempmail-api'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

const EmailContext = createContext({})

// Actions pour le reducer
const EMAIL_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_EMAILS: 'SET_EMAILS',
  ADD_EMAIL: 'ADD_EMAIL',
  UPDATE_EMAIL: 'UPDATE_EMAIL',
  DELETE_EMAIL: 'DELETE_EMAIL',
  SET_INBOXES: 'SET_INBOXES',
  ADD_INBOX: 'ADD_INBOX',
  UPDATE_INBOX: 'UPDATE_INBOX',
  DELETE_INBOX: 'DELETE_INBOX',
  SET_SELECTED_EMAIL: 'SET_SELECTED_EMAIL',
  SET_SELECTED_INBOX: 'SET_SELECTED_INBOX',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
}

// État initial
const initialState = {
  emails: [],
  inboxes: [],
  selectedEmail: null,
  selectedInbox: null,
  loading: false,
  error: null
}

// Reducer pour gérer l'état
function emailReducer(state, action) {
  switch (action.type) {
    case EMAIL_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload }
    
    case EMAIL_ACTIONS.SET_EMAILS:
      return { ...state, emails: action.payload, loading: false }
    
    case EMAIL_ACTIONS.ADD_EMAIL:
      return { 
        ...state, 
        emails: [action.payload, ...state.emails],
        loading: false 
      }
    
    case EMAIL_ACTIONS.UPDATE_EMAIL:
      return {
        ...state,
        emails: state.emails.map(email => 
          email.id === action.payload.id ? { ...email, ...action.payload } : email
        ),
        selectedEmail: state.selectedEmail?.id === action.payload.id 
          ? { ...state.selectedEmail, ...action.payload } 
          : state.selectedEmail
      }
    
    case EMAIL_ACTIONS.DELETE_EMAIL:
      return {
        ...state,
        emails: state.emails.filter(email => email.id !== action.payload),
        selectedEmail: state.selectedEmail?.id === action.payload ? null : state.selectedEmail
      }
    
    case EMAIL_ACTIONS.SET_INBOXES:
      return { ...state, inboxes: action.payload, loading: false }
    
    case EMAIL_ACTIONS.ADD_INBOX:
      return { 
        ...state, 
        inboxes: [action.payload, ...state.inboxes],
        loading: false 
      }
    
    case EMAIL_ACTIONS.UPDATE_INBOX:
      return {
        ...state,
        inboxes: state.inboxes.map(inbox => 
          inbox.id === action.payload.id ? { ...inbox, ...action.payload } : inbox
        ),
        selectedInbox: state.selectedInbox?.id === action.payload.id 
          ? { ...state.selectedInbox, ...action.payload } 
          : state.selectedInbox
      }
    
    case EMAIL_ACTIONS.DELETE_INBOX:
      return {
        ...state,
        inboxes: state.inboxes.filter(inbox => inbox.id !== action.payload),
        selectedInbox: state.selectedInbox?.id === action.payload ? null : state.selectedInbox
      }
    
    case EMAIL_ACTIONS.SET_SELECTED_EMAIL:
      return { ...state, selectedEmail: action.payload }
    
    case EMAIL_ACTIONS.SET_SELECTED_INBOX:
      return { ...state, selectedInbox: action.payload }
    
    case EMAIL_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false }
    
    case EMAIL_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null }
    
    default:
      return state
  }
}

export const useEmail = () => {
  const context = useContext(EmailContext)
  if (!context) {
    throw new Error('useEmail must be used within an EmailProvider')
  }
  return context
}

export const EmailProvider = ({ children }) => {
  const [state, dispatch] = useReducer(emailReducer, initialState)

  // Charger les données au montage
  useEffect(() => {
    loadUserData()
  }, [])

  // Charger toutes les données
  const loadUserData = async () => {
    dispatch({ type: EMAIL_ACTIONS.SET_LOADING, payload: true })
    try {
      await Promise.all([
        loadInboxes(),
        loadEmails()
      ])
      
      // Après avoir chargé les inboxes, récupérer les emails de chacune
      setTimeout(() => {
        refreshAllInboxes()
      }, 1000)
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error)
      dispatch({ type: EMAIL_ACTIONS.SET_ERROR, payload: error.message })
    }
  }

  // Charger les boîtes de réception
  const loadInboxes = async () => {
    try {
      const { data, error } = await supabase
        .from('inboxes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      dispatch({ type: EMAIL_ACTIONS.SET_INBOXES, payload: data || [] })
    } catch (error) {
      console.error('Erreur lors du chargement des boîtes:', error)
      throw error
    }
  }

  // Charger les emails
  const loadEmails = async () => {
    try {
      const { data, error } = await supabase
        .from('emails')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      dispatch({ type: EMAIL_ACTIONS.SET_EMAILS, payload: data || [] })
    } catch (error) {
      console.error('Erreur lors du chargement des emails:', error)
      throw error
    }
  }

  // Créer une nouvelle boîte de réception temporaire
  const createInbox = async (input) => {
    try {
      dispatch({ type: EMAIL_ACTIONS.SET_LOADING, payload: true })

      // Obtenir les domaines disponibles
      const { data: domains } = await tempMailAPI.getDomains()
      if (!domains || domains.length === 0) {
        throw new Error('Aucun domaine disponible')
      }

      let email, name
      
      // Vérifier si l'input est une adresse email complète ou juste un nom
      if (input.includes('@')) {
        // C'est une adresse email complète
        email = input
        const [localPart, domain] = input.split('@')
        name = localPart
        
        // Vérifier que le domaine est supporté (les domaines de l'API peuvent avoir un @ devant)
        const normalizedDomains = domains.map(d => d.replace('@', ''))
        if (!normalizedDomains.includes(domain)) {
          throw new Error(`Le domaine "${domain}" n'est pas supporté. Domaines disponibles: ${normalizedDomains.join(', ')}`)
        }
      } else {
        // C'est juste un nom, utiliser un domaine aléatoire
      const domain = domains[Math.floor(Math.random() * domains.length)]
        email = `${input}@${domain}`
        name = input
      }

      // Sauvegarder dans Supabase
      const { data, error } = await supabase
        .from('inboxes')
        .insert([{
          email: email,
          name: name,
          is_active: true
        }])
        .select()
        .single()

      if (error) throw error

      dispatch({ type: EMAIL_ACTIONS.ADD_INBOX, payload: data })
      toast.success(`Boîte temporaire créée: ${email}`)
      
      // Récupérer immédiatement les emails existants
      setTimeout(() => {
        refreshInboxEmails(data.id)
      }, 1000) // Délai de 1 seconde pour laisser le temps à l'API de traiter
      
      return data
    } catch (error) {
      console.error('Erreur lors de la création de la boîte:', error)
      dispatch({ type: EMAIL_ACTIONS.SET_ERROR, payload: error.message })
      toast.error('Erreur lors de la création de la boîte temporaire')
      throw error
    }
  }

  // Actualiser les emails d'une boîte
  const refreshInboxEmails = async (inboxId) => {
    try {
      console.log('🔄 Actualisation des emails pour inbox ID:', inboxId)
      const inbox = state.inboxes.find(i => i.id === inboxId)
      if (!inbox) {
        console.log('❌ Inbox non trouvée:', inboxId)
        return
      }

      console.log('📮 Inbox trouvée:', inbox.email)

      // Récupérer les emails depuis l'API Temp-Mail
      const { data: tempEmails, error } = await tempMailAPI.getEmails(inbox.email)
      console.log('📧 Emails récupérés:', tempEmails)
      
      if (error) {
        console.error('❌ Erreur API:', error)
        throw new Error(error)
      }

      // Vérifier si l'API retourne une erreur "pas d'emails"
      if (tempEmails && tempEmails.error && tempEmails.error.includes('no emails')) {
        console.log('📭 Aucun email trouvé pour cette boîte')
        toast('Aucun email trouvé')
        return
      }

      if (!tempEmails || !Array.isArray(tempEmails) || tempEmails.length === 0) {
        console.log('📭 Aucun email trouvé pour cette boîte')
        toast('Aucun nouvel email')
        return
      }

      let newEmailsCount = 0

      // Sauvegarder les nouveaux emails dans Supabase
      for (const tempEmail of tempEmails) {
        console.log('📨 Traitement email:', tempEmail)
        const emailExists = state.emails.some(e => e.external_id === tempEmail.mail_id)
        
        if (!emailExists) {
          console.log('✨ Nouvel email trouvé:', tempEmail.mail_subject || tempEmail.subject)
          console.log('🔍 Structure complète de l\'email:', tempEmail)
          
          // Extraire les bonnes données selon la structure de l'API
          const emailData = {
            inbox_id: inboxId,
            external_id: tempEmail.mail_id || tempEmail.id,
            from_email: tempEmail.mail_from || tempEmail.from || 'Expéditeur inconnu',
            to_email: tempEmail.mail_to || tempEmail.to || inbox.email || 'Destinataire inconnu',
            subject: tempEmail.mail_subject || tempEmail.subject || '(Aucun sujet)',
            content: tempEmail.mail_text_only || tempEmail.mail_html || tempEmail.text || tempEmail.html || tempEmail.body || '',
            received_at: tempEmail.mail_timestamp 
              ? new Date(tempEmail.mail_timestamp * 1000).toISOString()
              : tempEmail.createdAt 
              ? new Date(tempEmail.createdAt).toISOString()
              : new Date().toISOString(),
            is_read: false
          }
          
          console.log('📝 Données à insérer:', emailData)
          
          const { data, error: insertError } = await supabase
            .from('emails')
            .insert([emailData])
            .select()
            .single()

          if (!insertError && data) {
            dispatch({ type: EMAIL_ACTIONS.ADD_EMAIL, payload: data })
            newEmailsCount++
            console.log('✅ Email sauvegardé:', data.subject)
          } else {
            console.error('❌ Erreur sauvegarde:', insertError)
          }
        }
      }

      if (newEmailsCount > 0) {
        toast.success(`${newEmailsCount} nouvel(s) email(s) reçu(s)`)
      } else {
        toast('Emails actualisés - aucun nouveau')
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'actualisation:', error)
      toast.error(`Erreur: ${error.message}`)
    }
  }

  // Marquer un email comme lu
  const markEmailAsRead = async (emailId) => {
    try {
      const { error } = await supabase
        .from('emails')
        .update({ is_read: true })
        .eq('id', emailId)

      if (error) throw error

      dispatch({ 
        type: EMAIL_ACTIONS.UPDATE_EMAIL, 
        payload: { id: emailId, is_read: true } 
      })
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error)
    }
  }

  // Supprimer une boîte de réception
  const deleteInbox = async (inboxId) => {
    try {
      const { error } = await supabase
        .from('inboxes')
        .delete()
        .eq('id', inboxId)

      if (error) throw error

      dispatch({ type: EMAIL_ACTIONS.DELETE_INBOX, payload: inboxId })
      toast.success('Boîte supprimée')
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      toast.error('Erreur lors de la suppression')
    }
  }

  // Actualiser les emails de toutes les boîtes
  const refreshAllInboxes = async () => {
    console.log('🔄 Actualisation de toutes les boîtes')
    const activeInboxes = state.inboxes.filter(inbox => inbox.is_active)
    console.log('📮 Boîtes actives:', activeInboxes.length)
    
    for (const inbox of activeInboxes) {
      console.log('🔄 Traitement de la boîte:', inbox.email)
      await refreshInboxEmails(inbox.id)
      // Petite pause entre chaque requête pour éviter le rate limiting
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  const value = {
    ...state,
    // Actions
    createInbox,
    refreshInboxEmails,
    refreshAllInboxes,
    markEmailAsRead,
    deleteInbox,
    loadUserData,
    // Setters
    setSelectedEmail: (email) => dispatch({ type: EMAIL_ACTIONS.SET_SELECTED_EMAIL, payload: email }),
    setSelectedInbox: (inbox) => dispatch({ type: EMAIL_ACTIONS.SET_SELECTED_INBOX, payload: inbox }),
    clearError: () => dispatch({ type: EMAIL_ACTIONS.CLEAR_ERROR })
  }

  return (
    <EmailContext.Provider value={value}>
      {children}
    </EmailContext.Provider>
  )
} 