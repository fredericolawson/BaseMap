
export interface CredentialsProps {
  pat: string
  baseId: string
  geminiApiKey: string
  setPat: (pat: string) => void
  setBaseId: (baseId: string) => void
  setGeminiApiKey: (geminiApiKey: string) => void
  purgeStorage: () => void
}