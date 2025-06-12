export function formatMessageTime(timestamp) {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  if (isNaN(date)) return ""; // or return "Invalid date"
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
