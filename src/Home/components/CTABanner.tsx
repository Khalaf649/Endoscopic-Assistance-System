import { Link } from "react-router-dom";
import { ShieldCheck, ScanSearch } from "lucide-react";

export default function CTABanner() {
  return (
    <section
      className="fade-in fade-in-delay-3"
      style={{
        textAlign: "center",
        padding: "48px 0 24px",
        borderTop: "1px solid var(--surface-border)",
      }}
    >
      <ShieldCheck
        size={36}
        style={{ color: "var(--teal)", marginBottom: 16 }}
      />

      <h2 style={{ fontSize: "1.6rem", marginBottom: 10 }}>
        Ready to analyse your images?
      </h2>

      <p
        style={{
          color: "var(--text-secondary)",
          marginBottom: 24,
          fontSize: "0.95rem",
        }}
      >
        Upload an endoscopic image and receive three enhanced outputs in seconds.
      </p>

      <Link
        to="/analysis"
        className="home-hero-cta"
        id="cta-go-analysis-2"
      >
        Open Analysis Tool
        <ScanSearch size={18} />
      </Link>
    </section>
  );
}
