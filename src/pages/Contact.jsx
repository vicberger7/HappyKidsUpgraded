import css from "./Contact.module.css";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { useTranslation } from "react-i18next";
import { FaEnvelope, FaClock, FaPhone } from "react-icons/fa";

export default function ContactUs() {
  const { t } = useTranslation();
  return (
    <>
      <main>
        <article className={css.contactUs}>
          <div className={css.contactUsData}>
            <div className={css.mailCard}>
              <div className={css.mailText}>
                <div className={css.mailIcon}>
                  <FaEnvelope size={24} color="blue" />
                  <p className={css.mailLine}>{t("contact.emailLine")}</p>
                </div>
                <a
                  data-tooltip-id="emailTip"
                  data-tooltip-content={t("contact.emailTooltip")}
                  href="mailto:happy.kids.2017.mukachevo@gmail.com"
                  className={css.mail}
                >
                  happy.kids.2017.mukachevo@gmail.com
                </a>

                <Tooltip id="emailTip" />
              </div>
            </div>

            <div className={css.workHoursCard}>
              <div className={css.workHoursIcon}>
                <FaClock size={20} color="gray" />
                <h3 className={css.workHoursTitle}>
                  {t("contact.workHoursTitle")}
                </h3>
              </div>
              <p className={css.workHoursLine}>{t("contact.workHoursLine")}</p>
            </div>
            <div className={css.phoneCard}>
              <div className={css.phoneSection}>
                <div className={css.phoneIcon1}>
                  <FaPhone size={22} color="green" />
                  <p className={css.phoneLine}>
                    {t("contact.phone1")} +380509128814
                  </p>
                </div>
                <button
                  onClick={() => (window.location.href = "tel:+380509128814")}
                  className={css.callButton}
                >
                  {t("contact.callButton")}
                </button>
              </div>

              <div className={css.phoneSection}>
                <div className={css.phoneIcon2}>
                  <FaPhone size={22} color="green" />
                  <p className={css.phoneLine}>
                    {t("contact.phone2")} +380669202021
                  </p>
                </div>
                <button
                  onClick={() => (window.location.href = "tel:+380669202021")}
                  className={css.callButton}
                >
                  {t("contact.callButton")}
                </button>
              </div>
            </div>
          </div>

          <div className={css.addressCard}>
            <h3 className={css.addressTitle}>{t("contact.addressTitle")}</h3>
            <p className={css.getDirections}>
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=48.443328,22.721937"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("contact.getDirections")}
              </a>
            </p>
            <iframe
              src="https://www.google.com/maps?q=48.443328,22.721937&output=embed"
              width="100%"
              height="200"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </article>
      </main>
    </>
  );
}
