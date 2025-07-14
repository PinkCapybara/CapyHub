import { selector } from "recoil";
import { sensorsAtom } from "./elementAtoms";

export const gaugeSensorsAtom = selector({
  key: "gaugeSensorsAtom",
  get: ({ get }) => {
    const sensors = get(sensorsAtom);
    return sensors.filter((s) => s.subType === "gauge");
  },
});

export const widgetSensorsAtom = selector({
  key: "widgetSensorsAtom",
  get: ({ get }) => {
    const sensors = get(sensorsAtom);
    return sensors.filter((s) => s.subType === "widget");
  },
});

export const notificationSensorsAtom = selector({
  key: "notificationSensorsAtom",
  get: ({ get }) => {
    const sensors = get(sensorsAtom);
    return sensors.filter((s) => s.subType === "notification");
  },
});
