import { createApi } from 'unsplash-js'

export const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || '',
})

// Kép keresése hely alapján (FŐOLDALHOZ - mindig az első kép)
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

// ÚJ FUNKCIÓ: Részletes oldalhoz (MINDIG A 2. KÉP!)
export async function getPlaceDetailImage(placeName: string, category: string) {
  try {
    const query = `budapest ${category.toLowerCase()} ${placeName.toLowerCase()}`
    const result = await unsplash.search.getPhotos({
      query,
      perPage: 3, // Kérünk legalább 3 képet
      orientation: 'landscape',
    })

    // Ha van legalább 2 kép, visszaadjuk a 2.-at (index 1)
    if (result.response && result.response.results.length > 1) {
      return result.response.results[1].urls.regular // ← 2. KÉP!
    }
    
    // Ha csak 1 kép van, akkor az első (de ez ritka)
    if (result.response && result.response.results.length > 0) {
      return result.response.results[0].urls.regular
    }

    // Fallback: kategória alapján
    const fallbackResult = await unsplash.search.getPhotos({
      query: `${category.toLowerCase()} interior`,
      perPage: 3,
      orientation: 'landscape',
    })

    if (fallbackResult.response && fallbackResult.response.results.length > 1) {
      return fallbackResult.response.results[1].urls.regular
    }

    return null
  } catch (error) {
    console.error('Error fetching detail image:', error)
    return null
  }
}
