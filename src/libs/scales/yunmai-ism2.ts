import { Scale, ScaleConfig, Result, Status } from './scale';
/**
 * YunmaiISM2 parser
 * Reference from Open Scale
 * https://github.com/oliexdev/openScale/blob/master/android_app/app/src/main/java/com/health/openscale/core/bluetooth/BluetoothYunmaiSE_Mini.java
 */
export class YunmaiISM2 extends Scale {
  public name = 'Yun Mai ISM 2';
  public config = (c: ScaleConfig): void => {
    // this.connect();
  };
  protected async getDevice() {
    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: ['0000ffe0-0000-1000-8000-00805f9b34fb']
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
    const weight = (data.getUint8(13) * 16 * 16 + data.getUint8(14)) / 100;
    const bodyFat = data.getUint8(17) / 100;

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
