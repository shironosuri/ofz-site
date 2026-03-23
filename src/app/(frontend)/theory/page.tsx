import { articleListingPage, generateListingMetadata } from '@/app/(frontend)/_articles/shared'

const CATEGORY = 'theory' as const

export default function Page() {
  return articleListingPage({ category: CATEGORY })
}

export const generateMetadata = () => generateListingMetadata(CATEGORY)
