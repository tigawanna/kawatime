import React, { useEffect } from "react";
import { View } from "react-native";
import { DatePickerInput, enGB, registerTranslation } from "react-native-paper-dates";
import { useDebounce } from "@uidotdev/usehooks";

registerTranslation("en-GB", enGB);

interface DatePickerProps {
  today: Date | undefined;
  setToday: (d: Date) => void;
}

export function DatePicker({ today, setToday }: DatePickerProps) {
  const [inputDate, setInputDate] = React.useState<Date | undefined>(
    today ? new Date(today) : undefined
  );
  
  const debouncedDate = useDebounce(inputDate, 800);
  useEffect(() => {
    if (debouncedDate) {
      setToday(debouncedDate);
    }
  }, [debouncedDate, setToday]);

  return (
    <View style={{ justifyContent: "center", height: 50, alignItems: "center" }}>
      <DatePickerInput
        locale="en-US"
        label="Select date"
        value={inputDate}
        onChange={(d) => setInputDate(d)}
        inputMode="start"
        style={{ width: 200 }}
        mode="outlined"
      />
      {}
    </View>
  );
}
