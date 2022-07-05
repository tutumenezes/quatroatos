import Link from 'next/link'

import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'

import ThemeToggle from './themetoggle'
import ReactTooltip from 'react-tooltip'
import { FiCornerDownLeft, FiInfo } from 'react-icons/fi'
import Spotify from './svgs/spotify'

const spotify = 'https://open.spotify.com/show/3uMvgtj9OunqRfid1mkFwd'

const Nav = ({ titlePre = '' }) => {
  const { pathname } = useRouter()
  const { theme } = useTheme()

  return (
    <div className="nav">
      <ul>
        <li className="nav-list-item spotify" key={'spotify'}>
          {spotify && (
            <a
              className="spotify"
              href={`${spotify}`}
              title={`Spotify 4 Atos`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Spotify />
            </a>
          )}
        </li>
        {pathname === '/about' && (
          <li className="nav-list-item" key={'about'}>
            <Link href={'/'} as={'/'}>
              <a data-tip={'Home'} className={'active'}>
                <FiCornerDownLeft />
                {theme == 'dark' ? (
                  <ReactTooltip place="bottom" type="light" effect="solid" />
                ) : (
                  <ReactTooltip place="bottom" type="dark" effect="solid" />
                )}
              </a>
            </Link>
          </li>
        )}
        {pathname !== '/about' && (
          <li className="nav-list-item" key={'about'}>
            <Link href={'/about'} as={'/about'}>
              <a data-tip={'About'} className={'active'}>
                <FiInfo />
                {theme == 'dark' ? (
                  <ReactTooltip place="bottom" type="light" effect="solid" />
                ) : (
                  <ReactTooltip place="bottom" type="dark" effect="solid" />
                )}
              </a>
            </Link>
          </li>
        )}
        <li>
          <ThemeToggle />
        </li>
      </ul>
    </div>
  )
}

export default Nav
