import { useState } from "react";
import { Sparkles } from "lucide-react";
import ImageViewport from "./Components/imageViewerPort";

interface AnalysisResults {
  denoised: string;
  contrast: string;
  polyp: string;
}

export default function AnalysisPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResults | null>(null);

  /* ── Handle image upload ─────────────────────────────────── */
  const handleUpload = (file: File) => {
    setUploadedFile(file);
    setResults(null);
    const url = URL.createObjectURL(file);
    setPreviewSrc(url);
  };

  /* ── Apply analysis via API ──────────────────────────────── */
  const handleApply = async () => {
    if (!uploadedFile) return;

    setIsLoading(true);
    setResults(null);

    try {
      const formData = new FormData();
      formData.append("image", uploadedFile);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("API request failed");

      const data: AnalysisResults = await response.json();
      setResults(data);
    } catch (err) {
      console.error("Analysis failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const canApply = !!uploadedFile && !isLoading;

  return (
    <div className="page-container analysis-page">
      {/* ── Page Header ───────────────────────────────────────── */}
      <div className="analysis-header fade-in">
        <h1>Endoscopic Image Analysis</h1>
        <p>
          Upload an endoscopic image, then apply AI processing to receive
          denoised, contrast-enhanced, and polyp-detected outputs.
        </p>
      </div>

      {/* ── Upload Section ────────────────────────────────────── */}
      <div className="upload-section fade-in fade-in-delay-1">
        <ImageViewport
          title="Input Image"
          badge="Input"
          variant="purple"
          src={previewSrc}
          isUpload={true}
          onUpload={handleUpload}
        />

        {/* Apply Button */}
        <div className="analysis-actions">
          <button
            id="btn-apply-analysis"
            className={`btn-apply${isLoading ? " loading" : ""}`}
            onClick={handleApply}
            disabled={!canApply}
            aria-label="Apply AI analysis"
          >
            {!isLoading && <Sparkles size={18} />}
            {isLoading ? "Analysing…" : "Apply Analysis"}
          </button>
        </div>
      </div>

      {/* ── Results Section ───────────────────────────────────── */}
      {(isLoading || results) && (
        <section className="results-section fade-in">
          <h2>Analysis Results</h2>
          <p className="results-subtitle">
            Three AI-processed outputs from your endoscopic image
          </p>

          <div className="results-grid">
            {/* Denoised */}
            <ImageViewport
              title="Denoised Image"
              badge="Denoised"
              variant="teal"
              src={results?.denoised ?? null}
              isLoading={isLoading}
            />

            {/* Contrast Enhanced */}
            <ImageViewport
              title="Contrast Enhanced"
              badge="Enhanced"
              variant="amber"
              src={results?.contrast ?? null}
              isLoading={isLoading}
            />

            {/* Polyp Detection */}
            <ImageViewport
              title="Polyp Detection"
              badge="Detected"
              variant="rose"
              src={results?.polyp ?? null}
              isLoading={isLoading}
            />
          </div>
        </section>
      )}
    </div>
  );
}