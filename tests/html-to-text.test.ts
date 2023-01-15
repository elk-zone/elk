import { describe, expect, it } from 'vitest'

describe('html-to-text', () => {
  it('inline code', () => {
    expect(htmlToText('<p>text <code>code</code> inline</p>'))
      .toMatchInlineSnapshot('"text `code` inline"')
  })

  it('code block', () => {
    expect(htmlToText('<p>text </p><pre><code class="language-js">code</code></pre>'))
      .toMatchInlineSnapshot(`
      "text 
      \`\`\`js
      code
      \`\`\`"
    `)
  })

  it('bold & italic', () => {
    expect(htmlToText('<p>text <b>bold</b> <em>italic</em></p>'))
      .toMatchInlineSnapshot('"text **bold** *italic*"')
  })
})
