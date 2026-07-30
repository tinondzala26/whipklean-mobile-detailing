"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";

type CaptureKind = "vehicle" | "disc" | "plate";
type Details = { owner: string; registration: string; vin: string; makeModel: string; colour: string };

const captures: Array<{ kind: CaptureKind; label: string; help: string; frame: string }> = [
  { kind: "vehicle", label: "Your vehicle", help: "Fit the full car inside the frame.", frame: "wide" },
  { kind: "disc", label: "Licence disc", help: "Hold steady with every line sharp and readable.", frame: "document" },
  { kind: "plate", label: "Number plate", help: "Centre the plate and avoid glare.", frame: "plate" },
];

const emptyDetails: Details = { owner: "", registration: "", vin: "", makeModel: "", colour: "" };

function findValue(text: string, labels: string[]) {
  const lines = text.split(/\n/).map((line) => line.replace(/\s+/g, " ").trim()).filter(Boolean);
  for (const label of labels) {
    const match = lines.find((line) => line.toUpperCase().includes(label));
    if (match) return match.replace(new RegExp(`.*${label}\\s*[:\\-]?\\s*`, "i"), "").trim();
  }
  return "";
}

function likelyPlate(text: string) {
  const candidates = text.toUpperCase().replace(/[^A-Z0-9\n ]/g, " ").split(/\n/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter((line) => line.length >= 4 && line.length <= 12);
  return candidates.sort((a, b) => b.replace(/\s/g, "").length - a.replace(/\s/g, "").length)[0] || "";
}

export default function SmartScanPage() {
  const [photos, setPhotos] = useState<Partial<Record<CaptureKind, string>>>({});
  const [activeCapture, setActiveCapture] = useState<CaptureKind | null>(null);
  const [cameraError, setCameraError] = useState("");
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [consent, setConsent] = useState(false);
  const [scanState, setScanState] = useState<"idle" | "reading" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [details, setDetails] = useState<Details>(emptyDetails);
  const [condition, setCondition] = useState("");
  const [location, setLocation] = useState("");
  const [service, setService] = useState("Deep Klean");
  const [complete, setComplete] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const photoCount = Object.keys(photos).length;
  const readiness = useMemo(() => {
    const completed = [photoCount === 3, details.registration, details.makeModel, location.trim(), consent].filter(Boolean).length;
    return Math.round((completed / 5) * 100);
  }, [photoCount, details, location, consent]);

  useEffect(() => {
    if (!activeCapture) return;
    let cancelled = false;
    navigator.mediaDevices?.getUserMedia({ video: { facingMode, width: { ideal: 1920 }, height: { ideal: 1080 } }, audio: false })
      .then((stream) => {
        if (cancelled) return stream.getTracks().forEach((track) => track.stop());
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      })
      .catch(() => setCameraError("Camera access was unavailable. You can choose a photo instead."));
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, [activeCapture, facingMode]);

  function closeCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    setActiveCapture(null);
    setCameraError("");
  }

  function takePhoto() {
    const video = videoRef.current;
    if (!video?.videoWidth || !activeCapture) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    setPhotos((current) => ({ ...current, [activeCapture]: canvas.toDataURL("image/jpeg", .88) }));
    setScanState("idle");
    setComplete(false);
    closeCamera();
  }

  function choosePhoto(kind: CaptureKind, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setPhotos((current) => ({ ...current, [kind]: reader.result as string }));
    };
    reader.readAsDataURL(file);
    setScanState("idle");
  }

  async function readVehicleDetails() {
    if (!photos.disc || !photos.plate || !consent) return;
    setScanState("reading");
    setProgress(4);
    try {
      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker("eng", undefined, {
        logger: (message) => {
          if (message.status === "recognizing text") setProgress(Math.round(10 + message.progress * 42));
        },
      });
      const plateResult = await worker.recognize(photos.plate);
      setProgress(55);
      const discResult = await worker.recognize(photos.disc);
      await worker.terminate();
      const discText = discResult.data.text;
      setDetails({
        owner: findValue(discText, ["OWNER", "HOLDER", "NAME"]),
        registration: likelyPlate(plateResult.data.text) || findValue(discText, ["REGISTRATION", "REG NO", "REGISTER NO"]),
        vin: findValue(discText, ["VIN", "CHASSIS"]),
        makeModel: [findValue(discText, ["MAKE"]), findValue(discText, ["MODEL"])].filter(Boolean).join(" "),
        colour: findValue(discText, ["COLOUR", "COLOR"]),
      });
      setProgress(100);
      setScanState("done");
    } catch {
      setScanState("error");
    }
  }

  function updateDetail(key: keyof Details, value: string) {
    setDetails((current) => ({ ...current, [key]: value }));
    setComplete(false);
  }

  return (
    <main className="intakePage">
      <header className="intakeHeader">
        <a className="intakeBrand" href="/"><img src="/images/whipklean-logo.png" alt="WhipKlean" /><span>WHIP<span>KLEAN</span></span></a>
        <a href="/">Back to main site ↗</a>
      </header>

      <section className="scanHero">
        <div><span>WHIPKLEAN VEHICLE SCAN / 01</span><h1>Point. Capture.<br /><em>We’ll prep the rest.</em></h1><p>Three guided photos create a faster, more accurate detailing enquiry.</p></div>
        <div className="readiness"><strong>{readiness}%</strong><span>BOOKING PROFILE READY</span><i><b style={{ width: `${readiness}%` }} /></i></div>
      </section>

      <section className="captureSection">
        <div className="intakeTitle"><span>STEP 01 / CAMERA</span><h2>Capture three views</h2><p>Use the built-in camera guides for a clear vehicle, disc, and plate photo.</p></div>
        <div className="captureGrid">
          {captures.map((capture, index) => (
            <article className={photos[capture.kind] ? "captureCard captured" : "captureCard"} key={capture.kind}>
              <div>{photos[capture.kind] ? <img src={photos[capture.kind]} alt={`${capture.label} captured`} /> : <b>0{index + 1}</b>}<span>{photos[capture.kind] ? "CAPTURED ✓" : "REQUIRED"}</span></div>
              <h3>{capture.label}</h3><p>{capture.help}</p>
              <button onClick={() => setActiveCapture(capture.kind)}>{photos[capture.kind] ? "Retake photo" : "Open camera"} <b>↗</b></button>
              <label>Choose existing photo<input type="file" accept="image/*" capture="environment" onChange={(event) => choosePhoto(capture.kind, event)} /></label>
            </article>
          ))}
        </div>
      </section>

      <section className="scanConsent">
        <div><span>STEP 02 / READ DETAILS</span><h2>Let the photos do the typing.</h2><p>The number plate and licence disc are read on this device. WhipKlean does not receive the photos until you choose to continue with a quote.</p></div>
        <div className="consentPanel">
          <label><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /><span><b>I consent to reading these photos</b><small>I confirm I am authorised to provide this vehicle and owner information.</small></span></label>
          <button disabled={photoCount < 3 || !consent || scanState === "reading"} onClick={readVehicleDetails}>{scanState === "reading" ? `Reading photos… ${progress}%` : "Read vehicle details →"}</button>
          {scanState === "error" && <p className="scanNotice">We couldn’t read these photos clearly. Retake them or enter the details manually below.</p>}
        </div>
      </section>

      <section className="intakeSection detailSection">
        <div className="intakeTitle"><span>STEP 03 / CONFIRM</span><h2>Check every detail</h2><p>Camera readings can be imperfect. Correct anything that does not match the vehicle or licence disc.</p></div>
        <div className="intakeForm">
          <label>Owner or registered holder<input value={details.owner} onChange={(event) => updateDetail("owner", event.target.value)} placeholder="Confirm or enter the name" /></label>
          <label>Registration number<input value={details.registration} onChange={(event) => updateDetail("registration", event.target.value)} placeholder="e.g. CA 123-456" /></label>
          <label>VIN / chassis number<input value={details.vin} onChange={(event) => updateDetail("vin", event.target.value)} placeholder="Confirm from the licence disc" /></label>
          <label>Make and model<input value={details.makeModel} onChange={(event) => updateDetail("makeModel", event.target.value)} placeholder="e.g. Toyota RAV4" /></label>
          <label>Vehicle colour<input value={details.colour} onChange={(event) => updateDetail("colour", event.target.value)} placeholder="e.g. Pearl white" /></label>
          <label>Preferred service<select value={service} onChange={(event) => setService(event.target.value)}><option>Klean Wash</option><option>Deep Klean</option><option>Klean & Protect</option></select></label>
          <label className="wide">Condition and priority areas<textarea value={condition} onChange={(event) => setCondition(event.target.value)} placeholder="Stains, pet hair, road film, scratches, wheels, or other priority areas." /></label>
          <label className="wide">Mobile service location<input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Suburb, city, or workplace area" /></label>
        </div>
      </section>

      <section className="intakeSummary">
        <div><span>STEP 04 / REVIEW</span><h2>Your service brief</h2></div>
        <dl>
          <div><dt>Vehicle</dt><dd>{details.makeModel || "Confirm vehicle"}</dd></div>
          <div><dt>Registration</dt><dd>{details.registration || "Confirm plate"}</dd></div>
          <div><dt>Service</dt><dd>{service}</dd></div>
          <div><dt>Photos</dt><dd>{photoCount} of 3 captured</dd></div>
          <div><dt>Location</dt><dd>{location || "Add location"}</dd></div>
          <div><dt>Owner</dt><dd>{details.owner || "Confirm holder"}</dd></div>
          <div className="summaryCondition"><dt>Condition</dt><dd>{condition || "No priority areas added"}</dd></div>
        </dl>
        {complete ? <div className="intakeComplete"><b>Profile ready.</b><span>Your confirmed vehicle details can now be included with the enquiry.</span><a href="/#quote">Request a quote ↗</a></div> : <button disabled={readiness < 100} onClick={() => setComplete(true)}>Prepare booking profile →</button>}
      </section>

      {activeCapture && (
        <div className="cameraOverlay" role="dialog" aria-modal="true" aria-label={`Capture ${activeCapture}`}>
          <video ref={videoRef} playsInline muted />
          <div className={`cameraGuide ${captures.find((item) => item.kind === activeCapture)?.frame}`}><span>{captures.find((item) => item.kind === activeCapture)?.label}</span><b>Keep the subject inside the guide</b></div>
          <header><button onClick={closeCamera}>Close ×</button><span>WHIPKLEAN CAMERA</span><button onClick={() => setFacingMode((mode) => mode === "environment" ? "user" : "environment")}>Flip ↻</button></header>
          {cameraError ? <div className="cameraError"><p>{cameraError}</p><button onClick={closeCamera}>Choose a photo instead</button></div> : <button className="shutter" onClick={takePhoto} aria-label="Take photo"><i /></button>}
        </div>
      )}
    </main>
  );
}
