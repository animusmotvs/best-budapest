import { supabase } from '@/lib/supabase'
import { getPlaceDetailImage } from '@/lib/unsplash' // ← getPlaceDetailImage!
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

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

  // Kép lekérése Unsplash-ből
  // Kép lekérése Unsplash-ből (2. kép)
const imageUrl = await getPlaceDetailImage(place.name, place.category)

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Vissza gomb */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-800 font-semibold"
        >
          ← Back to all places
        </Link>
      </div>

      {/* Hely részletei */}
      <article className="max-w-4xl mx-auto px-4 pb-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          
          {/* HERO KÉP - ÚJ! */}
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
            <div className="flex items-center gap-6 mb-8">
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
            <div className="flex gap-4">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition font-semibold text-lg">
                Get Directions
              </button>
              <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition font-semibold text-lg">
                Save for Later
              </button>
            </div>
          </div>
        </div>
      </article>
    </main>
  )
}
