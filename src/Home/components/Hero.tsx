import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="home-hero fade-in">
      <div className="home-hero-badge">
        <span className="dot" />
        AI-Powered Medical Imaging
      </div>

      <h1>
        Smarter Endoscopy
        <br />
        with <span className="gradient-text">AI Assistance</span>
      </h1>

      <p className="home-hero-subtitle">
        EndoAssist enhances endoscopic procedures through advanced AI image
        processing — delivering real-time denoising, contrast enhancement, and
        automated polyp detection to support clinical decision-making.
      </p>

      <Link to="/analysis" className="home-hero-cta" id="cta-go-analysis">
        Start Analysis
        <ArrowRight size={18} />
      </Link>
    </section>
  );
}
