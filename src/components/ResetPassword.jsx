import { useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import css from "./ResetPassword.module.css";
import { useTranslation } from "react-i18next";

export default function ResetPassword() {
  const { t } = useTranslation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError(t("reset-password.validation.passwordMismatch"));
      return;
    }

    if (password.length < 6) {
      setError(t("reset-password.validation.passwordLength"));
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    setMessage(t("reset-password.success"));
  };

  return (
    <div className={css.resetPassword}>
      <div className={css.resetPasswordCard}>
        <h2>{t("reset-password.title")}</h2>

        <form onSubmit={handleResetPassword}>
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button type="submit">{t("reset-password.button")}</button>
        </form>

        {error && <p className={css.resetError}>{error}</p>}
        {message && <p className={css.resetSuccess}>{message}</p>}
      </div>
    </div>
  );
}
