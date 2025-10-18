'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { getPlaceImage } from '@/lib/unsplash'

interface Place {
  id: string
  name: string
  category: string
  address: string | null
  google_rating: number | null
  description: string | null
  slug: string
  imageUrl?: string | null
}

const CATEGORIES = ['All', 'Cafe', 'Restaurant', 'Bar', 'Spa', 'Museum', 'Bakery', 'Market', 'Memorial', 'Attraction', 'District']

export default function HomePage() {
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [minRating, setMinRating] = useState(0)

  // Adatok lekérése Supabase-ből + képek Unsplash-ből
  useEffect(() => {
    async function fetchPlaces() {
      setLoading(true)
      const { data, error } = await supabase
        .from('places')
        .select('*')
        .order('google_rating', { ascending: false })

      if (error) {
        console.error('Error fetching places:', error)
        setLoading(false)
        return
      }

      // Képek lekérése minden helyhez
      const placesWithImages = await Promise.all(
        (data || []).map(async (place) => {
          const imageUrl = await getPlaceImage(place.name, place.category)
          return { ...place, imageUrl }
        })
      )

      setPlaces(placesWithImages)
      setLoading(false)
    }

    fetchPlaces()
  }, [])

  // Szűrés logika
  const filteredPlaces = useMemo(() => {
    return places.filter(place => {
      const matchesSearch = searchQuery === '' || 
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (place.address && place.address.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (place.description && place.description.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = selectedCategory === 'All' || place.category === selectedCategory
      const matchesRating = !place.google_rating || place.google_rating >= minRating

      return matchesSearch && matchesCategory && matchesRating
    })
  }, [places, searchQuery, selectedCategory, minRating])

  // Loading állapot
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-xl text-gray-600">Loading amazing places...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      
      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            🏛️ Budapest Prime
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Discover the best things to do in Budapest, scored by public reviews and expert tastings
          </p>

          {/* KERESŐSÁV */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 Search places, categories, neighborhoods..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 rounded-full text-gray-900 text-lg shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-300 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SZŰRŐK SECTION */}
      <section className="bg-white shadow-md sticky top-0 z-10 py-4 border-b">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Kategória Chipek */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Categories</h3>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category === 'All' && '✨'} {category}
                </button>
              ))}
            </div>
          </div>

          {/* Értékelés Szűrők */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Minimum Rating</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setMinRating(0)}
                className={`px-4 py-2 rounded-full font-medium transition ${
                  minRating === 0
                    ? 'bg-yellow-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setMinRating(4.0)}
                className={`px-4 py-2 rounded-full font-medium transition ${
                  minRating === 4.0
                    ? 'bg-yellow-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ⭐ 4.0+
              </button>
              <button
                onClick={() => setMinRating(4.5)}
                className={`px-4 py-2 rounded-full font-medium transition ${
                  minRating === 4.5
                    ? 'bg-yellow-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ⭐ 4.5+
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* RESULTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Results Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            {filteredPlaces.length} Places Found
          </h2>
          {(searchQuery || selectedCategory !== 'All' || minRating > 0) && (
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('All')
                setMinRating(0)
              }}
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Places Grid */}
        {filteredPlaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPlaces.map((place) => (
              <Link 
                key={place.id}
                href={`/place/${place.slug}`}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
              >
                {/* Image */}
                <div className="h-48 relative overflow-hidden">
                  {place.imageUrl ? (
                    <Image
                      src={place.imageUrl}
                      alt={place.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="h-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                      <span className="text-6xl">
                        {place.category === 'Cafe' && '☕'}
                        {place.category === 'Bar' && '🍺'}
                        {place.category === 'Restaurant' && '🍽️'}
                        {place.category === 'Spa' && '♨️'}
                        {place.category === 'Museum' && '🏛️'}
                        {place.category === 'Bakery' && '🥐'}
                        {place.category === 'Market' && '🛒'}
                        {!['Cafe', 'Bar', 'Restaurant', 'Spa', 'Museum', 'Bakery', 'Market'].includes(place.category) && '📍'}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-xl mb-3 group-hover:text-blue-600 transition">
                    {place.name}
                  </h3>
                  
                  {/* Rating */}
                  {place.google_rating && (
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-yellow-500 text-2xl">★</span>
                      <span className="font-bold text-xl">{place.google_rating}</span>
                      <span className="text-gray-500 text-sm">/ 5.0</span>
                    </div>
                  )}

                  {/* Category Badge */}
                  <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mb-3">
                    {place.category}
                  </span>

                  {/* Address */}
                  {place.address && (
                    <p className="text-gray-600 text-sm mb-3">
                      📍 {place.address}
                    </p>
                  )}

                  {/* Description */}
                  {place.description && (
                    <p className="text-gray-700 line-clamp-2">
                      {place.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No places found</h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your filters or search query
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('All')
                setMinRating(0)
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
            >
              Clear all filters
            </button>
          </div>
        )}
      </section>
    </main>
  )
}