import { CardJSON, CardType, CardStatus } from '../interfaces';

/** Basic card details. */
export class Card {
  /** @internal */
  json: CardJSON;

  /** Unique card identifier. */
  id: string;

  /** Associated account's identifier. */
  accountId: string;

  /** Card type. */
  cardType: CardType;

  /** Account currency code. */
  cardStatus: CardStatus;

  /** Current card limit. */
  limit: number;

  /** Card masked pan, e.g **** **** **** 5454. */
  maskedPan: string;

  /** Card year and month of expiry, e.g. 2024-08. */
  expiry: string;

  /** Boolean indicating if card is SCA compliant. */
  sca: boolean;

  /** @internal */
  constructor(json: CardJSON) {
    this.json = json;
    this.id = json.id;
    this.accountId = json.accountId;
    this.cardType = json.cardType as CardType;
    this.cardStatus = json.cardStatus as CardStatus;
    this.limit = json.limit;
    this.maskedPan = json.maskedPan;
    this.expiry = json.expiry;
    this.sca = json.sca;
  }
}
