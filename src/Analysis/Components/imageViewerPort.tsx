import { ImageOff, Upload } from "lucide-react";

type ColorVariant = "purple" | "teal" | "rose" | "amber";

interface ImageViewportProps {
  /** Title shown in the header bar */
  title: string;
  /** Small badge label (e.g. "Input", "Denoised") */
  badge: string;
  /** Color accent for dot and badge */
  variant: ColorVariant;
  /** Image src URL to display. Pass null to show placeholder / skeleton */
  src: string | null;
  /** When true, show upload-zone UI and call onUpload on click/drop */
  isUpload?: boolean;
  /** Called with the selected File when the user picks / drops one */
  onUpload?: (file: File) => void;
  /** When true, show loading skeleton instead of image */
  isLoading?: boolean;
}

export default function ImageViewport({
  title,
  badge,
  variant,
  src,
  isUpload = false,
  onUpload,
  isLoading = false,
}: ImageViewportProps) {
  /* ── Drag state ─────────────────────────────────────────── */
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add("drag-over");
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove("drag-over");
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove("drag-over");
    const file = e.dataTransfer.files?.[0];
    if (file && onUpload) onUpload(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpload) onUpload(file);
  };

  const handleClick = () => {
    if (!isUpload) return;
    document.getElementById(`file-input-${badge}`)?.click();
  };

  /* ── Body content ───────────────────────────────────────── */
  const renderBody = () => {
    /* Loading skeleton */
    if (isLoading) {
      return (
        <div className="image-viewport-body skeleton" aria-label="Loading image">
          <div className="skeleton-placeholder">
            <div className="spinner" />
            <span>Processing…</span>
          </div>
        </div>
      );
    }

    /* Image ready */
    if (src) {
      return (
        <div className="image-viewport-body">
          <img src={src} alt={title} />
        </div>
      );
    }

    /* Upload zone */
    if (isUpload) {
      return (
        <div
          className="image-viewport-body upload-zone"
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          aria-label="Upload endoscopic image"
          onKeyDown={(e) => e.key === "Enter" && handleClick()}
        >
          <input
            id={`file-input-${badge}`}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileInput}
          />
          <div className="upload-placeholder">
            <div className="upload-placeholder-icon">
              <Upload size={24} />
            </div>
            <span className="upload-placeholder-text">
              Click or drag &amp; drop an image
            </span>
            <span className="upload-placeholder-hint">
              PNG, JPG, BMP — endoscopic format supported
            </span>
          </div>
        </div>
      );
    }

    /* Empty result slot */
    return (
      <div className="image-viewport-body" aria-label="No image yet">
        <div className="upload-placeholder">
          <div className="upload-placeholder-icon" style={{ background: "rgba(100,116,139,0.08)", color: "var(--text-muted)" }}>
            <ImageOff size={24} />
          </div>
          <span className="upload-placeholder-text" style={{ color: "var(--text-muted)" }}>
            Awaiting analysis
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="image-viewport" id={`viewport-${badge.toLowerCase().replace(/\s+/g, "-")}`}>
      {/* Header bar */}
      <div className="image-viewport-header">
        <div className="image-viewport-title">
          <span className={`status-dot ${variant}`} />
          {title}
        </div>
        <span className={`image-viewport-badge ${variant}`}>{badge}</span>
      </div>

      {/* Body */}
      {renderBody()}
    </div>
  );
}
