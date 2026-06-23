import type { Metadata } from 'next'
import PsychologistsPage from '@/components/pages/psychologists-page'
import { requirePageSession } from '@/lib/session'

type Props = {
  searchParams: Promise<{ location?: string }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { location } = await searchParams

  if (location) {
    return {
      title: `Psychologists in ${location} — Mindwell`,
      description: `Find licensed psychologists and mental health professionals in ${location}. Search by location to connect with professional support near you through Mindwell.`,
      openGraph: {
        title: `Psychologists in ${location} — Mindwell`,
        description: `Find licensed psychologists near ${location}. Professional mental health support, softly held.`,
      },
    }
  }

  return {
    title: 'Find a Psychologist Near You — Mindwell',
    description:
      'Search for licensed psychologists and mental health professionals in your area. Find professional support near you with Mindwell.',
    openGraph: {
      title: 'Find a Psychologist Near You — Mindwell',
      description: 'Search for licensed psychologists and mental health professionals in your area.',
    },
  }
}

export default async function Page({ searchParams }: Props) {
  await requirePageSession()
  const { location } = await searchParams

  return <PsychologistsPage initialLocation={location ?? null} />
}
