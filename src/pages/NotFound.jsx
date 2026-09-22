import { Link } from 'react-router-dom'
import { Logo } from '../components/ui/Logo.jsx'
import { Button } from '../components/ui/Button.jsx'
import './notfound.css'

/** Unknown URL. SEO: marked noindex by lib/seo.js so it never enters search results. */
export default function NotFound() {
  return (
    <section className="nf" aria-labelledby="nf-title">
      <Logo className="nf__logo" priority />
      <p className="eyebrow">Error 404</p>
      <h1 id="nf-title" className="nf__title">
        This table <em>isn't</em> set.
      </h1>
      <p className="body-copy">The page you were looking for doesn't exist or has moved.</p>
      <div className="nf__actions">
        <Button to="/" variant="solid">Back to Afrish Petals</Button>
        <Link to="/contact" className="link-line">Contact us</Link>
      </div>
    </section>
  )
}
