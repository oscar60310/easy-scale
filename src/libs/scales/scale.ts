import { BehaviorSubject } from 'rxjs';
export enum Sex {
  Male,
  Female
}
export enum WeightUnit {
  KG,
  LB
}
export interface ScaleConfig {
  sex: Sex;
  weightUnit: WeightUnit;
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
  abstract readonly name: string;
  abstract config(c: ScaleConfig): void;
  protected abstract async getDevice(): Promise<BluetoothDevice>;
  protected abstract async startReceiveData(): Promise<void>;
  protected abstract async parseData(data: DataView): Promise<Result>;
  protected server: BluetoothRemoteGATTServer | null = null;

  public result: Result | null = null;
  public status = new BehaviorSubject(Status.IDLE);
  public async connect() {
    this.status.next(Status.CONNECTING);
    const device = await this.getDevice();
    if (!device.gatt) {
      this.handleError(new Error('Device gatt not found'));
      return;
    }
    this.server = await device.gatt.connect();
    this.status.next(Status.CONNECTED);
  }
  public async startReceive() {
    try {
      this.status.next(Status.RECEIVING);
      this.startReceiveData();
    } catch (e) {
      this.handleError(e);
    }
  }
  protected async dataReceived(data: DataView) {
    try {
      this.result = await this.parseData(data);
      this.status.next(Status.FINISH);
      if (this.server) this.server.disconnect();
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
