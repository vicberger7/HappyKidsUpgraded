import { useState } from "react";
import { NavLink } from "react-router-dom";
import css from "./MobileHeader.module.css";
import logo from "../assets/images/HappyKidsLogo.png";
import admin from "../assets/images/adminIcon.png";
import { useTranslation } from "react-i18next";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import AdminLogin from "../pages/AdminLogin";

export default function MobileHeader() {
  const [open, setOpen] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const { t, i18n } = useTranslation();

  const toggleLang = () => {
    const newLang = i18n.language === "ua" ? "en" : "ua";
    i18n.changeLanguage(newLang);
  };

  return (
    <>
      <header className={css.header}>
        <div
          className={css.logo}
          style={{
            cursor: "pointer",
          }}
        >
          <NavLink to="/">
            <img src={logo} alt="Happy Kids Logo" />
          </NavLink>
        </div>

        <button onClick={toggleLang} className={css.langToggle}>
          {i18n.language === "ua" ? "EN" : "UA"}
        </button>

        <div className={css.socials}>
          <a
            href="https://www.facebook.com/happy.kids.980967"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook />
          </a>

          <a
            href="https://www.instagram.com/happy.kids_2017?igsh=ZzR6eWg3bHZjbDEz"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram />
          </a>

          <img
            src={admin}
            alt="Admin Logo"
            className={css.adminLogo}
            onClick={() => setShowAdminLogin(true)}
          />
        </div>

        <div className={css.burger} onClick={() => setOpen(true)}>
          ☰
        </div>
      </header>

      {/* Overlay Menu */}
      <div className={`${css.menu} ${open ? css.open : ""}`}>
        <div className={css.closeWrapper}>
          <button className={css.close} onClick={() => setOpen(false)}>
            ✕
          </button>
        </div>

        <nav>
          <NavLink to="/" onClick={() => setOpen(false)}>
            {t("nav.home")}
          </NavLink>

          <NavLink to="/about" onClick={() => setOpen(false)}>
            {t("nav.about")}
          </NavLink>

          <NavLink to="/services" onClick={() => setOpen(false)}>
            {t("nav.services")}
          </NavLink>

          <NavLink to="/food-menu" onClick={() => setOpen(false)}>
            {t("nav.food-menu")}
          </NavLink>

          <NavLink to="/gallery" onClick={() => setOpen(false)}>
            {t("nav.gallery")}
          </NavLink>

          <NavLink to="/career" onClick={() => setOpen(false)}>
            {t("nav.career")}
          </NavLink>

          <NavLink to="/contact" onClick={() => setOpen(false)}>
            {t("nav.contact")}
          </NavLink>
          <NavLink to="/booking" onClick={() => setOpen(false)}>
            {t("nav.booking")}
          </NavLink>
        </nav>
      </div>
      {/* Admin Login */}
      {showAdminLogin && (
        <AdminLogin onClose={() => setShowAdminLogin(false)} />
      )}
    </>
  );
}
