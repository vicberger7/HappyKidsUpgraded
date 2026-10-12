import { useTranslation } from "react-i18next";
import css from "./FoodMenu.module.css";
import img1 from "../assets/images/menu/menu1.jpg";
import img2 from "../assets/images/menu/menu2.jpg";
import img3 from "../assets/images/menu/menu3.jpg";
import qrImage from "../assets/images/menu/QRcode.png";

export default function FoodMenu() {
  const { t } = useTranslation();
  return (
    <div className={css.foodMenuContainer}>
      <h1 className={css.titleMenu}>{t("foodMenu.title")}</h1>
      <p className={css.description}>{t("foodMenu.description")}</p>
      <div className={css.menuItems}>
        <div className={css.menuItem}>
          <img src={img1} alt="menu1" />
        </div>
        <div className={css.menuItem}>
          <img src={img2} alt="menu2" />
        </div>
        <div className={css.menuItem}>
          <img src={img3} alt="menu3" />
        </div>
      </div>
      <div className={css.qrContainer}>
        <p className={css.qrText}>
          {t("foodMenu.scanQr") }
        </p>
        <img src={qrImage} alt="QR Code to menu" className={css.qrCode} />
      </div>
    </div>
  );
}
