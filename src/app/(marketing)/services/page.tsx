import PageIntro from '@/components/marketing/PageIntro'
import ServicesSection from '@/components/marketing/ServicesSection'
import ConsultationCTA from '@/components/marketing/ConsultationCTA'

export default function ServicesPage() {
  return (
    <>
      <PageIntro
        eyebrow="Our care"
        title="Your health. Your path forward."
        description="Explore consultations and care for fertility, sexual health and everyday wellbeing. Every treatment plan begins with understanding you."
      />
      <ServicesSection />
      <ConsultationCTA />
    </>
  )
}
