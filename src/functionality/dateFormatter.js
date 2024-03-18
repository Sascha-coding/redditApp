
async function dateFormatter(date){
  date = new Date(date);
  const isoString = date.toISOString();
  const localeString = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const [datestr, time] = isoString.split("T");
  const [hours, minutes] = time.split(":");
  const formattedTime = `${hours}:${minutes.padStart(2, "0")}`;
  return [localeString, formattedTime];
};

export default dateFormatter;
