import React from 'react';
export const PairDevice = () => {
  let server: any = null;
  const [weight, setWeight] = React.useState(0);
  const [state, setState] = React.useState('Pair');
  function handleCharacteristicValueChanged(event: any) {
    const value = event.target.value;
    console.log('Received ' + value);
    if (value.getUint8(3) === 0x02) {
      server.disconnect();
      setWeight((value.getUint8(13) * 16 * 16 + value.getUint8(14)) / 100);
      setState('Finish');
    } else {
      setState('Checking');
    }
    const a: number[] = [];
    // Convert raw data bytes to hex values just for the sake of showing something.
    // In the "real" world, you'd use data.getUint8, data.getUint16 or even
    // TextDecoder to process raw data bytes.
    for (let i = 0; i < value.byteLength; i++) {
      a.push(value.getUint8(i));
    }
    console.log('> ' + a.join(' '));
    // TODO: Parse Heart Rate Measurement value.
    // See https://github.com/WebBluetoothCG/demos/blob/gh-pages/heart-rate-sensor/heartRateSensor.js
  }
  const requestSearch = async () => {
    try {
      const device = await (navigator as any).bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['0000ffe0-0000-1000-8000-00805f9b34fb']
      });
      console.log(device);
      server = await device.gatt.connect();
      console.log(server);
      const service = await server
        .getPrimaryService('0000ffe0-0000-1000-8000-00805f9b34fb')
        .catch(e => console.log(e.message));
      console.log(service);
      const characteristic = await service.getCharacteristic(0xffe4);
      await characteristic.startNotifications();
      setState('Connected');
      characteristic.addEventListener(
        'characteristicvaluechanged',
        handleCharacteristicValueChanged
      );
    } catch (e) {
      if (server) server.disconnect();
      console.log(e);
    }
  };
  return (
    <div>
      {state}
      <h3>{weight}</h3>
      <button onClick={requestSearch}>Search</button>
    </div>
  );
};
