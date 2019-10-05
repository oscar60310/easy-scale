import Dexie from 'dexie';
import { Result } from './scales/scale';

export interface RecordData extends Result {
  time: Date;
}
class UserMeasureDatabase extends Dexie {
  record: Dexie.Table<RecordData, Date>;
  constructor() {
    super('UserMeasureDatabase');
    this.version(1).stores({
      record: 'time'
    });
    this.record = this.table('record');
  }
}
export const addRecord = (data: Result) => {
  const record: RecordData = { ...data, time: new Date() };
  const db = new UserMeasureDatabase();
  db.record.put(record);
};
export const getRecord = async () => {
  const db = new UserMeasureDatabase();
  return await db.record.orderBy('time').toArray();
};
