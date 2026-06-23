import { useState } from 'react'
import './Menu.scss'
import { useDishes, useDishFilters, type Dish, type DishFilters, type DishRef } from '@/entities/Dish'

function DishCard({ dish }: { dish: Dish }) {
  return (
    <div className='menu__card'>
      <div className='menu__card-present-block'>
        <img className='menu__card-image' src={dish.images[0]} alt={dish.name} />
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
  )
}

function FilterGroup({ title, options, isActive, onSelect, className }: {
  title: string
  options: DishRef[]
  isActive: (slug: string) => boolean
  onSelect: (slug: string) => void
  className: string
}) {
  return (
    <div className={`menu__filter-type ${className}`}>
      <h4 className='menu__filter-title'>
        {title}
      </h4>
      <div className='menu__billets'>
        {options.map((option) => (
          <div
            key={option.slug}
            className={`menu__billet ${isActive(option.slug) ? 'menu__billet--active' : ''}`}
            onClick={() => onSelect(option.slug)}
          >
            {option.name}
          </div>
        ))}
      </div>
    </div>
  )
}

function toggleInArray(arr: string[], slug: string): string[] {
  return arr.includes(slug) ? arr.filter((s) => s !== slug) : [...arr, slug]
}

function Menu() {
  const [filters, setFilters] = useState<DishFilters>({ tags: [], allergens: [] })
  const { data: dishes, isLoading, isError } = useDishes(filters)
  const { data: options } = useDishFilters()

  const selectCategory = (slug?: string) =>
    setFilters((filter) => ({
      ...filter,
      category: slug
    }))
  const toggleTag = (slug: string) =>
    setFilters((filter) => ({
      ...filter,
      tags: toggleInArray(filter.tags, slug)
    }))
  const toggleAllergen = (slug: string) =>
    setFilters((filter) => ({
      ...filter,
      allergens: toggleInArray(filter.allergens, slug)
    }))
  const toggleSort = () =>
    setFilters((filter) => ({
      ...filter,
      sort: filter.sort === 'price_asc' ? 'price_desc' : 'price_asc'
    }))

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
              <div
                className={`menu__billet ${!filters.category ? 'menu__billet--active' : ''}`}
                onClick={() => selectCategory(undefined)}
              >
                all
              </div>
              {options?.categories.map((category) => (
                <div
                  key={category.slug}
                  className={`menu__billet ${filters.category === category.slug ? 'menu__billet--active' : ''}`}
                  onClick={() => selectCategory(category.slug)}
                >
                  {category.name}
                </div>
              ))}
            </div>
          </div>

          <FilterGroup
            title='Tags'
            className='menu__filter-tags'
            options={options?.tags ?? []}
            isActive={(s) => filters.tags.includes(s)}
            onSelect={toggleTag}
          />

          <FilterGroup
            title='Allergens'
            className='menu__filter-allergens'
            options={options?.allergens ?? []}
            isActive={(s) => filters.allergens.includes(s)}
            onSelect={toggleAllergen}
          />

          <div className='menu__filter-type menu__filter-sort'>
            <h4 className='menu__filter-title'>
              Sort
            </h4>
            <button type='button' className='menu__sort-type' onClick={toggleSort}>
              {filters.sort === 'price_desc' ? 'Price: High to Low' : 'Price: Low to High'}
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
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Menu
