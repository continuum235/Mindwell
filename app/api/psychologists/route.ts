import { NextRequest, NextResponse } from 'next/server'
import { ensureApiSession } from '@/lib/session'
import type { Psychologist } from '@/types/app'

interface NominatimResult {
  lat: string
  lon: string
  display_name: string
}

interface OverpassElement {
  type: 'node' | 'way'
  id: number
  lat?: number
  lon?: number
  center?: { lat: number; lon: number }
  tags?: Record<string, string>
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function geocodeLocation(query: string): Promise<{ lat: number; lon: number; label: string } | null> {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`

  await sleep(1100)

  const res = await fetch(url, {
    headers: { 'User-Agent': 'MindwellApp/1.0' },
  })

  if (!res.ok) return null

  const data: NominatimResult[] = await res.json()
  if (data.length === 0) return null

  return {
    lat: Number.parseFloat(data[0].lat),
    lon: Number.parseFloat(data[0].lon),
    label: data[0].display_name,
  }
}

async function searchOverpass(lat: number, lon: number, radius = 5000): Promise<OverpassElement[]> {
  const query = `
    [out:json][timeout:25];
    (
      node["healthcare"="psychologist"](around:${radius},${lat},${lon});
      node["healthcare:speciality"="psychiatry"](around:${radius},${lat},${lon});
      node["healthcare:specialist"="psychiatrist"](around:${radius},${lat},${lon});
      node["amenity"="doctors"]["healthcare:speciality"="psychiatry"](around:${radius},${lat},${lon});
      way["healthcare"="psychologist"](around:${radius},${lat},${lon});
      way["healthcare:speciality"="psychiatry"](around:${radius},${lat},${lon});
    );
    out center tags;
  `

  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`

  const res = await fetch(url, {
    headers: { 'User-Agent': 'MindwellApp/1.0' },
  })

  if (!res.ok) throw new Error(`Overpass API error: ${res.status}`)

  const data: { elements: OverpassElement[] } = await res.json()
  return data.elements
}

function buildAddress(tags?: Record<string, string>): string {
  if (!tags) return ''

  const parts = [tags['addr:street'], tags['addr:housenumber'], tags['addr:city'], tags['addr:postcode']].filter(
    Boolean,
  )

  return parts.join(', ') || tags.address || ''
}

function formatType(tags?: Record<string, string>): string {
  if (!tags) return 'Healthcare'

  if (tags.healthcare === 'psychologist') return 'Psychologist'
  if (tags['healthcare:speciality'] === 'psychiatry') return 'Psychiatrist'
  if (tags['healthcare:specialist'] === 'psychiatrist') return 'Psychiatrist'
  if (tags.amenity === 'doctors') return 'Doctor'

  return 'Mental Health Professional'
}

function toPsychologist(element: OverpassElement): Psychologist | null {
  const tags = element.tags
  if (!tags) return null

  const name = tags.name || tags.operator || tags.organisation || 'Unknown'
  const lat = element.lat ?? element.center?.lat
  const lon = element.lon ?? element.center?.lon
  if (lat == null || lon == null) return null

  return {
    id: `${element.type}-${element.id}`,
    name,
    address: buildAddress(tags),
    phone: tags.phone || tags['contact:phone'],
    website: tags.website || tags['contact:website'],
    type: formatType(tags),
    lat,
    lon,
  }
}

export async function GET(request: NextRequest) {
  const { response } = await ensureApiSession()
  if (response) return response

  const location = request.nextUrl.searchParams.get('location')
  if (!location || location.trim().length === 0) {
    return NextResponse.json({ error: 'Location query is required' }, { status: 400 })
  }

  try {
    const geo = await geocodeLocation(location.trim())
    if (!geo) {
      return NextResponse.json({ error: 'Could not find that location. Try a different search.' }, { status: 404 })
    }

    const elements = await searchOverpass(geo.lat, geo.lon)
    const psychologists: Psychologist[] = elements.map(toPsychologist).filter((p): p is Psychologist => p !== null)

    return NextResponse.json({ location: geo.label, results: psychologists })
  } catch {
    return NextResponse.json(
      { error: 'Unable to search for psychologists right now. Please try again.' },
      { status: 500 },
    )
  }
}
