export interface Place {
  id: string
  name: string
  category: string
  address: string | null
  google_rating: number | null
  description: string | null
  slug: string
  created_at: string
}