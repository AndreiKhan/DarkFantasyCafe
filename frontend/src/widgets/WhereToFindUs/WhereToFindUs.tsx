import './WhereToFindUs.scss'

function WhereToFindUs() {
  return (
    <section className='where-to-find-us'>
      <div className='center'>
        <h2 className='where-to-find-us__title'>
          Where to find us
        </h2>
        <div className='where-to-find-us__content'>
          <div className='where-to-find-us__map'>
            YANDEX MAP
          </div>
          <div className='where-to-find-us__info'>
            <h3 className='where-to-find-us__header'>
              Visit us
            </h3>
            <div className='where-to-find-us__info-list'>
              <div className='where-to-find-us__item'>
                <div className='where-to-find-us__svg'>
                  svg
                </div>
                <div className='where-to-find-us__description'>
                  <h5 className='where-to-find-us__name'>
                    address
                  </h5>
                  <p className='where-to-find-us__text'>
                    text
                  </p>
                </div>
              </div>
              <div className='where-to-find-us__item'>
                <div className='where-to-find-us__svg'>
                  svg
                </div>
                <div className='where-to-find-us__description'>
                  <h5 className='where-to-find-us__name'>
                    phone
                  </h5>
                  <p className='where-to-find-us__text'>
                    text
                  </p>
                </div>
              </div>
              <div className='where-to-find-us__item'>
                <div className='where-to-find-us__svg'>
                  svg
                </div>
                <div className='where-to-find-us__description'>
                  <h5 className='where-to-find-us__name'>
                    hours
                  </h5>
                  <p className='where-to-find-us__text'>
                    text
                  </p>
                </div>
              </div>
            </div>
            <div className='where-to-find-us__divider' />
            <h4 className='where-to-find-us__subtitle'>
              Leave a request
            </h4>
            <form className='where-to-find-us__contact-form'>
              <input type="date" className='where-to-find-us__input' />
              <input type="date" className='where-to-find-us__input' />
              <textarea className='where-to-find-us__textarea'>
                message
              </textarea>
              <button className='where-to-find-us__button'>
                Send raven
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhereToFindUs
