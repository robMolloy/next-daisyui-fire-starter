import { Typography } from "@/components";
import { auth } from "@/config/firebaseConfig";
import { UserAuthCreateLoginForm } from "@/modules/authUserForm";
import { Layout } from "@/modules/layout";
import { Notify } from "@/modules/notify";
import { useAuthStore, useAuthStoreBase } from "@/stores/useAuthStore";
import "@/styles/globals.css";
import { onAuthStateChanged } from "firebase/auth";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const authStoreBase = useAuthStoreBase();
  const authStore = useAuthStore();
  const safeAuthStore = authStore.getSafeStore();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      authStoreBase.setUser(user);
    });
  }, []);
  return (
    <>
      <Head>
        <title>next-daisyui-fire-starter</title>
      </Head>

      <Notify />

      <Layout>
        {safeAuthStore.status === "loading" && <div>Loading...</div>}
        {safeAuthStore.status === "logged_in" && <Component {...pageProps} />}
        {safeAuthStore.status === "logged_out" && (
          <Typography fullPage>
            <UserAuthCreateLoginForm />
          </Typography>
        )}
      </Layout>
    </>
  );
}
