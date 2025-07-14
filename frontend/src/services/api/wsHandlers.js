import { elementsAtom } from "../../store/elementAtoms";
import { useSetRecoilState } from "recoil";
import { devicesAtom } from "../../store/gdAtoms";

export function useHandleSensorUpdate() {
  const setElements = useSetRecoilState(elementsAtom);

  return ({ elementId, data }) => {
    setElements((prev) =>
      prev.map((el) =>
        el._id === elementId ? { ...el, value: Number(data) } : el,
      ),
    );
  };
}

export function useHandleResponseUpdate() {
  const setElements = useSetRecoilState(elementsAtom);
  return ({ elementId, data }) => {
    setElements((prev) =>
      prev.map((el) =>
        el._id === elementId ? { ...el, value: Number(data) } : el,
      ),
    );
  };
}

export function useHandleStatusUpdate() {
  const setDeviceStatus = useSetRecoilState(devicesAtom);
  return ({ deviceId, data }) => {
    setDeviceStatus((prev) =>
      prev.map((item) =>
        item._id === deviceId
          ? { ...item, isOnline: data.trim().toLowerCase() === "online" }
          : item,
      ),
    );
  };
}

export function useHandleSigstrUpdate() {
  const setDeviceStatus = useSetRecoilState(devicesAtom);
  return ({ deviceId, data }) => {
    const strength = parseInt(data, 10) || 0;
    setDeviceStatus((prev) =>
      prev.map((item) =>
        item._id === deviceId ? { ...item, strength } : item,
      ),
    );
  };
}
