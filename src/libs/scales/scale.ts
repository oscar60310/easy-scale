import { BehaviorSubject } from 'rxjs';
import { AppConfig, getAPIEndpoint } from '@libs/config';
import dayjs from 'dayjs';
export enum Sex {
  Male,
  Female
}
export enum WeightUnit {
  KG,
  LB
}

export enum Status {
  IDLE,
  CONNECTING,
  CONNECTED,
  RECEIVING,
  FINISH,
  ERROR
}
export interface Result {
  weight?: number;
  bodyFat?: number;
}
export abstract class Scale {
  public static scaleName: string;
  abstract async config(c: AppConfig): Promise<void>;
  protected abstract async getDevice(): Promise<BluetoothDevice>;
  protected abstract async startReceiveData(): Promise<void>;
  protected abstract async parseData(data: DataView): Promise<Result>;
  protected server: BluetoothRemoteGATTServer | null = null;
  protected device: BluetoothDevice | null = null;
  public result: Result | null = null;
  public status = new BehaviorSubject(Status.IDLE);
  public async connect() {
    this.status.next(Status.CONNECTING);
    this.device = await this.getDevice();
    if (!this.device.gatt) {
      this.handleError(new Error('Device gatt not found'));
      return;
    }
    this.server = await this.device.gatt.connect();
    this.status.next(Status.CONNECTED);
  }
  public async startReceive() {
    try {
      await this.startReceiveData();
    } catch (e) {
      this.handleError(e);
    }
  }
  public disconnect() {
    if (this.server) this.server.disconnect();
  }
  protected async dataReceived(data: DataView) {
    try {
      this.result = await this.parseData(data);

      if (this.server) this.server.disconnect();
      const endPoint = getAPIEndpoint();
      if (endPoint.length > 0) {
        await fetch(endPoint, {
          method: 'POST',
          body: JSON.stringify({
            time: dayjs().format('YYYY/MM/DD HH:mm:ss'),
            weight: this.result.weight,
            bodyfat: this.result.bodyFat
          })
        });
      }
      this.status.next(Status.FINISH);
    } catch (e) {
      this.handleError(e);
    }
  }
  private handleError(e: Error): never {
    if (this.server) {
      this.server.disconnect();
    }
    this.status.next(Status.ERROR);
    throw e;
  }
}
