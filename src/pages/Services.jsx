import css from "./Services.module.css";
import { useTranslation } from "react-i18next";
import img1 from "../assets/images/services/animationsAndShows.jpeg";
import img2 from "../assets/images/services/familyLeisure.png";
import img3 from "../assets/images/services/gamingRoom2.png";
import img4 from "../assets/images/services/partiesAndBDs.png";
import img5 from "../assets/images/services/restaurant.png";

export default function Services() {
  const { t } = useTranslation();

  const services = [
    { text: t("services.animationsAndShows"), img: img1 },
    { text: t("services.familyLeisure"), img: img2 },
    { text: t("services.gamingRoom"), img: img3 },
    { text: t("services.partiesAndBDs"), img: img4 },
    { text: t("services.restaurant"), img: img5 },
  ];

  return (
    <div className={css.servicesContainer}>
      <div className={css.cards}>
        {services.map((service, index) => {
          const [firstSentence, ...restSentences] = service.text.split(".");
          const description =
            restSentences
              .map((s) => s.trim())
              .filter(Boolean) 
              .join(". ") + (restSentences.length ? "." : ""); 

          return (
            <div className={css.card} key={index}>
              <div className={css.imgWrapper}>
                <img src={service.img} alt={firstSentence} />
              </div>
              <h2>
                <span className={css.title}>{firstSentence}</span>
                {description && <span className={css.desc}>{description}</span>}
              </h2>
            </div>
          );
        })}
      </div>
    </div>
  );
}
