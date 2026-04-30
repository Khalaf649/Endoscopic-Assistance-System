interface Stat {
  value: string;
  label: string;
}

const STATS: Stat[] = [
  { value: "95%+", label: "Polyp Detection Accuracy" },
  { value: "< 2s", label: "Average Processing Time" },
  { value: "3-in-1", label: "Image Enhancement Pipeline" },
];

export default function StatsRow() {
  return (
    <div className="stats-row fade-in fade-in-delay-1">
      {STATS.map(({ value, label }) => (
        <div className="stat-item" key={label}>
          <div className="stat-value">{value}</div>
          <div className="stat-label">{label}</div>
        </div>
      ))}
    </div>
  );
}
