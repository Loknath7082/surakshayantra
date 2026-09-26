export default function UptimeIndicator() {
  return (
    <div className="flex items-center gap-2">
      <span className="h-2 w-2 rounded-full bg-state-success" />
      <span className="text-sm text-muted">All systems operational</span>
    </div>
  );
}
