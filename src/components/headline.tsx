import ExtLink from '../components/ext-link'

const Headline = () => (
  <div className="headline">
    <div className="container">
      <p>
        <span>
          Designer at{' '}
          <ExtLink
            className="underlined futuur-link"
            href="https://futuur.com/"
          >
            Futuur
          </ExtLink>{' '}
          &{' '}
          <ExtLink className="underlined mude-link" href="https://mude.fit/">
            Mude
          </ExtLink>
          .
        </span>
        <span>Passionate about the creative process.</span>
      </p>
    </div>
  </div>
)

export default Headline
