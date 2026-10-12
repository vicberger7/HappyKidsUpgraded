import css from "./AboutUs.module.css";
import { useTranslation } from "react-i18next";
import img1 from "../assets/images/aboutUs/babyInTheCar.jpg";
import img2 from "../assets/images/aboutUs/BDParty.jpg";
import img3 from "../assets/images/aboutUs/cheerfulPeople.jpg";
import img4 from "../assets/images/aboutUs/gamingRoom.jpg";
import img5 from "../assets/images/aboutUs/girlWithBaloons.jpg";
import img6 from "../assets/images/aboutUs/foamParty.jpg";
import img7 from "../assets/images/aboutUs/boyAndBears.jpg";
import img8 from "../assets/images/aboutUs/colorsGame.jpg";
import img9 from "../assets/images/aboutUs/heartWall.jpg";
import img10 from "../assets/images/aboutUs/happyFamily.jpg";
export default function AboutUs() {
  const { t } = useTranslation();

  const images = [
    img1,
    img2,
    img3,
    img4,
    img5,
    img6,
    img7,
    img8,
    img9,
    img10
  ];

  return (
    <div className={css.aboutContainer}>
      <div className={css.textContainer}>
        <p className={css.description}>{t("aboutUs.description")}</p>
      </div>
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt="About Us"
          className={`${css.image} ${css["img" + i]}`}
        />
      ))}
    </div>
  );
}
