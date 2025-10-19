'use client'

import { useState, useEffect } from 'react'

interface FavoriteButtonProps {
  placeId: string
  className?: string
  variant?: 'icon' | 'button'
}

export default function FavoriteButton({ 
  placeId, 
  className = '',
  variant = 'icon'
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  // Betöltéskor ellenőrizzük, hogy kedvenc-e
  useEffect(() => {
    const favorites = getFavorites()
    setIsFavorite(favorites.includes(placeId))
  }, [placeId])

  // Kedvencek lekérése LocalStorage-ból
  const getFavorites = (): string[] => {
    if (typeof window === 'undefined') return []
    const favorites = localStorage.getItem('budapest-favorites')
    return favorites ? JSON.parse(favorites) : []
  }

  // Kedvencek mentése LocalStorage-ba
  const saveFavorites = (favorites: string[]) => {
    localStorage.setItem('budapest-favorites', JSON.stringify(favorites))
  }

  // Toggle kedvenc állapot
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault() // Ha Link-ben van, ne navigáljon
    e.stopPropagation() // Ne terjedjen tovább az esemény

    const favorites = getFavorites()
    
    if (isFavorite) {
      // Eltávolítás
      const newFavorites = favorites.filter(id => id !== placeId)
      saveFavorites(newFavorites)
      setIsFavorite(false)
    } else {
      // Hozzáadás
      const newFavorites = [...favorites, placeId]
      saveFavorites(newFavorites)
      setIsFavorite(true)
      
      // Animáció
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 300)
    }
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={toggleFavorite}
        className={`transition-all duration-200 ${isAnimating ? 'scale-125' : 'scale-100'} ${className}`}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <svg
          className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'fill-none text-gray-400 hover:text-red-400'}`}
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
      </button>
    )
  }

  // Button variant (nagyobb gomb)
  return (
    <button
      onClick={toggleFavorite}
      className={`flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold text-lg transition-all ${
        isFavorite
          ? 'bg-red-500 text-white hover:bg-red-600'
          : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
      } ${isAnimating ? 'scale-105' : 'scale-100'} ${className}`}
    >
      <svg
        className={`w-6 h-6 ${isFavorite ? 'fill-white' : 'fill-none'}`}
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
      {isFavorite ? 'Saved' : 'Save for Later'}
    </button>
  )
}

// Export utility funkciók
export const getFavoritesCount = (): number => {
  if (typeof window === 'undefined') return 0
  const favorites = localStorage.getItem('budapest-favorites')
  return favorites ? JSON.parse(favorites).length : 0
}

export const getAllFavorites = (): string[] => {
  if (typeof window === 'undefined') return []
  const favorites = localStorage.getItem('budapest-favorites')
  return favorites ? JSON.parse(favorites) : []
}