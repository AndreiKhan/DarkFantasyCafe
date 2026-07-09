import { useState } from 'react'
import { useFaqList } from '@/entities/Faq'
import SectionDecoratedTitle from '@/shared/ui/SectionDecoratedTitle/SectionDecoratedTitle'
import { HtmlContent } from '@/shared/ui'
import './Faq.scss'

function Faq() {
  const { data } = useFaqList()
  const [openId, setOpenId] = useState<string | null>(null)

  if (!data || data.length === 0) {
    return null
  }

  return (
    <section className='faq' aria-labelledby='faq-title'>
      <div className='center'>
        <SectionDecoratedTitle title='FAQ' />

        <div className='faq__questions' role='list'>
          {data.map((item) => {
            const opened = openId === item.id
            return (
              <div className='faq__question' role='listitem' key={item.id}>
                <div
                  className='faq__question__header'
                  onClick={() => setOpenId(opened ? null : item.id)}
                >
                  <p className='faq__question__name'>
                    {item.title}
                  </p>
                  <div className={`faq__question__switch ${opened ? 'faq__question__switch--opened' : ''}`} aria-hidden='true' />
                </div>
                {opened && (
                  <div className='faq__question__answer'>
                    <HtmlContent markdown={item.description} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Faq
