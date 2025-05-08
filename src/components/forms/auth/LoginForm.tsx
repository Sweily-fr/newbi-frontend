import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { LOGIN_MUTATION } from "../../../graphql/auth";
import { Form, TextField, Button, Checkbox } from "../../../components/ui";
import { PasswordField } from "../../../components/ui/PasswordField";
import { Notification } from "../../../components/feedback/Notification";
import { ReactivateAccountModal } from "./ReactivateAccountModal";
import CryptoJS from "crypto-js";

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export const LoginForm = ({ onSwitchToRegister }: LoginFormProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useState(new URLSearchParams(location.search));
  const messageFromURL = searchParams.get("message");
  const messageFromState = location.state?.message;
  const message = messageFromURL || messageFromState;
  const [emailVerificationError, setEmailVerificationError] = useState<
    string | null
  >(null);
  const [lastAttemptedEmail, setLastAttemptedEmail] = useState<string>("");
  const [isReactivateModalOpen, setIsReactivateModalOpen] = useState(false);

  // Déterminer si le message est lié à la vérification d'email après inscription
  const isEmailVerificationMessage =
    message &&
    message.toLowerCase().includes("vérifier") &&
    message.toLowerCase().includes("email");

  // Récupérer les informations sauvegardées si elles existent
  const getSavedLoginInfo = () => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedRememberMe = localStorage.getItem("rememberMe") === "true";

    return {
      email: savedEmail || "",
      password: "", // Ne jamais stocker le mot de passe
      rememberMe: savedRememberMe,
    };
  };

  const {
    register,
    handleSubmit,
    setError: setFormError,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<LoginFormValues>({
    defaultValues: getSavedLoginInfo(),
  });

  const rememberMe = watch("rememberMe");

  const [login] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      localStorage.setItem("token", data.login.token);
      Notification.success("Connexion réussie");
      window.location.href = "/outils";
    },
    onError: (error) => {
      // Ne pas traiter les erreurs réseau ici, elles sont gérées par l'errorLink
      if (error.networkError) {
        // Les erreurs réseau sont gérées par l'errorLink dans apolloClient.ts
        return;
      }

      // Analyser le message d'erreur pour identifier les champs en erreur
      const errorMsg = error.message;
      const errorCode = error.graphQLErrors?.[0]?.extensions?.code;

      // Vérifier si c'est une erreur de vérification d'email
      if (
        errorCode === "EMAIL_NOT_VERIFIED" ||
        errorMsg.includes("vérifier votre adresse email")
      ) {
        setEmailVerificationError(errorMsg);
        // S'assurer que l'email est stocké pour le renvoi de vérification
        const formValues = watch();
        setLastAttemptedEmail(formValues.email);
        return;
      }

      // Vérifier si c'est une erreur de compte désactivé
      if (
        errorCode === "ACCOUNT_DISABLED" ||
        errorMsg.includes("compte a été désactivé")
      ) {
        setIsReactivateModalOpen(true);
        return;
      }

      if (errorMsg.includes("email")) {
        setFormError("email", { message: "Email incorrect" });
      } else if (
        errorMsg.includes("mot de passe") ||
        errorMsg.includes("password")
      ) {
        setFormError("password", { message: "Mot de passe incorrect" });
      } else {
        // Si on ne peut pas identifier le champ spécifique, on affiche juste la notification
        Notification.error(error.message);
      }
    },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    try {
      // Sauvegarder l'email et le choix "se souvenir de moi" si demandé
      if (data.rememberMe) {
        localStorage.setItem("rememberedEmail", data.email);
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.setItem("rememberMe", "false");
      }

      // Stocker l'email pour le cas où nous aurions besoin de renvoyer un email de vérification
      setLastAttemptedEmail(data.email);

      // Chiffrer le mot de passe avec AES-CBC et clé hachée SHA256 (recommandé pour interop)
      const keyRaw =
        (import.meta.env.VITE_PASSWORD_ENCRYPTION_KEY as string) ||
        "newbi-public-key";
      const key = CryptoJS.SHA256(keyRaw); // Clé 256 bits (WordArray)

      // Générer un IV aléatoire de 16 octets
      const iv = CryptoJS.lib.WordArray.random(16);

      // Chiffrer avec AES en mode CBC (PKCS7 padding par défaut)
      const encrypted = CryptoJS.AES.encrypt(data.password, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      // Préparer IV et texte chiffré pour la transmission
      const ivStr = CryptoJS.enc.Base64.stringify(iv);
      const cipherTextBase64 = CryptoJS.enc.Base64.stringify(
        encrypted.ciphertext
      );
      const combined = `${ivStr}:${cipherTextBase64}`;

      await login({
        variables: {
          input: {
            email: data.email,
            password: combined,
            rememberMe: data.rememberMe,
            passwordEncrypted: true,
          },
        },
      });
    } catch (error) {
      // Les erreurs sont gérées par onError
      console.error("Erreur lors de la connexion:", error);
    }
  };

  // Afficher la notification pour le message de succès (par exemple après inscription)
  useEffect(() => {
    if (message) {
      // Si le message contient une mention de vérification d'email, utiliser une notification spéciale
      if (
        message.toLowerCase().includes("vérifier") &&
        message.toLowerCase().includes("email")
      ) {
        Notification.info(message, {
          position: "bottom-left",
          duration: 5000, // Rester affiché plus longtemps (5 secondes)
        });
      } else {
        // Pour les autres messages, utiliser une notification de succès standard
        Notification.success(message, { position: "bottom-left" });
      }
    }
  }, [message]);

  return (
    <div className="py-6 px-4 w-full mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-700 mb-2">Connexion</h1>
        <p className="text-gray-500 text-lg">
          Bienvenue, heureux de te voir de nouveau !
        </p>
      </div>

      {/* Afficher un message d'information pour les utilisateurs qui viennent de s'inscrire */}
      {isEmailVerificationMessage && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md mb-6 max-w-lg mx-auto">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Un email de vérification a été envoyé à votre adresse email.
                Veuillez vérifier votre boîte de réception et cliquer sur le
                lien de vérification avant de vous connecter.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Afficher l'erreur de vérification d'email si elle existe */}
      {emailVerificationError && (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-md mb-6 max-w-lg mx-auto">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-amber-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">
                Vérification requise
              </h3>
              <div className="mt-2 text-sm text-amber-700">
                <p>{emailVerificationError}</p>
              </div>
              <div className="mt-4">
                <div className="-mx-2 -my-1.5 flex">
                  <button
                    onClick={() => {
                      // Rediriger vers la page de renvoi d'email avec l'email pré-rempli
                      navigate("/resend-verification", {
                        state: { email: lastAttemptedEmail },
                      });
                    }}
                    className="bg-amber-50 px-3 py-1.5 rounded-md text-sm font-medium text-amber-800 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                  >
                    Renvoyer l'email de vérification
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Form
        onSubmit={handleSubmit(onSubmit)}
        spacing="normal"
        className="max-w-lg mx-auto"
      >
        <TextField
          id="email"
          label="Email"
          type="email"
          placeholder="ahmed@gmail.com"
          {...register("email", {
            required: "L'email est requis",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Adresse email invalide",
            },
          })}
          error={errors.email}
        />

        <PasswordField
          id="password"
          label="Mot de passe"
          placeholder="••••••••"
          {...register("password", {
            required: "Le mot de passe est requis",
          })}
          error={errors.password}
        />

        <div className="flex items-center justify-between mb-4 mt-2">
          <div className="flex items-center">
            <Checkbox
              id="rememberMe"
              label="Se souvenir de moi"
              variant="blue"
              {...register("rememberMe")}
              checked={rememberMe}
              onChange={(e) => setValue("rememberMe", e.target.checked)}
            />
          </div>
          <div className="text-sm">
            <Link
              to="/forgot-password"
              className="font-medium text-gray-600 hover:text-gray-500"
            >
              Mot de passe oublié ?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          isLoading={isSubmitting}
          loaderPosition="left"
          fullWidth
          className="bg-[#5b50ff] hover:bg-[#4a41d0] py-3 rounded-lg"
        >
          Connexion
        </Button>

        <div className="text-sm text-center mt-6">
          <span className="text-gray-600">Vous n'avez pas de compte?</span>{" "}
          <button
            onClick={onSwitchToRegister}
            className="font-medium text-[#5b50ff] hover:text-[#4a41d0] border-none bg-transparent cursor-pointer p-0"
          >
            S'inscrire
          </button>
        </div>
      </Form>

      {/* Modal de réactivation de compte */}
      <ReactivateAccountModal
        isOpen={isReactivateModalOpen}
        onClose={() => setIsReactivateModalOpen(false)}
        email={lastAttemptedEmail}
      />
    </div>
  );
};
