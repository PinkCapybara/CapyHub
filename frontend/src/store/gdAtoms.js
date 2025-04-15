import { atom, selector } from "recoil";
import { getGroups } from "../services/api/endpoints";

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