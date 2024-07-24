import { useNotifyStore } from "@/modules/notify";
import { useState } from "react";
import { AuthCreateUserForm, AuthLoginUserForm } from ".";

export const UserAuthCreateLoginForm = () => {
  const [formData, setFormData] = useState({
    userEmail: "",
    userPassword: "",
    userPasswordConfirm: "",
  });
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
            formData={formData}
            onFormDataChange={(newFormData) => setFormData({ ...formData, ...newFormData })}
            onLoginSuccess={() => {
              notifyStore.push({ type: "alert-success", children: "login success" });
            }}
            onLoginFail={(errMsgObj) => {
              const errMsg =
                Object.values(errMsgObj)
                  .filter((x) => !!x)
                  .join(", ") ?? "unknown error";
              notifyStore.push({ type: "alert-warning", children: `login failed: ${errMsg}` });
            }}
          />
        )}
        {mode === "create" && (
          <AuthCreateUserForm
            formData={formData}
            onFormDataChange={(newFormData) => setFormData({ ...formData, ...newFormData })}
            onCreateUserSuccess={() => {
              notifyStore.push({ type: "alert-success", children: "user created success" });
            }}
            onCreateUserFail={(initErrMsg) => {
              const errMsg = initErrMsg ? initErrMsg : "unknown error";
              notifyStore.push({ type: "alert-warning", children: `user created: ${errMsg}` });
            }}
          />
        )}
      </div>
    </div>
  );
};
