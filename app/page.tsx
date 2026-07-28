"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";

const services = [
  {
    number: "01",
    title: "Klean Wash",
    description:
      "A careful hand wash that clears road film, salt, brake dust, and everyday grime without harsh automated brushes.",
    features: ["Pre-rinse & foam bath", "Hand wash & towel dry", "Wheels, tires & glass"],
    time: "From 60 min",
  },
  {
    number: "02",
    title: "Deep Klean",
    description:
      "A reset for the places a quick wash misses—seat seams, vents, carpets, trim, cupholders, and tight interior crevices.",
    features: ["Full vacuum & steam detail", "Fabric or leather care", "Stain & odour treatment"],
    time: "From 3 hrs",
    featured: true,
  },
  {
    number: "03",
    title: "Klean & Protect",
    description:
      "Our most complete service pairs a deep clean with corrosion-conscious protection for Canadian driving conditions.",
    features: ["Interior + exterior detail", "Protective surface treatment", "Undercarriage attention"],
    time: "From 5 hrs",
  },
];

const process = [
  ["Tell us your ride", "Share your vehicle, condition, service address, and the areas that need attention."],
  ["Confirm the location", "We confirm the callout area, safe working space, access, and weather plan."],
  ["We come to you", "Our mobile setup arrives at your approved home, workplace, or fleet location."],
  ["Drive away protected", "Enjoy a cleaner vehicle without losing time travelling to a detailing shop."],
];

const vehicleTypes = ["Cars", "SUVs", "Trucks", "Vans", "Work vehicles"];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sent, setSent] = useState(false);

  function submitQuote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <main>
      <div className="topbar">
        <span>Canadian-owned mobile detailing</span>
        <span>We come to your home, workplace or fleet</span>
        <a href="#quote">Get a free quote →</a>
      </div>

      <header className="site-header">
        <a className="brand" href="#home" aria-label="WhipKlean home">
          <Image
            src="/images/whipklean-logo.png"
            alt=""
            width={64}
            height={64}
            priority
          />
          <span>WHIP<span>KLEAN</span></span>
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen((value) => !value)}
        >
          <i />
          <i />
        </button>
        <nav className={menuOpen ? "nav-open" : ""} aria-label="Main navigation">
          <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
          <a href="#mobile" onClick={() => setMenuOpen(false)}>Mobile service</a>
          <a href="#protection" onClick={() => setMenuOpen(false)}>Why WhipKlean</a>
          <a href="#process" onClick={() => setMenuOpen(false)}>How it works</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
          <a className="nav-cta" href="#quote" onClick={() => setMenuOpen(false)}>
            Book your klean
          </a>
        </nav>
      </header>

      <section className="hero" id="home">
        <Image
          className="hero-image"
          src="/images/whipklean-hero.png"
          alt="A WhipKlean detailer carefully cleaning the wheel of a black SUV"
          fill
          priority
          sizes="100vw"
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="eyebrow"><span /> Mobile detail beyond the surface</p>
          <h1>We bring<br /><em>the klean.</em></h1>
          <p className="hero-copy">
            WhipKlean comes to your home, workplace, or fleet. From quick
            refreshes to hard-to-reach details, we clean and protect vehicles
            of every size right where they are.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#quote">Get a free quote <b>→</b></a>
            <a className="text-link" href="#services">Explore our services <span>↓</span></a>
          </div>
          <div className="hero-proof">
            <div><strong>We travel</strong><span>No shop visit required</span></div>
            <div><strong>All sizes</strong><span>Cars to fleet vehicles</span></div>
            <div><strong>Protected</strong><span>Canadian-road care</span></div>
          </div>
        </div>
      </section>

      <section className="services section" id="services">
        <div className="section-heading">
          <div>
            <p className="eyebrow dark"><span /> Pick your level of klean</p>
            <h2>More than a car wash.</h2>
          </div>
          <p>
            Every mobile service is vehicle-safe, detail-focused, and tailored
            to your ride, location, and Canadian driving conditions.
          </p>
        </div>
        <div className="service-grid">
          {services.map((service) => (
            <article className={service.featured ? "service-card featured" : "service-card"} key={service.title}>
              {service.featured && <span className="popular">Most popular</span>}
              <div className="service-number">{service.number}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <ul>
                {service.features.map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
              <div className="service-footer">
                <span>{service.time}</span>
                <a href="#quote" aria-label={`Request a quote for ${service.title}`}>Get a quote →</a>
              </div>
            </article>
          ))}
        </div>
        <p className="services-note">Not sure what you need? <a href="#quote">Tell us about your vehicle</a> and we’ll point you in the right direction.</p>
      </section>

      <section className="mobile-service section" id="mobile">
        <div className="mobile-intro">
          <p className="eyebrow dark"><span /> Your location is our workspace</p>
          <h2>Professional detailing.<br /><em>Zero shop commute.</em></h2>
          <p>
            WhipKlean has no fixed customer-facing shop. Our mobile team travels
            to an approved service location so your vehicle can be detailed
            while you stay home, work, or keep your fleet moving.
          </p>
        </div>
        <div className="mobile-grid">
          <article><span>01</span><h3>Home callouts</h3><p>A driveway or other safe private area with enough room to work around the vehicle.</p></article>
          <article><span>02</span><h3>Workplace service</h3><p>With property approval, we detail while you work and coordinate access around the site.</p></article>
          <article><span>03</span><h3>Fleet locations</h3><p>Cars, trucks, vans, and work vehicles serviced together at an approved operating location.</p></article>
          <article><span>04</span><h3>Weather-aware booking</h3><p>Outdoor appointments may be adjusted when weather or site conditions make safe, quality work impossible.</p></article>
        </div>
        <div className="site-check">
          <strong>Before we arrive</strong>
          <span>Confirm a safe, legal work area</span>
          <span>Tell us about water or power access</span>
          <span>Obtain property-manager permission</span>
          <span>Keep keys and vehicle documents ready</span>
        </div>
      </section>

      <section className="detail-story" id="protection">
        <div className="story-image">
          <Image
            src="/images/whipklean-interior.png"
            alt="A gloved WhipKlean detailer cleaning a hard-to-reach vehicle seat seam"
            fill
            sizes="(max-width: 800px) 100vw, 50vw"
          />
          <div className="image-stamp">
            <span>WHIPKLEAN</span>
            <strong>We get<br />into it.</strong>
          </div>
        </div>
        <div className="story-copy">
          <p className="eyebrow"><span /> The WhipKlean difference</p>
          <h2>Clean where the grime <em>actually hides.</em></h2>
          <p className="lead">
            A shiny exterior is only the beginning. We work into seams, vents,
            wheel wells, trim gaps, and the overlooked zones that collect dirt,
            salt, and moisture.
          </p>
          <div className="benefit-list">
            <div>
              <i>✦</i>
              <span><strong>Precision deep cleaning</strong>Tools and techniques made for tight, delicate spaces.</span>
            </div>
            <div>
              <i>◇</i>
              <span><strong>Corrosion-conscious chemistry</strong>Vehicle-safe products selected to clean while supporting long-term protection.</span>
            </div>
            <div>
              <i>↗</i>
              <span><strong>Care for every vehicle</strong>Personal cars, family SUVs, trucks, vans, and hardworking fleet vehicles.</span>
            </div>
          </div>
          <a className="button light" href="#quote">Protect your vehicle <b>→</b></a>
        </div>
      </section>

      <section className="vehicle-strip">
        <span>One standard of care.</span>
        <div>
          {vehicleTypes.map((type) => <strong key={type}>{type}<i>•</i></strong>)}
        </div>
      </section>

      <section className="process section" id="process">
        <div className="process-intro">
          <p className="eyebrow dark"><span /> Simple from start to shine</p>
          <h2>A better clean in<br />four easy steps.</h2>
          <p>No confusing package maze. Just honest guidance, careful work, and a vehicle that feels renewed.</p>
        </div>
        <div className="process-list">
          {process.map(([title, description], index) => (
            <div className="process-step" key={title}>
              <span>0{index + 1}</span>
              <div><h3>{title}</h3><p>{description}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="about" id="about">
        <div className="about-content">
          <p className="eyebrow"><span /> Small business. Serious care.</p>
          <h2>Built in Canada.<br />Built to care.</h2>
          <p>
            WhipKlean started in 2024 with a simple belief: professional
            detailing should fit around the customer. We built a mobile
            operation instead of a fixed shop so careful, honest vehicle care
            can come directly to Canadian homes, workplaces, and fleets.
          </p>
          <div className="about-values">
            <span><b>01</b> Mobile convenience</span>
            <span><b>02</b> Clear recommendations</span>
            <span><b>03</b> Protection-minded products</span>
          </div>
        </div>
        <div className="foam-mark" aria-hidden="true">
          <div className="bubble b1" />
          <div className="bubble b2" />
          <div className="bubble b3" />
          <Image src="/images/whipklean-logo.png" alt="" width={420} height={420} />
        </div>
      </section>

      <section className="quote" id="quote">
        <div className="quote-heading">
          <p className="eyebrow dark"><span /> Ready when your ride is</p>
          <h2>Let’s get your whip <em>klean.</em></h2>
          <p>Tell us about your vehicle and service location. We’ll confirm the mobile callout details and send a clear quote.</p>
        </div>
        {sent ? (
          <div className="success-message" role="status">
            <span>✓</span>
            <h3>Request received.</h3>
            <p>Thanks for choosing WhipKlean. We’ll be in touch to confirm your service, callout area, and location requirements.</p>
            <button type="button" onClick={() => setSent(false)}>Send another request</button>
          </div>
        ) : (
          <form className="quote-form" onSubmit={submitQuote}>
            <label>Name<input name="name" required placeholder="Your name" /></label>
            <label>Phone or email<input name="contact" required placeholder="How should we reach you?" /></label>
            <label className="full">Mobile service address
              <input name="address" required placeholder="Street, city and province" />
            </label>
            <label>Vehicle type
              <select name="vehicle" required defaultValue="">
                <option value="" disabled>Select your vehicle</option>
                {vehicleTypes.map((type) => <option key={type}>{type}</option>)}
              </select>
            </label>
            <label>Service
              <select name="service" required defaultValue="">
                <option value="" disabled>What does it need?</option>
                {services.map((service) => <option key={service.title}>{service.title}</option>)}
                <option>Not sure yet</option>
              </select>
            </label>
            <label>Work area
              <select name="work-area" required defaultValue="">
                <option value="" disabled>Select the setup</option>
                <option>Private driveway</option>
                <option>Workplace parking</option>
                <option>Fleet / commercial property</option>
                <option>Other approved private area</option>
              </select>
            </label>
            <label>Water & power
              <select name="utilities" required defaultValue="">
                <option value="" disabled>What is available?</option>
                <option>Water and power available</option>
                <option>Water only</option>
                <option>Power only</option>
                <option>Neither / not sure</option>
              </select>
            </label>
            <label className="full">Anything we should know?
              <textarea name="details" rows={4} placeholder="Stains, pet hair, winter salt, vehicle size, or anything else..." />
            </label>
            <button className="button dark-button full" type="submit">Request my quote <b>→</b></button>
          </form>
        )}
        <div className="booking-extras full">
          <details className="contact-details">
            <summary>
              <span><small>Need help before booking?</small>Contact WhipKlean</span>
              <b>+</b>
            </summary>
            <div>
              <a href="mailto:whipklean@yahoo.com">whipklean@yahoo.com</a>
              <a href="tel:+14165550147">(416) 555-0147 <small>Temporary number</small></a>
              <p>Mobile detailing by appointment. Service location and travel area are confirmed with every quote.</p>
            </div>
          </details>
          <div className="agreement-download">
            <div>
              <span>Before your appointment</span>
              <h3>Mobile Service Authorization Agreement</h3>
              <p>Review, complete, and sign the fillable PDF covering site access, insurance, licensing, and limited vehicle movement at the approved service location.</p>
              <small>Fillable customer agreement for mobile appointments.</small>
            </div>
            <a className="button dark-button" href="/docs/whipklean-mobile-service-agreement.pdf" download>
              Download PDF <b>↓</b>
            </a>
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-brand">
          <Image src="/images/whipklean-logo.png" alt="" width={86} height={86} />
          <div><strong>WHIP<span>KLEAN</span></strong><p>Mobile detail beyond the surface.</p></div>
        </div>
        <div className="footer-links">
          <div><span>Navigate</span><a href="#services">Services</a><a href="#mobile">Mobile service</a><a href="#protection">Why WhipKlean</a><a href="#about">Our story</a></div>
          <div><span>Get started</span><a href="#quote">Request a quote</a><a href="mailto:whipklean@yahoo.com">whipklean@yahoo.com</a><a href="tel:+14165550147">(416) 555-0147</a></div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 WhipKlean. Canada.</span>
          <span>Established 2024 · Mobile by design</span>
        </div>
      </footer>
    </main>
  );
}
