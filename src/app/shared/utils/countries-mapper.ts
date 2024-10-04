import {Country} from "../enum/country";

export const availableCountriesFromList = (enumList: { [key: string]:string }): string[]  => {
  return Object.values(enumList)
    .map((value) => value);
}
