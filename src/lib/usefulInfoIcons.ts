import {
  Clock, CameraOff, Armchair, Accessibility, Building, Sun,
  Info, Ticket, Ban, Phone, Car, CreditCard, ShieldCheck,
  Users, Baby, Volume2, VolumeOff, MapPin, Shirt, Utensils,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/** Available icon choices for admin select */
export const USEFUL_INFO_ICON_OPTIONS: { value: string; label: string }[] = [
  { value: "clock", label: "Reloj" },
  { value: "ticket", label: "Boleto" },
  { value: "camera-off", label: "Sin cámara" },
  { value: "armchair", label: "Asiento" },
  { value: "accessibility", label: "Accesible" },
  { value: "building", label: "Interior" },
  { value: "sun", label: "Exterior" },
  { value: "ban", label: "Prohibido" },
  { value: "phone", label: "Teléfono" },
  { value: "car", label: "Estacionamiento" },
  { value: "credit-card", label: "Pago" },
  { value: "shield-check", label: "Seguridad" },
  { value: "users", label: "Grupo" },
  { value: "baby", label: "Niños" },
  { value: "volume-2", label: "Sonido" },
  { value: "volume-off", label: "Sin sonido" },
  { value: "map-pin", label: "Ubicación" },
  { value: "shirt", label: "Vestimenta" },
  { value: "utensils", label: "Comida" },
  { value: "info", label: "Info" },
];

const ICON_MAP: Record<string, LucideIcon> = {
  clock: Clock,
  ticket: Ticket,
  "camera-off": CameraOff,
  armchair: Armchair,
  accessibility: Accessibility,
  building: Building,
  sun: Sun,
  ban: Ban,
  phone: Phone,
  car: Car,
  "credit-card": CreditCard,
  "shield-check": ShieldCheck,
  users: Users,
  baby: Baby,
  "volume-2": Volume2,
  "volume-off": VolumeOff,
  "map-pin": MapPin,
  shirt: Shirt,
  utensils: Utensils,
  info: Info,
};

/** Keyword patterns for auto-detecting icon from text */
const KEYWORD_MAP: [RegExp, string][] = [
  [/temprano|antes|llegar|puntual|hora/i, "clock"],
  [/grab|video|foto|cámara|filmar/i, "camera-off"],
  [/asiento|silla|butaca|numerado/i, "armchair"],
  [/accesib|discapacidad|silla de rueda/i, "accessibility"],
  [/interior|techado|cubierto/i, "building"],
  [/exterior|aire libre|sol/i, "sun"],
  [/boleto|entrada|ticket/i, "ticket"],
  [/prohib|permit|no se puede/i, "ban"],
  [/estaciona|parking|valet/i, "car"],
  [/pago|tarjeta|efectivo|cash/i, "credit-card"],
  [/seguridad|seguro|guardia/i, "shield-check"],
  [/grupo|familia|amigos/i, "users"],
  [/niño|menor|edad|bebé/i, "baby"],
  [/ruido|volumen|sonido/i, "volume-2"],
  [/vestim|ropa|dress|formal/i, "shirt"],
  [/comida|alimento|snack/i, "utensils"],
  [/ubicaci|lugar|dirección/i, "map-pin"],
];

/** Resolve a Lucide icon component from a stored key or by auto-detecting from text */
export function resolveUsefulInfoIcon(iconKey?: string, text?: string): LucideIcon {
  if (iconKey && ICON_MAP[iconKey]) return ICON_MAP[iconKey];

  // Auto-detect from text
  if (text) {
    for (const [pattern, key] of KEYWORD_MAP) {
      if (pattern.test(text)) return ICON_MAP[key];
    }
  }

  return Info; // fallback
}
