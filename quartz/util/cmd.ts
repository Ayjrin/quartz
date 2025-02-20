// Types for command-line arguments and events
export type FileEvent = "add" | "change" | "delete"

export interface Argv {
  directory: string
  verbose: boolean
  output: string
  content: string
  serve: boolean
  fastRebuild: boolean
  port: number
  wsPort: number
  remoteDevHost?: string
  baseDir: string
  // Add other CLI arguments as needed
  source?: string
  strategy?: "new" | "copy" | "symlink"
  links?: string
}
