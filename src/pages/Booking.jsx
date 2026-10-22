// booking.jsx

import { useState } from "react";
import css from "./Booking.module.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useTranslation } from "react-i18next";
import { supabase } from "../supabase/supabaseClient";
import emailjs from "@emailjs/browser";

export default function Booking() {
  const [showModalHoursError, setShowModalHoursError] = useState(false);
  const [showEmailSuccessModal, setShowEmailSuccessModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  const { t, i18n } = useTranslation();

  const hours = ["12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

  const tomorrow = new Date();
  tomorrow.setHours(0, 0, 0, 0);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedHour(null);
    setShowTimeModal(true);
  };

  const handleTimeContinue = () => {
    if (!selectedHour) {
      setShowModalHoursError(true);

      setTimeout(() => {
        setShowModalHoursError(false);
      }, 3000);

      return;
    }

    setShowTimeModal(false);
    setShowConfirmationModal(true);
  };

  const handleConfirmationContinue = () => {
    setShowConfirmationModal(false);
    setShowDetailsForm(true);
  };

  const formattedDate = selectedDate
    ? selectedDate
        .toLocaleDateString(i18n.language === "en" ? "en-US" : "uk-UA", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        })
        .replace(/^./, (char) => char.toUpperCase())
    : "";

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿА-Яа-яІіЇїЄєҐґ' -]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // const phoneRegex = /^\+?[0-9\s()-]{7,20}$/;
    const phoneRegex = /^\+380\d{9}$/;

    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.contactNumber.trim();
    const message = formData.message.trim();

    if (!name) {
      newErrors.name = t("booking.validation.nameRequired");
    } else if (name.length < 2) {
      newErrors.name = t("booking.validation.nameMin");
    } else if (name.length > 100) {
      newErrors.name = t("booking.validation.nameMax");
    } else if (!nameRegex.test(name)) {
      newErrors.name = t("booking.validation.nameInvalid");
    }

    if (!email) {
      newErrors.email = t("booking.validation.emailRequired");
    } else if (!emailRegex.test(email)) {
      newErrors.email = t("booking.validation.emailInvalid");
    }

    if (!phone) {
      newErrors.contactNumber = t("booking.validation.contactNumberRequired");
    } else if (!phoneRegex.test(phone)) {
      newErrors.contactNumber = t("booking.validation.contactNumberInvalid");
    }

    if (message.length > 1000) {
      newErrors.message = t("booking.validation.messageMax");
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!selectedDate || !selectedHour) {
      return;
    }

    try {
      const { error } = await supabase
        .from("bookings")
        .insert([
          {
            booking_date: selectedDate.toISOString().split("T")[0],
            booking_time: selectedHour,
            name: formData.name.trim(),
            email: formData.email.trim(),
            contact_number: formData.contactNumber.trim(),
            message: formData.message.trim(),
          },
        ])
        .select();

      if (error) {
        console.error("Supabase booking error:", error);
        return;
      }

      const templateParams = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        booking_date: selectedDate.toISOString().split("T")[0],
        booking_time: selectedHour,
        booking_number: formData.contactNumber.trim(),
        message: formData.message.trim(),
      };

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams,
        {
          publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
        },
      );

      setShowDetailsForm(false);
      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);
        setShowEmailSuccessModal(true);

        setTimeout(() => {
          setShowEmailSuccessModal(false);
        }, 4000);
      }, 4000);

      setSelectedDate(null);
      setSelectedHour(null);
      setFormData({
        name: "",
        email: "",
        contactNumber: "",
        message: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const onClose = () => {
    setShowTimeModal(false);
    setShowConfirmationModal(false);
    setShowDetailsForm(false);
    setSelectedDate(null);
    setSelectedHour(null);
  };

  return (
    <div className={css.bookingContainer}>
      <h1 className={css.title}>{t("booking.title")}</h1>
      <div className={css.bookingCalendar}>
        <Calendar
          locale={i18n.language === "en" ? "en-US" : "uk-UA"}
          minDate={tomorrow}
          className={css.calendar}
          onChange={handleDateChange}
          formatMonthYear={(locale, date) => {
            const formatted = date.toLocaleDateString(locale, {
              month: "long",
              year: "numeric",
            });

            return formatted.replace(/\sр\.$/, "");
          }}
        />
      </div>
      {/* TIME MODAL */}
      {showTimeModal && (
        <div className={css.modalOverlay}>
          <div className={css.modal}>
            <button
              type="button"
              className={css.closeModalButton}
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
            <h2>{t("booking.selectTime")}</h2>

            <div className={css.timeList}>
              {hours.map((time) => (
                <button
                  key={time}
                  className={`${css.timeButton} ${
                    selectedHour === time ? css.selectedTime : ""
                  }`}
                  onClick={() => setSelectedHour(time)}
                >
                  {time}
                </button>
              ))}
            </div>

            <button className={css.continueButton} onClick={handleTimeContinue}>
              {t("booking.continueButton")}
            </button>
          </div>
        </div>
      )}

      {/* HOUR ERROR MODAL */}
      {showModalHoursError && (
        <div className={css.alertModalOverlay}>
          <div className={css.modal}>
            <button
              type="button"
              className={css.closeModalButton}
              onClick={() => setShowModalHoursError(false)}
              aria-label="Close"
            >
              ×
            </button>

            <p>{t("booking.hoursError")}</p>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL */}
      {showConfirmationModal && (
        <div className={css.modalOverlay}>
          <div className={css.modal}>
            <button
              type="button"
              className={css.closeModalButton}
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
            <div className={css.bookingDetails}>
              <div className={css.detailRow}>
                <span>{t("booking.eventStarts")}:</span>
                <strong>{selectedHour}</strong>
              </div>

              <div className={css.detailRow}>
                <span>{t("booking.date")}:</span>
                <strong>{formattedDate}</strong>
              </div>
            </div>

            <button
              className={css.continueButton}
              onClick={handleConfirmationContinue}
            >
              {t("booking.continueButton")}
            </button>
          </div>
        </div>
      )}
      {/* DETAILS FORM */}
      {showDetailsForm && (
        <div className={css.modalOverlay}>
          <div className={css.modal}>
            <button
              type="button"
              className={css.closeModalButton}
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
            <h2>{t("booking.yourDetails")}</h2>

            <form className={css.detailsForm} onSubmit={handleConfirmBooking}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t("booking.form.name")}
                autoComplete="name"
                maxLength={100}
                required
              />

              {errors.name && <span className={css.error}>{errors.name}</span>}

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t("booking.form.email")}
                autoComplete="email"
                required
              />

              {errors.email && (
                <span className={css.error}>{errors.email}</span>
              )}

              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder={t("booking.form.contactNumber")}
                autoComplete="tel"
                maxLength={20}
                required
              />

              {errors.contactNumber && (
                <span className={css.error}>{errors.contactNumber}</span>
              )}

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder={t("booking.form.message")}
                rows="4"
                maxLength={1000}
              />

              {errors.message && (
                <span className={css.error}>{errors.message}</span>
              )}

              <button type="submit" className={css.confirmBookingButton}>
                {t("booking.confirmBooking")}
              </button>
            </form>
          </div>
        </div>
      )}
      {showSuccessModal && (
        <div className={css.alertModalOverlay}>
          <div className={css.modal}>
            <p>{t("booking.success")}</p>
          </div>
        </div>
      )}
      {showEmailSuccessModal && (
        <div className={css.alertModalOverlay}>
          <div className={css.modal}>
            <p>{t("booking.emailSuccess")}</p>
          </div>
        </div>
      )}
    </div>
  );
}
