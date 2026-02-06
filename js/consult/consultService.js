(() => {
  const { parseDate } = window.CRM.utils.date;

  const getConsultationsByCustomer = (consultations, customerId) =>
    consultations.filter((consult) => consult.customerId === customerId);

  const applyConsultFilters = (consultations, filters) => {
    let result = [...consultations];
    if (filters.type !== "ALL") {
      result = result.filter((consult) => consult.type === filters.type);
    }
    if (filters.status !== "ALL") {
      result = result.filter((consult) => consult.status === filters.status);
    }

    result.sort((a, b) => {
      const dateA = parseDate(a.createdAt)?.getTime() || 0;
      const dateB = parseDate(b.createdAt)?.getTime() || 0;
      return filters.sort === "ASC" ? dateA - dateB : dateB - dateA;
    });

    return result;
  };

  const upsertConsultation = (consultations, payload) => {
    const existingIndex = consultations.findIndex((item) => item.id === payload.id);
    if (existingIndex >= 0) {
      const updated = {
        ...consultations[existingIndex],
        ...payload,
        updatedAt: new Date().toISOString()
      };
      return consultations.map((item, index) => (index === existingIndex ? updated : item));
    }

    const newItem = {
      ...payload,
      id: `CONS-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return [newItem, ...consultations];
  };

  window.CRM.consult.service = { getConsultationsByCustomer, applyConsultFilters, upsertConsultation };
})();
