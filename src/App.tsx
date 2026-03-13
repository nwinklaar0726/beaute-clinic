import { Toaster } from '@/components/ui/sonner'
import { QueryProvider } from '@/providers/QueryProvider'
import { Navigation } from '@/sections/Navigation'
import { Hero } from '@/sections/Hero'
import { Services } from '@/sections/Services'
import { BeautyBar } from '@/sections/BeautyBar'
import { About } from '@/sections/About'
import { BookingWizard } from '@/features/appointments/components/BookingWizard'
import { Footer } from '@/sections/Footer'

/**
 * BEAUTÉ - PLATAFORMA INTEGRAL DE ESTÉTICA Y NUTRICIÓN
 * 
 * Arquitectura con TanStack:
 * - TanStack Query: Gestión de estado del servidor
 * - TanStack Table: Tablas de datos (admin)
 * - React: UI components
 * 
 * Dra. Meyryn Carrillo | Costa Rica
 */

function App() {
  return (
    <QueryProvider>
      <div className="min-h-screen bg-beute-cream">
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
          <Hero />
          <Services />
          <BeautyBar />
          <About />
          <BookingWizard />
        </main>
        
        <Footer />
      </div>
    </QueryProvider>
  )
}

export default App
