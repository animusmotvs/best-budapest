import { createApi } from 'unsplash-js'

export const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || '',
})

// Kép keresése hely alapján
export async function getPlaceImage(placeName: string, category: string) {
  try {
    const query = `budapest ${category.toLowerCase()} ${placeName.toLowerCase()}`
    const result = await unsplash.search.getPhotos({
      query,
      perPage: 1,
      orientation: 'landscape',
    })

    if (result.response && result.response.results.length > 0) {
      return result.response.results[0].urls.regular
    }
    
    // Fallback: csak kategória
    const fallbackResult = await unsplash.search.getPhotos({
      query: `${category.toLowerCase()} interior`,
      perPage: 1,
      orientation: 'landscape',
    })

    if (fallbackResult.response && fallbackResult.response.results.length > 0) {
      return fallbackResult.response.results[0].urls.regular
    }

    return null
  } catch (error) {
    console.error('Error fetching image:', error)
    return null
  }
}