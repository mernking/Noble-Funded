"use client"

import Image from "next/image"

interface TradingCardProps {
  accountSize: string
  price: string
  currencyName: string
  currencyFlag: string
  currencyId: string
}

export default function TradingCard({ accountSize, price, currencyName, currencyFlag, currencyId }: TradingCardProps) {
  const isNaira = currencyId === "ngn"

  return (
    <div className="w-full mx-auto select-none">
      {/* ── Card Shell ── */}
      <div
        className="relative w-full rounded-3xl overflow-hidden"
        style={{
          aspectRatio: "1.586 / 1",
          background: isNaira
            ? "linear-gradient(135deg, #001820 0%, #002B36 30%, #0a3d35 60%, #14655B 100%)"
            : "linear-gradient(135deg, #001c14 0%, #002B36 35%, #083028 65%, #0d4d40 100%)",
          boxShadow:
            "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(167,255,235,0.08), inset 0 1px 0 rgba(167,255,235,0.12)",
        }}
      >

        {/* ── Noise texture overlay ── */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: "150px 150px",
          }}
        />

        {/* ── Radial light source — top-left ── */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "-40%",
            left: "-20%",
            width: "70%",
            height: "90%",
            background: "radial-gradient(ellipse, rgba(167,255,235,0.07) 0%, transparent 70%)",
          }}
        />

        {/* ── Radial glow — bottom-right ── */}
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: "-30%",
            right: "-10%",
            width: "55%",
            height: "75%",
            background: "radial-gradient(ellipse, rgba(20,101,91,0.35) 0%, transparent 65%)",
          }}
        />

        {/* ── Horizontal accent line — top ── */}
        <div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{ background: "linear-gradient(90deg, transparent 0%, rgba(167,255,235,0.4) 40%, rgba(167,255,235,0.15) 100%)" }}
        />

        {/* ── Diagonal mesh lines ── */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern id="mesh" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 40" stroke="#A7FFEB" strokeWidth="0.5" fill="none" />
              <path d="M 0 0 L 40 40" stroke="#A7FFEB" strokeWidth="0.5" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mesh)" />
        </svg>

        {/* ── Card content ── */}
        <div className="relative z-10 h-full flex flex-col p-[6%]" style={{ gap: "0" }}>

          {/* TOP ROW: logo/brand + chip */}
          <div className="flex items-center justify-between">
            {/* Brand */}
            <div className="flex items-center gap-2.5">
              <div
                className="rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0"
                style={{
                  width: "clamp(28px, 5%, 40px)",
                  height: "clamp(28px, 5%, 40px)",
                  background: "rgba(0,0,0,0.5)",
                  border: "1px solid rgba(167,255,235,0.15)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <Image
                  src="/noble-logo.png"
                  alt="Noble Funded"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="leading-none">
                <p
                  className="font-bold tracking-[0.18em] uppercase"
                  style={{ fontSize: "clamp(7px, 1.3vw, 11px)", color: "#A7FFEB" }}
                >
                  Noble Funded
                </p>
                <p
                  className="tracking-[0.1em] uppercase mt-0.5"
                  style={{ fontSize: "clamp(5px, 0.9vw, 8px)", color: "rgba(167,255,235,0.45)" }}
                >
                  Prop Trading Firm
                </p>
              </div>
            </div>

            {/* EMV Chip — gold micro-circuit */}
            <div
              className="relative rounded-md flex-shrink-0"
              style={{
                width: "clamp(28px, 5.5%, 44px)",
                height: "clamp(20px, 3.8%, 32px)",
                background: "linear-gradient(145deg, #c8a84b 0%, #f5d676 35%, #a07828 55%, #e8c050 80%, #b08c38 100%)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.3)",
              }}
            >
              {/* chip contact lines */}
              <div className="absolute inset-0 rounded-md overflow-hidden opacity-50">
                <div className="absolute top-[33%] left-0 right-0 h-px bg-[#7a5c1a]" />
                <div className="absolute top-[66%] left-0 right-0 h-px bg-[#7a5c1a]" />
                <div className="absolute left-[33%] top-0 bottom-0 w-px bg-[#7a5c1a]" />
                <div className="absolute left-[66%] top-0 bottom-0 w-px bg-[#7a5c1a]" />
              </div>
              {/* centre square */}
              <div
                className="absolute rounded-sm"
                style={{
                  top: "22%", left: "22%", right: "22%", bottom: "22%",
                  background: "linear-gradient(135deg, #c8a84b, #f5d676)",
                  border: "1px solid rgba(120,90,20,0.5)",
                }}
              />
            </div>
          </div>

          {/* MIDDLE: account size — hero number */}
          <div className="flex-1 flex flex-col justify-center mt-1">
            <p
              className="uppercase tracking-[0.25em]"
              style={{ fontSize: "clamp(5.5px, 1vw, 8px)", color: "rgba(167,255,235,0.4)", marginBottom: "2px" }}
            >
              Account Size
            </p>
            <p
              className="font-black tracking-tight leading-none"
              style={{
                fontSize: "clamp(1.2rem, 5.5vw, 2.2rem)",
                color: "#ffffff",
                textShadow: "0 0 30px rgba(167,255,235,0.3), 0 2px 4px rgba(0,0,0,0.5)",
                letterSpacing: "-0.02em",
              }}
            >
              {accountSize}
            </p>

            {/* Subtle divider with glow */}
            <div
              className="mt-2"
              style={{
                width: "clamp(32px, 18%, 60px)",
                height: "2px",
                background: "linear-gradient(90deg, #A7FFEB, transparent)",
                borderRadius: "1px",
                boxShadow: "0 0 8px rgba(167,255,235,0.6)",
              }}
            />
          </div>

          {/* BOTTOM ROW: account type + fee + contactless */}
          <div className="flex items-end justify-between">
            {/* Left: type info */}
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span style={{ fontSize: "clamp(9px, 1.5vw, 13px)" }}>{currencyFlag}</span>
                <span
                  className="font-semibold tracking-[0.12em] uppercase"
                  style={{ fontSize: "clamp(6px, 1.1vw, 9px)", color: "rgba(167,255,235,0.75)" }}
                >
                  {isNaira ? "Naira Challenge" : "Dollar Challenge"}
                </span>
              </div>
              <p
                className="tracking-[0.12em] uppercase"
                style={{ fontSize: "clamp(5px, 0.9vw, 7.5px)", color: "rgba(167,255,235,0.35)" }}
              >
                2-Step · MT5 · 80% Profit Split
              </p>
            </div>

            {/* Right: fee pill + contactless icon */}
            <div className="flex flex-col items-end gap-1.5">
              {/* Contactless symbol */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: "clamp(12px, 2.2vw, 18px)", opacity: 0.35 }}
              >
                <path d="M12 2C12 2 19 8 19 13C19 17.4 15.9 21 12 21C8.1 21 5 17.4 5 13C5 8 12 2 12 2Z" stroke="#A7FFEB" strokeWidth="1.5" fill="none"/>
                <path d="M12 6C12 6 16 10 16 13C16 15.2 14.2 17 12 17C9.8 17 8 15.2 8 13C8 10 12 6 12 6Z" stroke="#A7FFEB" strokeWidth="1.5" fill="none"/>
                <path d="M12 10C12 10 13.5 11.5 13.5 13C13.5 13.8 12.8 14.5 12 14.5C11.2 14.5 10.5 13.8 10.5 13C10.5 11.5 12 10 12 10Z" fill="#A7FFEB" opacity="0.5"/>
              </svg>

              {/* Fee badge */}
              <div
                className="flex items-center gap-1 px-2 py-1 rounded-full"
                style={{
                  background: "rgba(167,255,235,0.08)",
                  border: "1px solid rgba(167,255,235,0.2)",
                  backdropFilter: "blur(4px)",
                }}
              >
                <span
                  className="uppercase tracking-widest"
                  style={{ fontSize: "clamp(4.5px, 0.8vw, 6.5px)", color: "rgba(167,255,235,0.45)" }}
                >
                  Fee
                </span>
                <span
                  className="font-bold"
                  style={{
                    fontSize: "clamp(7px, 1.4vw, 11px)",
                    color: "#A7FFEB",
                    textShadow: "0 0 12px rgba(167,255,235,0.7)",
                  }}
                >
                  {price}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* ── Bottom accent strip ── */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: "3px",
            background: isNaira
              ? "linear-gradient(90deg, #14655B 0%, #A7FFEB 50%, #14655B 100%)"
              : "linear-gradient(90deg, #0d4d40 0%, #A7FFEB 40%, #14655B 100%)",
            opacity: 0.7,
          }}
        />

      </div>

      {/* ── Glow reflection ── */}
      <div
        className="mx-[12%] mt-1 h-3 rounded-full blur-xl"
        style={{
          background: isNaira
            ? "linear-gradient(90deg, transparent, #14655B, #A7FFEB55, #14655B, transparent)"
            : "linear-gradient(90deg, transparent, #0d4d40, #A7FFEB44, #0d4d40, transparent)",
          opacity: 0.5,
        }}
      />

      {/* ── Card specs strip below ── */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        {[
          { label: "Platform", value: "MetaTrader 5" },
          { label: "Challenge", value: "2-Step" },
          { label: "Profit Split", value: "Up to 80%" },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-xl px-3 py-2 text-center"
            style={{
              background: "rgba(167,255,235,0.04)",
              border: "1px solid rgba(167,255,235,0.08)",
            }}
          >
            <p
              className="uppercase tracking-widest"
              style={{ fontSize: "clamp(5px, 0.85vw, 7px)", color: "rgba(167,255,235,0.35)" }}
            >
              {label}
            </p>
            <p
              className="font-semibold mt-0.5"
              style={{ fontSize: "clamp(7px, 1.1vw, 10px)", color: "rgba(167,255,235,0.75)" }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
