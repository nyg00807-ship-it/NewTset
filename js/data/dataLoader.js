(() => {
  const loadJson = async (path) => {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`데이터 로드 실패: ${path}`);
    }
    return response.json();
  };

  const loadInitialData = async () => {
    try {
      const [customerData, consultData] = await Promise.all([
        loadJson("./data/customers.json"),
        loadJson("./data/consultations.json")
      ]);

      return {
        customers: customerData.customers || [],
        consultations: consultData.consultations || [],
        usedFallback: false
      };
    } catch (error) {
      return {
        customers: window.CRM.data.fallbackCustomers,
        consultations: window.CRM.data.fallbackConsultations,
        usedFallback: true
      };
    }
  };

  window.CRM.data.loadInitialData = loadInitialData;
})();
