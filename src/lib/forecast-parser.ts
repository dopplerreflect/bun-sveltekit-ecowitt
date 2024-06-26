import { MONTHS } from "$lib/constants";
const N_HRS = 1;

export const parseForecastText = (text: string) => {
  return [...text.split("\n\n")].slice(0, N_HRS).map(forecastText => {
    const [header, _info, _capecin, _sid, _sounding, _sid_other, ...rest] =
      forecastText.split("\n").map(t => t.replace(/^[ ]+/, ""));

    let info = parseInfo(_info);
    let [, cape, , cin] = _capecin.split(/[\s]+/);
    let [, latlon] = _sid_other.split(/[\s]+/);

    let soundings = [
      ...rest.map(t => {
        let [type, pressure, height, temp, dewpt, direction, speed] = t
          .split(/[\s]+/)
          .map(v => Number(v));
        return { height, temp: temp / 10, dewpt: dewpt / 10, direction, speed };
      }),
    ];
    return {
      header,
      _info,
      info,
      latlon,
      _capecin,
      cape,
      cin,
      _sid,
      _sounding,
      _sid_other,
      soundings,
      forecastText,
    };
  });
};

function parseInfo(s: string) {
  const [type, hour, day, month, year] = s.split(/[\s]+/);
  return {
    type,
    hour: Number(hour),
    day: Number(day),
    month: Number(MONTHS.get(month)!),
    year: Number(year),
  };
}
