'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useTheme } from '@/contexts/ThemeContext'
import Button from '@/components/ui/Button'
import { 
  HiMail, 
  HiShieldCheck, 
  HiClock, 
  HiEye, 
  HiMoon, 
  HiSun,
  HiSparkles,
  HiGlobeAlt,
  HiLockClosed
} from 'react-icons/hi'

const LandingPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { theme, toggleTheme } = useTheme()

  const handleSignIn = async (provider = 'email') => {
    setIsLoading(true)
    try {
      await signIn(provider, { callbackUrl: '/dashboard' })
    } catch (error) {
      console.error('Erreur de connexion:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const features = [
    {
      icon: HiMail,
      title: 'Emails temporaires illimités',
      description: 'Créez autant d\'adresses email temporaires que nécessaire'
    },
    {
      icon: HiClock,
      title: 'Expiration automatique',
      description: 'Configurez la durée de vie de vos emails (1h, 1j, 1s)'
    },
    {
      icon: HiShieldCheck,
      title: 'Sécurité avancée',
      description: 'Chiffrement de bout en bout et protection de vos données'
    },
    {
      icon: HiEye,
      title: 'Interface moderne',
      description: 'Design Gmail-like avec mode sombre et notifications en temps réel'
    },
    {
      icon: HiGlobeAlt,
      title: 'API complète',
      description: 'Intégrez TempMail à vos applications via notre API REST'
    },
    {
      icon: HiLockClosed,
      title: 'Confidentialité totale',
      description: 'Aucun tracking, suppression automatique des données'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900">
      {/* Header */}
      <header className="relative z-10">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
          <div className="flex items-center gap-2">
            <HiSparkles className="h-8 w-8 text-primary-500" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              TempMail
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2"
            >
              {theme === 'dark' ? (
                <HiSun className="h-5 w-5" />
              ) : (
                <HiMoon className="h-5 w-5" />
              )}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSignIn()}
              loading={isLoading}
            >
              Se connecter
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="py-24 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-7xl">
            Emails temporaires
            <span className="block text-primary-500">sécurisés et privés</span>
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-xl leading-8 text-gray-600 dark:text-gray-300">
            Protégez votre adresse email principale avec nos emails temporaires. 
            Interface moderne, sécurité avancée et expiration automatique.
          </p>
          
          <div className="mt-10 flex items-center justify-center gap-6">
            <Button
              size="lg"
              onClick={() => handleSignIn()}
              loading={isLoading}
              className="text-lg px-8 py-4"
            >
              Commencer gratuitement
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              className="text-lg px-8 py-4"
            >
              Voir les fonctionnalités
            </Button>
          </div>
        </div>

        {/* Demo Preview */}
        <div className="mt-16 flow-root sm:mt-24">
          <div className="relative rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 dark:bg-gray-100/5 dark:ring-gray-100/10 lg:rounded-2xl lg:p-4">
            <div className="aspect-video rounded-md bg-white shadow-2xl ring-1 ring-gray-900/10 dark:bg-dark-800 dark:ring-gray-100/10">
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <HiMail className="mx-auto h-16 w-16 text-primary-500" />
                  <p className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                    Interface TempMail
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Démo disponible après connexion
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="py-24 sm:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Tout ce dont vous avez besoin
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Une solution complète pour gérer vos emails temporaires en toute sécurité
            </p>
          </div>
          
          <div className="mx-auto mt-16 max-w-5xl">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="relative rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-900/5 dark:bg-dark-800 dark:ring-gray-100/5"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-500">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="mt-4 text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 text-center">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Prêt à protéger votre vie privée ?
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Rejoignez des milliers d'utilisateurs qui font confiance à TempMail
            </p>
            <div className="mt-10">
              <Button
                size="xl"
                onClick={() => handleSignIn()}
                loading={isLoading}
                className="text-xl px-12 py-6"
              >
                Créer un compte gratuit
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white dark:border-dark-700 dark:bg-dark-900">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HiSparkles className="h-6 w-6 text-primary-500" />
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                TempMail
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2024 TempMail. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage 