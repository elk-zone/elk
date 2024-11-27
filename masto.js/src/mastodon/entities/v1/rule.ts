export interface Rule {
  /** An identifier for the rule. */
  id: string;
  /** The rule to be followed. */
  text: string;
  /** Longer-form description of the rule. */
  hint: string;
}
