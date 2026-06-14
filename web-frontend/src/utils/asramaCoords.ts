export const GEDUNG_COORDINATES: Record<string, [number, number]> = {
  "Gedung 1": [-6.9710403, 107.6283141],
  "Gedung 2": [-6.9707509, 107.6283404],
  "Gedung 3": [-6.9704344, 107.6283533],
  "Gedung 4": [-6.9709904, 107.6277174],
  "Gedung 5": [-6.9706729, 107.627767],
  "Gedung 6": [-6.970935, 107.6271111],
  "Gedung 7": [-6.9706223, 107.6271815],
  "Gedung 8": [-6.9702831, 107.6272323],
  "Gedung 9": [-6.9700347, 107.6277742],
  "Gedung 10": [-6.9697409, 107.6278167],
  "Gedung 11": [-6.9700978, 107.6283584],
  "Gedung 12": [-6.9697555, 107.6283976],
  "Gedung A": [-6.9740468, 107.6285963],
  "Gedung B": [-6.9736757, 107.6286558],
  "Gedung C": [-6.9732535, 107.6287044],
  "Gedung D": [-6.9728527, 107.6286204],
  "Gedung E": [-6.9725544, 107.6286242],
  "Gedung F": [-6.9720839, 107.6286579],
};

export const DEFAULT_CUSTOMER_COORDS: [number, number] = [-6.9698, 107.6295];

export function parseGedungFromAddress(address: string | undefined | null): [number, number] {
  if (!address) return DEFAULT_CUSTOMER_COORDS;
  const match = address.match(/Gedung\s*(12|11|10|[1-9]|[A-F])/i);
  if (match) {
    const key = `Gedung ${match[1].toUpperCase()}`;
    if (GEDUNG_COORDINATES[key]) {
      return GEDUNG_COORDINATES[key];
    }
  }
  return DEFAULT_CUSTOMER_COORDS;
}
