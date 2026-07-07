import { useState, type MouseEvent } from 'react'
import Arrow from '@/assets/svg/arrow.svg?react'
import './DishImages.scss'

function DishImages({ images, alt, variant = 'card' }: {
  images: string[]
  alt: string
  variant?: 'card' | 'modal'
}) {
  const [index, setIndex] = useState(0)
  if (!images.length) {
    return null
  }

  const step = (event: MouseEvent, delta: number) => {
    event.stopPropagation()
    setIndex((current) => (current + delta + images.length) % images.length)
  }

  return (
    <div className={`dish-images dish-images--${variant}`}>
      {images.length > 1 &&
        <button type='button' className='dish-images__arrow' onClick={(event) => step(event, -1)}>
          <Arrow />
        </button>
      }
      <img className='dish-images__img' src={images[index]} alt={alt} />
      {images.length > 1 &&
        <button type='button' className='dish-images__arrow dish-images__arrow--next' onClick={(event) => step(event, 1)}>
          <Arrow />
        </button>
      }
    </div>
  )
}

export default DishImages
