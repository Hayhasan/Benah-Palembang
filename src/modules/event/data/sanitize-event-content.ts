import "server-only"

import sanitizeHtml from "sanitize-html"

const EVENT_CONTENT_TAGS = [
  ...sanitizeHtml.defaults.allowedTags,
  "h1",
  "h2",
  "h3",
  "img",
  "video",
  "source",
  "iframe",
  "figure",
  "figcaption",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "hr",
]

export function sanitizeEventContent(content: string) {
  return sanitizeHtml(content, {
    allowedTags: EVENT_CONTENT_TAGS,
    allowedIframeHostnames: [
      "www.youtube.com",
      "youtube.com",
      "youtu.be",
      "www.youtube-nocookie.com",
    ],
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      "*": ["class", "style"],
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "title", "width", "height", "class", "style"],
      video: ["src", "controls", "width", "height", "class", "style"],
      iframe: [
        "src",
        "width",
        "height",
        "allowfullscreen",
        "allow",
        "frameborder",
        "class",
        "style",
      ],
      figure: ["class", "style"],
      figcaption: ["class", "style"],
      source: ["src", "type"],
      th: ["colspan", "rowspan", "class", "style"],
      td: ["colspan", "rowspan", "class", "style"],
      hr: ["class", "style"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedStyles: {
      "*": {
        "margin-left": [/^(?:auto|\d+(?:\.\d+)?(?:px|rem|em|%))$/],
        "margin-right": [/^(?:auto|\d+(?:\.\d+)?(?:px|rem|em|%))$/],
        margin: [
          /^(?:auto|\d+(?:\.\d+)?(?:px|rem|em|%))(?:\s+(?:auto|\d+(?:\.\d+)?(?:px|rem|em|%)))*$/,
        ],
        display: [/^(?:block|inline-block|flex|inline-flex)$/],
        "text-align": [/^(?:left|right|center|justify)$/],
        "max-width": [/^(?:none|100%|\d+(?:\.\d+)?(?:px|rem|em|%))$/],
        width: [/^(?:auto|100%|\d+(?:\.\d+)?(?:px|rem|em|%))$/],
        height: [/^(?:auto|100%|\d+(?:\.\d+)?(?:px|rem|em|%))$/],
      },
      img: {
        height: [/^(?:auto|\d+(?:\.\d+)?(?:px|rem|em|%))$/],
        width: [/^(?:auto|\d+(?:\.\d+)?(?:px|rem|em|%))$/],
        "max-width": [/^(?:none|100%|\d+(?:\.\d+)?(?:px|rem|em|%))$/],
      },
      video: {
        height: [/^(?:auto|\d+(?:\.\d+)?(?:px|rem|em|%))$/],
        width: [/^(?:auto|\d+(?:\.\d+)?(?:px|rem|em|%))$/],
      },
      iframe: {
        width: [/^(?:auto|100%|\d+(?:\.\d+)?(?:px|rem|em|%))$/],
        height: [/^(?:auto|100%|\d+(?:\.\d+)?(?:px|rem|em|%))$/],
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

export function eventContentHasText(content: string) {
  return sanitizeHtml(content, { allowedTags: [], allowedAttributes: {} })
    .replaceAll("&nbsp;", " ")
    .trim().length > 0
}
