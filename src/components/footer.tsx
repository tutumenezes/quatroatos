import { FiSend, FiTwitter } from 'react-icons/fi'
import Spotify from './svgs/spotify'

const twitter = 'irwingoliveira'
const email = 'rangelirwing@gmail.com'
const spotify = 'https://open.spotify.com/show/3uMvgtj9OunqRfid1mkFwd'

export default function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="copyright">
            Blog feito em 2022, todos os direitos reservados • Entre em contato
            :D
          </div>
          <div className="social">
            {spotify && (
              <a
                className="spotify"
                href={`${spotify}`}
                title={`Spotify 4 Atos`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Spotify className="social-icon" />
              </a>
            )}

            {twitter && (
              <a
                className="twitter"
                href={`https://twitter.com/${twitter}`}
                title={`Twitter @${twitter}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FiTwitter className="social-icon" />
              </a>
            )}

            {email && (
              <a
                className="email"
                href={`mailto:${email}`}
                title={`Email ${email}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FiSend className="social-icon" />
              </a>
            )}
          </div>
        </div>
      </footer>
    </>
  )
}
