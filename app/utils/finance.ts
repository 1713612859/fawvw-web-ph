// Standard amortizing loan payment. Rates are annual percentages (e.g. 8 for 8% p.a.).
export function monthlyPayment(principal: number, annualRatePct: number, months: number) {
  if (principal <= 0 || months <= 0) return 0
  const r = annualRatePct / 100 / 12
  if (r === 0) return principal / months
  return (principal * r) / (1 - (1 + r) ** -months)
}

// Starting values of the financing calculator.
export const financeDefaults = { downPct: 20, months: 60, rate: 8 }
