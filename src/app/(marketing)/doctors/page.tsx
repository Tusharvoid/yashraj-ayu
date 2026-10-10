import ClinicalTeamSection from '@/components/marketing/ClinicalTeamSection'
import PageIntro from '@/components/marketing/PageIntro'
import ConsultationCTA from '@/components/marketing/ConsultationCTA'

export default function DoctorsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Our doctors"
        title="People behind your care."
        description="Meet the doctors and supporting clinicians connected to Yashraj Clinic, from general consultations and specialist referrals to physiotherapy and yoga."
      />
      <ClinicalTeamSection />
      <ConsultationCTA />
    </>
  )
}
