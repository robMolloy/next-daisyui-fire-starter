import Link from "next/link";
import { NavBar } from "./NavBar";
import { useAuthStore } from "@/stores/useAuthStore";
import { logoutFirebaseUser } from "@/utils/firebaseAuthUtils";
import { auth } from "@/config/firebaseConfig";

export type TPageLink = {
  label: string;
  href: string;
  alwaysShow?: true;
  horizontalClassName?: string;
};

const CloseDrawerWrapper: React.FC<{ children?: React.ReactNode }> = (p) => {
  return (
    <label htmlFor="sidebar" aria-label="close sidebar" className="drawer-overlay">
      {p.children}
    </label>
  );
};
const OpenDrawerWrapper: React.FC<{ children?: React.ReactNode }> = (p) => {
  return (
    <label htmlFor="sidebar" aria-label="open sidebar" className="btn btn-square btn-ghost">
      {p.children}
    </label>
  );
};

const NavBarContainer = (p: { children: React.ReactNode }) => {
  return (
    <div className="sticky top-0 z-[10]">
      <div className="navbar w-full border-b bg-base-300">{p.children}</div>
    </div>
  );
};
const DrawerContainer = (p: { children: React.ReactNode }) => {
  return <div className="m-0 min-h-full min-w-80 border-r bg-base-100 p-1">{p.children}</div>;
};

const ContainerWithSpotlightBackgroundTop = () => {
  return (
    <div className="absolute top-0 z-[-99] h-[90vh] min-w-full bg-gradient-to-tr from-base-100 via-base-100 via-75% to-primary sm:via-65%" />
  );
};

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

export const Layout = (p: { children: React.ReactNode }) => {
  const authStore = useAuthStore();
  const safeAuthStore = authStore.getSafeStore();
  return (
    <>
      <div className="drawer">
        <input id="sidebar" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <NavBarContainer>
            <NavBar
              leftChildren={
                <div className="flex gap-2 pl-4">
                  <div className="block sm:hidden">
                    <OpenDrawerWrapper>
                      <BurgerMenuIcon />
                    </OpenDrawerWrapper>
                  </div>
                  <Link href="/" className="btn p-0 text-xl">
                    next-daisyui-fire-starter
                  </Link>
                </div>
              }
              rightChildren={
                <div className="flex w-full justify-end">
                  {safeAuthStore.status === "logged_in" && (
                    <Link
                      className="btn btn-sm hover:underline"
                      href="/"
                      onClick={() => logoutFirebaseUser({ auth: auth })}
                    >
                      Log Out
                    </Link>
                  )}
                </div>
              }
              bottomChildren={
                <div className="breadcrumbs pl-4 text-sm">
                  <ul>
                    <li>
                      <a>Home</a>
                    </li>
                    <li>
                      <a>Documents</a>
                    </li>
                    <li>Add Document</li>
                  </ul>
                </div>
              }
            />
          </NavBarContainer>
          {p.children}
          <ContainerWithSpotlightBackgroundTop />
        </div>
        <div className="drawer-side z-[11]">
          <CloseDrawerWrapper />

          <DrawerContainer>
            <CloseDrawerWrapper>asd </CloseDrawerWrapper>
          </DrawerContainer>
        </div>
      </div>
    </>
  );
};
