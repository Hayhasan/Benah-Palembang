import "server-only"

import sanitizeHtml from "sanitize-html"

const ARTICLE_CONTENT_TAGS = [
  ...sanitizeHtml.defaults.allowedTags,
  "h1",
  "h2",
  "h3",
  "img",
  "video",
  "source",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
]

export function sanitizeArticleContent(content: string) {
  return sanitizeHtml(content, {
    allowedTags: ARTICLE_CONTENT_TAGS,
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      "*": ["class", "style"],
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "title", "width", "height", "class", "style"],
      video: ["src", "controls", "width", "height", "class", "style"],
      source: ["src", "type"],
      th: ["colspan", "rowspan", "class", "style"],
      td: ["colspan", "rowspan", "class", "style"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedStyles: {
      "*": {
        "margin-left": [/^\d+(?:\.\d+)?(?:px|rem|em|%)$/],
        "text-align": [/^(?:left|right|center|justify)$/],
      },
      img: {
        height: [/^\d+(?:\.\d+)?(?:px|rem|em|%)$/],
        width: [/^\d+(?:\.\d+)?(?:px|rem|em|%)$/],
      },
      video: {
        height: [/^\d+(?:\.\d+)?(?:px|rem|em|%)$/],
        width: [/^\d+(?:\.\d+)?(?:px|rem|em|%)$/],
      },
    },
    transformTags: {
      a: (_tagName, attributes) => ({
        tagName: "a",
        attribs: {
          ...attributes,
          rel: "noopener noreferrer",
        },
      }),
    },
  })
}

export function articleContentHasText(content: string) {
  return (
    sanitizeHtml(content, { allowedTags: [], allowedAttributes: {} })
      .replaceAll("&nbsp;", " ")
      .trim().length > 0
  )
}

export function calculateReadingTime(content: string) {
  const plainText = sanitizeHtml(content, {
    allowedTags: [],
    allowedAttributes: {},
  })
    .replaceAll("&nbsp;", " ")
    .trim()
  const wordCount = plainText.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(wordCount / 200))
}
