// src/components/Sidebar.jsx

import { useState } from "react";
import { NavLink } from "react-router-dom";
import css from "./Sidebar.module.css";
import logo from "../assets/images/HappyKidsLogo.png";
import admin from "../assets/images/adminIcon.png";
import AdminLogin from "../pages/AdminLogin";
import { useTranslation } from "react-i18next";
import { FaFacebook, FaInstagram } from "react-icons/fa";

export default function Sidebar() {
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const { t, i18n } = useTranslation();

  const toggleLang = () => {
    const newLang = i18n.language === "ua" ? "en" : "ua";
    i18n.changeLanguage(newLang);
  };

  return (
    <div className={css.menu}>
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
      <nav className={css.nav}>
        <ul className={css.navLinks}>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${css.link} ${isActive ? css.red : ""}`
              }
            >
              {t("nav.home")}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `${css.link} ${isActive ? css.orange : ""}`
              }
            >
              {t("nav.about")}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/services"
              className={({ isActive }) =>
                `${css.link} ${isActive ? css.yellow : ""}`
              }
            >
              {t("nav.services")}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/food-menu"
              className={({ isActive }) =>
                `${css.link} ${isActive ? css.green : ""}`
              }
            >
              {t("nav.food-menu")}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/gallery"
              className={({ isActive }) =>
                `${css.link} ${isActive ? css.lightblue : ""}`
              }
            >
              {t("nav.gallery")}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/career"
              className={({ isActive }) =>
                `${css.link} ${isActive ? css.blue : ""}`
              }
            >
              {t("nav.career")}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `${css.link} ${isActive ? css.indigo : ""}`
              }
            >
              {t("nav.contact")}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/booking"
              className={({ isActive }) =>
                `${css.link} ${isActive ? css.black : ""}`
              }
            >
              {t("nav.booking")}
            </NavLink>
          </li>
        </ul>
      </nav>
      <button onClick={toggleLang} className={css.langToggle}>
        {i18n.language === "ua" ? "EN" : "UA"}
      </button>
      <div className={css.icons}>
        <div className={css.adminWrapper}>
          <img
            src={admin}
            alt="Admin Logo"
            className={css.adminLogo}
            onClick={() => setShowAdminLogin(true)}
          />
          <span className={css.tooltip}>Admin only</span>
        </div>
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
        </div>
      </div>
      {showAdminLogin && (
        <AdminLogin onClose={() => setShowAdminLogin(false)} />
      )}
    </div>
  );
}
