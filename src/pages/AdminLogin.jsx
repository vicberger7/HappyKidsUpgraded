// AdminLogin.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import css from "./AdminLogin.module.css";
import { loginWithSupabase } from "../supabase/supabaseLoginService";
import { useTranslation } from "react-i18next";
import { FaEye, FaEyeSlash } from "react-icons/fa";
 import { resetPassword } from "../supabase/supabaseLoginService";




export default function AdminLogin({ onClose }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogin = async (e) => {
    e.preventDefault();

    const result = await loginWithSupabase(email, password);

    if (result.success) {
      onClose();
      navigate("/admin");
    } else {
      alert(result.message || t("login.error"));
    }
  };

  const handleForgotPassword = async () => {
    const result = await resetPassword(email);

    if (result.success) {
      alert(result.message);
    } else {
      alert(result.message);
    }
  };

  return (
    <div className={css.overlay} onClick={onClose}>
      <div className={css.loginContainer} onClick={(e) => e.stopPropagation()}>
        <button type="button" className={css.closeButton} onClick={onClose}>
          ×
        </button>
        <h1>{t("login.title")}</h1>
        <form onSubmit={handleLogin} className={css.loginForm}>
          <input
            type="email"
            autoComplete="email"
            placeholder={t("login.emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={css.loginInput}
            required
          />
          <div className={css.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              autoCorrect="off"
              autoCapitalize="off"
              autoComplete="off"
              placeholder={t("login.passwordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={css.loginInput}
            />

            <button
              type="button"
              className={css.eyeButton}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
           <button 
           type="button" 
           onClick={handleForgotPassword} 
           className={css.forgotPasswordLink}>
            {t("login.forgotPassword")}
          </button> 
          <button type="submit" className={css.loginButton}>
            {t("login.button")}
          </button>
        </form>
      </div>

    </div>
  );
}
