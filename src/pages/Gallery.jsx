import { useEffect, useState, useRef } from "react";
import css from "./Gallery.module.css";
import { supabase } from "../supabase/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "react-i18next";
import { FaCamera, FaImage } from "react-icons/fa";

export default function MyGallery() {
  const { t } = useTranslation();
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showUploadButtons, setShowUploadButtons] = useState(false);

  const titlePressTimer = useRef(null);

  function handleTitlePressStart() {
    titlePressTimer.current = setTimeout(() => {
      setShowUploadButtons((prev) => !prev);
    }, 600);
  }

  function handleTitlePressEnd() {
    clearTimeout(titlePressTimer.current);
  }

  let pressTimer = useRef(null);

  function handlePressStart(imageId) {
    if (!showUploadButtons) return;

    pressTimer.current = setTimeout(() => {
      setDeleteTarget(imageId);
    }, 600);
  }

  function handlePressEnd() {
    clearTimeout(pressTimer.current);
  }

  useEffect(() => {
    fetchImages();
  }, []);

  async function fetchImages() {
    const { data, error } = await supabase.storage.from("gallery").list("", {
      sortBy: {
        column: "created_at",
        order: "desc",
      },
    });

    if (error) {
      console.error("Error loading images:", error);
      return;
    }

    const imagesWithUrls = data
      .filter((file) => file.name !== ".emptyFolderPlaceholder")
      .map((file) => {
        const path = file.name;

        const { data: urlData } = supabase.storage
          .from("gallery")
          .getPublicUrl(path);

        return {
          id: file.id || file.name,
          path,
          url: urlData.publicUrl,
        };
      });

    setImages(imagesWithUrls);
  }

  async function handleUpload(e) {
    const file = e.target.files[0];

    if (!file) return;

    const fileExt = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("gallery")
      .upload(fileName, file);

    console.log("UPLOAD DATA:", data);

    if (error) {
      console.error("Upload error:", error);
      return;
    }

    await fetchImages();

    e.target.value = "";
  }

  async function handleDelete(image) {
    console.log("DELETING:", image.path);
    const { data, error } = await supabase.storage
      .from("gallery")
      .remove([image.path]);

    console.log("DELETE DATA:", data);

    if (error) {
      console.error("Delete error:", error);
      return;
    }

    setDeleteTarget(null);

    await fetchImages();
  }

  useEffect(() => {
    if (!showUploadButtons) {
      setDeleteTarget(null);
    }
  }, [showUploadButtons]);

  return (
    <main>
      <article className={css.myGallery}>
        <h1
          className={css.title}
          onMouseDown={handleTitlePressStart}
          onMouseUp={handleTitlePressEnd}
          onMouseLeave={handleTitlePressEnd}
          onTouchStart={handleTitlePressStart}
          onTouchEnd={handleTitlePressEnd}
        >
          {t("gallery.title")}
        </h1>

        {/* Upload Buttons */}

        {showUploadButtons && (
          <div className={css.uploadButtons}>
            <label className={css.uploadImgBtn}>
              <FaImage />
              <span>{t("gallery.addImage")}</span>

              <input
                type="file"
                accept="image/*"
                className={css.desktopInput}
                onChange={handleUpload}
              />
            </label>

            <label className={css.addPhotoBtn}>
              <FaCamera />
              <span>{t("gallery.addPhoto")}</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className={css.mobileInput}
                onChange={handleUpload}
              />
            </label>
          </div>
        )}

        {/* Gallery */}

        <div className={css.imageContainer}>
          {images.map((img) => (
            <div
              key={img.id}
              className={css.imageCard}
              onMouseDown={() => handlePressStart(img.id)}
              onMouseUp={handlePressEnd}
              onMouseLeave={handlePressEnd}
              onTouchStart={() => handlePressStart(img.id)}
              onTouchEnd={handlePressEnd}
            >
              <img
                src={img.url}
                alt="Gallery"
                onClick={() => setSelectedImage(img.url)}
              />

              {deleteTarget === img.id && (
                <button
                  className={css.deleteBtn}
                  onClick={() => handleDelete(img)}
                >
                  {/* Delete */}
                  {t("gallery.deletePhoto")}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedImage && (
          <div
            className={css.modalOverlay}
            onClick={() => setSelectedImage(null)}
          >
            <div
              className={css.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={css.closeButton}
                onClick={() => setSelectedImage(null)}
                aria-label="Close modal"
              >
                ✕
              </button>
              <img src={selectedImage} alt="Full size" />
            </div>
          </div>
        )}
      </article>
    </main>
  );
}
