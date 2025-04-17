import { atom, selector } from "recoil";
import { getGroups, getDevices } from "../services/api/endpoints";

export const groupsAtom = atom({
    key: "groupAtom",
    default: selector({
        key: "groupsSelector",
        get: async ({get}) => {
            get(groupsRefreshAtom);
            const res = await getGroups();
            return res.data.groups
        }
    })
})

export const groupsRefreshAtom = atom({
    key: 'groupsRefreshAtom',
    default: 0,
});

export const devicesAtom = atom({
    key: "devicesAtom",
    default: selector({
        key: "devicesSelector",
        get: async ({get}) => {
            get(devicesRefreshAtom);
            const res = await getDevices();
            return res.data.devices
        }
    })
})

export const devicesRefreshAtom = atom({
    key: 'devicesRefreshAtom',
    default: 0,
});

export const deviceStatusAtom = atom({
    key: 'deviceStatus',
    default: selector({
      key: 'deviceStatus/default',
      get: ({get}) => {
        const devices = get(devicesAtom);
        return devices.map(device => ({
          deviceId: device._id,
          name: device.name,
          isOnline: false,
          strength: 0
        }));
      }
    })
  });