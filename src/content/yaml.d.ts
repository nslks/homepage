declare module '*.yaml' {
  const data: unknown
  export default data
}

// set by vite.config.ts: whether public/cv.pdf exists at build time
declare const __HAS_CV__: boolean

// set by vite.config.ts from IMPRESSUM_EMAIL; empty when the variable is missing
declare const __IMPRESSUM_EMAIL__: string
