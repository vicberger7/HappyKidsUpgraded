import css from "./Career.module.css";
import { useTranslation } from "react-i18next";
import emailjs from "@emailjs/browser";
export default function Career() {
  const { t } = useTranslation();

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
         import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        e.target,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      )
      .then(() => {
        alert("Message sent successfully!");
      })
      .catch((error) => {
        console.error(error);
        alert("Failed to send message.");
      });

    e.target.reset();
  };

  return (
    <div className={css.careerContainer}>
      <div className={css.textContainer}>
        <h1>{t("career.title")}</h1>
        <p>{t("career.description1")}</p>
        <p>{t("career.description2")}</p>
        <p>{t("career.description3")}</p>
      </div>
      <div className={css.formContainer}>
        <form onSubmit={handleSubmit}>
          <div className={css.namePhone}>
            <label className={css.name}>
              <input
                type="text"
                name="name"
                placeholder={t("career.form.name")}
                required
              />
            </label>
            <label className={css.contactNumber}>
              <input
                type="text"
                name="contactNumber"
                placeholder={`${t("career.form.contactNumber")} (${t("career.form.optional")})`}
              />
            </label>
          </div>
          <label className={css.email}>
            <input
              type="email"
              name="email"
              placeholder={t("career.form.email")}
              required
            />
          </label>
          <label className={css.subject}>
            <input
              type="text"
              name="subject"
              placeholder={t("career.form.subject")}
            />
          </label>
          <label className={css.message}>
            <textarea
              type="text"
              name="message"
              placeholder={t("career.form.message")}
              required
            />
          </label>
          <button className={css.sendButton} type="submit">
            {t("career.form.sendButton")}
          </button>
        </form>
      </div>
    </div>
  );
}
