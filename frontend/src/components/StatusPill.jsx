import React from 'react';

export default function StatusPill({ status, label }) {
  // map generic status strings to specific classes
  let pillClass = "pill-neutral";
  if (status === "pending" || status === "requested") pillClass = "pill-pending";
  if (status === "confirmed" || status === "match") pillClass = "pill-confirmed";
  if (status === "fulfilled" || status === "stored") pillClass = "pill-fulfilled";

  return (
    <span className={`pill ${pillClass}`}>
      {label || status}
    </span>
  );
}
