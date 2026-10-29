declare module '*.yaml' {
  const data: unknown
  export default data
}

// set by vite.config.ts: whether public/cv.pdf exists at build time
declare const __HAS_CV__: boolean
