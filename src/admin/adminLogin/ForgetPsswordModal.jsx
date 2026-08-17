import React, { useState, useEffect } from "react";
import {
  X,
  Mail,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  Loader2,
} from "lucide-react";

import { useTranslation } from "react-i18next";
import { apiFetch } from "../../utils/apiClient";

import styles from "./ForgetPasswordModal.module.css";

export default function ForgotPasswordModal({
  isOpen,
  onClose,
}) {
  const { t, i18n } = useTranslation();

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [passwordShown, setPasswordShown] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] = useState(null);

  /* ==========================================
     Reset when modal opens
  ========================================== */

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setEmail("");
      setOtp("");
      setResetToken("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordShown(false);
      setError(null);
    }
  }, [isOpen]);

  /* ==========================================
     Send Code
  ========================================== */

  const handleSendCode = async () => {
    if (!email.trim()) {
      setError(
        t("forgotPassword.emailRequired")
      );
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await apiFetch(
        "/api/auth/forgot-password",
        {
          method: "POST",
          body: JSON.stringify({
            email: email.trim(),
          }),
        }
      );

      const data = await response.json();

      if (
        !response.ok ||
        data.status !== "success"
      ) {
        throw new Error(
          data.message ||
            t("forgotPassword.sendCodeFailed")
        );
      }

      setStep(2);
    } catch (err) {
      setError(
        err.message ||
          t("forgotPassword.sendCodeFailed")
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* ==========================================
     Verify OTP
  ========================================== */

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setError(
        t("forgotPassword.codeRequired")
      );
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await apiFetch(
        "/api/auth/verify-reset-otp",
        {
          method: "POST",
          body: JSON.stringify({
            email: email.trim(),
            otp: otp.trim(),
          }),
        }
      );

      const data = await response.json();

      if (
        !response.ok ||
        data.status !== "success"
      ) {
        throw new Error(
          data.message ||
            t("forgotPassword.invalidCode")
        );
      }

      setResetToken(data.data.reset_token);

      setStep(3);
    } catch (err) {
      setError(
        err.message ||
          t("forgotPassword.invalidCode")
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* ==========================================
     Reset Password
  ========================================== */

  const handleResetPassword = async () => {
    if (newPassword.length < 8) {
      setError(
        t(
          "forgotPassword.passwordTooShort"
        )
      );
      return;
    }

    if (
      newPassword !== confirmPassword
    ) {
      setError(
        t(
          "forgotPassword.passwordsDontMatch"
        )
      );
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await apiFetch(
        "/api/auth/reset-password",
        {
          method: "POST",
          body: JSON.stringify({
            email: email.trim(),
            reset_token: resetToken,
            password: newPassword,
            password_confirmation:
              confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (
        !response.ok ||
        data.status !== "success"
      ) {
        throw new Error(
          data.message ||
            t("forgotPassword.resetFailed")
        );
      }

      setStep(4);
    } catch (err) {
      setError(
        err.message ||
          t("forgotPassword.resetFailed")
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* ==========================================
     Don't render
  ========================================== */

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={`${styles.forgotPasswordOverlay} ${
        i18n.language === "ar"
          ? styles.rtl
          : ""
      }`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={styles.forgotPasswordCard}
        onMouseDown={(e) =>
          e.stopPropagation()
        }
      >
        {/* ======================================
            Close
        ====================================== */}

        {step !== 4 && (
          <button
            type="button"
            className={
              styles.forgotPasswordClose
            }
            onClick={onClose}
            aria-label="Close"
          >
            <X size={22} />
          </button>
        )}

        {/* ======================================
            STEP 1
        ====================================== */}

        {step === 1 && (
          <div
            className={
              styles.forgotPasswordStep
            }
          >
            <h2
              className={
                styles.forgotPasswordTitle
              }
            >
              {t(
                "forgotPassword.step1Title"
              )}
            </h2>

            <p
              className={
                styles.forgotPasswordSubtitle
              }
            >
              {t(
                "forgotPassword.step1Subtitle"
              )}
            </p>

            {error && (
              <div
                className={
                  styles.forgotPasswordError
                }
              >
                {error}
              </div>
            )}

            <div
              className={
                styles.forgotPasswordInputGroup
              }
            >
              <Mail
                size={20}
                className={
                  styles.forgotPasswordInputIcon
                }
              />

              <input
                type="email"
                className={
                  styles.forgotPasswordInput
                }
                placeholder={t(
                  "forgotPassword.emailPlaceholder"
                )}
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                disabled={isLoading}
                autoComplete="email"
              />
            </div>

            <button
              type="button"
              className={
                styles.forgotPasswordPrimaryBtn
              }
              onClick={handleSendCode}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2
                  size={20}
                  className={
                    styles.forgotPasswordSpinner
                  }
                />
              ) : (
                t(
                  "forgotPassword.sendCode"
                )
              )}
            </button>
          </div>
        )}

        {/* ======================================
            STEP 2
        ====================================== */}

        {step === 2 && (
          <div
            className={
              styles.forgotPasswordStep
            }
          >
            <h2
              className={
                styles.forgotPasswordTitle
              }
            >
              {t(
                "forgotPassword.step2Title"
              )}
            </h2>

            <p
              className={
                styles.forgotPasswordSubtitle
              }
            >
              {t(
                "forgotPassword.step2Subtitle",
                { email }
              )}
            </p>

            {error && (
              <div
                className={
                  styles.forgotPasswordError
                }
              >
                {error}
              </div>
            )}

            <div
              className={
                styles.forgotPasswordInputGroup
              }
            >
              <KeyRound
                size={20}
                className={
                  styles.forgotPasswordInputIcon
                }
              />

              <input
                type="text"
                inputMode="numeric"
                className={
                  styles.forgotPasswordInput
                }
                placeholder={t(
                  "forgotPassword.codePlaceholder"
                )}
                value={otp}
                onChange={(e) => {
                  const value =
                    e.target.value.replace(
                      /\D/g,
                      ""
                    );

                  setOtp(value.slice(0, 6));
                }}
                disabled={isLoading}
                maxLength={6}
                autoComplete="one-time-code"
              />
            </div>

            <button
              type="button"
              className={
                styles.forgotPasswordPrimaryBtn
              }
              onClick={handleVerifyOtp}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2
                  size={20}
                  className={
                    styles.forgotPasswordSpinner
                  }
                />
              ) : (
                t(
                  "forgotPassword.verifyCode"
                )
              )}
            </button>

            <button
              type="button"
              className={
                styles.forgotPasswordLink
              }
              onClick={handleSendCode}
              disabled={isLoading}
            >
              {t(
                "forgotPassword.resendCode"
              )}
            </button>
          </div>
        )}

        {/* ======================================
            STEP 3
        ====================================== */}

        {step === 3 && (
          <div
            className={
              styles.forgotPasswordStep
            }
          >
            <h2
              className={
                styles.forgotPasswordTitle
              }
            >
              {t(
                "forgotPassword.step3Title"
              )}
            </h2>

            <p
              className={
                styles.forgotPasswordSubtitle
              }
            >
              {t(
                "forgotPassword.step3Subtitle"
              )}
            </p>

            {error && (
              <div
                className={
                  styles.forgotPasswordError
                }
              >
                {error}
              </div>
            )}

            {/* New Password */}

            <div
              className={
                styles.forgotPasswordInputGroup
              }
            >
              <Lock
                size={20}
                className={
                  styles.forgotPasswordInputIcon
                }
              />

              <input
                type={
                  passwordShown
                    ? "text"
                    : "password"
                }
                className={
                  styles.forgotPasswordInput
                }
                placeholder={t(
                  "forgotPassword.newPasswordPlaceholder"
                )}
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(
                    e.target.value
                  )
                }
                disabled={isLoading}
                autoComplete="new-password"
              />

              <button
                type="button"
                className={
                  styles.forgotPasswordEyeBtn
                }
                onClick={() =>
                  setPasswordShown(
                    !passwordShown
                  )
                }
                tabIndex={-1}
              >
                {passwordShown ? (
                  <Eye size={20} />
                ) : (
                  <EyeOff size={20} />
                )}
              </button>
            </div>

            {/* Confirm Password */}

            <div
              className={
                styles.forgotPasswordInputGroup
              }
            >
              <Lock
                size={20}
                className={
                  styles.forgotPasswordInputIcon
                }
              />

              <input
                type={
                  passwordShown
                    ? "text"
                    : "password"
                }
                className={
                  styles.forgotPasswordInput
                }
                placeholder={t(
                  "forgotPassword.confirmPasswordPlaceholder"
                )}
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                disabled={isLoading}
                autoComplete="new-password"
              />
            </div>

            <button
              type="button"
              className={
                styles.forgotPasswordPrimaryBtn
              }
              onClick={
                handleResetPassword
              }
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2
                  size={20}
                  className={
                    styles.forgotPasswordSpinner
                  }
                />
              ) : (
                t(
                  "forgotPassword.resetPassword"
                )
              )}
            </button>
          </div>
        )}

        {/* ======================================
            STEP 4
        ====================================== */}

        {step === 4 && (
          <div
            className={
              styles.forgotPasswordSuccess
            }
          >
            <div
              className={
                styles.forgotPasswordSuccessIcon
              }
            >
              <CheckCircle
                size={52}
                color="#16a34a"
              />
            </div>

            <h2
              className={
                styles.forgotPasswordTitle
              }
            >
              {t(
                "forgotPassword.successTitle"
              )}
            </h2>

            <p
              className={
                styles.forgotPasswordSubtitle
              }
            >
              {t(
                "forgotPassword.successSubtitle"
              )}
            </p>

            <button
              type="button"
              className={
                styles.forgotPasswordPrimaryBtn
              }
              onClick={onClose}
            >
              {t(
                "forgotPassword.backToLogin"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}