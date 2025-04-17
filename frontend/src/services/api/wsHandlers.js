import { elementsAtom } from '../../store/elementAtoms';
import { useSetRecoilState, useRecoilState } from 'recoil';
import { deviceStatusAtom } from '../../store/gdAtoms';

export function useHandleSensorUpdate() {
  const [elements,setElements ]= useRecoilState(elementsAtom);

  return ({ elementId, data }) => {
    setElements(prev =>
      prev.map(el =>
        el._id === elementId
          ? { ...el, value: Number(data) }
          : el
      )
      
    );
  };
}

export function useHandleResponseUpdate() {
  const setElements = useSetRecoilState(elementsAtom);
  return ({ elementId, data }) => {
    setElements(prev =>
      prev.map(el =>
        el._id === elementId
          ? { ...el, value: data }
          : el
      )
    );
  };
}

export function useHandleStatusUpdate() {
    const setDeviceStatus = useSetRecoilState(deviceStatusAtom);
    return ({ deviceId, data }) => {
      setDeviceStatus(prev =>
        prev.map(item =>
          item.deviceId === deviceId
            ? { ...item, isOnline: data === 'online' }
            : item
        )
      );
    };
  }

export function useHandleSigstrUpdate() {
  const setDeviceStatus = useSetRecoilState(deviceStatusAtom);
  return ({ deviceId, data }) => {
    const strength = parseInt(data, 10) || 0;
    setDeviceStatus(prev =>
      prev.map(item =>
        item.deviceId === deviceId
          ? { ...item, strength }
          : item
      )
    );
  };
}
