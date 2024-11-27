/**
 * Represents a custom user role that grants permissions.
 * @see https://docs.joinmastodon.org/entities/Role/
 */
export interface Role {
  /** The ID of the Role in the database. */
  id: number;
  /** The name of the role. */
  name: string;
  /** The hex code assigned to this role. If no hex code is assigned, the string will be empty */
  color: string;
  /** An index for the role’s position. The higher the position, the more priority the role has over other roles. */
  position: number;
  /** A bitmask that represents the sum of all permissions granted to the role. */
  permissions: number;
  /** Whether the role is publicly visible as a badge on user profiles. */
  highlighted: boolean;
  /** The date that the role was created. */
  createdAt: string;
  /** The date that the role was updated. */
  updatedAt: string;
}
