import axios from 'axios'

// Configuration de l'API Temp-Mail via RapidAPI
const RAPIDAPI_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY
const RAPIDAPI_HOST = process.env.NEXT_PUBLIC_RAPIDAPI_HOST

// Debug des variables d'environnement
console.log('🔧 Configuration TempMail API:')
console.log('RAPIDAPI_KEY:', RAPIDAPI_KEY ? `Définie (${RAPIDAPI_KEY.substring(0, 8)}...)` : 'NON DÉFINIE')
console.log('RAPIDAPI_HOST:', RAPIDAPI_HOST || 'NON DÉFINIE')
console.log('Toutes les variables NEXT_PUBLIC_:', Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_')))

const BASE_URL = `https://${RAPIDAPI_HOST}`
console.log('BASE_URL:', BASE_URL)

// Headers communs pour toutes les requêtes
const headers = {
  'X-RapidAPI-Key': RAPIDAPI_KEY,
  'X-RapidAPI-Host': RAPIDAPI_HOST,
  'Content-Type': 'application/json'                                          
}

// Client axios configuré
const tempMailClient = axios.create({
  baseURL: BASE_URL,
  headers,
  timeout: 10000
})

// Intercepteur pour gestion des erreurs
tempMailClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('TempMail API Error:', error)
    return Promise.reject(error)
  }
)

export const tempMailAPI = {
  // Obtenir la liste des domaines disponibles
  async getDomains() {
    try {
      const response = await tempMailClient.get('/request/domains/')
      return { data: response.data, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  // Générer un email temporaire aléaoire
  async generateRandomEmail() {
    try {
      const response = await tempMailClient.get('/request/mail/id/')
      return { data: response.data, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  // Créer une adresse email temporaire personnalisée
  async createEmail(name, domain) {
    try {
      const email = `${name}@${domain}`
      // L'API Temp-Mail génère automatiquement l'email lors de la première requête
      return { data: { email }, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  // Obtenir les emails pour une adresse donnée
  async getEmails(email) {
    try {
      console.log('🔍 Récupération des emails pour:', email)
      const hash = await this.getEmailHash(email)
      console.log('🔑 Hash généré:', hash)
      
      if (!hash) {
        return { data: [], error: 'Impossible de générer le hash pour cet email' }
      }

      const response = await tempMailClient.get(`/request/mail/id/${hash}/`)
      console.log('📧 Réponse API emails:', response.data)
      return { data: response.data || [], error: null }
    } catch (error) {
      console.error('❌ Erreur récupération emails:', error)
      return { data: [], error: error.message }
    }
  },

  // Obtenir un email spécifique par son ID
  async getEmailById(emailId) {
    try {
      const response = await tempMailClient.get(`/request/one_mail/id/${emailId}/`)
      return { data: response.data, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  // Supprimer un email temporaire
  async deleteEmail(email) {
    try {
      const hash = await this.getEmailHash(email)
      if (!hash) {
        return { error: 'Impossible de générer le hash pour cet email' }
      }

      const response = await tempMailClient.get(`/request/delete/id/${hash}/`)
      return { data: response.data, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  // Utilitaire pour générer le hash MD5 d'un email (requis par l'API)
  async getEmailHash(email) {
    try {
      // Utilisation de crypto-js pour générer le hash MD5
      const CryptoJS = await import('crypto-js')
      return CryptoJS.MD5(email.toLowerCase()).toString()
    } catch (error) {
      console.error('Erreur lors de la génération du hash:', error)
      return null
    }
  },

  // Vérifier la validité d'une adresse email
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  // Polling pour vérifier les nouveaux emails
  async pollEmails(email, interval = 5000, maxAttempts = 10) {
    let attempts = 0
    
    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          const { data, error } = await this.getEmails(email)
          
          if (error) {
            reject(new Error(error))
            return
          }

          if (data && data.length > 0) {
            resolve(data)
            return
          }

          attempts++
          if (attempts >= maxAttempts) {
            resolve([]) // Aucun email trouvé après les tentatives maximales
            return
          }

          setTimeout(poll, interval)
        } catch (error) {
          reject(error)
        }
      }

      poll()
    })
  }
}

export default tempMailAPI 