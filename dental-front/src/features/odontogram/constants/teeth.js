export const UPPER_TEETH = ['18', '17', '16', '15', '14', '13', '12', '11', '21', '22', '23', '24', '25', '26', '27', '28']
export const LOWER_TEETH = ['48', '47', '46', '45', '44', '43', '42', '41', '31', '32', '33', '34', '35', '36', '37', '38']
export const ALL_TEETH = [...UPPER_TEETH, ...LOWER_TEETH]

export const TOOTH_CONDITIONS = [
  { value: 'HEALTHY', label: 'Saine', color: '#ffffff', border: '#c0c7d2' },
  { value: 'CARIES', label: 'Carie', color: '#ffdad6', border: '#ba1a1a' },
  { value: 'FILLED', label: 'Obturée', color: '#cfe5ff', border: '#005e97' },
  { value: 'CROWN', label: 'Couronne', color: '#fff3c4', border: '#c9a227' },
  { value: 'ROOT_CANAL', label: 'Dévitalisée', color: '#e8d5ff', border: '#6750a4' },
  { value: 'MISSING', label: 'Absente', color: '#e0e3e5', border: '#575b5c' },
  { value: 'IMPLANT', label: 'Implant', color: '#79f7e3', border: '#006b5f' },
  { value: 'TO_EXTRACT', label: 'À extraire', color: '#ffdcc3', border: '#c45d00' },
]

export function toothMeta(condition) {
  return TOOTH_CONDITIONS.find((item) => item.value === condition) || TOOTH_CONDITIONS[0]
}
