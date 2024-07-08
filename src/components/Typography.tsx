import React from "react";

export const Typography = (p: {
  children: React.ReactNode;
  fullPage?: boolean;
  wide?: boolean;
}) => {
  const wide = p.wide ?? false;
  const wideClass = wide ? "" : "max-w-3xl px-6";
  return (
    <div className={`prose ${wideClass} ${p.fullPage ? "py-8" : ""} mx-auto`}>{p.children}</div>
  );
};
