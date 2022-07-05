import ExtLink from '../components/ext-link'
import Nav from './nav'

const Headline = () => (
  <div className="headline">
    <div className="container">
      <p>
        <span>Sua revista semanal sobre filmes e séries.</span>
        <span className="sub">
          Blog e Podcast por{' '}
          <ExtLink
            className="underlined"
            href="https://twitter.com/irwingoliveira"
          >
            Irwing Rangel
          </ExtLink>{' '}
          .
        </span>
      </p>
      <Nav />
    </div>
  </div>
)

export default Headline
