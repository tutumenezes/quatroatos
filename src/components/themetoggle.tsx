import { useTheme } from 'next-themes'
import { FiZap, FiZapOff } from 'react-icons/fi'
import ReactTooltip from 'react-tooltip'

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()

  return (
    <>
      {/* The current theme is: {theme} */}
      {theme == 'dark' ? (
        <>
          <button data-tip="Toggle Dark Mode" onClick={() => setTheme('light')}>
            <FiZap />
          </button>
          <ReactTooltip place="bottom" type="light" effect="solid" />
        </>
      ) : (
        <>
          <button data-tip="Toggle Dark Mode" onClick={() => setTheme('dark')}>
            <FiZapOff />
          </button>
          <ReactTooltip place="bottom" type="dark" effect="solid" />
        </>
      )}
    </>
  )
}

export default ThemeToggle
