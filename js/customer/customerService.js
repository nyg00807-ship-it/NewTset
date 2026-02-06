(() => {
  const filterCustomers = (customers, query) => {
    if (!query) return customers;
    const normalized = query.trim().toLowerCase();
    return customers.filter((customer) => {
      return (
        customer.name.toLowerCase().includes(normalized) ||
        customer.customerNo.includes(normalized)
      );
    });
  };

  const findCustomerById = (customers, customerId) =>
    customers.find((customer) => customer.id === customerId);

  window.CRM.customer.service = { filterCustomers, findCustomerById };
})();
