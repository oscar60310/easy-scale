import { Scale, ScaleConfig, Result } from './scale';

export class YunmaiISM2 extends Scale {
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
      this.handleCharacteristicValueChanged
    );
  }
  protected async parseData(data: DataView): Promise<Result> {
    const weight = (data.getUint8(13) * 16 * 16 + data.getUint8(14)) / 100;
    return {
      weight
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private handleCharacteristicValueChanged(event: any) {
    const value: DataView = event.target.value;
    if (value.getUint8(3) === 2) {
      this.dataReceived(value);
    }
  }
}
