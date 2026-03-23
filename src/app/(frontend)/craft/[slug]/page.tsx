import { articleDetailPage, generateArticleMetadata, generateArticleStaticParams } from '@/app/(frontend)/_articles/shared'

const CATEGORY = 'craft' as const

export default function Page({ params }: { params: { slug: string } }) {
  return articleDetailPage({ params: Promise.resolve(params), category: CATEGORY })
}

export const generateMetadata = async (props: { params: { slug: string } }) => generateArticleMetadata({ params: Promise.resolve(props.params), category: CATEGORY })

export const generateStaticParams = () => generateArticleStaticParams(CATEGORY)
