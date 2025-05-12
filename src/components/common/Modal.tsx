import { Fragment, ReactNode } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  titleIcon?: ReactNode;
  children: ReactNode;
  size?:
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl";
  showCloseButton?: boolean;
  className?: string;
  footer?: ReactNode;
  maxHeight?: string;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  titleIcon,
  children,
  size = "md",
  showCloseButton = true,
  className = "",
  footer,
  maxHeight,
}: ModalProps) => {
  // Définir la largeur du modal en fonction de la taille
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    "6xl": "max-w-6xl",
    "7xl": "max-w-7xl",
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Overlay avec animation de fondu */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`w-full ${sizeClasses[size]} ${className} transform overflow-hidden rounded-lg bg-white flex flex-col transition-all`}
                style={{ 
                  boxShadow: "0 4px 20px rgba(91, 80, 255, 0.15)",
                  maxHeight: maxHeight || 'calc(100vh - 2rem)'
                }}
              >
                {/* En-tête avec titre et bouton de fermeture */}
                {(title || showCloseButton) && (
                  <div className="flex items-center justify-between p-6 pb-4">
                    {title && (
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900 flex items-center"
                      >
                        {titleIcon && <span className="mr-2">{titleIcon}</span>}
                        {title}
                      </Dialog.Title>
                    )}
                    {showCloseButton && (
                      <button
                        type="button"
                        className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5b50ff] focus:ring-offset-2"
                        onClick={onClose}
                      >
                        <span className="sr-only">Fermer</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                )}

                {/* Contenu du modal avec défilement si nécessaire */}
                <div className="flex-1 overflow-y-auto p-6 pt-2">
                  {children}
                </div>

                {/* Pied de modal (optionnel) */}
                {footer && (
                  <div className="border-t border-gray-200 p-6 bg-gray-50 mt-auto">
                    {footer}
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
