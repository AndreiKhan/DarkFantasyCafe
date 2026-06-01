import './Faq.scss'

function Faq() {
  return (
    <section className='faq'>
      <div className='center'>
        <h2 className='faq__title'>
          Frequently asked questions
        </h2>
        <div className='faq__questions'>
          <div className='faq__question'>
            <div className='faq__question-header'>
              <p className='faq__question-name'>
                question
              </p>
              <div className='faq__question-svg'>
                +\-
              </div>
            </div>
            <div className='faq__question-answer'>
              answer
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Faq
