import { ArrowRight, FileText, Mic, Search, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="page">
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">Village public service desk</p>
          <h1>Report local problems by speaking in your own language.</h1>
          <p className="hero-copy">
            Speak, review the English translation, submit your complaint, and track the action taken by Panchayat staff.
          </p>
          <div className="hero-actions">
            <Link className="primary-button big-button" to="/submit"><Mic size={24} /> Speak Your Problem</Link>
            <Link className="secondary-button big-button" to="/track"><Search size={22} /> Track Complaint</Link>
          </div>
        </div>
      </section>

      <section className="feature-grid" aria-label="Service steps">
        <article className="feature-card">
          <Mic size={30} />
          <h2>Speak</h2>
          <p>Use the phone microphone and record the problem in a supported local language.</p>
        </article>
        <article className="feature-card">
          <FileText size={30} />
          <h2>Submit</h2>
          <p>Add village, ward, address, category, and an optional photo for clear follow-up.</p>
        </article>
        <article className="feature-card">
          <ShieldCheck size={30} />
          <h2>Resolve</h2>
          <p>Panchayat members securely review, assign, update, and respond to complaints.</p>
        </article>
      </section>

      <section className="wide-band">
        <h2>For Panchayat service teams</h2>
        <p>Log in to view real complaints from MongoDB, filter them, assign work, and store every status update.</p>
        <Link className="text-link" to="/admin/login">Open staff dashboard <ArrowRight size={18} /></Link>
      </section>
    </div>
  );
}
