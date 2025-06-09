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
  const createInbox = async (name, expirationTime = '1h') => {
    try {
      dispatch({ type: EMAIL_ACTIONS.SET_LOADING, payload: true })

      // Obtenir les domaines disponibles
      const { data: domains } = await tempMailAPI.getDomains()
      if (!domains || domains.length === 0) {
        throw new Error('Aucun domaine disponible')
      }

      // Créer l'email temporaire
      const domain = domains[Math.floor(Math.random() * domains.length)]
      const email = `${name}@${domain}`

      // Calculer la date d'expiration
      const expiresAt = new Date()
      switch (expirationTime) {
        case '1h': expiresAt.setHours(expiresAt.getHours() + 1); break
        case '1d': expiresAt.setDate(expiresAt.getDate() + 1); break
        case '1w': expiresAt.setDate(expiresAt.getDate() + 7); break
        default: expiresAt.setHours(expiresAt.getHours() + 1)
      }

      // Sauvegarder dans Supabase
      const { data, error } = await supabase
        .from('inboxes')
        .insert([{
          email: email,
          name: name,
          expires_at: expiresAt.toISOString(),
          is_active: true
        }])
        .select()
        .single()

      if (error) throw error

      dispatch({ type: EMAIL_ACTIONS.ADD_INBOX, payload: data })
      toast.success(`Boîte temporaire créée: ${email}`)
      
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
      const inbox = state.inboxes.find(i => i.id === inboxId)
      if (!inbox) return

      // Récupérer les emails depuis l'API Temp-Mail
      const { data: tempEmails, error } = await tempMailAPI.getEmails(inbox.email)
      if (error) throw new Error(error)

      // Sauvegarder les nouveaux emails dans Supabase
      for (const tempEmail of tempEmails || []) {
        const emailExists = state.emails.some(e => e.external_id === tempEmail.mail_id)
        if (!emailExists) {
          const { data, error: insertError } = await supabase
            .from('emails')
            .insert([{
              inbox_id: inboxId,
              external_id: tempEmail.mail_id,
              from_email: tempEmail.mail_from,
              to_email: tempEmail.mail_to,
              subject: tempEmail.mail_subject,
              content: tempEmail.mail_text_only || tempEmail.mail_html,
              received_at: new Date(tempEmail.mail_timestamp * 1000).toISOString(),
              is_read: false
            }])
            .select()
            .single()

          if (!insertError && data) {
            dispatch({ type: EMAIL_ACTIONS.ADD_EMAIL, payload: data })
          }
        }
      }

      toast.success('Emails actualisés')
    } catch (error) {
      console.error('Erreur lors de l\'actualisation:', error)
      toast.error('Erreur lors de l\'actualisation')
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

  const value = {
    ...state,
    // Actions
    createInbox,
    refreshInboxEmails,
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