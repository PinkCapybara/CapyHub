import { selector } from "recoil";
import { switchesAtom } from "./elementAtoms";

export const pushSwitchesAtom = selector({
    key: 'pushSwitchesAtom',
    get: ({ get }) => {
      const switches = get(switchesAtom);
      return switches.filter((sw) => sw.subType === 'push');
    },
  });
  
  export const toggleSwitchesAtom = selector({
    key: 'toggleSwitchesAtom',
    get: ({ get }) => {
      const switches = get(switchesAtom);
      return switches.filter((sw) => sw.subType === 'toggle');
    },
  });
  
  export const sliderSwitchesAtom = selector({
    key: 'sliderSwitchesAtom',
    get: ({ get }) => {
      const switches = get(switchesAtom);
      return switches.filter((sw) => sw.subType === 'slider');
    },
  });
  
  export const colorPickerSwitchesAtom = selector({
    key: 'colorPickerSwitchesAtom',
    get: ({ get }) => {
      const switches = get(switchesAtom);
      return switches.filter((sw) => sw.subType === 'color_picker');
    },
  });