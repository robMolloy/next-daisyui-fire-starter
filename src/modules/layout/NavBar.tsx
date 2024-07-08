import Link from "next/link";
import React from "react";

const BurgerMenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    className="inline-block h-6 w-6 stroke-current"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4 6h16M4 12h16M4 18h16"
    ></path>
  </svg>
);

export type TNavbarProps = {
  OpenDrawerWrapper: React.FC<{ children: React.ReactNode }>;
  children: React.ReactNode;
};

export const NavBar = (p: TNavbarProps) => {
  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full">
        <div className="block sm:hidden">
          <p.OpenDrawerWrapper>
            <BurgerMenuIcon />
          </p.OpenDrawerWrapper>
        </div>

        <div className="flex-1">
          <Link href="/" className="btn btn-ghost text-xl">
            next-daisyui-fire-starter
          </Link>
        </div>
        <div className="flex gap-4">
          <div>{p.children}</div>
        </div>
      </div>
    </div>
  );
};
