import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import userIcon from "../assets/images/icon/user.svg";
import lockIcon from "../assets/images/icon/lock_password.svg";
import hidePasswordIcon from "../assets/images/icon/hide_password.svg";
import showPasswordIcon from "../assets/images/icon/show_password.svg";
import googleIcon from "../assets/images/icon/google.svg";
import facebookIcon from "../assets/images/icon/facebook.svg";
import "../CSS/authModal.css";

const normalizeAuthError = (message) => {
  const text = String(message || "");
  const lowered = text.toLowerCase();

  if (lowered.includes("username") && lowered.includes("ton tai")) {
    return "Tên username đã tồn tại";
  }
  if (lowered.includes("email") && lowered.includes("ton tai")) {
    return "Email đã được đăng ký";
  }
  if (lowered.includes("duplicate") || lowered.includes("e11000")) {
    return "Thông tin đã tồn tại, vui lòng kiểm tra lại";
  }

  return text || "Đã có lỗi xảy ra, vui lòng thử lại";
};

export default function AuthModal({ open, onClose, initialMode = "login" }) {
  const { login, register } = useAuth();

  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    identifier: "",
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const loginIdentifierRef = useRef(null);
  const registerUsernameRef = useRef(null);
  const registerEmailRef = useRef(null);
  const registerPasswordRef = useRef(null);

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError("");
    setMessage("");
    setShowPassword(false);
  };

  useEffect(() => {
    if (!open) return;
    setMode(initialMode === "register" ? "register" : "login");
  }, [open, initialMode]);

  useEffect(() => {
    if (!open) return;
    const focusTarget =
      mode === "login"
        ? loginIdentifierRef.current
        : registerUsernameRef.current;
    focusTarget?.focus();
  }, [open, mode]);

  if (!open) return null;

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      setLoading(true);
      const identifier = form.identifier.trim();
      await login({
        identifier,
        password: form.password,
      });
      onClose();
    } catch (err) {
      setError(normalizeAuthError(err?.message));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      setLoading(true);
      await register({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      onClose();
    } catch (err) {
      setError(normalizeAuthError(err?.message));
    } finally {
      setLoading(false);
    }
  };

  const socialButtons = [
    { label: "Continue with Google", icon: googleIcon },
    { label: "Continue with Facebook", icon: facebookIcon },
  ];

  return (
    <div className="auth-modal-shell" role="dialog" aria-modal="true">
      <div className="auth-modal-backdrop" onClick={onClose} />
      <div className="auth-modal">
        <button type="button" className="auth-modal__close" onClick={onClose}>
          ×
        </button>

        <div className="auth-modal__media">
          <img
            src="/logo.png"
            alt="Fashion Shop"
            className="auth-modal__brand-logo"
          />
          <div className="auth-modal__eyebrow">Fashion Shop</div>
          <h2>{mode === "login" ? "Log in" : "Create account"}</h2>
          <p>
            {mode === "login"
              ? "Sign in to track orders and keep your cart in sync."
              : "Create an account with email and username only."}
          </p>
        </div>

        <div className="auth-modal__panel">
          <div className="auth-modal__title-row">
            <h3>{mode === "login" ? "Log in to Fashion" : "Sign up"}</h3>
            <button
              type="button"
              className="auth-modal__switch"
              onClick={() =>
                switchMode(mode === "login" ? "register" : "login")
              }
            >
              {mode === "login" ? "Sign up" : "Log in"}
            </button>
          </div>
          <div className="auth-modal__socials">
            {socialButtons.map((button) => (
              <button
                key={button.label}
                type="button"
                className="auth-modal__social"
                disabled
              >
                <img src={button.icon} alt="" aria-hidden="true" />
                <span>{button.label}</span>
              </button>
            ))}
          </div>

          <div className="auth-modal__divider">
            <span>or</span>
          </div>

          {mode === "login" ? (
            <form onSubmit={handleLogin} className="auth-modal__form">
              <label className="auth-field">
                <span className="auth-field__icon auth-field__icon--start">
                  <img src={userIcon} alt="" aria-hidden="true" />
                </span>
                <input
                  ref={loginIdentifierRef}
                  type="text"
                  placeholder="Email or username"
                  value={form.identifier}
                  onChange={(e) => setField("identifier", e.target.value)}
                />
              </label>

              <label className="auth-field">
                <span className="auth-field__icon auth-field__icon--start">
                  <img src={lockIcon} alt="" aria-hidden="true" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => setField("password", e.target.value)}
                />
                <button
                  type="button"
                  className="auth-field__toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  <img
                    src={showPassword ? showPasswordIcon : hidePasswordIcon}
                    alt=""
                    aria-hidden="true"
                  />
                </button>
              </label>

              <div className="auth-modal__row auth-modal__row--single">
                <button type="button" className="auth-modal__forgot">
                  Forgot password?
                </button>
              </div>

              <button className="auth-modal__submit" disabled={loading}>
                {loading ? "Signing in..." : "Log in"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="auth-modal__form">
              <label className="auth-field">
                <span className="auth-field__icon auth-field__icon--start">
                  <img src={userIcon} alt="" aria-hidden="true" />
                </span>
                <input
                  ref={registerUsernameRef}
                  type="text"
                  placeholder="Username"
                  value={form.username}
                  onChange={(e) => setField("username", e.target.value)}
                />
              </label>

              <label className="auth-field">
                <span className="auth-field__icon auth-field__icon--start">
                  <img src={userIcon} alt="" aria-hidden="true" />
                </span>
                <input
                  ref={registerEmailRef}
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                />
              </label>

              <label className="auth-field">
                <span className="auth-field__icon auth-field__icon--start">
                  <img src={lockIcon} alt="" aria-hidden="true" />
                </span>
                <input
                  ref={registerPasswordRef}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => setField("password", e.target.value)}
                />
                <button
                  type="button"
                  className="auth-field__toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  <img
                    src={showPassword ? showPasswordIcon : hidePasswordIcon}
                    alt=""
                    aria-hidden="true"
                  />
                </button>
              </label>

              <button className="auth-modal__submit" disabled={loading}>
                {loading ? "Creating account..." : "Sign up"}
              </button>
            </form>
          )}

          {message && (
            <div className="auth-modal__message auth-modal__message--info">
              {message}
            </div>
          )}
          {error && (
            <div className="auth-modal__message auth-modal__message--error">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
