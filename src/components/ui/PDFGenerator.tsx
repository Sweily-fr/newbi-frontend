import React, { useRef, ReactNode, useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Button } from "./Button";
import { ButtonProps } from "../../types/ui";
import { Loader } from "./Loader";

// Note: Les polyfills jsPDF sont automatiquement chargés par le bundler

interface PDFGeneratorProps {
  /**
   * Le contenu HTML à convertir en PDF
   */
  content: ReactNode;

  /**
   * Le nom du fichier PDF à télécharger (sans extension)
   */
  fileName?: string;

  /**
   * Le texte à afficher sur le bouton
   */
  buttonText?: string;

  /**
   * Les propriétés du bouton (sans children, qui sera géré automatiquement)
   */
  buttonProps?: Omit<ButtonProps, "children">;

  /**
   * Format du papier (par défaut A4)
   */
  format?: "a4" | "a3" | "letter";

  /**
   * Orientation du papier
   */
  orientation?: "portrait" | "landscape";

  /**
   * Callback appelé après la génération du PDF
   */
  onGenerated?: (pdf: jsPDF) => void;

  /**
   * Callback appelé au début de la génération du PDF
   */
  onGenerationStart?: () => void;

  /**
   * Callback appelé en cas d'erreur lors de la génération du PDF
   */
  onGenerationError?: (error: any) => void;
}

/**
 * Composant pour générer et télécharger un PDF à partir de contenu HTML
 */
export const PDFGenerator: React.FC<PDFGeneratorProps> = ({
  content,
  fileName = "document",
  buttonText = "Télécharger en PDF",
  buttonProps = { variant: "primary", size: "sm" },
  format = "a4",
  orientation = "portrait",
  onGenerated,
  onGenerationStart,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // États pour suivre le processus de génération du PDF
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Réinitialiser l'indicateur de succès après un certain temps
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (success) {
      timer = setTimeout(() => {
        setSuccess(false);
      }, 2000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [success]);

  const generatePDF = async () => {
    if (!contentRef.current) return;

    setIsGenerating(true);
    setLoading(true);
    
    // Notifier le composant parent que la génération a commencé
    if (onGenerationStart) {
      onGenerationStart();
    }

    try {
      console.log("Début de la génération du PDF");

      // Précharger les images avant de générer le PDF
      await preloadImages();

      // Attendre un peu pour s'assurer que les images sont chargées
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Cloner le contenu pour éviter de modifier l'original
      const contentClone = contentRef.current.cloneNode(true) as HTMLElement;

      // Créer un conteneur temporaire pour le contenu cloné
      const tempContainer = document.createElement("div");
      document.body.appendChild(tempContainer);
      tempContainer.appendChild(contentClone);
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-8888px";
      tempContainer.style.top = "0";
      tempContainer.style.width = "210mm"; // Largeur A4
      tempContainer.style.backgroundColor = "white";
      tempContainer.style.zIndex = "-9999";

      // Trouver toutes les images dans le contenu
      const images = Array.from(contentClone.querySelectorAll("img"));
      console.log(`${images.length} images trouvées dans le contenu`);

      // Masquer les éléments qui ne doivent pas être dans le PDF
      const elementsToHide = contentClone.querySelectorAll(".no-print");
      elementsToHide.forEach((el) => {
        (el as HTMLElement).style.display = "none";
      });

      // Ajouter des styles spécifiques pour le PDF
      const styleElement = document.createElement("style");
      styleElement.textContent = `
        /* Reset global pour tous les éléments */
        [data-pdf-content="true"] * {
          transform: translateY(-.1mm) !important;
        }

        [data-pdf-body="true"] {
          padding: 12mm !important;
        }

        [data-pdf-footer="true"] {
          padding: 5mm 12mm !important;
        }

        [data-pdf-footer="true"] * {
          padding: 0 !important;
        }

        /* Styles pour la grille des coordonnées bancaires */
        [data-pdf-footer="true"] .grid {
          display: grid !important;
          grid-template-columns: 30% 70% !important;
          gap: 2px 8px !important;
          width: 100% !important;
        }

        [data-pdf-footer="true"] .grid > span {
          display: block !important;
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          line-height: 2 !important;
        }

        [data-pdf-footer="true"] .grid > span.font-bold {
          font-weight: bold !important;
        }

        /* Styles pour la pagination */
        [data-pdf-page-number="true"], [data-pdf-total-pages="true"] {
          display: inline !important;
          white-space: nowrap !important;
        }
        
        /* Style pour le trait barré des montants avec remise */
        .text-gray-500.line-through {
          text-decoration: none !important;
          position: relative !important;
          display: inline-block !important;
        }

        .text-gray-500.line-through::after {
          content: '' !important;
          position: absolute !important;
          left: 0 !important;
          right: 0 !important;
          top: 82% !important;
          height: 1px !important;
          background-color: #6b7280 !important;
          z-index: 10 !important;
        }

        /* Ajustements spécifiques pour différents types d'éléments */
        [data-pdf-content="true"] table {
          transform: translateY(-.5mm) !important;
        }

        /* Ajustement pour les totaux */
        [data-pdf-totals="true"] {
          transform: translateY(-1mm) !important;
        }  

        [data-pdf-totals="true"] div:first-child, [data-pdf-totals="true"] div:nth-child(2) {
          transform: translateY(-.6mm) !important;
        }
        
        [data-pdf-totals="true"] [data-pdf-total-item="true"] {
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
        }

        [data-pdf-content="true"] th {
          transform: translateY(-.5mm) !important;
        }
        
        [data-pdf-content="true"] td {
          transform: translateY(-.7mm) !important;
        }
        
        [data-pdf-total-item="true"] span {
          transform: translateY(-.6mm) !important;
        }
        
        /* Ajustements pour les en-têtes et pieds de page */
        [data-pdf-header="true"] * {
          transform: translateY(-.5mm) !important;
        }
      `;
      contentClone.appendChild(styleElement);

      // Attendre que le DOM soit mis à jour et que toutes les images soient chargées
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Vérifier les images avant la capture
      console.log("Vérification des images avant capture:");
      Array.from(contentClone.querySelectorAll("img")).forEach((img, idx) => {
        console.log(`Image ${idx}:`, {
          src: img.src,
          complete: img.complete,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          visible: window.getComputedStyle(img).display !== "none",
          opacity: window.getComputedStyle(img).opacity,
        });
      });

      // Créer le document PDF
      const pdf = new jsPDF({
        orientation,
        unit: "mm",
        format: format,
      });

      // Déterminer s'il y a un footer
      const footerElement = contentClone.querySelector(
        ".footer, [data-pdf-footer='true']"
      ) as HTMLElement;
      let footerHeight = 0;
      let footerCanvas: HTMLCanvasElement | null = null;

      // Si un footer est présent, le capturer séparément
      if (footerElement) {
        console.log("Footer détecté, capture séparée");

        // Masquer temporairement pour la capture principale
        footerElement.style.display = "none"; // Masquer temporairement pour la capture principale

        // Capturer le footer séparément
        const tempFooter = footerElement.cloneNode(true) as HTMLElement;
        const footerContainer = document.createElement("div");
        document.body.appendChild(footerContainer);
        footerContainer.appendChild(tempFooter);
        footerContainer.style.position = "absolute";
        footerContainer.style.left = "-8888px";
        footerContainer.style.top = "0";
        footerContainer.style.width = "210mm"; // Largeur A4
        footerContainer.style.backgroundColor = "white";

        // S'assurer que le footer est visible et correctement stylisé
        tempFooter.style.display = "block";
        tempFooter.style.visibility = "visible";
        tempFooter.style.opacity = "1";
        tempFooter.style.position = "relative"; // Assurer un positionnement correct
        tempFooter.style.width = "100%";
        tempFooter.style.paddingBottom = `5mm`; // Définir la hauteur explicitement

        // Forcer la visibilité de tous les éléments du footer
        const footerElements = tempFooter.querySelectorAll("*");
        footerElements.forEach((el) => {
          (el as HTMLElement).style.visibility = "visible";
          (el as HTMLElement).style.display = "block";
          (el as HTMLElement).style.opacity = "1";
        });

        try {
          footerCanvas = await html2canvas(tempFooter, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: "#ffffff",
          });

          const footerWidth = footerCanvas.width;
          const footerContentHeight = footerCanvas.height;
          const pdfWidth = pdf.internal.pageSize.getWidth();

          // Convertir pixels en mm pour le PDF
          const footerRatio = pdfWidth / footerWidth;
          footerHeight = footerContentHeight * footerRatio;

          // Nettoyer
          document.body.removeChild(footerContainer);
        } catch (footerError) {
          console.error("Erreur lors de la capture du footer:", footerError);
        }
      }

      try {
        // Capturer le contenu principal
        const canvas = await html2canvas(contentClone, {
          scale: 2,
          useCORS: true,
          logging: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          imageTimeout: 300, // Augmenter le timeout pour les images
          onclone: (clonedDoc) => {
            // Forcer la visibilité de toutes les images dans le clone
            const allImages = clonedDoc.querySelectorAll("img");
            allImages.forEach((img) => {
              img.style.display = "block";
              img.style.visibility = "visible";
              img.style.opacity = "1";
              img.style.zIndex = "9999";

              // Ajouter crossOrigin pour éviter les problèmes CORS
              img.setAttribute("crossOrigin", "anonymous");
            });

            // Traitement spécifique pour les logos et images PDF
            const pdfImages = clonedDoc.querySelectorAll(
              '[data-pdf-image="true"], .pdf-image'
            );
            pdfImages.forEach((img) => {
              console.log(
                "Forçage de la visibilité pour l'image PDF:",
                (img as HTMLImageElement).src
              );
              img.setAttribute(
                "style",
                "display: block !important; visibility: visible !important; opacity: 1 !important; z-index: 9999 !important;"
              );
            });

            return clonedDoc;
          },
        });

        console.log("Canvas généré avec succès", {
          width: canvas.width,
          height: canvas.height,
        });

        // Calculer le ratio pour adapter le contenu à la page
        const contentWidth = canvas.width;
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        // Calculer le ratio en préservant la largeur
        const ratio = pdfWidth / contentWidth;


        // Ajouter la pagination si le contenu est trop grand pour une seule page
        await addPaginatedContent(pdf, canvas, footerCanvas, {
          ratio,
          pdfWidth,
          pdfHeight,
          footerHeight,
          topMarginForSubsequentPages: 15, // 15mm de marge en haut pour les pages suivantes
          footerMargin: 10, // 10mm de marge au-dessus du footer
        });

        // Appeler le callback si fourni
        if (onGenerated) {
          onGenerated(pdf);
        }

        // Télécharger le PDF
        console.log("Téléchargement du PDF", { fileName });
        pdf.save(`${fileName}`);
        console.log("PDF téléchargé avec succès");
      } catch (canvasError) {
        console.error("Erreur lors de la génération du canvas:", canvasError);
        throw canvasError;
      } finally {
        // Nettoyer
        if (tempContainer.parentNode) {
          document.body.removeChild(tempContainer);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      alert(
        `Erreur lors de la génération du PDF: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setIsGenerating(false);
      setLoading(false);
    }
  };

  // Fonction pour ajouter le contenu paginé au PDF
  const addPaginatedContent = async (
    pdf: jsPDF,
    contentCanvas: HTMLCanvasElement,
    footerCanvas: HTMLCanvasElement | null,
    options: {
      ratio: number;
      pdfWidth: number;
      pdfHeight: number;
      footerHeight: number;
      topMarginForSubsequentPages: number;
      footerMargin: number;
    }
  ) => {
    const { ratio, pdfWidth, pdfHeight, footerHeight, topMarginForSubsequentPages, footerMargin } = options;
    
    // Calculer la hauteur disponible sur la page en tenant compte du footer et de sa marge
    const availableHeight = pdfHeight - (footerHeight + footerMargin);
    
    // Calculer la hauteur totale du contenu en mm
    const contentHeightInMM = contentCanvas.height * ratio;
    
    // Si tout le contenu tient sur une page
    if (contentHeightInMM <= availableHeight) {
      // Centrer le contenu sur la page
      const xPos = (pdfWidth - contentCanvas.width * ratio) / 2;
      const yPos = 0; // Commencer en haut de la page
      
      // Ajouter l'image au PDF
      const imgData = contentCanvas.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", xPos, yPos, contentCanvas.width * ratio, contentCanvas.height * ratio);
      
      // Ajouter le footer si disponible
      if (footerCanvas) {
        const footerImgData = footerCanvas.toDataURL("image/png");
        const footerXPos = (pdfWidth - footerCanvas.width * ratio) / 2;
        const footerYPos = pdfHeight - footerHeight;
        
        pdf.addImage(
          footerImgData,
          "PNG",
          footerXPos,
          footerYPos,
          footerCanvas.width * ratio,
          footerHeight
        );
      }
    } else {
      // Le contenu nécessite plusieurs pages
      console.log("Contenu nécessitant plusieurs pages", {
        contentHeightInMM,
        availableHeight,
        footerHeight,
        ratio
      });
      
      // Calculer le nombre de pixels à afficher par page
      const pixelsPerPage = Math.floor(availableHeight / ratio);
      
      // Nombre total de pages nécessaires
      const totalPages = Math.ceil(contentCanvas.height / pixelsPerPage);
      console.log(`Pagination: ${totalPages} pages nécessaires`);
      
      // Créer un canvas temporaire pour chaque page
      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");
      
      if (!tempCtx) {
        throw new Error("Impossible de créer le contexte du canvas temporaire");
      }
      
      // Largeur du canvas temporaire = largeur du canvas original
      tempCanvas.width = contentCanvas.width;
      
      // Pour chaque page
      for (let pageNum = 0; pageNum < totalPages; pageNum++) {
        // Si ce n'est pas la première page, ajouter une nouvelle page au PDF
        if (pageNum > 0) {
          pdf.addPage();
        }
        
        // Hauteur de cette portion de contenu
        const remainingHeight = contentCanvas.height - pageNum * pixelsPerPage;
        const currentPageHeight = Math.min(pixelsPerPage, remainingHeight);
        
        // Définir la hauteur du canvas temporaire
        tempCanvas.height = currentPageHeight;
        
        // Effacer le canvas temporaire
        tempCtx.fillStyle = "#ffffff";
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        
        // Dessiner la portion appropriée du contenu original
        tempCtx.drawImage(
          contentCanvas,
          0,                           // sx - position x source
          pageNum * pixelsPerPage,     // sy - position y source
          contentCanvas.width,         // sWidth - largeur source
          currentPageHeight,           // sHeight - hauteur source
          0,                           // dx - position x destination
          0,                           // dy - position y destination
          tempCanvas.width,            // dWidth - largeur destination
          currentPageHeight            // dHeight - hauteur destination
        );
        
        // Convertir en image data URL
        const pageImgData = tempCanvas.toDataURL("image/png");
        
        // Position x centrée
        const xPos = (pdfWidth - tempCanvas.width * ratio) / 2;
        
        // Position y avec marge en haut pour les pages suivantes
        const yPos = pageNum === 0 ? 0 : topMarginForSubsequentPages;
        
        // Ajouter l'image de cette page au PDF
        pdf.addImage(
          pageImgData,
          "PNG",
          xPos,
          yPos,
          tempCanvas.width * ratio,
          currentPageHeight * ratio
        );
        
        // Ajouter le footer à chaque page si disponible
        if (footerCanvas) {
          const footerImgData = footerCanvas.toDataURL("image/png");
          const footerXPos = (pdfWidth - footerCanvas.width * ratio) / 2;
          const footerYPos = pdfHeight - footerHeight;
          
          pdf.addImage(
            footerImgData,
            "PNG",
            footerXPos,
            footerYPos,
            footerCanvas.width * ratio,
            footerHeight
          );
          
          // Mettre à jour le numéro de page dans le footer
          // Note: jsPDF ne permet pas de modifier directement le contenu après l'ajout,
          // donc cette fonctionnalité nécessiterait une approche différente
          // comme l'utilisation de setPage et la mise à jour des numéros de page
          // après avoir généré toutes les pages
        }
      }
      
      // Mettre à jour les numéros de page si nécessaire
      // Cette partie dépend de la façon dont les numéros de page sont gérés dans votre PDF
    }
  };

  // Ajouter cette fonction pour précharger les images
  const preloadImages = async () => {
    if (!contentRef.current) return;

    const images = Array.from(contentRef.current.querySelectorAll("img"));
    console.log(`Préchargement de ${images.length} images...`);

    return Promise.all(
      images.map((img) => {
        // Ajouter des attributs pour faciliter le chargement
        img.setAttribute("crossOrigin", "anonymous");
        img.setAttribute("loading", "eager");
        img.classList.add("pdf-image");
        img.setAttribute("data-pdf-image", "true");

        // Forcer les styles de visibilité
        img.style.display = "block";
        img.style.visibility = "visible";
        img.style.opacity = "1";
        img.style.zIndex = "9999";

        // Créer une nouvelle promesse pour chaque image
        return new Promise((resolve, reject) => {
          // Si l'image est déjà chargée
          if (img.complete && img.naturalWidth > 0) {
            console.log("Image déjà chargée:", img.src);
            resolve(img);
          } else {
            // Attendre le chargement
            img.onload = () => {
              console.log("Image chargée avec succès:", img.src);
              resolve(img);
            };
            img.onerror = (e) => {
              console.error("Erreur de chargement d'image:", img.src, e);
              // Essayer de charger l'image via une autre méthode
              loadImageWithRetry(img)
                .then(() => resolve(img))
                .catch(() => reject(e));
            };
          }
        });
      })
    );
  };

  // Fonction pour charger une image avec plusieurs tentatives
  const loadImageWithRetry = (
    img: HTMLImageElement,
    retries = 3,
    delay = 300
  ) => {
    return new Promise<void>((resolve, reject) => {
      let attempts = 0;
      const originalSrc = img.src;

      const tryLoad = () => {
        attempts++;
        console.log(
          `Tentative ${attempts} de chargement de l'image: ${originalSrc}`
        );

        if (img.complete && img.naturalWidth > 0) {
          console.log("Image chargée avec succès:", originalSrc);
          resolve();
          return;
        }

        if (attempts >= retries) {
          console.warn(
            "Nombre maximum de tentatives atteint pour:",
            originalSrc
          );
          // Essayer une autre approche - conversion via canvas
          tryConvertViaCanvas(img)
            .then(resolve)
            .catch(() => {
              // Si tout échoue, essayer via fetch
              tryConvertViaFetch(img).then(resolve).catch(reject);
            });
          return;
        }

        // Réessayer après un délai avec un paramètre pour éviter le cache
        img.src =
          originalSrc +
          (originalSrc.includes("?") ? "&" : "?") +
          `retry=${attempts}`;
        setTimeout(tryLoad, delay);
      };

      tryLoad();
    });
  };

  // Fonction pour convertir une image en base64 via Canvas
  const tryConvertViaCanvas = (img: HTMLImageElement) => {
    return new Promise<void>((resolve, reject) => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || 300;
        canvas.height = img.naturalHeight || 150;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          console.error("Impossible d'obtenir le contexte 2D du canvas");
          reject(new Error("Canvas context not available"));
          return;
        }

        // Dessiner l'image sur le canvas
        ctx.drawImage(img, 0, 0);

        // Convertir en base64
        const dataUrl = canvas.toDataURL("image/png");
        if (dataUrl && dataUrl !== "data:,") {
          console.log("Image convertie en base64 via Canvas");
          img.src = dataUrl;
          resolve();
        } else {
          console.error("Échec de conversion via Canvas");
          reject(new Error("Canvas conversion failed"));
        }
      } catch (error) {
        console.error("Erreur lors de la conversion via Canvas:", error);
        reject(error);
      }
    });
  };

  // Fonction pour convertir une image en base64 via Fetch
  const tryConvertViaFetch = (img: HTMLImageElement) => {
    return new Promise<void>((resolve, reject) => {
      const imgUrl = img.src;

      fetch(imgUrl, {
        mode: "cors",
        credentials: "same-origin",
        cache: "no-cache",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `Failed to fetch: ${response.status} ${response.statusText}`
            );
          }
          return response.blob();
        })
        .then((blob) => {
          const reader = new FileReader();

          reader.onloadend = () => {
            // Convertir le blob en base64
            const logoBase64 = reader.result as string;
            img.src = logoBase64;
            console.log("Image convertie en base64 via Fetch");
            resolve();
          };

          reader.onerror = () => {
            reject(new Error("Erreur lors de la lecture du blob"));
          };

          reader.readAsDataURL(blob);
        })
        .catch((error) => {
          console.error("Erreur lors de la conversion via Fetch:", error);
          reject(error);
        });
    });
  };

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: "-9999px",
          top: "-9999px",
          width: "210mm",
          height: "auto",
          overflow: "hidden",
          visibility: "hidden",
        }}
      >
        <div
          ref={contentRef}
          data-pdf-content="true"
          style={{ width: "100%", backgroundColor: "white" }}
        >
          {content}
        </div>
      </div>

      <Button
        variant={buttonProps?.variant || "primary"}
        size={buttonProps?.size || "sm"}
        onClick={generatePDF}
        disabled={isGenerating || loading}
        {...buttonProps}
      >
        {loading ? (
          <>
            <Loader className="h-4 w-4 mr-2" />
            Génération...
          </>
        ) : success ? (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Téléchargé
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            {buttonText}
          </>
        )}
      </Button>
    </>
  );
};
