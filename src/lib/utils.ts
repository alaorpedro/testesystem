import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrencyBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value).replace(/\s+/g, " ")
}

export function formatCurrencyInputBRL(value: number): string {
  return formatCurrencyBRL(value).replace(/^R\$\s?/, "")
}

export function parseCurrencyBRL(value: string): number {
  const normalized = value.trim().replace(/[^\d,.-]/g, "")

  if (!normalized) return 0

  const hasCommaDecimal = normalized.includes(",")
  const parsed = hasCommaDecimal
    ? Number(normalized.replace(/\./g, "").replace(",", "."))
    : Number(normalized.replace(/\./g, ""))

  return Number.isFinite(parsed) ? parsed : 0
}

const UNITS = [
  "",
  "um",
  "dois",
  "três",
  "quatro",
  "cinco",
  "seis",
  "sete",
  "oito",
  "nove",
]

const TEENS = [
  "dez",
  "onze",
  "doze",
  "treze",
  "quatorze",
  "quinze",
  "dezesseis",
  "dezessete",
  "dezoito",
  "dezenove",
]

const TENS = [
  "",
  "",
  "vinte",
  "trinta",
  "quarenta",
  "cinquenta",
  "sessenta",
  "setenta",
  "oitenta",
  "noventa",
]

const HUNDREDS = [
  "",
  "cento",
  "duzentos",
  "trezentos",
  "quatrocentos",
  "quinhentos",
  "seiscentos",
  "setecentos",
  "oitocentos",
  "novecentos",
]

function joinWords(parts: string[]): string {
  return parts.filter(Boolean).join(" e ")
}

function numberBelowThousandToWords(value: number): string {
  if (value === 0) return ""
  if (value === 100) return "cem"

  const hundreds = Math.floor(value / 100)
  const remainder = value % 100
  const tens = Math.floor(remainder / 10)
  const units = remainder % 10

  if (remainder < 10) return joinWords([HUNDREDS[hundreds], UNITS[remainder]])
  if (remainder < 20) return joinWords([HUNDREDS[hundreds], TEENS[remainder - 10]])

  return joinWords([HUNDREDS[hundreds], TENS[tens], UNITS[units]])
}

function integerToPortugueseWords(value: number): string {
  if (value === 0) return "zero"

  const millions = Math.floor(value / 1_000_000)
  const thousands = Math.floor((value % 1_000_000) / 1_000)
  const remainder = value % 1_000
  const parts: string[] = []

  if (millions > 0) {
    parts.push(`${integerToPortugueseWords(millions)} ${millions === 1 ? "milhão" : "milhões"}`)
  }

  if (thousands > 0) {
    parts.push(thousands === 1 ? "mil" : `${numberBelowThousandToWords(thousands)} mil`)
  }

  if (remainder > 0) {
    parts.push(numberBelowThousandToWords(remainder))
  }

  return joinWords(parts)
}

export function formatCurrencyBRLInWords(value: number): string {
  const centsValue = Math.round(Math.abs(value) * 100)
  const reais = Math.floor(centsValue / 100)
  const cents = centsValue % 100
  const sign = value < 0 ? "menos " : ""

  const realText = `${integerToPortugueseWords(reais)} ${reais === 1 ? "real" : "reais"}`
  const centsText = cents > 0
    ? `${integerToPortugueseWords(cents)} ${cents === 1 ? "centavo" : "centavos"}`
    : ""

  return `${sign}${joinWords([realText, centsText])}`
}

export function formatCurrencyBRLWithWords(value: number): string {
  return `${formatCurrencyBRL(value)} (${formatCurrencyBRLInWords(value)})`
}
