import './Hero.scss'

function Hero() {
  return (
    <section className='hero'>
      <div className='center'>
        <div className='hero__description'>
          <h1 className='hero__title'>
            main title
          </h1>
          <h3 className='hero__subtitle'>
            subtitle
          </h3>
          <button className='hero__main-button' type='button'>
            Take a seat
          </button>
        </div>
      </div>
    </section>
  )
}

export default Hero
