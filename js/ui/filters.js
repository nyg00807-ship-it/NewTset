(() => {
  const { $, setText } = window.CRM.utils.dom;

  const bindFilters = ({ onFilterChange, onReset }) => {
    $("#filter-type").addEventListener("change", (event) => {
      event.preventDefault();
      onFilterChange({ type: event.target.value });
    });
    $("#filter-status").addEventListener("change", (event) => {
      event.preventDefault();
      onFilterChange({ status: event.target.value });
    });
    $("#filter-sort").addEventListener("change", (event) => {
      event.preventDefault();
      onFilterChange({ sort: event.target.value });
    });
    $("#filter-reset").addEventListener("click", (event) => {
      event.preventDefault();
      onReset();
    });
  };

  const bindSearch = ({ onSearch, onClear }) => {
    $("#customer-search").addEventListener("input", (event) => onSearch(event.target.value));
    $("#customer-search-clear").addEventListener("click", () => {
      $("#customer-search").value = "";
      onClear();
    });
  };

  const setSelectedCustomerStatus = (target, customer) => {
    setText(target, customer ? `${customer.name} 선택됨` : "미선택");
  };

  window.CRM.ui.filters = { bindFilters, bindSearch, setSelectedCustomerStatus };
})();
