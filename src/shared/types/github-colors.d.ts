declare module 'github-colors' {
  interface LanguageInfo {
    color: string | null
    type: string
    aliases?: string[]
    extensions?: string[]
  }

  function get(language: string): LanguageInfo | undefined

  export { get }
}
