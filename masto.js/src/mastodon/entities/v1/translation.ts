export interface Translation {
  /** The translated text of the status. */
  content: string;
  /** The language of the source text, as auto-detected by the machine translation provider. */
  detectedLanguageSource: string;
  /** The service that provided the machine translation. */
  provider: string;
}
