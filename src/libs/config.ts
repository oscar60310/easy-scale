export interface AppConfig {
  scaleType: string;
}

export const loadConfig = () => {
  const data = localStorage.getItem('config');
  let config: AppConfig = {
    scaleType: ''
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
