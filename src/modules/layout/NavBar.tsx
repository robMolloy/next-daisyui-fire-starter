import React from "react";

export type TNavbarProps = {
  OpenDrawerWrapper?: React.FC<{ children: React.ReactNode }>;
  leftChildren?: React.ReactNode;
  centerChildren?: React.ReactNode;
  rightChildren?: React.ReactNode;
  bottomChildren?: React.ReactNode;
};

export const NavBar = (p: TNavbarProps) => {
  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full">
        <div className="flex flex-1">{p.leftChildren}</div>
        <div className="">
          <div>{p.centerChildren}</div>
        </div>
        <div className="flex flex-1">{p.rightChildren}</div>
      </div>
      <div className="flex w-full">
        <div className="flex flex-1">{p.bottomChildren}</div>
      </div>
    </div>
  );
};

export const NavBarContainer = (p: { children: React.ReactNode }) => {
  return (
    <div className="sticky top-0 z-10">
      <div className="navbar w-full border-b bg-base-300">{p.children}</div>
    </div>
  );
};

export const NavBarDropdown = (p: {
  children: React.ReactNode;
  labelChildren: (p: { tabIndex: 0 }) => React.JSX.Element;
}) => {
  return (
    <div className="dropdown dropdown-end dropdown-bottom">
      <p.labelChildren tabIndex={0} />
      <div
        tabIndex={0}
        className="dropdown-content mt-1 rounded-box border bg-base-100 p-0 shadow"
        style={{ opacity: "0.94" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="max-h-[75vh] min-w-52 overflow-y-auto rounded-box"
          onClick={(e) => e.stopPropagation()}
        >
          {p.children}
        </div>
      </div>
    </div>
  );
};
