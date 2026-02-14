export interface StoreFormValue {
  code: string;
  name: string;
  postalCode: string;
  prefecture: string;
  city: string;
  addressLine: string;
  isActive: boolean;
}

export interface Store {
  id: number;
  code: string;
  name: string;
  postalCode: string;
  prefecture: string;
  city: string;
  addressLine: string;
  isActive: boolean;
}

export interface StoreSummary {
  id: number;
  name: string;
}
