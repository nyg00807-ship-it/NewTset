(() => {
  const formatNumber = (value) => {
    const number = Number(value || 0);
    return number.toLocaleString("ko-KR");
  };

  const maskPhone = (value) => {
    if (!value) return "-";
    const match = value.match(/(\d{3})-(\d{2,4})-(\d{4})/);
    if (!match) return value;
    return `${match[1]}-${match[2]}-${match[3]}`;
  };

  window.CRM.utils.format = { formatNumber, maskPhone };
})();
