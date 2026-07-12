/**
 * Client-safe customer shape. NEVER contains the password hash/salt — those
 * live only in the server store. Shared by the auth API, the account UI and the
 * checkout prefill.
 */
export interface PublicCustomer {
  id: string;
  email: string;
  name: string;
  phone: string;
  /** Whether the customer opted in to marketing emails (retargeting list). */
  marketingOptIn: boolean;
  /** True once they've set a password; false for capture-only guest leads. */
  registered: boolean;
}
