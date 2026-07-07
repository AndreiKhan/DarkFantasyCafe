import './SectionDecoratedTitle.scss'

function SectionDecoratedTitle({ title, arrows = true }: { title: string, arrows?: boolean }) {
  return (
    <div className='section-decorated-title'>
      <div className='section-decorated-title__decorator' aria-hidden='true'>
        {arrows &&
          <div className='section-decorated-title__decorator--arrow' />
        }
        <div className='section-decorated-title__decorator--rune1' />
        <div className='section-decorated-title__decorator--rune2' />
        <div className='section-decorated-title__decorator--rune3' />
      </div>
      <h2 className='section-decorated-title__name'>
        {title}
      </h2>
      <div className='section-decorated-title__decorator' aria-hidden='true'>
        <div className='section-decorated-title__decorator--rune4' />
        <div className='section-decorated-title__decorator--rune5' />
        <div className='section-decorated-title__decorator--rune6' />
        {arrows &&
          <div className='section-decorated-title__decorator--arrow' />
        }
      </div>
    </div>
  )
}

export default SectionDecoratedTitle
