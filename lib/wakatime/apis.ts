

export interface GetTodaysWakatimeDurationsResponse {
  data: Daum[];
  end: string;
  start: string;
  timezone: string;
}

export interface Daum {
  color: string;
  duration: number;
  project: string;
  time: number;
}


type GetTodaysWakatimeDurationsProps ={
    date: string;
    api_key: string;
}

export async function getTodaysWakatimeDurations({api_key,date}:GetTodaysWakatimeDurationsProps) {
  const durationDate = date || new Date().toISOString().split("T")[0];
  const response = await fetch(
    `https://wakatime.com/api/v1/users/current/durations?date=${durationDate}&api_key=${api_key}`
  );
  if (!response.ok) {
    return {
      data: null,
      error: response.statusText
    };
  }
  const data = await response.json();
  return {
    data:data as GetTodaysWakatimeDurationsResponse,
    error: null,
  }
}



