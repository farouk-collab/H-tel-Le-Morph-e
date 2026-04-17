import { useEffect } from 'react'

function ensureMeta(name, attribute = 'name') {
  let meta = document.head.querySelector(`meta[${attribute}="${name}"]`)
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute(attribute, name)
    document.head.appendChild(meta)
  }
  return meta
}

export default function Seo({ title, description }) {
  useEffect(() => {
    document.title = title

    const metaDescription = ensureMeta('description')
    metaDescription.setAttribute('content', description)

    const ogTitle = ensureMeta('og:title', 'property')
    ogTitle.setAttribute('content', title)

    const ogDescription = ensureMeta('og:description', 'property')
    ogDescription.setAttribute('content', description)

    const twitterTitle = ensureMeta('twitter:title')
    twitterTitle.setAttribute('content', title)

    const twitterDescription = ensureMeta('twitter:description')
    twitterDescription.setAttribute('content', description)
  }, [title, description])

  return null
}
