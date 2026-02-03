import {
  DefaultNodeTypes,
  SerializedBlockNode,
  type SerializedLinkNode,
} from '@payloadcms/richtext-lexical'
import {
  JSXConvertersFunction,
  LinkJSXConverter,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import type { QuoteBannerBlock as QuoteBannerBlockProps } from '@/payload-types'
import { QuoteBanner } from '@/blocks/QuoteBanner/Component'
import React from 'react'

type NodeTypes = DefaultNodeTypes | SerializedBlockNode<QuoteBannerBlockProps>

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!
  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }
  const slug = value.slug
  return relationTo === 'news' ? `/news/${slug}` : `/${slug}`
}

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
  blocks: {
    quoteBanner: ({ node }) => <QuoteBanner {...node.fields} />,
  },
})

type Props = {
  data: SerializedEditorState
} & React.HTMLAttributes<HTMLDivElement>

export const RichText: React.FC<Props> = ({ data, ...props }) => {
  if (!data) {
    return null
  }

  return (
    <div {...props}>
      <ConvertRichText converters={jsxConverters} data={data} />
    </div>
  )
}
