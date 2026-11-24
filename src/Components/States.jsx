import React from "react";
import { SkeletonCard } from "./DealCard";

export function LoadError({ message, onRetry }) {
  return (
    <div className="error-box" role="alert">
      <b>Couldn't load deals.</b> {message ? <span className="muted">({message})</span> : null}
      <div style={{ marginTop: 10 }}>
        <button className="btn" onClick={onRetry || (() => window.location.reload())}>
          Try again
        </button>
      </div>
    </div>
  );
}

export function GridSkeleton({ n = 8 }) {
  return (
    <div className="grid">
      {Array.from({ length: n }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
