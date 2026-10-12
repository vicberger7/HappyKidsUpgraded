// AdminDashboard.jsx

import { useEffect, useState, useRef } from "react";
import {
  getBookings,
  deleteBooking,
  updateBookingStatus,
  onBookingsChange,
} from "../supabase/supabaseBookingServices";
import { isToday, parseISO, format } from "date-fns";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import css from "./AdminDashboard.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { enUS, uk } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import emailjs from "@emailjs/browser";

function sortBookings(list) {
  return list.sort((a, b) => {
    if (a.date === b.date) return a.time.localeCompare(b.time);
    return a.date.localeCompare(b.date);
  });
}

function formatLocalDate(d) {
  const local = new Date(d);
  const year = local.getFullYear();
  const month = String(local.getMonth() + 1).padStart(2, "0");
  const day = String(local.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [monthPickerOpen, setMonthPickerOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() => new Date());
  const [modalBooking, setModalBooking] = useState(null);
  const [isMobileSize, setIsMobileSize] = useState(false);

  const { t } = useTranslation();
  const { i18n } = useTranslation();

  const dateLocale = i18n.language === "en" ? enUS : uk;

  const load = async () => {
    try {
      const data = await getBookings();
      setBookings(sortBookings(Array.isArray(data) ? data : []));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    let unsubscribe;
    let cancelled = false;

    const setup = async () => {
      await load();

      if (cancelled) return;

      unsubscribe = onBookingsChange(() => {
        load();
      });
    };

    setup();

    return () => {
      cancelled = true;

      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Видалити бронювання?")) return;
    await deleteBooking(id);
    await load();
  };

  // const handleConfirmationEmail = async (b) => {
  //   try {
  //     const response = await fetch("/api/send-confirmation-email", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         clientName: b.clientName,
  //         email: b.email,
  //         date: b.date,
  //         time: b.time,
  //       }),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to send confirmation email");
  //     }

  //     await updateBookingStatus(b.id, "confirmed");

  //     setBookings((prev) =>
  //       prev.map((item) =>
  //         item.id === b.id ? { ...item, status: "confirmed" } : item,
  //       ),
  //     );

  //     alert(`Confirmation email sent to ${b.clientName}`);
  //   } catch (err) {
  //     console.error("Error sending confirmation email:", err);
  //     alert("Error sending confirmation email.");
  //   }
  // };

  
const handleConfirmationEmail = async (b) => {
  try {
    const templateParams = {
      name: b.clientName,
      email: b.email,
      booking_date: b.date,
      booking_time: b.time,
      booking_number: b.number,
      message: b.message || "",
    };

    // Send confirmation email using EmailJS
    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_CONFIRMATION_TEMPLATE_ID,
      templateParams,
      {
        publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      },
    );

    // Update booking status in Supabase
    await updateBookingStatus(b.id, "confirmed");

    // Update local state
    setBookings((prev) =>
      prev.map((item) =>
        item.id === b.id ? { ...item, status: "confirmed" } : item,
      ),
    );

    alert(`Confirmation email sent to ${b.clientName}`);
  } catch (err) {
    console.error("Error sending confirmation email:", err);
    alert("Error sending confirmation email.");
  }
};



  const handleCancellationEmail = async (b) => {
    try {
      await fetch("/api/send-cancellation-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: b.clientName,
          email: b.email,
          date: b.date,
          time: b.time,
        }),
      });

      await updateBookingStatus(b.id, "cancelled");

      setBookings((prev) =>
        prev.map((item) =>
          item.id === b.id ? { ...item, status: "cancelled" } : item,
        ),
      );

      alert(`📧 Скасування надіслано на email клієнта ${b.clientName}`);
    } catch (err) {
      console.error("Error sending cancellation email:", err);
      alert("❌ Помилка при надсиланні email");
    }
  };

  const toggleCalendar = () => {
    setCalendarOpen((prev) => {
      if (prev) {
        setSelectedDate(null);
        setFilteredBookings([]);
      }
      return !prev;
    });
  };

  const total = bookings.length;
  const upcomingToday = bookings.filter((b) =>
    isToday(parseISO(b.date)),
  ).length;

  const bookingsToShow =
    filteredBookings.length > 0 ? filteredBookings : bookings;

  const bookedDatesSet = new Set(bookings.map((b) => formatLocalDate(b.date)));

  useEffect(() => {
    const checkSize = () => {
      const width = window.innerWidth;
      setIsMobileSize(width >= 350 && width <= 430);
    };
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  const workingHours = (() => {
    const start = 8 * 60 + 30;
    const end = 18 * 60;
    const arr = [];
    for (let t = start; t <= end; t += 30) {
      const h = Math.floor(t / 60)
        .toString()
        .padStart(2, "0");
      const m = (t % 60).toString().padStart(2, "0");
      arr.push(`${h}:${m}`);
    }
    return arr;
  })();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const endOfMonth = new Date(
    visibleMonth.getFullYear(),
    visibleMonth.getMonth() + 1,
    0,
  );

  let daysInMonth = [];
  for (let d = 1; d <= endOfMonth.getDate(); d++) {
    daysInMonth.push(
      new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), d),
    );
  }

  const hasBookingsOnDay = (date) => {
    const fd = formatLocalDate(date);
    return bookings.some((b) => formatLocalDate(b.date) === fd);
  };

  daysInMonth = daysInMonth.sort((a, b) => {
    const aHas = hasBookingsOnDay(a);
    const bHas = hasBookingsOnDay(b);
    if (aHas && !bHas) return -1;
    if (!aHas && bHas) return 1;
    return a - b;
  });

  const bookingsForSelectedDate = bookings.filter(
    (b) =>
      selectedDate && formatLocalDate(b.date) === formatLocalDate(selectedDate),
  );

  const bookingMap = {};
  bookingsForSelectedDate.forEach((b) => {
    bookingMap[b.time] = bookingMap[b.time] || [];
    bookingMap[b.time].push(b);
  });

  const monthNames = Array.from({ length: 12 }).map((_, i) =>
    format(new Date(2020, i, 1), "LLLL", { locale: uk }),
  );

  const years = [new Date().getFullYear()];

  const longPressTimer = useRef(null);

  const startLongPress = (booking) => {
    longPressTimer.current = setTimeout(() => {
      setModalBooking(booking);
    }, 600);
  };

  const cancelLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const applyMonthYear = (m, y) => {
    setVisibleMonth(new Date(y, m, 1));
    setMonthPickerOpen(false);

    if (
      !selectedDate ||
      selectedDate.getMonth() !== m ||
      selectedDate.getFullYear() !== y
    ) {
      setSelectedDate(null);
    }
  };

  const calendarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        calendarOpen &&
        calendarRef.current &&
        !calendarRef.current.contains(event.target)
      ) {
        setCalendarOpen(false);
        setSelectedDate(null);
        setFilteredBookings([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [calendarOpen]);

  return (
    <>
      <div className={css.adminPanel}>
        <h1 className={css.adminTitle}>{t("adminDashboard.title")}</h1>
        <div className={css.statsContainer}>
          <div className={css.card}>
            {t("adminDashboard.totalBookings")} <strong>{total}</strong>
          </div>
          <div className={css.card}>
            {t("adminDashboard.upcomingToday")} <strong>{upcomingToday}</strong>
          </div>
          <button
            className={css.checkDate}
            style={{ position: "relative", cursor: "pointer" }}
            onClick={toggleCalendar}
          >
            {t("adminDashboard.checkBookingsByDate")}
            {calendarOpen && (
              <div
                ref={calendarRef}
                className={css.calendarDropdown}
                onClick={(e) => e.stopPropagation()}
              >
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => {
                    setSelectedDate(date);
                  }}
                  inline
                  locale={dateLocale}
                  dateFormat="dd.MM.yyyy"
                  highlightDates={[]}
                  shouldCloseOnSelect={false}
                  dayClassName={(date) => {
                    const formatted = formatLocalDate(date);
                    return bookedDatesSet.has(formatted)
                      ? css.bookedDay
                      : undefined;
                  }}
                />
              </div>
            )}
          </button>
        </div>
        <section className={css.tableSection}>
          {bookingsToShow.length === 0 ? (
            <p className={css.noBookings}>{t("adminDashboard.noBookings")}</p>
          ) : (
            <table className={css.bookingsTable}>
              <thead>
                <tr>
                  <th>{t("adminDashboard.clientName")}</th>
                  <th>{t("adminDashboard.number")}</th>
                  <th>{t("adminDashboard.message")}</th>
                  <th>{t("adminDashboard.date")}</th>
                  <th>{t("adminDashboard.time")}</th>
                  <th>{t("adminDashboard.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {bookingsToShow.map((b) => {
                  return (
                    <tr key={b.id}>
                      <td>{b.clientName}</td>
                      <td>{b.number}</td>
                      <td>{b.message}</td>
                      <td>{b.date}</td>
                      <td>{b.time}</td>
                      <td className={css.actions}>
                        <button
                          className={`${css.btn} ${
                            b.status === "confirmed" ? css.confirmed : ""
                          }`}
                          onClick={() => handleConfirmationEmail(b)}
                          disabled={b.status === "confirmed"}
                        >
                          {t("adminDashboard.confirm")}
                        </button>
                        <button
                          className={`${css.btn} ${
                            b.status === "cancelled" ? css.cancelled : ""
                          }`}
                          onClick={() => handleCancellationEmail(b)}
                          disabled={b.status === "cancelled"}
                        >
                          {b.status === "cancelled"
                            ? t("adminDashboard.cancelled")
                            : t("adminDashboard.cancel")}
                        </button>
                        <button
                          className={`${css.btn} ${css.delete}`}
                          onClick={() => handleDelete(b.id)}
                        >
                          {t("adminDashboard.delete")}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </section>
      </div>

      {isMobileSize && (
        <div className={css.adminPanelMobile}>
          <div className={css.topRow}>
            <div
              className={css.monthField}
              onClick={() => setMonthPickerOpen(true)}
            >
              <span className={css.monthText}>
                {format(visibleMonth, "LLLL yyyy", { locale: uk })}
              </span>
              <button className={css.downArrow}>▾</button>
            </div>
          </div>

          {monthPickerOpen && (
            <div
              className={css.centerModalOverlay}
              onClick={() => setMonthPickerOpen(false)}
            >
              <div
                className={css.centerModal}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
              >
                <h3>{t("adminDashboard.selectMonthYear")}</h3>
                <div className={css.monthPickerGrid}>
                  <div className={css.monthList}>
                    {monthNames.map((mn, idx) => (
                      <button
                        key={mn}
                        onClick={() => {
                          applyMonthYear(idx, visibleMonth.getFullYear());
                        }}
                        className={css.monthItem}
                      >
                        {mn}
                      </button>
                    ))}
                  </div>
                  <div className={css.yearList}>
                    {years.map((y) => (
                      <button
                        key={y}
                        onClick={() => {
                          applyMonthYear(visibleMonth.getMonth(), y);
                        }}
                        className={css.yearItem}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                </div>
                <div className={css.modalButtonsRow}>
                  <button
                    className={css.modalBtn}
                    onClick={() => setMonthPickerOpen(false)}
                  >
                    {t("adminDashboard.close")}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className={css.daysRow} role="list">
            {daysInMonth.map((d) => {
              const dayLabel = format(d, "d", { locale: uk });
              const weekday = format(d, "EEE", { locale: uk });
              const isSelected =
                selectedDate &&
                formatLocalDate(selectedDate) === formatLocalDate(d);
              const booked = hasBookingsOnDay(d);
              return (
                <button
                  key={d.toISOString()}
                  className={`${css.dayCell} ${
                    isSelected ? css.daySelected : ""
                  }`}
                  onClick={() => {
                    setSelectedDate(d);
                  }}
                >
                  <div className={css.weekday}>{weekday}</div>
                  <div className={css.dayNumber}>{dayLabel}</div>
                  {booked && <div className={css.dot} />}
                </button>
              );
            })}
          </div>

          <div className={css.timelineWrapper}>
            <div className={css.hoursColumn}>
              {workingHours.map((h) => (
                <div key={h} className={css.hourCell}>
                  {h}
                </div>
              ))}
            </div>

            <div className={css.bookingsColumn}>
              {bookings.length === 0 ? (
                <div className={css.noDateSelected}>
                  {t("adminDashboard.noBookings")}
                </div>
              ) : !selectedDate ? (
                <div className={css.noDateSelected}>
                  {t("adminDashboard.noDateSelected")}
                </div>
              ) : (
                workingHours.map((h) => {
                  const list = bookingMap[h] || [];
                  if (list.length === 0) {
                    return <div key={h} className={css.bookingEmpty} />;
                  }

                  return (
                    <div key={h} className={css.bookingSlot}>
                      {list.map((b) => (
                        <div
                          key={b.id}
                          className={css.bookingCard}
                          onTouchStart={() => startLongPress(b)}
                          onTouchEnd={cancelLongPress}
                          onMouseDown={() => startLongPress(b)}
                          onMouseUp={cancelLongPress}
                          onMouseLeave={cancelLongPress}
                        >
                          <div className={css.bookingHead}>
                            <div className={css.clientName}>{b.clientName}</div>
                            <div className={css.phone}>{b.number}</div>
                          </div>
                          <div className={css.bookingBody}>
                            <div className={css.service}>
                              {Array.isArray(b.services)
                                ? b.services.join(", ")
                                : b.services}
                            </div>
                            <div className={css.meta}>
                              <span>
                                {b.totalDuration ?? b.duration ?? "—"} хв
                              </span>
                              <span>{b.totalPrice ?? b.price ?? 0} грн</span>
                            </div>
                            <div className={css.status}>{b.status}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {modalBooking && (
            <div
              className={css.centerModalOverlay}
              onClick={() => setModalBooking(null)}
            >
              <div
                className={css.centerModal}
                onClick={(e) => e.stopPropagation()}
              >
                <h3>{modalBooking.clientName}</h3>
                <p>
                  {Array.isArray(modalBooking.services)
                    ? modalBooking.services.join(", ")
                    : modalBooking.services}
                </p>
                <div className={css.modalButtonsRow}>
                  <button
                    className={css.cancelBtn}
                    onClick={() => handleCancellationEmail(modalBooking)}
                    disabled={modalBooking.status === "Відмінено"}
                  >
                    {t("adminDashboard.cancel")}
                  </button>
                  <button
                    className={css.deleteBtn}
                    onClick={() => {
                      handleDelete(modalBooking.id);
                    }}
                  >
                    {t("adminDashboard.delete")}
                  </button>
                </div>
                <div className={css.modalButtonsRow}>
                  <button
                    className={css.modalBtnSecondary}
                    onClick={() => setModalBooking(null)}
                  >
                    {t("adminDashboard.close")}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className={css.hiddenTableOnMobile}></div>
        </div>
      )}
    </>
  );
}
