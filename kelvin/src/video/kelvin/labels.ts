/** Every string Kelvin draws. English defaults; pass `labels` to VideoSkin to translate. */
export type KelvinLabels = {
  brand: string;
  series: string;
  loupe: string;
  loupeHint: string;
  readingUnavailable: string;
  readingPending: string;
  temperature: string;
  offCurve: string;
  cctShort: string;
  tools: string;
  toolPoint: string;
  toolCompare: string;
  toolArea: string;
  toolRuler: string;
  exposure: string;
  keyLegend: string;
  settings: string;
  meterNote: string;
  luminance: string;
  hue: string;
  palette: string;
  notes: string;
  addNote: string;
  notePlaceholder: string;
  saveNote: string;
  deleteNote: string;
  exportCsv: string;
  closeSheet: string;
  chapter: string;
  timecode: string;
  approx: string;
  noNotes: string;
  plate: string;
  sheetTitle: string;
};

export const DEFAULT_LABELS: KelvinLabels = {
  brand: 'Kelvin',
  series: 'Instrument Series No. 1',
  loupe: 'Loupe',
  loupeHint: 'Press X to aim with the keyboard, Enter to add a note',
  readingUnavailable: 'Reading unavailable in this browser',
  readingPending: 'Waiting for a frame',
  temperature: 'Apparent CCT',
  offCurve: 'off the light curve',
  cctShort: 'CCT',
  tools: 'Measuring tool',
  toolPoint: 'Point',
  toolCompare: 'A–B',
  toolArea: 'Area',
  toolRuler: 'Ruler',
  exposure: 'Exposure',
  keyLegend: '1–4 tools · E exposure · X aim · ↵ set · P pin · Esc back',
  settings: 'Settings',
  meterNote: 'Readings come from the picture, not a light meter: no lux without exposure data and a calibrated reference.',
  luminance: 'Luminance',
  hue: 'Hue',
  palette: 'Palette',
  notes: 'Notes',
  addNote: 'Add note',
  notePlaceholder: 'What do you see here?',
  saveNote: 'Save note',
  deleteNote: 'Delete note',
  exportCsv: 'Export CSV',
  closeSheet: 'Close sheet',
  chapter: 'Chapter',
  timecode: 'Timecode',
  approx: 'approx.',
  noNotes: 'No notes in this chapter yet.',
  plate: 'Plate',
  sheetTitle: 'Specimen sheet',
};
