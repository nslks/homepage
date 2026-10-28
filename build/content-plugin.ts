import { basename } from 'node:path'
import type { Plugin } from 'vite'
import { parse } from 'yaml'
import { prettifyError } from 'zod'
import { contentSchemas } from '../src/content/schema'

// Parses content/*.yaml and validates it against its schema, so invalid content fails the build
export function contentPlugin(): Plugin {
  return {
    name: 'homepage-content',
    transform(code, id) {
      if (!id.endsWith('.yaml')) return null

      const name = basename(id, '.yaml')
      if (!(name in contentSchemas)) this.error(`No content schema for ${name}.yaml`)

      const result = contentSchemas[name as keyof typeof contentSchemas].safeParse(parse(code))
      if (!result.success) {
        this.error(`Invalid content in content/${name}.yaml:\n${prettifyError(result.error)}`)
      }

      return { code: `export default ${JSON.stringify(result.data)}`, map: null }
    },
  }
}
