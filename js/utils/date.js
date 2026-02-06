(() => {
  const parseDate = (value) => (value ? new Date(value) : null);

  const formatDate = (value) => {
    const date = parseDate(value);
    if (!date || Number.isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("ko-KR");
  };

  const formatDateTime = (value) => {
    const date = parseDate(value);
    if (!date || Number.isNaN(date.getTime())) return "-";
    return `${date.toLocaleDateString("ko-KR")} ${date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit"
    })}`;
  };

  const isRecent = (value, days = 7) => {
    const date = parseDate(value);
    if (!date) return false;
    const diff = Date.now() - date.getTime();
    return diff <= days * 24 * 60 * 60 * 1000;
  };

  window.CRM.utils.date = { parseDate, formatDate, formatDateTime, isRecent };
})();
