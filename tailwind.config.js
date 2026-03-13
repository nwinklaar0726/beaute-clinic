/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Base shadcn colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },

        // ============================================
        // BEAUTÉ BRAND COLORS - Brandbook 2025
        // ============================================

        // Primary Colors - Earth Palette
        beute: {
          // Base Backgrounds
          cream: {
            DEFAULT: '#FAEFE6',      // Fondo principal suave
            light: '#FDF8F3',        // Fondo más claro
            dark: '#F5E6D8',         // Fondo más oscuro
            pale: '#F6F2EF',         // Secundario, cards
          },
          nude: {
            DEFAULT: '#F6F2EF',      // Cards, secciones
            light: '#FAF8F6',
            dark: '#EDE8E3',
          },

          // Earth Colors - Text & Headlines
          earth: {
            deep: '#51350C',         // Textos principales, títulos
            medium: '#925F42',       // Subtítulos, acentos
            light: '#B8936F',        // Texto secundario
            muted: '#D4C4B0',        // Bordes sutiles
          },

          // Gold Accent - CTAs & Premium Elements
          gold: {
            DEFAULT: '#AC802A',      // CTAs, badges premium
            light: '#C9A961',        // Hover states
            pale: '#E8D5A8',         // Highlights sutiles
            dark: '#8A6B20',         // Active states
            muted: '#C4A055',        // Elementos secundarios
          },

          // Rose Accent - Femenine & Warm
          rose: {
            DEFAULT: '#A97574',      // Acento cálido
            light: '#D2A4A1',        // Hover states
            pale: '#F5D6D3',         // Backgrounds sutiles
            dark: '#8B5A59',         // Active
          },

          // Taupe - Neutral Warm
          taupe: {
            DEFAULT: '#A48D82',      // Neutral cálido
            light: '#D9CAC1',        // Bordes, separadores
            pale: '#FAEFE6',         // Fondos
            dark: '#7A6B62',         // Texto secundario
          },

          // Olive - Natural & Wellness
          olive: {
            DEFAULT: '#59533C',      // Naturaleza, bienestar
            light: '#837F67',        // Elementos secundarios
            pale: '#C4BCA3',         // Backgrounds naturales
            dark: '#3D3928',         // Texto oscuro
          },

          // Functional Colors
          success: {
            DEFAULT: '#7A9E7E',      // Verde apagado, confirmaciones
            light: '#A8C4AA',
            pale: '#E8F0E9',
          },
          warning: {
            DEFAULT: '#C9A961',      // Dorado suave, alertas
            light: '#E5D4A3',
            pale: '#FAF5E8',
          },
          error: {
            DEFAULT: '#A65D57',      // Terracota, errores
            light: '#C98A85',
            pale: '#F5E5E3',
          },
          info: {
            DEFAULT: '#6B8E9B',      // Azul apagado, información
            light: '#9BB8C3',
            pale: '#E8F1F4',
          },
        },

        // Legacy support (mantener compatibilidad)
        // Serán deprecados gradualmente
        brand: {
          brown: {
            dark: '#51350C',
            medium: '#925F42',
            light: '#7A561B',
          },
        },
      },

      // ============================================
      // TYPOGRAPHY - Brandbook Fonts
      // ============================================
      fontFamily: {
        // Display - Títulos de prestigio
        dream: ['"Dream Orphans"', 'serif'],
        
        // Accent - Elementos decorativos
        bestand: ['Bestand', 'cursive'],
        apollo: ['Apollo', 'serif'],
        
        // Body - Lato Family (legibilidad médica)
        lato: ['Lato', 'sans-serif'],
        
        // Mono - Códigos y datos técnicos
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },

      fontSize: {
        // Hero headlines
        'display-1': ['5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '400' }],
        'display-2': ['4rem', { lineHeight: '1.15', letterSpacing: '-0.01em', fontWeight: '400' }],
        'display-3': ['3rem', { lineHeight: '1.2', letterSpacing: '0', fontWeight: '400' }],
        
        // Section titles
        'heading-1': ['2.5rem', { lineHeight: '1.2', letterSpacing: '0.01em', fontWeight: '400' }],
        'heading-2': ['2rem', { lineHeight: '1.25', letterSpacing: '0.01em', fontWeight: '400' }],
        'heading-3': ['1.5rem', { lineHeight: '1.3', letterSpacing: '0.02em', fontWeight: '400' }],
        
        // Body text (Lato)
        'body-xl': ['1.25rem', { lineHeight: '1.7', letterSpacing: '0', fontWeight: '300' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7', letterSpacing: '0', fontWeight: '300' }],
        'body': ['1rem', { lineHeight: '1.7', letterSpacing: '0', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.6', letterSpacing: '0', fontWeight: '400' }],
        'body-xs': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.01em', fontWeight: '400' }],
        
        // UI Elements
        'label': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.15em', fontWeight: '600' }],
        'caption': ['0.625rem', { lineHeight: '1.4', letterSpacing: '0.1em', fontWeight: '500' }],
      },

      // ============================================
      // SPACING - Luxury Medical Design
      // ============================================
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem',
        '88': '22rem',
        '128': '32rem',
      },

      // ============================================
      // BORDER RADIUS - Soft & Premium
      // ============================================
      borderRadius: {
        'xs': '0.25rem',      // 4px - Inputs
        'sm': '0.375rem',     // 6px - Small elements
        'md': '0.5rem',       // 8px - Buttons
        'lg': '0.75rem',      // 12px - Cards
        'xl': '1rem',         // 16px - Modals
        '2xl': '1.5rem',      // 24px - Large cards
        '3xl': '2rem',        // 32px - Sections
        'full': '9999px',     // Pills, badges
      },

      // ============================================
      // SHADOWS - Elegant & Soft
      // ============================================
      boxShadow: {
        'xs': '0 1px 2px 0 rgb(0 0 0 / 0.03)',
        'sm': '0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'DEFAULT': '0 4px 6px -1px rgb(0 0 0 / 0.04), 0 2px 4px -2px rgb(0 0 0 / 0.04)',
        'md': '0 6px 8px -1px rgb(0 0 0 / 0.04), 0 4px 6px -2px rgb(0 0 0 / 0.04)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.04), 0 4px 6px -4px rgb(0 0 0 / 0.04)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.04), 0 8px 10px -6px rgb(0 0 0 / 0.04)',
        
        // Brand shadows
        'gold': '0 4px 20px rgba(172, 128, 42, 0.25)',
        'gold-lg': '0 8px 30px rgba(172, 128, 42, 0.3)',
        'soft': '0 4px 20px rgba(81, 53, 12, 0.06)',
        'soft-lg': '0 8px 40px rgba(81, 53, 12, 0.08)',
        'elegant': '0 12px 50px rgba(81, 53, 12, 0.1)',
        'inner-light': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.02)',
        
        // Hover states
        'hover': '0 8px 30px rgba(81, 53, 12, 0.12)',
        'hover-gold': '0 8px 30px rgba(172, 128, 42, 0.35)',
      },

      // ============================================
      // TRANSITIONS - Smooth & Elegant
      // ============================================
      transitionDuration: {
        '150': '150ms',
        '250': '250ms',
        '350': '350ms',
        '450': '450ms',
        '550': '550ms',
        '650': '650ms',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-soft': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'ease-out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'ease-in-out-smooth': 'cubic-bezier(0.65, 0, 0.35, 1)',
      },

      // ============================================
      // KEYFRAMES - Micro-interactions
      // ============================================
      keyframes: {
        // Accordion animations
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        
        // Caret blink
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        
        // Float animation
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        
        // Shimmer/Gold glow
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        
        // Fade animations
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-down": {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        
        // Scale animations
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "scale-out": {
          "0%": { opacity: "1", transform: "scale(1)" },
          "100%": { opacity: "0", transform: "scale(0.95)" },
        },
        
        // Slide animations
        "slide-in-right": {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "slide-in-left": {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        
        // Pulse glow
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(172, 128, 42, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(172, 128, 42, 0.5)" },
        },
        
        // Spin slow
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        
        // Bounce subtle
        "bounce-subtle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        
        // Gradient flow
        "gradient-flow": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      
      animation: {
        // Default shadcn
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        
        // Brand animations
        "float": "float 3s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "fade-in": "fade-in 0.4s ease-out",
        "fade-out": "fade-out 0.4s ease-out",
        "fade-in-up": "fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in-down": "fade-in-down 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "scale-in": "scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "scale-out": "scale-out 0.2s ease-out forwards",
        "slide-in-right": "slide-in-right 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-in-left": "slide-in-left 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "spin-slow": "spin-slow 8s linear infinite",
        "bounce-subtle": "bounce-subtle 2s ease-in-out infinite",
        "gradient-flow": "gradient-flow 3s ease infinite",
      },

      // ============================================
      // BACKGROUND IMAGES
      // ============================================
      backgroundImage: {
        // Gold gradients
        'gold-gradient': 'linear-gradient(135deg, #AC802A 0%, #C9A961 50%, #E8D5A8 100%)',
        'gold-gradient-radial': 'radial-gradient(circle at center, #C9A961 0%, #AC802A 100%)',
        'gold-gradient-linear': 'linear-gradient(90deg, #AC802A 0%, #C9A961 25%, #E8D5A8 50%, #C9A961 75%, #AC802A 100%)',
        
        // Cream gradients
        'cream-gradient': 'linear-gradient(180deg, #FAEFE6 0%, #F6F2EF 100%)',
        'cream-gradient-radial': 'radial-gradient(circle at 50% 0%, #FDF8F3 0%, #FAEFE6 100%)',
        
        // Hero gradients
        'hero-gradient': 'linear-gradient(135deg, rgba(81, 53, 12, 0.9) 0%, rgba(146, 95, 66, 0.7) 50%, transparent 100%)',
        'hero-gradient-light': 'linear-gradient(to right, rgba(250, 239, 230, 0.98) 0%, rgba(250, 239, 230, 0.85) 50%, transparent 100%)',
        
        // Section gradients
        'section-gradient': 'linear-gradient(180deg, #F6F2EF 0%, #FAEFE6 50%, #F6F2EF 100%)',
        
        // Botanical patterns (SVG data URIs)
        'leaf-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 Q35 20 30 35 Q25 20 30 5' fill='none' stroke='%23AC802A' stroke-width='0.5' opacity='0.08'/%3E%3Cpath d='M15 15 Q20 30 15 45' fill='none' stroke='%23AC802A' stroke-width='0.5' opacity='0.06'/%3E%3Cpath d='M45 15 Q50 30 45 45' fill='none' stroke='%23AC802A' stroke-width='0.5' opacity='0.06'/%3E%3C/svg%3E\")",
        
        'leaf-pattern-dense': "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 2 Q24 15 20 28 Q16 15 20 2' fill='none' stroke='%23AC802A' stroke-width='0.4' opacity='0.05'/%3E%3Cpath d='M5 10 Q10 20 5 30' fill='none' stroke='%23AC802A' stroke-width='0.4' opacity='0.04'/%3E%3Cpath d='M35 10 Q30 20 35 30' fill='none' stroke='%23AC802A' stroke-width='0.4' opacity='0.04'/%3E%3C/svg%3E\")",
        
        'dot-pattern': "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1' fill='%2351350C' opacity='0.03'/%3E%3C/svg%3E\")",
      },

      // ============================================
      // BACKGROUND SIZE
      // ============================================
      backgroundSize: {
        'pattern': '60px 60px',
        'pattern-dense': '40px 40px',
        'pattern-sm': '20px 20px',
      },

      // ============================================
      // Z-INDEX SCALE
      // ============================================
      zIndex: {
        '40': '40',
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },

      // ============================================
      // ASPECT RATIOS
      // ============================================
      aspectRatio: {
        'portrait': '3 / 4',
        'landscape': '16 / 9',
        'square': '1 / 1',
        'golden': '1.618 / 1',
        'wide': '21 / 9',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
