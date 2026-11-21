// Variant names per model, in fawcar.com order (the source names carry a market prefix such as
// "GCC-"). Kept apart from specs.ts so pages that only need the names don't load the sheets.
export const variantNames: Record<string, string[]> = {
  'joyee-n09': ['240 Plus Premium EREV', '565 Pro Luxury BEV'],
  'joyee-s08': ['210 Premium', '210 Luxury'],
  'joyee-s04': ['445 km Premium', '445 km Luxury', '565 km Luxury'],
  'joyee-n01': ['222 km Premium', '328 km Premium'],
  'bestune-b70': ['1.5T Standard', '1.5T Luxury', '1.5T Premium', '2.0T Luxury'],
  'bestune-t90': ['1.5T Standard', '1.5T Premium', '2.0T Standard', '2.0T Premium', '2.0T Luxury'],
  'bestune-t77': ['1.5T Standard', '1.5T Premium', '1.5T Luxury'],
  'bestune-m9': ['2.0T Premium', '2.0T Luxury'],
  'bestune-xiaoma': ['222 km Standard', '222 km Premium'],
}
