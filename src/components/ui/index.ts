// ============================================
// BEAUTÉ DESIGN SYSTEM - Component Exports
// ============================================

// Button Components
export { ButtonLuxury, buttonLuxuryVariants } from './button-luxury'
export type { ButtonLuxuryProps } from './button-luxury'

// Card Components
export {
  CardLuxury,
  CardHeader,
  CardTitle,
  CardSubtitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardImage,
  CardImageHover,
  CardBadge,
  cardVariants,
} from './card-luxury'

// Section Components
export {
  SectionHeader,
  SectionDivider,
  SectionContainer,
} from './section-header'

// Service Components
export { ServiceCard } from './service-card'
export type { ServiceCardProps } from './service-card'

// Booking Components
export { BookingCalendar } from './booking-calendar'
export type { BookingCalendarProps, TimeSlot } from './booking-calendar'

// Re-export shadcn components for convenience
export { Button, buttonVariants } from './button'
export { Calendar } from './calendar'
export { Card, CardHeader as CardHeaderBase, CardFooter as CardFooterBase, CardTitle as CardTitleBase, CardDescription as CardDescriptionBase, CardContent as CardContentBase } from './card'
export { Input } from './input'
export { Label } from './label'
export { Toaster } from './sonner'
