import { Scale, Result, Status } from './scale';
import { AppConfig } from '@libs/config';
/**
 * YunmaiISM2 parser
 * Reference from Open Scale
 * https://github.com/oliexdev/openScale/blob/master/android_app/app/src/main/java/com/health/openscale/core/bluetooth/BluetoothYunmaiSE_Mini.java
 */
export class YunmaiISM2 extends Scale {
  public static scaleName = 'Yun Mai ISM 2';
  public async config(c: AppConfig): Promise<void> {
    const data = [
      0x0d,
      0x12,
      0x10,
      0x01,
      0x00,
      0x00,
      0xf1,
      0x22,
      c.height,
      c.gender === 'male' ? 0x01 : 0x02,
      c.age,
      0x55,
      0x5a,
      0x00,
      0x00,
      0x01, // kg or lb
      0x03
    ];
    // checksum
    let checksum = 0x00;
    for (let i = 1; i < data.length; i++) {
      checksum = checksum ^ data[i];
    }
    data.push(checksum);
    const buf = new ArrayBuffer(18);
    const view = new DataView(buf);
    data.forEach(function(b, i) {
      view.setUint8(i, b);
    });
    if (!this.server) throw 'Server not found';
    const service = await this.server.getPrimaryService(
      '0000ffe5-0000-1000-8000-00805f9b34fb'
    );
    const characteristic = await service.getCharacteristic(0xffe9);
    await characteristic.writeValue(buf);
  }
  protected async getDevice() {
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ name: 'YUNMAI-ISM2-W' }],
      optionalServices: [
        '0000ffe0-0000-1000-8000-00805f9b34fb',
        '0000ffe5-0000-1000-8000-00805f9b34fb'
      ]
    });
    return device;
  }
  protected async startReceiveData() {
    if (!this.server) throw 'Server not found';
    const service = await this.server.getPrimaryService(
      '0000ffe0-0000-1000-8000-00805f9b34fb'
    );
    const characteristic = await service.getCharacteristic(0xffe4);
    await characteristic.startNotifications();
    characteristic.addEventListener(
      'characteristicvaluechanged',
      this.handleCharacteristicValueChanged.bind(this)
    );
  }
  protected async parseData(data: DataView): Promise<Result> {
    // for (let i = 0; i < data.byteLength; i++) {
    //   console.log(i, data.getUint8(i));
    // }
    const weight = (data.getUint8(13) * 16 * 16 + data.getUint8(14)) / 100;
    const bodyFat = (data.getUint8(17) * 16 * 16 + data.getUint8(18)) / 100;

    return {
      weight,
      bodyFat
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private handleCharacteristicValueChanged(event: any) {
    const value: DataView = event.target.value;
    this.status.next(Status.RECEIVING);
    if (value.getUint8(3) === 2) {
      this.dataReceived(value);
    }
  }
}
