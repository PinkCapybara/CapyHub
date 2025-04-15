import { atom, selector } from "recoil";
import {getElements} from "../services/api/endpoints";

export const elementsAtom = atom({
  key: 'elementsAtom',
  default: selector({
          key: "elementSelector",
          get: async ({get}) => {
            get(elementRefreshAtom);
            const res = await getElements();
            return res.data.elements
          }
      })
});

export const elementRefreshAtom = atom({
    key: 'elementRefreshAtom',
    default: 0,
});

export const switchesAtom = selector({
  key: 'switchesSelector',
  get: ({ get }) => {
    const elements = get(elementsAtom);
    return elements.filter((el) => el.type === 'switch');
  },
});

export const sensorsAtom = selector({
  key: 'sensorsSelector',
  get: ({ get }) => {
    const elements = get(elementsAtom);
    return elements.filter((el) => el.type === 'sensor');
  },
});
