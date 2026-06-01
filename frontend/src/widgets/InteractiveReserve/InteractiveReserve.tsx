import './InteractiveReserve.scss'

function InteractiveReserve() {
  return (
    <section className='interactive-reserve'>
      <div className='center'>
        <h2 className='interactive-reserve__title'>
          Reserve your table
        </h2>
        <form className='interactive-reserve__filters'>
          <div className='interactive-reserve__filter'>
            <label className='interactive-reserve__label' htmlFor="">
              Date
            </label>
            <input className='interactive-reserve__input' type="date" />
          </div>
          <div className='interactive-reserve__filter'>
            <label className='interactive-reserve__label' htmlFor="">
              Time
            </label>
            <input className='interactive-reserve__input' type="time" />
          </div>
          <div className='interactive-reserve__filter'>
            <label className='interactive-reserve__label' htmlFor="">
              Guests
            </label>
            <input className='interactive-reserve__input' type="number" />
          </div>
          <div className='interactive-reserve__filter'>
            <label className='interactive-reserve__label' htmlFor="">
              Table
            </label>
            <input className='interactive-reserve__input' type="number" />
          </div>
          <button className='interactive-reserve__reserve' type='button'>
            RESERVE
          </button>
        </form>
        <div className='interactive-reserve__statuses'>
          <div className='interactive-reserve__status'>
            <div className='interactive-reserve__status-color' />
            <p className='interactive-reserve__status-name'>
              Free
            </p>
          </div>
          <div className='interactive-reserve__status'>
            <div className='interactive-reserve__status-color' />
            <p className='interactive-reserve__status-name'>
              Occupied
            </p>
          </div>
        </div>
        <div className='interactive-reserve__map'>
          MAP
        </div>
      </div>
    </section>
  )
}

export default InteractiveReserve
