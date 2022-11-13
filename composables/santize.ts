import SanitizeHTML from 'sanitize-html'

export function sanitize(text: string) {
  return SanitizeHTML(text, {
    allowedAttributes: {
      a: ['href', 'name', 'target', 'class'],
      span: ['class'],
      img: ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading'],
    },
  })
}
