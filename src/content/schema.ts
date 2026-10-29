import { z } from 'zod'

// Every user-facing text exists in German and English; English may stay empty until the i18n epic.
// Strict: an unquoted comma in a YAML flow mapping would otherwise silently cut the text
export const localized = z.strictObject({
  de: z.string().min(1),
  en: z.string(),
})

const url = z.url({ protocol: /^https?$/ })

export const siteSchema = z.object({
  name: z.string().min(1),
  title: localized,
  tagline: localized,
  legal: z.object({
    impressum: localized,
    datenschutz: localized,
  }),
})

export const careerSchema = z.object({
  intro: localized,
  education: z.array(
    z.object({
      period: localized,
      title: localized,
      place: z.string().min(1),
    }),
  ),
  skills: z.array(
    z.object({
      group: localized,
      items: z.array(z.string().min(1)).min(1),
    }),
  ),
  languages: z.array(
    z.object({
      name: localized,
      level: localized,
    }),
  ),
})

export const workSchema = z.object({
  entries: z
    .array(
      z.object({
        company: z.string().min(1),
        role: localized,
        period: localized,
        highlights: z.array(localized).min(3).max(5),
        tech: z.array(z.string().min(1)),
      }),
    )
    .min(1),
})

export const MAX_PROJECTS = 6

export const projectsSchema = z.object({
  entries: z
    .array(
      z.object({
        name: z.string().min(1),
        summary: localized,
        tech: z.array(z.string().min(1)),
        url: url.optional(),
        repoUrl: url.optional(),
        doorColor: z
          .string()
          .regex(/^#[0-9a-fA-F]{6}$/)
          .optional(),
      }),
    )
    .max(MAX_PROJECTS),
})

export const contactSchema = z.object({
  links: z
    .array(
      z.object({
        kind: z.enum(['linkedin', 'github', 'email']),
        label: localized,
        url: z.union([url, z.string().regex(/^mailto:\S+@\S+$/)]),
      }),
    )
    .min(1),
})

// Fixed set of UI strings: a missing key fails the build and components get autocompletion
export const uiSchema = z.strictObject({
  loading: localized,
  intro: z.strictObject({ skip: localized }),
  controls: z.strictObject({
    title: localized,
    move: localized,
    interact: localized,
    dismiss: localized,
  }),
  stations: z.strictObject({
    career: localized,
    work: localized,
    projects: localized,
    contact: localized,
  }),
  prompt: z.strictObject({ interact: localized }),
  panel: z.strictObject({
    close: localized,
    education: localized,
    skills: localized,
    languages: localized,
  }),
  project: z.strictObject({
    open: localized,
    repo: localized,
    comingSoon: localized,
  }),
  hud: z.strictObject({
    contact: localized,
    legal: localized,
    themeToDay: localized,
    themeToNight: localized,
    characterToMale: localized,
    characterToFemale: localized,
  }),
  legal: z.strictObject({
    impressum: localized,
    datenschutz: localized,
  }),
  unsupportedNotice: z.strictObject({
    title: localized,
    text: localized,
  }),
})

// Maps content/<name>.yaml to its schema; used by the build-time validation plugin
export const contentSchemas = {
  site: siteSchema,
  career: careerSchema,
  work: workSchema,
  projects: projectsSchema,
  contact: contactSchema,
  ui: uiSchema,
}

export type Localized = z.infer<typeof localized>
export type Site = z.infer<typeof siteSchema>
export type Career = z.infer<typeof careerSchema>
export type Work = z.infer<typeof workSchema>
export type Projects = z.infer<typeof projectsSchema>
export type Contact = z.infer<typeof contactSchema>
export type Ui = z.infer<typeof uiSchema>
