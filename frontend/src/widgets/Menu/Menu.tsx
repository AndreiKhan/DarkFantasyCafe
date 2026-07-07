import { useState } from 'react'
import './Menu.scss'
import { useTranslation } from 'react-i18next'
import { useDishes, useDishFilters, type Dish, type DishFilters, type DishRef, DishCard, DishImages } from '@/entities/Dish'
import { ErrorPlug, KeywordSearchField, Loader, Modal, Pagination } from '@/shared/ui'
import SectionDecoratedTitle from '@/shared/ui/SectionDecoratedTitle/SectionDecoratedTitle'

function FilterGroup({ title, options, isActive, onSelect, className }: {
  title: string
  options: DishRef[]
  isActive: (slug: string) => boolean
  onSelect: (slug: string) => void
  className: string
}) {
  const groupId = title.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={`menu__filter-type ${className}`} role='group' aria-labelledby={`menu-filter-${groupId}`}>
      <h4 className='menu__filter-title' id={`menu-filter-${groupId}`}>
        {title}
      </h4>
      <div className='menu__billets'>
        {options.map((option) => (
          <button
            key={option.slug}
            type='button'
            className={`menu__billet ${isActive(option.slug) ? 'menu__billet--active' : ''}`}
            aria-pressed={isActive(option.slug)}
            onClick={() => onSelect(option.slug)}
          >
            {option.name}
          </button>
        ))}
      </div>
    </div>
  )
}

function toggleInArray(arr: string[], slug: string): string[] {
  return arr.includes(slug) ? arr.filter((s) => s !== slug) : [...arr, slug]
}

function Menu({ dishQuantity, onQuantityChange, hideTitle = false }: {
  dishQuantity?: Record<string, number>
  onQuantityChange?: (dishId: string, quantity: number) => void
  hideTitle?: boolean
}) {
  const { t } = useTranslation('menu')
  const [filters, setFilters] = useState<DishFilters>({ tags: [], allergens: [] })
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null)
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
        {!hideTitle &&
          <SectionDecoratedTitle title={t('title')} />
        }

        <form className='menu__filter' aria-label={t('title')}>
          <div className='menu__filter-type menu__filter-categories' role='group' aria-labelledby='menu-filter-categories'>
            <h4 className='menu__filter-title' id='menu-filter-categories'>
              {t('categories')}
            </h4>
            <div className='menu__billets'>
              <button
                type='button'
                className={`menu__billet ${!filters.category ? 'menu__billet--active' : ''}`}
                aria-pressed={!filters.category}
                onClick={() => selectCategory(undefined)}
              >
                {t('all')}
              </button>
              {options?.categories.map((category) => (
                <button
                  key={category.slug}
                  type='button'
                  className={`menu__billet ${filters.category === category.slug ? 'menu__billet--active' : ''}`}
                  aria-pressed={filters.category === category.slug}
                  onClick={() => selectCategory(category.slug)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <FilterGroup
            title={t('tags')}
            className='menu__filter-tags'
            options={options?.tags ?? []}
            isActive={(s) => filters.tags.includes(s)}
            onSelect={toggleTag}
          />

          <FilterGroup
            title={t('allergens')}
            className='menu__filter-allergens'
            options={options?.allergens ?? []}
            isActive={(s) => filters.allergens.includes(s)}
            onSelect={toggleAllergen}
          />

          <div>
            <div className='menu__filter-type menu__filter-sort' role='group' aria-labelledby='menu-filter-sort'>
              <h4 className='menu__filter-title' id='menu-filter-sort'>
                {t('sort')}
              </h4>
              <button type='button' className='menu__sort-type' onClick={toggleSort} aria-pressed={filters.sort === 'price_desc'}>
                {filters.sort === 'price_desc' ? t('sortPriceDesc') : t('sortPriceAsc')}
              </button>
            </div>

            <KeywordSearchField
              onSearch={(text) => setFilters((filter) => ({ ...filter, keywordSearch: text || undefined }))}
              placeholder={t('searchPlaceholder')}
            />
          </div>
        </form>

        {isLoading &&
          <Loader width='100px' height='100px' />
        }
        {isError &&
          <ErrorPlug />
        }

        <Pagination items={dishes ?? []} pageSize={10} resetPage={filters}>
          {(pageDishes) => (
            <div className='menu__cards'>
              {pageDishes.map((dish) => (
                <DishCard
                  key={dish.id}
                  dish={dish}
                  quantity={dishQuantity?.[dish.id] ?? 0}
                  onQuantityChange={onQuantityChange}
                  onOpen={setSelectedDish}
                />
              ))}
            </div>
          )}
        </Pagination>

        <Modal
          title={selectedDish?.name}
          isOpen={Boolean(selectedDish)}
          onClose={() => setSelectedDish(null)}
        >
          {selectedDish && (
            <div className='menu__dish-modal'>
              <DishImages key={selectedDish.id} images={selectedDish.images} alt={selectedDish.name} variant='modal' />
              <p className='menu__dish-modal-description'>
                {selectedDish.description}
              </p>
              {selectedDish.tags.length > 0 && (
                <div className='menu__dish-modal-meta'>
                  <span className='menu__dish-modal-label'>{t('tags')}:</span>
                  {selectedDish.tags.map((tag) => tag.name).join(', ')}
                </div>
              )}
              {selectedDish.allergens.length > 0 && (
                <div className='menu__dish-modal-meta'>
                  <span className='menu__dish-modal-label'>{t('allergens')}:</span>
                  {selectedDish.allergens.map((allergen) => allergen.name).join(', ')}
                </div>
              )}
              <p className='menu__dish-modal-price'>
                {selectedDish.price} ₽
              </p>
            </div>
          )}
        </Modal>
      </div>
    </section>
  )
}

export default Menu
