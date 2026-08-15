const knownLocationTypes = ['remote', 'on_site', 'at_customer'] as const

export const locationTypeOptions = [
  { value: '', labelKey: 'locationTypes.placeholder' },
  { value: 'remote', labelKey: 'locationTypes.remote' },
  { value: 'on_site', labelKey: 'locationTypes.on_site' },
  { value: 'at_customer', labelKey: 'locationTypes.at_customer' },
] as const

/**
 * Uebersetzt den internen Bezeichner des Leistungsortes in einen
 * anzeigbaren Text. Unbekannte Werte werden unveraendert
 * zurueckgegeben, damit nichts verschwindet, was das Backend
 * spaeter ergaenzt.
 */
export function getLocationTypeLabel(
  value: string | null | undefined,
  t: (key: string) => string,
): string | null {
  if (!value) {
    return null
  }

  return (knownLocationTypes as readonly string[]).includes(value)
    ? t(`locationTypes.${value}`)
    : value
}
