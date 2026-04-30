import { Zap, TrendingUp, Microscope, type LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  iconVariant: "purple" | "teal" | "rose";
  title: string;
  description: string;
  id: string;
}

const FEATURES: Feature[] = [
  {
    icon: Zap,
    iconVariant: "purple",
    id: "feature-denoising",
    title: "AI Image Denoising",
    description:
      "Advanced deep-learning denoising removes sensor noise and compression artifacts, producing crystal-clear endoscopic images even in challenging lighting conditions.",
  },
  {
    icon: TrendingUp,
    iconVariant: "teal",
    id: "feature-contrast",
    title: "Contrast Enhancement",
    description:
      "Adaptive contrast enhancement brings out subtle mucosal features and vascular patterns that may be invisible to the naked eye, improving diagnostic yield.",
  },
  {
    icon: Microscope,
    iconVariant: "rose",
    id: "feature-polyp",
    title: "Polyp Detection",
    description:
      "State-of-the-art object detection localises and highlights polyps in real time, reducing miss rates and supporting early-stage colorectal cancer prevention.",
  },
];

export default function FeatureCards() {
  return (
    <section className="features-section fade-in fade-in-delay-2">
      <h2>Why EndoAssist?</h2>
      <p className="section-subtitle">
        A comprehensive AI pipeline built for endoscopic image analysis
      </p>

      <div className="features-grid">
        {FEATURES.map(({ icon: Icon, iconVariant, id, title, description }) => (
          <div className="feature-card" id={id} key={id}>
            <div className={`feature-icon ${iconVariant}`}>
              <Icon size={22} />
            </div>
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
