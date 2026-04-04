"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import Image from "next/image"
import CountrySelect from "@/components/country-select"

export default function NobleFundedAuth() {
  const [isSignIn, setIsSignIn] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const router = useRouter()

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = true
    video.load()
    const attempt = () => {
      video.play().catch(() => {
        setTimeout(() => video.play().catch(() => {}), 300)
      })
    }
    if (video.readyState >= 3) {
      attempt()
    } else {
      video.addEventListener("canplay", attempt, { once: true })
    }
    return () => video.removeEventListener("canplay", attempt)
  }, [])

  function switchToSignIn() {
    setIsSignIn(true)
    setShowPassword(false)
    setAgreedToTerms(false)
  }

  function switchToSignUp() {
    setIsSignIn(false)
    setShowPassword(false)
    setAgreedToTerms(false)
  }

  function handleSubmit() {
    // Set mock session so the dashboard auth guard lets users through
    sessionStorage.setItem("nf_logged_in", "true")
    router.push("/dashboard")
  }

  return (
    <>
    <style>{`
      @media (max-width: 768px) {
        .nf-outer-card {
          height: auto !important;
          padding: 12px !important;
          border-radius: 24px !important;
          max-width: 100% !important;
        }
        .nf-inner-card {
          flex-direction: column !important;
          border-radius: 16px !important;
        }
        .nf-form-panel {
          padding: 32px 24px !important;
          flex: unset !important;
          width: 100% !important;
        }
        .nf-video-panel {
          display: none !important;
        }
        .nf-name-country-row {
          flex-direction: column !important;
          gap: 12px !important;
        }
        .nf-heading {
          font-size: 20px !important;
        }
      }
    `}</style>
    <div
      style={{
        backgroundColor: "#0b1c1a",
        backgroundImage: [
          "radial-gradient(ellipse at 15% 0%, rgba(0, 140, 130, 0.55) 0%, transparent 45%)",
          "radial-gradient(ellipse at 85% 100%, rgba(0, 100, 110, 0.45) 0%, transparent 50%)",
          "radial-gradient(ellipse at 50% 50%, rgba(0, 60, 70, 0.35) 0%, transparent 70%)",
          "linear-gradient(160deg, #0e2a28 0%, #050f0d 100%)",
        ].join(", "),
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        overflow: "hidden",
        position: "relative",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Diagonal light streak */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-50%",
          left: "-50%",
          width: "200%",
          height: "200%",
          background:
            "conic-gradient(from 220deg at 50% 50%, transparent 0deg, rgba(255,255,255,0.02) 20deg, transparent 40deg)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Sparkle bottom-right */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          bottom: 28,
          right: 28,
          pointerEvents: "none",
          zIndex: 20,
        }}
      >
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path
            d="M20 1 L22 18 L39 20 L22 22 L20 39 L18 22 L1 20 L18 18 Z"
            fill="rgba(255,255,255,0.75)"
          />
        </svg>
      </div>

      {/* LAYER 1: Outer glass backplate */}
      <div
        className="nf-outer-card"
        style={{
          width: "100%",
          maxWidth: 1020,
          height: 640,
          background: "rgba(8, 32, 30, 0.55)",
          backdropFilter: "blur(48px) saturate(1.6)",
          WebkitBackdropFilter: "blur(48px) saturate(1.6)",
          borderRadius: 40,
          border: "1.5px solid rgba(0, 200, 180, 0.22)",
          borderTop: "1.5px solid rgba(0, 240, 200, 0.32)",
          borderLeft: "1.5px solid rgba(0, 240, 200, 0.28)",
          boxShadow: [
            "inset 0 0 80px rgba(0, 30, 28, 0.7)",
            "inset 0 1px 0 rgba(0, 255, 220, 0.12)",
            "0 40px 80px rgba(0, 0, 0, 0.8)",
            "0 0 0 1px rgba(0, 0, 0, 0.4)",
            "0 0 120px rgba(0, 180, 160, 0.12)",
          ].join(", "),
          padding: 16,
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* LAYER 2: Inner glass panel */}
        <div
          className="nf-inner-card"
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(145deg, rgba(10, 45, 42, 0.85) 0%, rgba(5, 18, 16, 0.95) 100%)",
            borderRadius: 28,
            overflow: "hidden",
            border: "1.5px solid rgba(0, 210, 190, 0.45)",
            boxShadow: [
              "0 20px 50px rgba(0, 0, 0, 0.7)",
              "inset 0 1px 0 rgba(0, 255, 220, 0.15)",
              "inset 0 0 60px rgba(0, 100, 90, 0.08)",
            ].join(", "),
          }}
        >
          {/* LEFT: Form section */}
          <div
            className="nf-form-panel"
            style={{
              flex: 1,
              padding: "40px 50px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              position: "relative",
              background:
                "radial-gradient(ellipse at 30% 40%, rgba(0, 160, 140, 0.1) 0%, transparent 60%), radial-gradient(ellipse at 80% 90%, rgba(0, 80, 80, 0.08) 0%, transparent 50%)",
            }}
          >
            {/* Logo */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                marginBottom: 30,
              }}
            >
              <Image
                src="/noble-logo.svg"
                alt="Noble Funded logo"
                width={160}
                height={32}
                priority
                style={{ height: 32, width: "auto", filter: "brightness(0) invert(1)" }}
              />
            </div>

            {/* Heading */}
            <h1
              className="nf-heading"
              style={{
                fontSize: 22,
                fontWeight: 400,
                marginBottom: 24,
                textAlign: "center",
                color: "#f0f4f5",
                lineHeight: 1.4,
              }}
            >
              {isSignIn
                ? "Sign in to your Noble Funded account"
                : "Create your Noble Funded account"}
            </h1>

            <div style={{ width: "100%", maxWidth: 380, margin: "0 auto" }}>
              {/* Google button */}
              <button
                type="button"
                onClick={handleSubmit}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  width: "100%",
                  padding: "12px",
                  background: "rgba(0, 30, 28, 0.5)",
                  border: "1px solid rgba(0, 190, 170, 0.3)",
                  borderRadius: 12,
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 400,
                  cursor: "pointer",
                  marginBottom: 24,
                  boxShadow: "inset 0 1px 0 rgba(0, 255, 220, 0.07), 0 2px 8px rgba(0,0,0,0.3)",
                  fontFamily: "inherit",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(0, 60, 55, 0.6)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(0, 30, 28, 0.5)")
                }
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                {isSignIn ? "Sign in with Google" : "Sign up with Google"}
              </button>

              {/* Sign Up fields */}
              {!isSignIn && (
                <div className="nf-name-country-row" style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 400, color: "#7ab8b0", marginBottom: 8 }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      style={{
                        width: "100%",
                        padding: "14px 16px",
                        background: "rgba(0, 20, 18, 0.6)",
                        border: "1px solid rgba(0, 180, 160, 0.35)",
                        borderRadius: 12,
                        color: "#e0f0ee",
                        fontSize: 14,
                        outline: "none",
                        fontFamily: "inherit",
                        boxSizing: "border-box",
                        boxShadow: "inset 0 2px 8px rgba(0,0,0,0.3)",
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 400, color: "#7ab8b0", marginBottom: 8 }}>
                      Country
                    </label>
                    <CountrySelect />
                  </div>
                </div>
              )}

              {/* Email */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 400, color: "#7ab8b0", marginBottom: 8 }}>
                  Email
                </label>
                <input
                  type="email"
                  placeholder={isSignIn ? "Email@email.com" : "name@email.com"}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    background: "rgba(0, 20, 18, 0.6)",
                    border: "1px solid rgba(0, 180, 160, 0.35)",
                    borderRadius: 12,
                    color: "#e0f0ee",
                    fontSize: 14,
                    outline: "none",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                    boxShadow: "inset 0 2px 8px rgba(0,0,0,0.3)",
                  }}
                />
              </div>

              {/* Password */}
              <div style={{ marginBottom: 8, position: "relative" }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 400, color: "#7ab8b0", marginBottom: 8 }}>
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={isSignIn ? "Password" : "••••••••"}
                  style={{
                    width: "100%",
                    padding: "14px 44px 14px 16px",
                    background: "rgba(0, 20, 18, 0.6)",
                    border: "1px solid rgba(0, 180, 160, 0.35)",
                    borderRadius: 12,
                    color: "#e0f0ee",
                    fontSize: 14,
                    outline: "none",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                    boxShadow: "inset 0 2px 8px rgba(0,0,0,0.3)",
                  }}
                />
                {isSignIn && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    style={{
                      position: "absolute",
                      right: 16,
                      top: 36,
                      color: "#849b9f",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                )}
              </div>

              {/* Forgot password */}
              {isSignIn && (
                <div style={{ textAlign: "right", marginBottom: 8 }}>
                  <a href="#" style={{ color: "#00f0ff", fontSize: 12, textDecoration: "none" }}>
                    Forgot password?
                  </a>
                </div>
              )}

              {/* Terms checkbox */}
              {!isSignIn && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8, marginBottom: 24 }}>
                  <div
                    role="checkbox"
                    aria-checked={agreedToTerms}
                    tabIndex={0}
                    onClick={() => setAgreedToTerms(!agreedToTerms)}
                    onKeyDown={(e) => e.key === " " && setAgreedToTerms(!agreedToTerms)}
                    style={{
                      width: 16,
                      height: 16,
                      background: agreedToTerms ? "#00f0ff" : "rgba(0,0,0,0.3)",
                      border: `1px solid ${agreedToTerms ? "#00f0ff" : "#1a5c63"}`,
                      borderRadius: 4,
                      cursor: "pointer",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {agreedToTerms && (
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <label style={{ margin: 0, fontSize: 12, color: "#7ab8b0" }}>
                    {"I agree to the "}
                    <a href="#" style={{ color: "#00f0ff", textDecoration: "none", borderBottom: "1px solid rgba(0, 240, 255, 0.4)" }}>
                      Terms of Service
                    </a>
                    {" and "}
                    <a href="#" style={{ color: "#00f0ff", textDecoration: "none", borderBottom: "1px solid rgba(0, 240, 255, 0.4)" }}>
                      Privacy Policy
                    </a>
                    .
                  </label>
                </div>
              )}

              {/* Submit button */}
              <button
                type="button"
                onClick={handleSubmit}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: "linear-gradient(90deg, #00f0ff, #00d4d4)",
                  border: "none",
                  borderRadius: 50,
                  color: "#041c20",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: [
                    "0 4px 20px rgba(0, 240, 255, 0.35)",
                    "inset 0 -2px 5px rgba(0,0,0,0.2)",
                    "inset 0 2px 5px rgba(255,255,255,0.4)",
                  ].join(", "),
                  marginTop: isSignIn ? 24 : 0,
                  marginBottom: 20,
                  fontFamily: "inherit",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)"
                  e.currentTarget.style.boxShadow = "0 6px 25px rgba(0, 240, 255, 0.5), inset 0 -2px 5px rgba(0,0,0,0.2), inset 0 2px 5px rgba(255,255,255,0.5)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 240, 255, 0.35), inset 0 -2px 5px rgba(0,0,0,0.2), inset 0 2px 5px rgba(255,255,255,0.4)"
                }}
              >
                {isSignIn ? "Sign in" : "Create account"}
              </button>

              {/* Toggle link */}
              <div style={{ textAlign: "center", fontSize: 13, color: "#7ab8b0" }}>
                {isSignIn ? (
                  <>
                    {"Don't have a Noble Funded account? "}
                    <a
                      onClick={(e) => { e.preventDefault(); switchToSignUp() }}
                      href="#"
                      style={{ color: "#00f0ff", textDecoration: "none", fontWeight: 500 }}
                    >
                      Sign up
                    </a>
                  </>
                ) : (
                  <>
                    {"Already have a Noble Funded account? "}
                    <a
                      onClick={(e) => { e.preventDefault(); switchToSignIn() }}
                      href="#"
                      style={{ color: "#00f0ff", textDecoration: "none", fontWeight: 500 }}
                    >
                      Sign in
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Video panel */}
          <div
            className="nf-video-panel"
            style={{
              flex: 1.1,
              position: "relative",
              borderLeft: "1px solid rgba(255,255,255,0.05)",
              overflow: "hidden",
            }}
          >
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              disableRemotePlayback
              controlsList="nodownload nofullscreen noremoteplayback"
              onContextMenu={(e) => e.preventDefault()}
              onPause={(e) => { e.currentTarget.play().catch(() => {}) }}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                pointerEvents: "none",
                userSelect: "none",
                WebkitUserSelect: "none",
              }}
            >
              <source src="/video/signin-intro.mp4" type="video/mp4" />
              <source src="/video/signin-intro.webm" type="video/webm" />
            </video>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
