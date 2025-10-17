import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function PlacePage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const { data: place } = await supabase
    .from('places')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!place) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition"
        >
          <span className="text-xl">←</span>
          <span>Back to all places</span>
        </Link>
      </div>

      <article className="max-w-4xl mx-auto px-4 pb-12">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          
          <div className="h-64 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="text-6xl mb-4">
                {place.category === 'Cafe' && '☕'}
                {place.category === 'Bar' && '🍺'}
                {place.category === 'Restaurant' && '🍽️'}
                {place.category === 'Spa' && '♨️'}
              </div>
              <p className="text-sm opacity-80">Photo coming soon</p>
            </div>
          </div>

          <div className="p-8">
            <h1 className="text-5xl font-bold mb-4 text-gray-900">
              {place.name}
            </h1>

            <div className="flex items-center gap-6 mb-8 pb-6 border-b">
              <div className="flex items-center gap-2">
                <span className="text-yellow-500 text-4xl">★</span>
                <div>
                  <div className="text-3xl font-bold">{place.google_rating}</div>
                  <div className="text-sm text-gray-500">out of 5.0</div>
                </div>
              </div>
              
              <span className="bg-blue-100 text-blue-800 px-5 py-2 rounded-full font-semibold text-lg">
                {place.category}
              </span>
            </div>

            <div className="mb-8 p-6 bg-gray-50 rounded-xl">
              <h2 className="font-semibold text-xl mb-3 flex items-center gap-2">
                <span className="text-2xl">📍</span>
                <span>Location</span>
              </h2>
              <p className="text-gray-700 text-lg">{place.address}</p>
            </div>

            <div className="mb-8">
              <h2 className="font-semibold text-2xl mb-4">About this place</h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {place.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address || place.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition font-semibold text-lg text-center"
              >
                🗺️ Get Directions
              </a>
              
              <button className="flex-1 border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl hover:bg-blue-50 transition font-semibold text-lg">
                ❤️ Save for Later
              </button>
            </div>
          </div>
        </div>
      </article>
    </main>
  )
}