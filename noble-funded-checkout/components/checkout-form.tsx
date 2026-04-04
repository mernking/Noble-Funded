"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import {
  User, Lock, CheckCircle, Mail, Loader2, MapPin, Phone,
  ChevronDown, Search, Check, Shield, Bitcoin, ExternalLink,
  AlertCircle,
} from "lucide-react"

interface CheckoutFormProps {
  totalPrice: number
  currency: { id: string; name: string; symbol: string; flag: string }
  productDetails: { name: string; accountSize: string; platform: string; challengeType: string }
}

// ── Full world country list ────────────────────────────────────────────────────
const countries = [
  { code: "AF", name: "Afghanistan", flag: "🇦🇫", dialCode: "+93" },
  { code: "AL", name: "Albania", flag: "🇦🇱", dialCode: "+355" },
  { code: "DZ", name: "Algeria", flag: "🇩🇿", dialCode: "+213" },
  { code: "AD", name: "Andorra", flag: "🇦🇩", dialCode: "+376" },
  { code: "AO", name: "Angola", flag: "🇦🇴", dialCode: "+244" },
  { code: "AG", name: "Antigua and Barbuda", flag: "🇦🇬", dialCode: "+1-268" },
  { code: "AR", name: "Argentina", flag: "🇦🇷", dialCode: "+54" },
  { code: "AM", name: "Armenia", flag: "🇦🇲", dialCode: "+374" },
  { code: "AU", name: "Australia", flag: "🇦🇺", dialCode: "+61" },
  { code: "AT", name: "Austria", flag: "🇦🇹", dialCode: "+43" },
  { code: "AZ", name: "Azerbaijan", flag: "🇦🇿", dialCode: "+994" },
  { code: "BS", name: "Bahamas", flag: "🇧🇸", dialCode: "+1-242" },
  { code: "BH", name: "Bahrain", flag: "🇧🇭", dialCode: "+973" },
  { code: "BD", name: "Bangladesh", flag: "🇧🇩", dialCode: "+880" },
  { code: "BB", name: "Barbados", flag: "🇧🇧", dialCode: "+1-246" },
  { code: "BY", name: "Belarus", flag: "🇧🇾", dialCode: "+375" },
  { code: "BE", name: "Belgium", flag: "🇧🇪", dialCode: "+32" },
  { code: "BZ", name: "Belize", flag: "🇧🇿", dialCode: "+501" },
  { code: "BJ", name: "Benin", flag: "🇧🇯", dialCode: "+229" },
  { code: "BT", name: "Bhutan", flag: "🇧🇹", dialCode: "+975" },
  { code: "BO", name: "Bolivia", flag: "🇧🇴", dialCode: "+591" },
  { code: "BA", name: "Bosnia and Herzegovina", flag: "🇧🇦", dialCode: "+387" },
  { code: "BW", name: "Botswana", flag: "🇧🇼", dialCode: "+267" },
  { code: "BR", name: "Brazil", flag: "🇧🇷", dialCode: "+55" },
  { code: "BN", name: "Brunei", flag: "🇧🇳", dialCode: "+673" },
  { code: "BG", name: "Bulgaria", flag: "🇧🇬", dialCode: "+359" },
  { code: "BF", name: "Burkina Faso", flag: "🇧🇫", dialCode: "+226" },
  { code: "BI", name: "Burundi", flag: "🇧🇮", dialCode: "+257" },
  { code: "CV", name: "Cabo Verde", flag: "🇨🇻", dialCode: "+238" },
  { code: "KH", name: "Cambodia", flag: "🇰🇭", dialCode: "+855" },
  { code: "CM", name: "Cameroon", flag: "🇨🇲", dialCode: "+237" },
  { code: "CA", name: "Canada", flag: "🇨🇦", dialCode: "+1" },
  { code: "CF", name: "Central African Republic", flag: "🇨🇫", dialCode: "+236" },
  { code: "TD", name: "Chad", flag: "🇹🇩", dialCode: "+235" },
  { code: "CL", name: "Chile", flag: "🇨🇱", dialCode: "+56" },
  { code: "CN", name: "China", flag: "🇨🇳", dialCode: "+86" },
  { code: "CO", name: "Colombia", flag: "🇨🇴", dialCode: "+57" },
  { code: "KM", name: "Comoros", flag: "🇰🇲", dialCode: "+269" },
  { code: "CD", name: "Congo (DRC)", flag: "🇨🇩", dialCode: "+243" },
  { code: "CG", name: "Congo (Republic)", flag: "🇨🇬", dialCode: "+242" },
  { code: "CR", name: "Costa Rica", flag: "🇨🇷", dialCode: "+506" },
  { code: "CI", name: "Côte d'Ivoire", flag: "🇨🇮", dialCode: "+225" },
  { code: "HR", name: "Croatia", flag: "🇭🇷", dialCode: "+385" },
  { code: "CU", name: "Cuba", flag: "🇨🇺", dialCode: "+53" },
  { code: "CY", name: "Cyprus", flag: "🇨🇾", dialCode: "+357" },
  { code: "CZ", name: "Czech Republic", flag: "🇨🇿", dialCode: "+420" },
  { code: "DK", name: "Denmark", flag: "🇩🇰", dialCode: "+45" },
  { code: "DJ", name: "Djibouti", flag: "🇩🇯", dialCode: "+253" },
  { code: "DM", name: "Dominica", flag: "🇩🇲", dialCode: "+1-767" },
  { code: "DO", name: "Dominican Republic", flag: "🇩🇴", dialCode: "+1-809" },
  { code: "EC", name: "Ecuador", flag: "🇪🇨", dialCode: "+593" },
  { code: "EG", name: "Egypt", flag: "🇪🇬", dialCode: "+20" },
  { code: "SV", name: "El Salvador", flag: "🇸🇻", dialCode: "+503" },
  { code: "GQ", name: "Equatorial Guinea", flag: "🇬🇶", dialCode: "+240" },
  { code: "ER", name: "Eritrea", flag: "🇪🇷", dialCode: "+291" },
  { code: "EE", name: "Estonia", flag: "🇪🇪", dialCode: "+372" },
  { code: "SZ", name: "Eswatini", flag: "🇸🇿", dialCode: "+268" },
  { code: "ET", name: "Ethiopia", flag: "🇪🇹", dialCode: "+251" },
  { code: "FJ", name: "Fiji", flag: "🇫🇯", dialCode: "+679" },
  { code: "FI", name: "Finland", flag: "🇫🇮", dialCode: "+358" },
  { code: "FR", name: "France", flag: "🇫🇷", dialCode: "+33" },
  { code: "GA", name: "Gabon", flag: "🇬🇦", dialCode: "+241" },
  { code: "GM", name: "Gambia", flag: "🇬🇲", dialCode: "+220" },
  { code: "GE", name: "Georgia", flag: "🇬🇪", dialCode: "+995" },
  { code: "DE", name: "Germany", flag: "🇩🇪", dialCode: "+49" },
  { code: "GH", name: "Ghana", flag: "🇬🇭", dialCode: "+233" },
  { code: "GR", name: "Greece", flag: "🇬🇷", dialCode: "+30" },
  { code: "GD", name: "Grenada", flag: "🇬🇩", dialCode: "+1-473" },
  { code: "GT", name: "Guatemala", flag: "🇬🇹", dialCode: "+502" },
  { code: "GN", name: "Guinea", flag: "🇬🇳", dialCode: "+224" },
  { code: "GW", name: "Guinea-Bissau", flag: "🇬🇼", dialCode: "+245" },
  { code: "GY", name: "Guyana", flag: "🇬🇾", dialCode: "+592" },
  { code: "HT", name: "Haiti", flag: "🇭🇹", dialCode: "+509" },
  { code: "HN", name: "Honduras", flag: "🇭🇳", dialCode: "+504" },
  { code: "HU", name: "Hungary", flag: "🇭🇺", dialCode: "+36" },
  { code: "IS", name: "Iceland", flag: "🇮🇸", dialCode: "+354" },
  { code: "IN", name: "India", flag: "🇮🇳", dialCode: "+91" },
  { code: "ID", name: "Indonesia", flag: "🇮🇩", dialCode: "+62" },
  { code: "IR", name: "Iran", flag: "🇮🇷", dialCode: "+98" },
  { code: "IQ", name: "Iraq", flag: "🇮🇶", dialCode: "+964" },
  { code: "IE", name: "Ireland", flag: "🇮🇪", dialCode: "+353" },
  { code: "IL", name: "Israel", flag: "🇮🇱", dialCode: "+972" },
  { code: "IT", name: "Italy", flag: "🇮🇹", dialCode: "+39" },
  { code: "JM", name: "Jamaica", flag: "🇯🇲", dialCode: "+1-876" },
  { code: "JP", name: "Japan", flag: "🇯🇵", dialCode: "+81" },
  { code: "JO", name: "Jordan", flag: "🇯🇴", dialCode: "+962" },
  { code: "KZ", name: "Kazakhstan", flag: "🇰🇿", dialCode: "+7" },
  { code: "KE", name: "Kenya", flag: "🇰🇪", dialCode: "+254" },
  { code: "KI", name: "Kiribati", flag: "🇰🇮", dialCode: "+686" },
  { code: "KW", name: "Kuwait", flag: "🇰🇼", dialCode: "+965" },
  { code: "KG", name: "Kyrgyzstan", flag: "🇰🇬", dialCode: "+996" },
  { code: "LA", name: "Laos", flag: "🇱🇦", dialCode: "+856" },
  { code: "LV", name: "Latvia", flag: "🇱🇻", dialCode: "+371" },
  { code: "LB", name: "Lebanon", flag: "🇱🇧", dialCode: "+961" },
  { code: "LS", name: "Lesotho", flag: "🇱🇸", dialCode: "+266" },
  { code: "LR", name: "Liberia", flag: "🇱🇷", dialCode: "+231" },
  { code: "LY", name: "Libya", flag: "🇱🇾", dialCode: "+218" },
  { code: "LI", name: "Liechtenstein", flag: "🇱🇮", dialCode: "+423" },
  { code: "LT", name: "Lithuania", flag: "🇱🇹", dialCode: "+370" },
  { code: "LU", name: "Luxembourg", flag: "🇱🇺", dialCode: "+352" },
  { code: "MG", name: "Madagascar", flag: "🇲🇬", dialCode: "+261" },
  { code: "MW", name: "Malawi", flag: "🇲🇼", dialCode: "+265" },
  { code: "MY", name: "Malaysia", flag: "🇲🇾", dialCode: "+60" },
  { code: "MV", name: "Maldives", flag: "🇲🇻", dialCode: "+960" },
  { code: "ML", name: "Mali", flag: "🇲🇱", dialCode: "+223" },
  { code: "MT", name: "Malta", flag: "🇲🇹", dialCode: "+356" },
  { code: "MH", name: "Marshall Islands", flag: "🇲🇭", dialCode: "+692" },
  { code: "MR", name: "Mauritania", flag: "🇲🇷", dialCode: "+222" },
  { code: "MU", name: "Mauritius", flag: "🇲🇺", dialCode: "+230" },
  { code: "MX", name: "Mexico", flag: "🇲🇽", dialCode: "+52" },
  { code: "FM", name: "Micronesia", flag: "🇫🇲", dialCode: "+691" },
  { code: "MD", name: "Moldova", flag: "🇲🇩", dialCode: "+373" },
  { code: "MC", name: "Monaco", flag: "🇲🇨", dialCode: "+377" },
  { code: "MN", name: "Mongolia", flag: "🇲🇳", dialCode: "+976" },
  { code: "ME", name: "Montenegro", flag: "🇲🇪", dialCode: "+382" },
  { code: "MA", name: "Morocco", flag: "🇲🇦", dialCode: "+212" },
  { code: "MZ", name: "Mozambique", flag: "🇲🇿", dialCode: "+258" },
  { code: "MM", name: "Myanmar", flag: "🇲🇲", dialCode: "+95" },
  { code: "NA", name: "Namibia", flag: "🇳🇦", dialCode: "+264" },
  { code: "NR", name: "Nauru", flag: "🇳🇷", dialCode: "+674" },
  { code: "NP", name: "Nepal", flag: "🇳🇵", dialCode: "+977" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱", dialCode: "+31" },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿", dialCode: "+64" },
  { code: "NI", name: "Nicaragua", flag: "🇳🇮", dialCode: "+505" },
  { code: "NE", name: "Niger", flag: "🇳🇪", dialCode: "+227" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬", dialCode: "+234" },
  { code: "NO", name: "Norway", flag: "🇳🇴", dialCode: "+47" },
  { code: "OM", name: "Oman", flag: "🇴🇲", dialCode: "+968" },
  { code: "PK", name: "Pakistan", flag: "🇵🇰", dialCode: "+92" },
  { code: "PW", name: "Palau", flag: "🇵🇼", dialCode: "+680" },
  { code: "PA", name: "Panama", flag: "🇵🇦", dialCode: "+507" },
  { code: "PG", name: "Papua New Guinea", flag: "🇵🇬", dialCode: "+675" },
  { code: "PY", name: "Paraguay", flag: "🇵🇾", dialCode: "+595" },
  { code: "PE", name: "Peru", flag: "🇵🇪", dialCode: "+51" },
  { code: "PH", name: "Philippines", flag: "🇵🇭", dialCode: "+63" },
  { code: "PL", name: "Poland", flag: "🇵🇱", dialCode: "+48" },
  { code: "PT", name: "Portugal", flag: "🇵🇹", dialCode: "+351" },
  { code: "QA", name: "Qatar", flag: "🇶🇦", dialCode: "+974" },
  { code: "RO", name: "Romania", flag: "🇷🇴", dialCode: "+40" },
  { code: "RU", name: "Russia", flag: "🇷🇺", dialCode: "+7" },
  { code: "RW", name: "Rwanda", flag: "🇷🇼", dialCode: "+250" },
  { code: "KN", name: "Saint Kitts and Nevis", flag: "🇰🇳", dialCode: "+1-869" },
  { code: "LC", name: "Saint Lucia", flag: "🇱🇨", dialCode: "+1-758" },
  { code: "VC", name: "Saint Vincent and the Grenadines", flag: "🇻🇨", dialCode: "+1-784" },
  { code: "WS", name: "Samoa", flag: "🇼🇸", dialCode: "+685" },
  { code: "SM", name: "San Marino", flag: "🇸🇲", dialCode: "+378" },
  { code: "ST", name: "Sao Tome and Principe", flag: "🇸🇹", dialCode: "+239" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦", dialCode: "+966" },
  { code: "SN", name: "Senegal", flag: "🇸🇳", dialCode: "+221" },
  { code: "RS", name: "Serbia", flag: "🇷🇸", dialCode: "+381" },
  { code: "SC", name: "Seychelles", flag: "🇸🇨", dialCode: "+248" },
  { code: "SL", name: "Sierra Leone", flag: "🇸🇱", dialCode: "+232" },
  { code: "SG", name: "Singapore", flag: "🇸🇬", dialCode: "+65" },
  { code: "SK", name: "Slovakia", flag: "🇸🇰", dialCode: "+421" },
  { code: "SI", name: "Slovenia", flag: "🇸🇮", dialCode: "+386" },
  { code: "SB", name: "Solomon Islands", flag: "🇸🇧", dialCode: "+677" },
  { code: "SO", name: "Somalia", flag: "🇸🇴", dialCode: "+252" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦", dialCode: "+27" },
  { code: "SS", name: "South Sudan", flag: "🇸🇸", dialCode: "+211" },
  { code: "ES", name: "Spain", flag: "🇪🇸", dialCode: "+34" },
  { code: "LK", name: "Sri Lanka", flag: "🇱🇰", dialCode: "+94" },
  { code: "SD", name: "Sudan", flag: "🇸🇩", dialCode: "+249" },
  { code: "SR", name: "Suriname", flag: "🇸🇷", dialCode: "+597" },
  { code: "SE", name: "Sweden", flag: "🇸🇪", dialCode: "+46" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭", dialCode: "+41" },
  { code: "SY", name: "Syria", flag: "🇸🇾", dialCode: "+963" },
  { code: "TW", name: "Taiwan", flag: "🇹🇼", dialCode: "+886" },
  { code: "TJ", name: "Tajikistan", flag: "🇹🇯", dialCode: "+992" },
  { code: "TZ", name: "Tanzania", flag: "🇹🇿", dialCode: "+255" },
  { code: "TH", name: "Thailand", flag: "🇹🇭", dialCode: "+66" },
  { code: "TL", name: "Timor-Leste", flag: "🇹🇱", dialCode: "+670" },
  { code: "TG", name: "Togo", flag: "🇹🇬", dialCode: "+228" },
  { code: "TO", name: "Tonga", flag: "🇹🇴", dialCode: "+676" },
  { code: "TT", name: "Trinidad and Tobago", flag: "🇹🇹", dialCode: "+1-868" },
  { code: "TN", name: "Tunisia", flag: "🇹🇳", dialCode: "+216" },
  { code: "TR", name: "Turkey", flag: "🇹🇷", dialCode: "+90" },
  { code: "TM", name: "Turkmenistan", flag: "🇹🇲", dialCode: "+993" },
  { code: "TV", name: "Tuvalu", flag: "🇹🇻", dialCode: "+688" },
  { code: "UG", name: "Uganda", flag: "🇺🇬", dialCode: "+256" },
  { code: "UA", name: "Ukraine", flag: "🇺🇦", dialCode: "+380" },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪", dialCode: "+971" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", dialCode: "+44" },
  { code: "US", name: "United States", flag: "🇺🇸", dialCode: "+1" },
  { code: "UY", name: "Uruguay", flag: "🇺🇾", dialCode: "+598" },
  { code: "UZ", name: "Uzbekistan", flag: "🇺🇿", dialCode: "+998" },
  { code: "VU", name: "Vanuatu", flag: "🇻🇺", dialCode: "+678" },
  { code: "VE", name: "Venezuela", flag: "🇻🇪", dialCode: "+58" },
  { code: "VN", name: "Vietnam", flag: "🇻🇳", dialCode: "+84" },
  { code: "YE", name: "Yemen", flag: "🇾🇪", dialCode: "+967" },
  { code: "ZM", name: "Zambia", flag: "🇿🇲", dialCode: "+260" },
  { code: "ZW", name: "Zimbabwe", flag: "🇿🇼", dialCode: "+263" },
]

const nigerianStates = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT","Gombe",
  "Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara",
  "Lagos","Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau",
  "Rivers","Sokoto","Taraba","Yobe","Zamfara",
]

// ── Searchable country combobox ───────────────────────────────────────────────
function CountryCombobox({
  value, onChange, placeholder = "Search country…", label,
}: {
  value: string; onChange: (code: string) => void; placeholder?: string; label?: string
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const selected = countries.find((c) => c.code === value)
  const filtered = query.trim()
    ? countries.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
    : countries

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      {label && <Label className="mb-1.5 block">{label}</Label>}
      <button
        type="button"
        onClick={() => { setOpen((o) => !o); setTimeout(() => inputRef.current?.focus(), 50) }}
        className="w-full flex items-center justify-between gap-2 rounded-lg border border-input bg-input px-3 py-2.5 text-sm text-foreground transition-colors hover:border-primary/60 focus:outline-none focus:ring-1 focus:ring-ring"
      >
        <span className="flex items-center gap-2 truncate">
          {selected ? (
            <><span className="text-lg leading-none">{selected.flag}</span><span>{selected.name}</span></>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-popover shadow-xl overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type to search…"
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
          </div>
          <ul className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-muted-foreground">No results found</li>
            ) : filtered.map((c) => (
              <li key={c.code}>
                <button
                  type="button"
                  onClick={() => { onChange(c.code); setQuery(""); setOpen(false) }}
                  className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent/20 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-lg leading-none">{c.flag}</span>
                    <span>{c.name}</span>
                  </span>
                  {value === c.code && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ── Phone dial code selector ──────────────────────────────────────────────────
function PhoneDialSelector({ value, onChange }: { value: string; onChange: (dialCode: string) => void }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const selected = countries.find((c) => c.dialCode === value) ?? countries.find((c) => c.code === "NG")!
  const filtered = query.trim()
    ? countries.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.dialCode.includes(query))
    : countries

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => { setOpen((o) => !o); setTimeout(() => inputRef.current?.focus(), 50) }}
        className="flex items-center gap-1.5 h-full rounded-lg border border-input bg-input px-3 py-2.5 text-sm text-foreground transition-colors hover:border-primary/60 focus:outline-none focus:ring-1 focus:ring-ring min-w-[110px]"
      >
        <span className="text-lg leading-none">{selected.flag}</span>
        <span className="font-medium tabular-nums">{selected.dialCode}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-72 rounded-lg border border-border bg-popover shadow-xl overflow-hidden left-0">
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Country name or dial code…"
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
          </div>
          <ul className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-muted-foreground">No results</li>
            ) : filtered.map((c) => (
              <li key={`dial-${c.code}`}>
                <button
                  type="button"
                  onClick={() => { onChange(c.dialCode); setQuery(""); setOpen(false) }}
                  className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent/20 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-lg leading-none">{c.flag}</span>
                    <span>{c.name}</span>
                  </span>
                  <span className="text-muted-foreground font-mono text-xs shrink-0">{c.dialCode}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ── Payment method selector ───────────────────────────────────────────────────
type PaymentMethod = "flutterwave" | "crypto"

function PaymentSelector({ value, onChange }: { value: PaymentMethod; onChange: (v: PaymentMethod) => void }) {
  const options: { id: PaymentMethod; label: string; sub: string; icon: React.ReactNode }[] = [
    {
      id: "flutterwave",
      label: "Flutterwave",
      sub: "Card, Bank Transfer, Mobile Money",
      icon: (
        <svg viewBox="0 0 40 40" className="w-7 h-7" fill="none">
          <rect width="40" height="40" rx="8" fill="#F5A623" />
          <path d="M10 20 Q20 8 30 20 Q20 32 10 20Z" fill="white" opacity="0.9" />
          <path d="M13 20 Q20 11 27 20 Q20 29 13 20Z" fill="#F5A623" />
        </svg>
      ),
    },
    {
      id: "crypto",
      label: "Cryptocurrency",
      sub: "USDT, BTC, ETH and more",
      icon: <Bitcoin className="w-7 h-7 text-orange-400" />,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-3">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
            value === opt.id
              ? "border-primary bg-primary/10"
              : "border-border hover:border-primary/40"
          }`}
        >
          <div className="shrink-0">{opt.icon}</div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-foreground">{opt.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{opt.sub}</p>
          </div>
          <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
            value === opt.id ? "border-primary bg-primary" : "border-muted-foreground"
          }`}>
            {value === opt.id && <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />}
          </div>
        </button>
      ))}
    </div>
  )
}

// ── Trust badge row ───────────────────────────────────────────────────────────
function TrustBadges() {
  const badges = [
    { icon: <Shield className="h-4 w-4 text-primary" />, label: "SSL Secured" },
    { icon: <CheckCircle className="h-4 w-4 text-primary" />, label: "Verified Payments" },
    { icon: <Lock className="h-4 w-4 text-primary" />, label: "256-bit Encryption" },
    { icon: <AlertCircle className="h-4 w-4 text-primary" />, label: "Refund Policy" },
  ]
  return (
    <div className="rounded-xl border border-border bg-muted/20 p-4">
      <div className="grid grid-cols-2 gap-3">
        {badges.map((b) => (
          <div key={b.label} className="flex items-center gap-2">
            {b.icon}
            <span className="text-xs text-muted-foreground font-medium">{b.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-border flex items-center justify-center gap-4">
        {/* Flutterwave wordmark */}
        <span className="text-[10px] font-bold tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
          FLUTTERWAVE
        </span>
        {/* Crypto logos */}
        <span className="text-[10px] font-bold tracking-wider text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded">
          BTC
        </span>
        <span className="text-[10px] font-bold tracking-wider text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded">
          USDT
        </span>
        <span className="text-[10px] font-bold tracking-wider text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded">
          ETH
        </span>
      </div>
    </div>
  )
}

// ── Main CheckoutForm ─────────────────────────────────────────────────────────
export default function CheckoutForm({ totalPrice, currency, productDetails }: CheckoutFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")

  const [email, setEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [isSendingCode, setIsSendingCode] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [verificationError, setVerificationError] = useState("")

  const [phoneDialCode, setPhoneDialCode] = useState("+234")
  const [phoneNumber, setPhoneNumber] = useState("")

  const [selectedCountry, setSelectedCountry] = useState("NG")
  const [selectedState, setSelectedState] = useState("")
  const [city, setCity] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [streetAddress, setStreetAddress] = useState("")

  const [discountCode, setDiscountCode] = useState("")
  const [discountApplied, setDiscountApplied] = useState(false)

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("flutterwave")
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const formatPrice = (price: number) =>
    currency.id === "ngn" ? `₦${price.toLocaleString()}` : `$${price.toFixed(2)}`

  const handleCountryChange = (code: string) => {
    setSelectedCountry(code)
    const found = countries.find((c) => c.code === code)
    if (found) setPhoneDialCode(found.dialCode)
    setSelectedState("")
  }

  const handleSendCode = async () => {
    if (!email || !email.includes("@")) {
      setVerificationError("Please enter a valid email address")
      return
    }
    setIsSendingCode(true)
    setVerificationError("")
    setTimeout(() => { setIsSendingCode(false); setCodeSent(true) }, 1500)
  }

  const handleVerifyCode = () => {
    if (verificationCode.length !== 6) {
      setVerificationError("Please enter the 6-digit code")
      return
    }
    setIsEmailVerified(true)
    setVerificationError("")
  }

  const handleApplyDiscount = () => {
    if (discountCode.length > 0) setDiscountApplied(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isEmailVerified) { setVerificationError("Please verify your email first"); return }
    if (!agreedToTerms) return
    setIsSubmitting(true)
    setTimeout(() => { setIsSubmitting(false); setIsComplete(true) }, 1500)
  }

  const canSubmit = isEmailVerified && agreedToTerms && !isSubmitting

  if (isComplete) {
    return (
      <Card className="p-8 bg-card">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <CheckCircle className="h-9 w-9 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Order Confirmed!</h2>
          <p className="text-muted-foreground mb-6">
            Your MT5 credentials will be sent to{" "}
            <span className="text-foreground font-medium">{email}</span> within 24 hours.
          </p>
          <div className="bg-muted/40 border border-border p-4 rounded-xl w-full mb-6 space-y-2 text-sm">
            {[
              ["Challenge", productDetails.name],
              ["Account Size", productDetails.accountSize],
              ["Platform", productDetails.platform],
              ["Challenge Type", productDetails.challengeType],
              ["Payment Method", paymentMethod === "flutterwave" ? "Flutterwave" : "Cryptocurrency"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-muted-foreground">{k}</span>
                <span className="font-medium text-foreground">{v}</span>
              </div>
            ))}
            <div className="flex justify-between pt-2 border-t border-border">
              <span className="font-medium text-foreground">Total Paid</span>
              <span className="font-bold text-primary">{formatPrice(totalPrice)}</span>
            </div>
          </div>
          <Button className="w-full" size="lg" onClick={() => window.location.reload()}>
            Purchase Another Challenge
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 bg-card">
      <h2 className="text-xl font-semibold text-foreground mb-6">Complete Your Order</h2>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* ── 1. Personal Information ───────────────────── */}
        <section>
          <h3 className="text-xs font-semibold text-muted-foreground mb-4 flex items-center gap-2 uppercase tracking-widest">
            <User className="h-3.5 w-3.5 text-primary" />
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" placeholder="John" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            </div>
          </div>
        </section>

        {/* ── 2. Email + Verification ───────────────────── */}
        <section>
          <h3 className="text-xs font-semibold text-muted-foreground mb-4 flex items-center gap-2 uppercase tracking-widest">
            <Mail className="h-3.5 w-3.5 text-primary" />
            Email Verification
          </h3>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <div className="flex gap-2">
                <Input
                  id="email" type="email" placeholder="you@example.com"
                  value={email} onChange={(e) => { setEmail(e.target.value); setVerificationError("") }}
                  disabled={isEmailVerified} required className="flex-1"
                />
                {!isEmailVerified && (
                  <Button
                    type="button" variant="outline" onClick={handleSendCode}
                    disabled={isSendingCode || !email}
                    className="whitespace-nowrap border-primary/40 text-primary hover:bg-primary/10"
                  >
                    {isSendingCode ? <><Loader2 className="h-4 w-4 mr-1.5 animate-spin" />Sending…</> : codeSent ? "Resend" : "Send Code"}
                  </Button>
                )}
              </div>
            </div>
            {codeSent && !isEmailVerified && (
              <div className="space-y-1.5">
                <Label htmlFor="verificationCode">Verification Code</Label>
                <p className="text-xs text-muted-foreground">We sent a 6-digit code to {email}</p>
                <div className="flex gap-2">
                  <Input
                    id="verificationCode" placeholder="• • • • • •"
                    value={verificationCode}
                    onChange={(e) => { setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6)); setVerificationError("") }}
                    maxLength={6} className="flex-1 tracking-[0.6em] text-center text-lg font-mono"
                  />
                  <Button type="button" onClick={handleVerifyCode} disabled={verificationCode.length !== 6}>
                    Verify
                  </Button>
                </div>
              </div>
            )}
            {isEmailVerified && (
              <div className="flex items-center gap-2 text-primary bg-primary/10 border border-primary/20 p-3 rounded-xl text-sm font-medium">
                <CheckCircle className="h-4 w-4 shrink-0" />
                Email verified successfully
              </div>
            )}
            {verificationError && <p className="text-sm text-destructive">{verificationError}</p>}
          </div>
        </section>

        {/* ── 3. Phone Number ───────────────────────────── */}
        <section>
          <h3 className="text-xs font-semibold text-muted-foreground mb-4 flex items-center gap-2 uppercase tracking-widest">
            <Phone className="h-3.5 w-3.5 text-primary" />
            Phone Number
          </h3>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="flex gap-2 items-stretch">
              <PhoneDialSelector value={phoneDialCode} onChange={setPhoneDialCode} />
              <Input
                id="phone" type="tel" placeholder="8012345678"
                value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                className="flex-1" required
              />
            </div>
          </div>
        </section>

        {/* ── 4. Address ────────────────────────────────── */}
        <section>
          <h3 className="text-xs font-semibold text-muted-foreground mb-4 flex items-center gap-2 uppercase tracking-widest">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            Address Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <CountryCombobox value={selectedCountry} onChange={handleCountryChange} placeholder="Select your country" label="Country" />
            </div>
            <div className="space-y-1.5">
              <Label>State / Province</Label>
              {selectedCountry === "NG" ? (
                <div className="relative">
                  <select
                    value={selectedState} onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full rounded-lg border border-input bg-input px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring appearance-none"
                  >
                    <option value="">Select state</option>
                    {nigerianStates.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              ) : (
                <Input placeholder="State / Province" value={selectedState} onChange={(e) => setSelectedState(e.target.value)} />
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="Lagos" value={city} onChange={(e) => setCity(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="postalCode">Postal / ZIP Code</Label>
              <Input id="postalCode" placeholder="100001" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="address">Street Address</Label>
              <Input id="address" placeholder="14 Broad Street" value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} required />
            </div>
          </div>
        </section>

        {/* ── 5. Discount Code ──────────────────────────── */}
        <section>
          <h3 className="text-xs font-semibold text-muted-foreground mb-4 uppercase tracking-widest">Discount Code</h3>
          <div className="flex gap-2">
            <Input
              placeholder="Enter promo code (optional)"
              value={discountCode} onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
              className="flex-1 tracking-widest font-mono" disabled={discountApplied}
            />
            <Button
              type="button" variant="outline"
              className={`border-primary/40 hover:bg-primary/10 ${discountApplied ? "text-primary" : "text-primary"}`}
              onClick={handleApplyDiscount} disabled={!discountCode || discountApplied}
            >
              {discountApplied ? <><Check className="h-4 w-4 mr-1" /> Applied</> : "Apply"}
            </Button>
          </div>
        </section>

        {/* ── 6. Payment Method ─────────────────────────── */}
        <section>
          <h3 className="text-xs font-semibold text-muted-foreground mb-4 flex items-center gap-2 uppercase tracking-widest">
            <Lock className="h-3.5 w-3.5 text-primary" />
            Payment Method
          </h3>
          <PaymentSelector value={paymentMethod} onChange={setPaymentMethod} />
        </section>

        {/* ── 7. Trust badges ───────────────────────────── */}
        <TrustBadges />

        {/* ── 8. Terms & Conditions ─────────────────────── */}
        <section>
          <label className="flex items-start gap-3 cursor-pointer group">
            <div
              onClick={() => setAgreedToTerms((v) => !v)}
              className={`mt-0.5 w-5 h-5 rounded border-2 shrink-0 flex items-center justify-center transition-all cursor-pointer ${
                agreedToTerms
                  ? "border-primary bg-primary"
                  : "border-muted-foreground group-hover:border-primary/60"
              }`}
            >
              {agreedToTerms && <Check className="h-3 w-3 text-primary-foreground" />}
            </div>
            <span className="text-sm text-muted-foreground leading-relaxed">
              I have read and agree to the{" "}
              <a href="#" className="text-primary underline underline-offset-2 hover:opacity-80">Terms & Conditions</a>
              {" "}and{" "}
              <a href="#" className="text-primary underline underline-offset-2 hover:opacity-80">Challenge Rules</a>
              {" "}of Noble Funded. I understand that the challenge fee is non-refundable once MT5 credentials are issued.
            </span>
          </label>
        </section>

        {/* ── 9. Submit ─────────────────────────────────── */}
        <div className="space-y-3">
          {/* Price line */}
          <div className="flex items-center justify-between text-sm border-t border-border pt-4">
            <span className="text-muted-foreground">Challenge Fee</span>
            <span className="text-xl font-bold text-foreground">{formatPrice(totalPrice)}</span>
          </div>

          <Button
            type="submit" className="w-full text-base font-semibold h-12" size="lg"
            disabled={!canSubmit}
          >
            {isSubmitting ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Processing…</>
            ) : (
              <span className="flex items-center gap-2">
                Pay {formatPrice(totalPrice)} via {paymentMethod === "flutterwave" ? "Flutterwave" : "Crypto"}
                <ExternalLink className="h-4 w-4 opacity-70" />
              </span>
            )}
          </Button>

          {!isEmailVerified && (
            <p className="text-center text-xs text-amber-400 flex items-center justify-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5" />
              Please verify your email to continue
            </p>
          )}
          {isEmailVerified && !agreedToTerms && (
            <p className="text-center text-xs text-amber-400 flex items-center justify-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5" />
              Please agree to the Terms & Conditions to continue
            </p>
          )}

          <div className="flex items-center justify-center text-xs text-muted-foreground gap-1.5 pt-1">
            <Lock className="h-3.5 w-3.5" />
            256-bit SSL encrypted &amp; secure checkout
          </div>
        </div>
      </form>
    </Card>
  )
}
