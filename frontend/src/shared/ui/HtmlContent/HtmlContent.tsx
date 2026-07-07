import MarkdownIt from 'markdown-it'
import DOMPurify from 'dompurify'

const md = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true
})

function HtmlContent({ markdown }: { markdown: string }) {
  const html = DOMPurify.sanitize(md.render(markdown))
  
  return <div className='html-content' dangerouslySetInnerHTML={{ __html: html }} />
}

export default HtmlContent