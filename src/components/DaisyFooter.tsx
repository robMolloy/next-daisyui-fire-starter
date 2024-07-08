import React from "react";

export const DaisyFooter = (p: { children: React.ReactNode; id?: string }) => {
  return (
    <footer className="footer border-t bg-neutral py-16 text-neutral-content" id={p.id}>
      <div className="block w-full">{p.children}</div>
    </footer>
  );
};
