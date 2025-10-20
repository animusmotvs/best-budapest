import { supabase } from '@/lib/supabase'
import { getPlaceDetailImage } from '@/lib/unsplash'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import FavoriteButton from '@/components/FavoriteButton'

export default async function PlacePage({
  params 
}: {
  params: { slug: string }
}) {
  // Konkrét hely lekérése
  const { data: place } = await supabase
    .from('places')
    .select('*')
    .eq('slug', params.slug)
    .single()

  // Ha nem találjuk, 404
  if (!place) {
    notFound()
  }

  // Kép lekérése Unsplash-ből (2. kép)
  const imageUrl = await getPlaceDetailImage(place.name, place.category)

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Vissza gomb */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-2"
        >
          ← Back to all places
        </Link>
      </div>

      {/* Hely részletei */}
      <article className="max-w-4xl mx-auto px-4 pb-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          
          {/* HERO KÉP */}
          {imageUrl && (
            <div className="h-96 relative">
              <Image
                src={imageUrl}
                alt={place.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 896px"
                priority
              />
            </div>
          )}

          <div className="p-8">
            {/* Név */}
            <h1 className="text-5xl font-bold mb-6 text-gray-900">
              {place.name}
            </h1>

            {/* Értékelés és kategória */}
            <div className="flex flex-wrap items-center gap-6 mb-8">
              {place.google_rating && (
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500 text-3xl">★</span>
                  <span className="text-3xl font-bold">{place.google_rating}</span>
                  <span className="text-gray-500">/ 5.0</span>
                </div>
              )}
              
              <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold">
                {place.category}
              </span>

              {place.cuisine && (
                <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full font-semibold">
                  {place.cuisine} Cuisine
                </span>
              )}
            </div>

            {/* Cím */}
            {place.address && (
              <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                <h2 className="font-semibold text-lg mb-2">📍 Address</h2>
                <p className="text-gray-700">{place.address}</p>
              </div>
            )}

            {/* Leírás */}
            {place.description && (
              <div className="mb-8">
                <h2 className="font-semibold text-2xl mb-4">About this place</h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {place.description}
                </p>
              </div>
            )}

            {/* Gombok */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Get Directions - MŰKÖDŐ LINK! */}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address || place.name + ', Budapest')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition font-semibold text-lg text-center inline-flex items-center justify-center gap-2"
              >
                📍 Get Directions
              </a>
              
              {/* Save for Later - MŰKÖDŐ KEDVENC GOMB! */}
              <FavoriteButton 
                placeId={place.id} 
                variant="button"
                className="flex-1"
              />
            </div>

            {/* Extra Info */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Quick Info */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-gray-900">Quick Info</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <span className="text-blue-600">✓</span>
                      <span>Category: {place.category}</span>
                    </li>
                    {place.cuisine && (
                      <li className="flex items-center gap-2">
                        <span className="text-blue-600">✓</span>
                        <span>Cuisine: {place.cuisine}</span>
                      </li>
                    )}
                    {place.google_rating && (
                      <li className="flex items-center gap-2">
                        <span className="text-blue-600">✓</span>
                        <span>Rating: {place.google_rating}/5.0</span>
                      </li>
                    )}
                  </ul>
                </div>

                {/* Visit Tips */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-gray-900">Visit Tips</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">💡</span>
                      <span>Check opening hours before visiting</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">💡</span>
                      <span>Reservations recommended for weekends</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">💡</span>
                      <span>Located in central Budapest</span>
                    </li>
                  </ul>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Similar Places (opcionális - később) */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Similar Places</h2>
          <p className="text-gray-600">More recommendations coming soon...</p>
        </div>
      </article>
    </main>
  )
}
