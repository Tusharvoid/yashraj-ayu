import Link from 'next/link'

export default function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <section className="clinic-page-intro">
      <div className="clinic-container">
        <nav aria-label="Breadcrumb" className="clinic-breadcrumb">
          <Link href="/clinic">Home</Link>
          <span aria-hidden="true">/</span>
          <span>{eyebrow}</span>
        </nav>
        <p className="clinic-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="clinic-lead">{description}</p>
      </div>
    </section>
  )
}
