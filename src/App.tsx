import { Outlet } from '@tanstack/react-router'
import { Toaster } from '@/components/ui/sonner'
import { Navigation } from '@/sections/Navigation'
import { HeroVideo } from '@/sections/HeroVideo'
import { Services } from '@/sections/Services'
import { BeautyBar } from '@/sections/BeautyBar'
import { About } from '@/sections/About'
import { BookingWizard } from '@/features/appointments/components/BookingWizard'
import { Footer } from '@/sections/Footer'

/**
 * BEAUTÉ - PLATAFORMA INTEGRAL DE ESTÉTICA Y NUTRICIÓN
 * 
 * Landing Page Component - Ruta raíz "/"
 */
function LandingPage() {
  return (
    <>
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            fontFamily: 'Lato, sans-serif',
          },
        }}
      />
      
      <Navigation />
      
      <main>
        <HeroVideo />
        <Services />
        <BeautyBar />
        <About />
        <BookingWizard />
      </main>
      
      <Footer />
    </>
  )
}

/**
 * App Component
 * 
 * Este componente se usa para la ruta raíz.
 * Las rutas hijas (como /admin) se renderizan a través de Outlet.
 */
function App() {
  return (
    <div className="min-h-screen bg-beute-cream">
      <Outlet />
    </div>
  )
}

// Export LandingPage para usarlo en routes
export { LandingPage }
export default App
