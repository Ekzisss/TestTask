import md5 from 'md5';
import axios from 'axios';

export default async function (action: string, params: unknown) {
  try {
    const res = await axios.post(
      'https://api.valantis.store:41000/',
      { action: action, params: params },
      {
        headers: {
          'X-Auth': md5(`${import.meta.env.VITE_API_KEY || 'Valantis'}_${getDate()}`),
        },
      }
    );
    return res.data.result;
  } catch (err) {
    console.log(err);
  }
}

function getDate() {
  const date = new Date();
  let month = (date.getUTCMonth() + 1).toString();
  let days = date.getUTCDate().toString();
  month = month.length === 2 ? month : '0' + month;
  days = days.length === 2 ? days : '0' + days;
  return `${date.getUTCFullYear()}${month}${days}`;
}
