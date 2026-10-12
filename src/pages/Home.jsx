import { useState, useEffect } from "react";
import css from "./Home.module.css";
import { useTranslation, Trans } from "react-i18next";

import happyKids from "../assets/images/happyKids2.png";
import happyKidsMobile from "../assets/images/HappyKidsMobile.png";
export default function Home() {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 425);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 425);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={css.homeContainer}>
      <img className={css.image} src={happyKids} alt="happyKids" />
      <img
        className={css.imageMobile}
        src={happyKidsMobile}
        alt="happyKidsMobile"
      />
      <h1 className={css.title}>
        {isMobile ? (
          <Trans i18nKey="home.welcomeMobile" components={[<br />]}>
            Ласкаво просимо до Happy Kids!
          </Trans>
        ) : (
          t("home.welcome")
        )}
      </h1>
      <p className={css.description}>{t("home.description")}</p>
    </div>
  );
}
