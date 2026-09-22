import { Link } from 'react-router-dom'
import { restaurant } from '../data/restaurant.js'
import { Logo } from '../components/ui/Logo.jsx'
import './privacy.css'

/**
 * Plain-language privacy notice. It describes ONLY what this website actually does.
 * If you add analytics, cookies, newsletter sign-up or third-party embeds, update it.
 */
export default function Privacy() {
  return (
    <article className="pv" aria-labelledby="pv-title">
      <div className="pv__inner">
        <Logo className="pv__logo" />
        <p className="eyebrow">Privacy</p>
        <h1 id="pv-title" className="pv__title">Privacy notice</h1>
        <p className="pv__lead">
          How {restaurant.name} looks after the details you share with us through this website.
        </p>

        <h2>Who we are</h2>
        <p>
          {restaurant.name}, {restaurant.address}, {restaurant.city}, {restaurant.country}.{' '}
          Contact: <a href={`mailto:${restaurant.email}`}>{restaurant.email}</a> · {restaurant.phone}.
        </p>

        <h2>What we collect</h2>
        <p>
          Only what you type into our contact, reservation and event forms: your name, phone number, email (if you give
          one), and the details of your request — such as date, time, number of guests, occasion, and any notes.
        </p>

        <h2>Why we use it</h2>
        <p>
          To reply to you and to arrange your reservation, event or enquiry. We do not sell your details and we do not use
          them for advertising.
        </p>

        <h2>Cookies and tracking</h2>
        <p>
          This website does not use advertising cookies or analytics trackers. Fonts and images are served from this
          website itself.
        </p>

        <h2>WhatsApp and other links</h2>
        <p>
          Buttons that open WhatsApp, email, phone or Google Maps take you to those services, which have their own privacy
          policies. If you message us on WhatsApp, we will see your number and message.
        </p>

        <h2>Your choices</h2>
        <p>
          You can ask us at any time to see, correct or delete the details we hold about you by contacting us using the
          details above.
        </p>

        <p className="pv__back">
          <Link to="/" className="link-line">Back to Afrish Petals</Link>
        </p>
      </div>
    </article>
  )
}
