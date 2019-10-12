import { Scale } from './scales/scale';
import { allScale } from './scales';
import { YunmaiISM2 } from './scales/yunmai-ism2';

export interface AppConfig {
  scaleType: string;
  height: number;
  gender: string;
  age: number;
  setup: boolean;
  apiEndPoint: string;
}

export const loadConfig = () => {
  const data = localStorage.getItem('config');
  let config: AppConfig = {
    scaleType: '',
    height: 60,
    gender: 'male',
    age: 25,
    apiEndPoint: '',
    setup: false
  };
  if (data) {
    config = JSON.parse(data);
  }
  return config;
};
export const writeConfig = (data: AppConfig) => {
  localStorage.setItem('config', JSON.stringify(data));
};
export const setScaleType = (n: string) => {
  writeConfig({ ...loadConfig(), scaleType: n });
};
export const setAPIEndpoint = (n: string) => {
  writeConfig({ ...loadConfig(), apiEndPoint: n });
};
export const getAPIEndpoint = () => {
  return loadConfig().apiEndPoint || '';
};
export const setBodyData = (gender: string, height: number, age: number) => {
  writeConfig({ ...loadConfig(), gender, height, age });
};
export const getScale = (): Scale => {
  const type = loadConfig().scaleType;
  switch (type) {
    case 'Yun Mai ISM 2':
      return new YunmaiISM2();
  }
  throw `Can't find type ${type}`;
};
export const isSetup = () => {
  return loadConfig().setup || false;
};
export const setSetup = (setup: boolean) => {
  writeConfig({ ...loadConfig(), setup });
};
