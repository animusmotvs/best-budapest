import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default async function Home() {
  // Adatok lekérése Supabase-ből
  const { data: places, error } = await supabase
    .from('places')
    .select('*')
    .order('google_rating', { ascending: false })

  if (error) {
    console.error('Error:', error)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900">
            🏛️ Best Budapest
          </h1>
          <p className="text-gray-600 mt-2">
            Discover the best places in Budapest
          </p>
        </div>
      </header>

      {/* Helyek listája */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Top Rated Places</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {places?.map((place) => (
            <Link 
              key={place.id}
              href={`/place/${place.slug}`}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
            >
              <div className="p-6">
                <h3 className="font-bold text-xl mb-3 group-hover:text-blue-600 transition">
                  {place.name}
                </h3>
                
                {/* Értékelés */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-yellow-500 text-2xl">★</span>
                  <span className="font-bold text-xl">{place.google_rating}</span>
                  <span className="text-gray-500 text-sm">/ 5.0</span>
                </div>

                {/* Kategória */}
                <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mb-3">
                  {place.category}
                </span>

                {/* Cím */}
                <p className="text-gray-600 text-sm mb-3">
                  📍 {place.address}
                </p>

                {/* Leírás */}
                <p className="text-gray-700 line-clamp-3">
                  {place.description}
                </p>

                {/* CTA */}
                <div className="mt-4 text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                  Read more →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}