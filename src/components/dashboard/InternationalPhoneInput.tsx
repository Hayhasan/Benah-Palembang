import { useState, useEffect, useRef, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ChevronDown, Check } from "lucide-react"

export interface Country {
    code: string
    name: string
    dialCode: string
    flag: string
}

export const COUNTRIES: Country[] = [
    { code: "ID", name: "Indonesia", dialCode: "+62", flag: "🇮🇩" },
    { code: "MY", name: "Malaysia", dialCode: "+60", flag: "🇲🇾" },
    { code: "SG", name: "Singapore", dialCode: "+65", flag: "🇸🇬" },
    { code: "US", name: "United States", dialCode: "+1", flag: "🇺🇸" },
    { code: "GB", name: "United Kingdom", dialCode: "+44", flag: "🇬🇧" },
    { code: "SA", name: "Saudi Arabia", dialCode: "+966", flag: "🇸🇦" },
    { code: "AE", name: "United Arab Emirates", dialCode: "+971", flag: "🇦🇪" },
    { code: "AU", name: "Australia", dialCode: "+61", flag: "🇦🇺" },
    { code: "JP", name: "Japan", dialCode: "+81", flag: "🇯🇵" },
    { code: "KR", name: "South Korea", dialCode: "+82", flag: "🇰🇷" },
    { code: "CN", name: "China", dialCode: "+86", flag: "🇨🇳" },
    { code: "HK", name: "Hong Kong", dialCode: "+852", flag: "🇭🇰" },
    { code: "TW", name: "Taiwan", dialCode: "+886", flag: "🇹🇼" },
    { code: "DE", name: "Germany", dialCode: "+49", flag: "🇩🇪" },
    { code: "FR", name: "France", dialCode: "+33", flag: "🇫🇷" },
    { code: "NL", name: "Netherlands", dialCode: "+31", flag: "🇳🇱" },
    { code: "IT", name: "Italy", dialCode: "+39", flag: "🇮🇹" },
    { code: "ES", name: "Spain", dialCode: "+34", flag: "🇪🇸" },
    { code: "CH", name: "Switzerland", dialCode: "+41", flag: "🇨🇭" },
    { code: "SE", name: "Sweden", dialCode: "+46", flag: "🇸🇪" },
    { code: "NO", name: "Norway", dialCode: "+47", flag: "🇳🇴" },
    { code: "DK", name: "Denmark", dialCode: "+45", flag: "🇩🇰" },
    { code: "FI", name: "Finland", dialCode: "+358", flag: "🇫🇮" },
    { code: "RU", name: "Russia", dialCode: "+7", flag: "🇷🇺" },
    { code: "TR", name: "Turkey", dialCode: "+90", flag: "🇹🇷" },
    { code: "IN", name: "India", dialCode: "+91", flag: "🇮🇳" },
    { code: "PK", name: "Pakistan", dialCode: "+92", flag: "🇵🇰" },
    { code: "BD", name: "Bangladesh", dialCode: "+880", flag: "🇧🇩" },
    { code: "TH", name: "Thailand", dialCode: "+66", flag: "🇹🇭" },
    { code: "VN", name: "Vietnam", dialCode: "+84", flag: "🇻🇳" },
    { code: "PH", name: "Philippines", dialCode: "+63", flag: "🇵🇭" },
    { code: "BN", name: "Brunei", dialCode: "+673", flag: "🇧🇳" },
    { code: "KH", name: "Cambodia", dialCode: "+855", flag: "🇰🇭" },
    { code: "LA", name: "Laos", dialCode: "+856", flag: "🇱🇦" },
    { code: "MM", name: "Myanmar", dialCode: "+95", flag: "🇲🇲" },
    { code: "TL", name: "Timor-Leste", dialCode: "+670", flag: "🇹🇱" },
    { code: "QA", name: "Qatar", dialCode: "+974", flag: "🇶🇦" },
    { code: "KW", name: "Kuwait", dialCode: "+965", flag: "🇰🇼" },
    { code: "OM", name: "Oman", dialCode: "+968", flag: "🇴🇲" },
    { code: "BH", name: "Bahrain", dialCode: "+973", flag: "🇧🇭" },
    { code: "JO", name: "Jordan", dialCode: "+962", flag: "🇯🇴" },
    { code: "LB", name: "Lebanon", dialCode: "+961", flag: "🇱🇧" },
    { code: "EG", name: "Egypt", dialCode: "+20", flag: "🇪🇬" },
    { code: "MA", name: "Morocco", dialCode: "+212", flag: "🇲🇦" },
    { code: "ZA", name: "South Africa", dialCode: "+27", flag: "🇿🇦" },
    { code: "NG", name: "Nigeria", dialCode: "+234", flag: "🇳🇬" },
    { code: "KE", name: "Kenya", dialCode: "+254", flag: "🇰🇪" },
    { code: "CA", name: "Canada", dialCode: "+1", flag: "🇨🇦" },
    { code: "MX", name: "Mexico", dialCode: "+52", flag: "🇲🇽" },
    { code: "BR", name: "Brazil", dialCode: "+55", flag: "🇧🇷" },
    { code: "AR", name: "Argentina", dialCode: "+54", flag: "🇦🇷" },
    { code: "CL", name: "Chile", dialCode: "+56", flag: "🇨🇱" },
    { code: "CO", name: "Colombia", dialCode: "+57", flag: "🇨🇴" },
    { code: "NZ", name: "New Zealand", dialCode: "+64", flag: "🇳🇿" },
]

interface InternationalPhoneInputProps {
    value: string
    onChange: (fullNumber: string) => void
    disabled?: boolean
    darkVariant?: boolean
    placeholder?: string
}

export function InternationalPhoneInput({
    value = "",
    onChange,
    disabled = false,
    darkVariant = false,
    placeholder = "812 3456 7890",
}: InternationalPhoneInputProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]) // default Indonesia (+62)
    const [localNumber, setLocalNumber] = useState("")
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Parse initial or external value
    useEffect(() => {
        if (!value) {
            setLocalNumber("")
            return
        }

        // Clean value
        let clean = value.trim()
        
        // Match country code
        let matched = COUNTRIES.find(c => clean.startsWith(c.dialCode))
        if (!matched && clean.startsWith("+")) {
            matched = COUNTRIES.find(c => clean.startsWith(c.dialCode.replace("+", "")))
        }

        if (matched) {
            setSelectedCountry(matched)
            const rest = clean.replace(matched.dialCode, "").replace(/^\+/, "").trim()
            setLocalNumber(rest)
        } else if (clean.startsWith("0")) {
            setSelectedCountry(COUNTRIES[0]) // ID
            setLocalNumber(clean.substring(1))
        } else if (clean.startsWith("62")) {
            setSelectedCountry(COUNTRIES[0]) // ID
            setLocalNumber(clean.substring(2))
        } else {
            setLocalNumber(clean.replace(/^\+/, ""))
        }
    }, [value])

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const filteredCountries = useMemo(() => {
        if (!searchQuery.trim()) return COUNTRIES
        const q = searchQuery.toLowerCase()
        return COUNTRIES.filter(
            c => c.name.toLowerCase().includes(q) || 
                 c.dialCode.includes(q) || 
                 c.code.toLowerCase().includes(q)
        )
    }, [searchQuery])

    const handleCountrySelect = (country: Country) => {
        setSelectedCountry(country)
        setIsOpen(false)
        setSearchQuery("")
        
        // Notify parent with new country code + local number
        const cleanLocal = localNumber.replace(/^0+/, "")
        const full = cleanLocal ? `${country.dialCode}${cleanLocal}` : country.dialCode
        onChange(full)
    }

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/[^\d]/g, "") // numbers only
        const clean = raw.replace(/^0+/, "") // remove leading 0
        setLocalNumber(clean)

        const full = clean ? `${selectedCountry.dialCode}${clean}` : ""
        onChange(full)
    }

    return (
        <div className="relative flex gap-2 w-full" ref={dropdownRef}>
            {/* Country Selector Trigger */}
            <div className="relative">
                <Button
                    type="button"
                    variant="outline"
                    disabled={disabled}
                    onClick={() => setIsOpen(!isOpen)}
                    className={`h-9 px-2.5 flex items-center gap-1.5 shrink-0 text-xs font-semibold ${
                        darkVariant 
                            ? "bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white" 
                            : "bg-background border-input hover:bg-muted"
                    }`}
                >
                    <span className="text-base leading-none">{selectedCountry.flag}</span>
                    <span>{selectedCountry.dialCode}</span>
                    <ChevronDown className="size-3 opacity-60 ml-0.5" />
                </Button>

                {/* Searchable Dropdown Popover */}
                {isOpen && (
                    <div className="absolute left-0 top-full mt-1 z-50 w-64 rounded-xl border bg-popover text-popover-foreground shadow-xl overflow-hidden animate-in fade-in-0 zoom-in-95">
                        {/* Search input */}
                        <div className="p-2 border-b bg-muted/40 flex items-center gap-2">
                            <Search className="size-3.5 text-muted-foreground shrink-0" />
                            <input
                                autoFocus
                                placeholder="Cari negara / kode..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground"
                            />
                        </div>

                        {/* List */}
                        <div className="max-h-56 overflow-y-auto p-1 space-y-0.5">
                            {filteredCountries.length > 0 ? (
                                filteredCountries.map((c) => {
                                    const isSelected = selectedCountry.code === c.code
                                    return (
                                        <button
                                            key={c.code}
                                            type="button"
                                            onClick={() => handleCountrySelect(c)}
                                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left ${
                                                isSelected 
                                                    ? "bg-palembang-red text-white font-medium" 
                                                    : "hover:bg-muted text-foreground"
                                            }`}
                                        >
                                            <div className="flex items-center gap-2 truncate">
                                                <span className="text-sm">{c.flag}</span>
                                                <span className="truncate">{c.name}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 shrink-0 ml-2">
                                                <span className={isSelected ? "text-white/80" : "text-muted-foreground font-mono text-[11px]"}>
                                                    {c.dialCode}
                                                </span>
                                                {isSelected && <Check className="size-3 text-white" />}
                                            </div>
                                        </button>
                                    )
                                })
                            ) : (
                                <div className="py-4 text-center text-xs text-muted-foreground">
                                    Negara tidak ditemukan
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Local Phone Number Input */}
            <div className="relative flex-1">
                <Input
                    type="tel"
                    disabled={disabled}
                    placeholder={placeholder}
                    value={localNumber}
                    onChange={handleNumberChange}
                    className={`h-9 text-sm font-medium ${
                        darkVariant
                            ? "bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-white/30"
                            : "bg-background border-input"
                    }`}
                />
            </div>
        </div>
    )
}
