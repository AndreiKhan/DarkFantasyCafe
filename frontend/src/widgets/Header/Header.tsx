import './Header.scss'

function Header() {
  return (
    <header className='header'>
      <div className='center header__content'>
        <div className='header__logo'>
          logo
        </div>
        <div className='header__container'>
          <nav className='header__nav'>
            <ul className='header__nav-list'>
              <li className='header__nav-item header__nav-item--active'>
                <a href="#">
                  Menu
                </a>
              </li>
              <li className='header__nav-item'>
                <a href="#">
                  Reserve
                </a>
              </li>
              <li className='header__nav-item'>
                <a href="#">
                  Arena
                </a>
              </li>
              <li className='header__nav-item'>
                <a href="#">
                  Gallery
                </a>
              </li>
              <li className='header__nav-item'>
                <a href="#">
                  News
                </a>
              </li>
            </ul>
          </nav>
          <div className='header__menu'>
            <button type='button' className='header__profile'>
              profile
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
