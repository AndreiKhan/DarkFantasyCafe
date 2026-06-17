import './Menu.scss'
import { useDishes } from '@/entities/Dish'

function DishCard({dish}) {
  return (
    <>
      <div key={dish.id} className='menu__card'>
        <div className='menu__card-present-block'>
          <img className='menu__card-image' src={dish.image} />
        </div>
        <div className='menu__card-info'>
          <h5 className='menu__card-title'>
            {dish.name}
          </h5>
          <p className='menu__card-description'>
            {dish.description}
          </p>
          <p className='menu__card-price'>
            {dish.price} ₽
          </p>
        </div>
      </div>
    </>
  )
}

function Menu() {
  const { data: dishes, isLoading, isError } = useDishes()

  return (
    <section className='menu'>
      <div className='center'>
        <div className='menu__header'>
          <h2 className='menu__title'>
            Menu
          </h2>
        </div>
        <form className='menu__filter'>
          <div className='menu__filter-type menu__filter-categories'>
            <h4 className='menu__filter-title'>
              Categories
            </h4>
            <div className='menu__billets'>
              <div className='menu__billet menu__billet--active'>
                all
              </div>
              <div className='menu__billet'>
                Food
              </div>
            </div>
          </div>
          <div className='menu__filter-type menu__filter-tags'>
            <h4 className='menu__filter-title'>
              Tags
            </h4>
            <div className='menu__billets'>
              <div className='menu__billet menu__billet--active'>
                Spicy
              </div>
              <div className='menu__billet'>
                Cold
              </div>
            </div>
          </div>
          <div className='menu__filter-type menu__filter-sort'>
            <h4 className='menu__filter-title'>
              Sort
            </h4>
            <button className='menu__sort-type'>
              Price: Low to High
            </button>
          </div>
        </form>
        <div className='menu__cards'>
          {isLoading &&
            <p>isLoading</p>
          }
          {isError &&
            <p>isError</p>
          }
          {dishes?.map((dish) => (
            <DishCard dish={dish} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Menu
