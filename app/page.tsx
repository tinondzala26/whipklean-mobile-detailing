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
  ["Tell us your ride", "Share your vehicle size, condition, and the areas that need attention."],
  ["Get a clear quote", "We recommend only the service your vehicle actually needs."],
  ["We get into it", "Careful tools and proven products reach beyond the obvious surfaces."],
  ["Drive away protected", "Enjoy a cleaner vehicle with surfaces prepared for Canadian roads."],
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
        <span>Canadian-owned & operated</span>
        <span>Serving vehicles of every size</span>
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
          <p className="eyebrow"><span /> Detail beyond the surface</p>
          <h1>Your ride.<br /><em>Seriously klean.</em></h1>
          <p className="hero-copy">
            From quick refreshes to the hidden, hard-to-reach details, we clean
            and protect vehicles of every size for life on Canadian roads.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#quote">Get a free quote <b>→</b></a>
            <a className="text-link" href="#services">Explore our services <span>↓</span></a>
          </div>
          <div className="hero-proof">
            <div><strong>2024</strong><span>Proudly established</span></div>
            <div><strong>All sizes</strong><span>Cars to work vehicles</span></div>
            <div><strong>Protected</strong><span>Corrosion-conscious care</span></div>
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
            Every service is vehicle-safe, detail-focused, and tailored to the
            size and condition of your ride.
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
            WhipKlean started in 2024 with a simple belief: every vehicle
            deserves careful, honest work—not rushed, one-size-fits-all
            treatment. We’re a growing local business, and your trust is the
            most important thing we clean up for.
          </p>
          <div className="about-values">
            <span><b>01</b> Care over speed</span>
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
          <p>Tell us a little about your vehicle. We’ll follow up with a clear recommendation and quote.</p>
        </div>
        {sent ? (
          <div className="success-message" role="status">
            <span>✓</span>
            <h3>Request received.</h3>
            <p>Thanks for choosing WhipKlean. We’ll be in touch to confirm the right service for your vehicle.</p>
            <button type="button" onClick={() => setSent(false)}>Send another request</button>
          </div>
        ) : (
          <form className="quote-form" onSubmit={submitQuote}>
            <label>Name<input name="name" required placeholder="Your name" /></label>
            <label>Phone or email<input name="contact" required placeholder="How should we reach you?" /></label>
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
            <label className="full">Anything we should know?
              <textarea name="details" rows={4} placeholder="Stains, pet hair, winter salt, vehicle size, or anything else..." />
            </label>
            <button className="button dark-button full" type="submit">Request my quote <b>→</b></button>
          </form>
        )}
      </section>

      <footer>
        <div className="footer-brand">
          <Image src="/images/whipklean-logo.png" alt="" width={86} height={86} />
          <div><strong>WHIP<span>KLEAN</span></strong><p>Detail beyond the surface.</p></div>
        </div>
        <div className="footer-links">
          <div><span>Navigate</span><a href="#services">Services</a><a href="#protection">Why WhipKlean</a><a href="#about">Our story</a></div>
          <div><span>Get started</span><a href="#quote">Request a quote</a><a href="#process">How it works</a></div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 WhipKlean. Canada.</span>
          <span>Established 2024 · Proudly small business</span>
        </div>
      </footer>
    </main>
  );
}
