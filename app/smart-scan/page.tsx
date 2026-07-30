"use client";

import { ChangeEvent, useMemo, useState } from "react";

type PhotoKind = "vehicle" | "plate" | "condition";

const photoSteps: Array<{ kind: PhotoKind; label: string; help: string }> = [
  { kind: "vehicle", label: "Full vehicle", help: "Capture the complete vehicle in good light." },
  { kind: "plate", label: "Licence plate", help: "Keep the plate centred and readable." },
  { kind: "condition", label: "Areas of concern", help: "Show stains, road film, scratches, or problem areas." },
];

export default function SmartScanPage() {
  const [photos, setPhotos] = useState<Partial<Record<PhotoKind, string>>>({});
  const [vehicle, setVehicle] = useState("");
  const [condition, setCondition] = useState("");
  const [location, setLocation] = useState("");
  const [service, setService] = useState("Deep Klean");
  const [complete, setComplete] = useState(false);

  const photoCount = Object.keys(photos).length;
  const readiness = useMemo(() => {
    const completed = [photoCount === 3, vehicle.trim(), condition.trim(), location.trim()].filter(Boolean).length;
    return Math.round((completed / 4) * 100);
  }, [photoCount, vehicle, condition, location]);

  function addPhoto(kind: PhotoKind, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setPhotos((current) => {
      const previous = current[kind];
      if (previous) URL.revokeObjectURL(previous);
      return { ...current, [kind]: URL.createObjectURL(file) };
    });
    setComplete(false);
  }

  return (
    <main className="intakePage">
      <header className="intakeHeader">
        <a className="intakeBrand" href="/">
          <img src="/images/whipklean-logo.png" alt="WhipKlean" />
          <span>WHIP<span>KLEAN</span></span>
        </a>
        <a href="/">Back to main site ↗</a>
      </header>

      <section className="intakeHero">
        <div>
          <span>WHIPKLEAN SMART INTAKE / 01</span>
          <h1>A clearer brief.<br /><em>A better klean.</em></h1>
        </div>
        <div className="readiness">
          <strong>{readiness}%</strong>
          <span>BOOKING BRIEF READY</span>
          <i><b style={{ width: `${readiness}%` }} /></i>
        </div>
      </section>

      <section className="intakeSection">
        <div className="intakeTitle">
          <span>STEP 01</span>
          <h2>Add three photos</h2>
          <p>Photos stay on this device and are used only to prepare the booking summary below.</p>
        </div>
        <div className="photoGrid">
          {photoSteps.map((step, index) => (
            <label className={photos[step.kind] ? "photoInput hasPhoto" : "photoInput"} key={step.kind}>
              {photos[step.kind] ? <img src={photos[step.kind]} alt={`${step.label} preview`} /> : <b>0{index + 1}</b>}
              <span>{step.label}</span>
              <small>{photos[step.kind] ? "Replace photo" : step.help}</small>
              <input type="file" accept="image/*" capture="environment" onChange={(event) => addPhoto(step.kind, event)} />
            </label>
          ))}
        </div>
      </section>

      <section className="intakeSection detailSection">
        <div className="intakeTitle">
          <span>STEP 02</span>
          <h2>Describe the job</h2>
          <p>Add only details you can confirm. WhipKlean will review the final scope with you.</p>
        </div>
        <div className="intakeForm">
          <label>Vehicle<input value={vehicle} onChange={(event) => setVehicle(event.target.value)} placeholder="e.g. 2021 Toyota RAV4, white" /></label>
          <label>Preferred service<select value={service} onChange={(event) => setService(event.target.value)}><option>Klean Wash</option><option>Deep Klean</option><option>Klean & Protect</option></select></label>
          <label className="wide">Condition and priority areas<textarea value={condition} onChange={(event) => setCondition(event.target.value)} placeholder="Tell us about stains, pet hair, road salt, wheels, paint, or anything needing special attention." /></label>
          <label className="wide">Mobile service location<input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Suburb, city, or workplace area" /></label>
        </div>
      </section>

      <section className="intakeSummary">
        <div>
          <span>STEP 03 / REVIEW</span>
          <h2>Your service brief</h2>
        </div>
        <dl>
          <div><dt>Vehicle</dt><dd>{vehicle || "Not added yet"}</dd></div>
          <div><dt>Service</dt><dd>{service}</dd></div>
          <div><dt>Photos</dt><dd>{photoCount} of 3 added</dd></div>
          <div><dt>Location</dt><dd>{location || "Not added yet"}</dd></div>
          <div className="summaryCondition"><dt>Condition</dt><dd>{condition || "Not added yet"}</dd></div>
        </dl>
        {complete ? (
          <div className="intakeComplete"><b>Brief ready.</b><span>Continue to the quote form and share these details with WhipKlean.</span><a href="/#quote">Request a quote ↗</a></div>
        ) : (
          <button disabled={readiness < 100} onClick={() => setComplete(true)}>Prepare booking brief →</button>
        )}
      </section>
    </main>
  );
}
