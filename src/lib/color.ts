export const hueForSpeed = (mph: number) => {
  if (mph >= 30) {
    return 0;
  }
  return 270 - mph * 10;
};

export const hueForTemp = (temp: number) => {
  return 360 - temp * 3;
};
