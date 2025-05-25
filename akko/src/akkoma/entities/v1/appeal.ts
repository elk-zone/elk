/**
 * Appeal against a moderation action.
 */
export interface Appeal {
  /** Text of the appeal from the moderated account to the moderators. */
  text: string;
  /** State of the appeal. */
  state: AppealState;
}

export type AppealState = "approved" | "rejected" | "pending";
