

type GetTodaysWakatimeDurationsProps ={
    date: string;
    api_key: string;
}
export async function getTodaysWakatimeDurations({api_key,date}:GetTodaysWakatimeDurationsProps) {
  const durationDate = date || new Date().toISOString().split("T")[0];
  const response = await fetch(
    `https://wakatime.com/api/v1/users/current/durations?date=${durationDate}&api_key=${api_key}`
  );
  const data = await response.json();
  return data;
}


