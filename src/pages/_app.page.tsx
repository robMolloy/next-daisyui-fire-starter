import { Typography } from "@/components";
import { auth } from "@/config/firebaseConfig";
import { UserAuthCreateLoginForm } from "@/modules/authUserForm";
import { Layout } from "@/modules/layout";
import { useAuthStore } from "@/stores/useAuthStore";
import "@/styles/globals.css";
import { onAuthStateChanged } from "firebase/auth";
import type { AppProps } from "next/app";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const authStore = useAuthStore();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      authStore.setIsLoggedIn(!!user);
    });
  }, []);
  return (
    <Layout>
      {authStore.isLoggedIn === undefined && <div>Loading...</div>}
      {authStore.isLoggedIn === true && <Component {...pageProps} />}
      {authStore.isLoggedIn === false && (
        <Typography fullPage>
          <UserAuthCreateLoginForm />
        </Typography>
      )}
    </Layout>
  );
}
