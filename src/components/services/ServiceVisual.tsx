import Image from 'next/image'
import { House, MonitorSmartphone, Stethoscope, TestTubeDiagonal, type LucideIcon } from 'lucide-react'
import { cn, type ServiceIconName, type ServiceItem, type ServiceVisualTone } from '@/lib/utils'

const serviceIcons: Record<ServiceIconName, LucideIcon> = {
  stethoscope: Stethoscope,
  'test-tube-diagonal': TestTubeDiagonal,
  house: House,
  'monitor-smartphone': MonitorSmartphone,
}

const toneClasses: Record<ServiceVisualTone, string> = {
  sage: 'bg-[linear-gradient(135deg,#edf5ef_0%,#d7e8dd_100%)]',
  linen: 'bg-[linear-gradient(135deg,#faf4ea_0%,#eee1cd_100%)]',
  gold: 'bg-[linear-gradient(135deg,#fbf5e7_0%,#f0ddb2_100%)]',
  mist: 'bg-[linear-gradient(135deg,#eef3f1_0%,#dde7e2_100%)]',
}

type ServiceVisualProps = {
  service: ServiceItem
  sizes: string
  className?: string
  imageClassName?: string
  iconCardClassName?: string
  iconClassName?: string
  decorated?: boolean
}

export default function ServiceVisual({
  service,
  sizes,
  className,
  imageClassName,
  iconCardClassName,
  iconClassName,
  decorated = true,
}: ServiceVisualProps) {
  if (service.visual.type === 'image') {
    return (
      <div className={cn('relative overflow-hidden bg-surface', className)}>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(0,0,0,0.08))]" />
        <Image
          src={service.visual.src}
          alt={service.visual.alt ?? service.name}
          fill
          sizes={sizes}
          className={cn(
            service.visual.fit === 'contain' ? 'object-contain' : 'object-cover',
            service.slug === 'general-physician-consultation' ? 'object-center' : '',
            imageClassName
          )}
        />
      </div>
    )
  }

  const Icon = serviceIcons[service.visual.icon]

  return (
    <div className={cn('relative overflow-hidden bg-surface', className)}>
      <div className={cn('absolute inset-0', toneClasses[service.visual.tone])} />
      {decorated ? <div className="absolute inset-[14%] rounded-[1.5rem] border border-white/55" /> : null}
      <div className="relative flex h-full items-center justify-center p-3">
        <div
          className={cn(
            'flex aspect-square w-full max-w-[5.5rem] items-center justify-center rounded-[1.4rem] border border-white/70 bg-white/90 shadow-[0_14px_30px_-24px_rgba(28,28,28,0.38)]',
            iconCardClassName
          )}
        >
          <Icon className={cn('h-10 w-10 text-primary', iconClassName)} />
        </div>
      </div>
    </div>
  )
}
