import { FiSend } from 'react-icons/fi'
import { FiGithub } from 'react-icons/fi'
import { FiLinkedin } from 'react-icons/fi'
import { FiTwitter } from 'react-icons/fi'

// const twitter = 'tutumenezes'
// const github = 'tutumenezes'
// const linkedin = 'tutumenezes'
// const email = 'tutumenezes@hub9.co'

export default function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="copyright">
            Written and Built by tutumenezes in 2022 • Hit me up!
          </div>
          <div className="social">
            <a
              className="instagram"
              href="https://twitter.com/tutumenezes"
              title="Twitter @tutumenezes"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FiTwitter className="social-icon" />
            </a>

            <a
              className="github"
              href="https://github.com/tutumenezes"
              title="Github @tutumenezes"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FiGithub className="social-icon" />
            </a>

            <a
              className="github"
              href="mailto:tutumenezes@hub9.co"
              title="Email tutumenezes@hub9.co"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FiSend className="social-icon" />
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}
