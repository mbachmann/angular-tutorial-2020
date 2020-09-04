

export class UserLocation {

  constructor(init?: Partial<UserLocation>) {
    Object.assign(this, init);
  }

  countryCode: string;
  iso3CountryCode: string;
  countryName: string;
  currency: string;
  countryCallingCode: string;
  countryLanguages: string[];
  browserLanguage: string;

}
