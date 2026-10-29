import { site } from '../content'

// public/cv.pdf, served next to the page; null when the file is not shipped
export const cvUrl = __HAS_CV__ ? `${import.meta.env.BASE_URL}cv.pdf` : null
export const cvFileName = `Lebenslauf-${site.name.replace(/\s+/g, '-')}.pdf`
