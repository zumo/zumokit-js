/**
 * Account's fiat related properties.
 * <p>
 * See {@link Account}.
 */
export interface AccountFiatProperties {
  /** Fiat account number or null. */
  accountNumber: string | null;

  /** Fiat account sort code or null. */
  sortCode: string | null;

  /** Fiat account BIC or null. */
  bic: string | null;

  /** Fiat account IBAN or null. */
  iban: string | null;

  /** Customer name or null. */
  customerName: string | null;
}
