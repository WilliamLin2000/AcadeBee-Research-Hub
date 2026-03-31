/** 學術領域：value 用於 URL / API；label 存入 task_skills 供搜尋與顯示 */
export const academicFields = [
  { value: 'biomechanics', label: '生物力學（Biomechanics）' },
  { value: 'biomedical_engineering', label: '生物醫學工程（Biomedical Engineering）' },
  { value: 'bioinformatics', label: '生物資訊學（Bioinformatics）' },
  { value: 'molecular_biology', label: '分子生物學（Molecular Biology）' },
  { value: 'microbiology', label: '微生物學（Microbiology）' },
  { value: 'neuroscience', label: '神經科學（Neuroscience）' },
  { value: 'pharmacology_toxicology', label: '藥理學與毒理學（Pharmacology & Toxicology）' },
  { value: 'chemistry', label: '化學（Chemistry）' },
  { value: 'chemical_engineering', label: '化學工程（Chemical Engineering）' },
  { value: 'materials_science', label: '材料科學與工程（Materials Science & Engineering）' },
  { value: 'mechanical_engineering', label: '機械工程（Mechanical Engineering）' },
  { value: 'electrical_engineering', label: '電機與電子工程（Electrical & Electronic Engineering）' },
  { value: 'computer_science', label: '資訊工程／計算機科學（Computer Science）' },
  { value: 'data_science_ai', label: '資料科學與人工智慧（Data Science & AI）' },
  { value: 'civil_environmental_engineering', label: '土木與環境工程（Civil & Environmental Engineering）' },
  { value: 'mathematics', label: '數學（Mathematics）' },
  { value: 'statistics', label: '統計學（Statistics）' },
  { value: 'physics', label: '物理學（Physics）' },
  { value: 'earth_environmental_science', label: '地球與環境科學（Earth & Environmental Science）' },
  { value: 'medicine_clinical', label: '醫學與臨床研究（Medicine & Clinical Research）' },
  { value: 'public_health_epidemiology', label: '公共衛生與流行病學（Public Health & Epidemiology）' },
  { value: 'psychology', label: '心理學（Psychology）' },
  { value: 'economics', label: '經濟學（Economics）' },
  { value: 'management', label: '管理學（Management）' },
  { value: 'education', label: '教育學（Education）' },
  { value: 'interdisciplinary', label: '跨領域整合（Interdisciplinary）' },
]

const labelBySlug = Object.fromEntries(academicFields.map((f) => [f.value, f.label]))

export function getAcademicFieldLabelBySlug(slug) {
  if (!slug || typeof slug !== 'string') return null
  return labelBySlug[slug.trim()] || null
}

export function slugFromAcademicFieldLabel(skillName) {
  const f = academicFields.find((a) => a.label === skillName)
  return f ? f.value : null
}

export function isAcademicFieldLabel(skillName) {
  return academicFields.some((a) => a.label === skillName)
}

/** 合併「學術領域標籤」與手動填寫的技能字串，回傳給 API 的 skills 字串 */
export function mergeSkillsWithAcademicFields(freeTextSkills, academicSlugs) {
  const fromText =
    typeof freeTextSkills === 'string'
      ? freeTextSkills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : []
  const labels = academicSlugs
    .map((slug) => labelBySlug[slug])
    .filter(Boolean)
  return [...new Set([...labels, ...fromText])].join(', ')
}

/** 從 skills 陣列拆回：學術領域 slug 列表 + 其餘關鍵字（逗號字串） */
export function splitSkillsIntoAcademicAndFree(skillsArr) {
  const arr = Array.isArray(skillsArr) ? skillsArr : []
  const academicSlugs = []
  const rest = []
  for (const s of arr) {
    const slug = slugFromAcademicFieldLabel(s)
    if (slug) academicSlugs.push(slug)
    else rest.push(s)
  }
  return { academicSlugs, freeSkillsText: rest.join(', ') }
}
