import { useNotifyStore } from "@/modules/notify";
import { useState } from "react";
import { AuthCreateUserForm, AuthLoginUserForm } from ".";

export const UserAuthCreateLoginForm = () => {
  const notifyStore = useNotifyStore();

  const [mode, setMode] = useState<"login" | "create">("login");

  return (
    <div
      className="box card border-2 border-base-content bg-base-300"
      style={{ boxShadow: "7px 7px 13px rgba(0, 0, 0, 0.5)" }}
    >
      <span role="tablist" className="tabs tabs-bordered">
        <a
          role="tab"
          className={`tab h-10 no-underline ${mode === "login" ? "tab-active" : "opacity-50"}`}
          onClick={() => setMode("login")}
        >
          Login
        </a>
        <a
          role="tab"
          className={`tab h-10 no-underline ${mode === "create" ? "tab-active" : "opacity-50"}`}
          onClick={() => setMode("create")}
        >
          Create
        </a>
      </span>
      <div className="card-body items-center text-center">
        {mode === "login" && (
          <AuthLoginUserForm
            onLoginSuccess={() => {
              notifyStore.push({ type: "alert-success", text: "login success" });
            }}
            onLoginFail={() => {
              notifyStore.push({ type: "alert-warning", text: "login failed" });
            }}
          />
        )}
        {mode === "create" && (
          <AuthCreateUserForm
            onCreateUserSuccess={() => {
              notifyStore.push({ type: "alert-success", text: "user created success" });
            }}
            onCreateUserFail={() => {
              notifyStore.push({ type: "alert-warning", text: "user created failed" });
            }}
          />
        )}
      </div>
    </div>
  );
};
