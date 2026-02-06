(() => {
  const { loadInitialData } = window.CRM.data;
  const { state, setState, subscribe } = window.CRM.state.store;
  const { filterCustomers, findCustomerById } = window.CRM.customer.service;
  const { renderCustomerDetail, renderCustomerTable, updateCustomerCount } =
    window.CRM.customer.ui;
  const { applyConsultFilters, getConsultationsByCustomer, upsertConsultation } =
    window.CRM.consult.service;
  const { renderConsultList, updateConsultCount } = window.CRM.consult.ui;
  const { bindFilters, bindSearch, setSelectedCustomerStatus } = window.CRM.ui.filters;
  const { updateMetrics } = window.CRM.ui.metrics;
  const { renderAnalytics } = window.CRM.ui.analytics;
  const { renderClaims } = window.CRM.ui.claims;
  const { buildFormPayload, populateForm, resetForm, setFormMode, toggleFormHint } =
    window.CRM.consult.form;
  const { $ } = window.CRM.utils.dom;

  const defaultFilters = { type: "ALL", status: "ALL", sort: "DESC" };
  let pendingPayload = null;
  let lastEmptyAlertKey = "";

  const initTabs = () => {
    const tabs = Array.from(document.querySelectorAll(".sidebar__nav .nav-item"));
    const panels = Array.from(document.querySelectorAll(".tab-content"));
    if (!tabs.length || !panels.length) return;

    const activate = (key) => {
      tabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.tab === key));
      panels.forEach((panel) => panel.classList.toggle("is-active", panel.dataset.tab === key));
      const main = document.querySelector(".main");
      if (main) main.scrollTop = 0;
    };

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const key = tab.dataset.tab;
        if (key) activate(key);
      });
    });

    const homeButton = document.querySelector("#home-btn");
    if (homeButton) {
      homeButton.addEventListener("click", () => activate("dashboard"));
    }

    activate("dashboard");
  };

  const initData = async () => {
    try {
      const { customers, consultations } = await loadInitialData();
      setState({
        customers,
        consultations,
        selectedCustomerId: customers[0]?.id || null,
        errors: { customers: null, consultations: null }
      });
    } catch (error) {
      setState({
        errors: {
          customers: "LOAD_FAIL",
          consultations: "LOAD_FAIL"
        }
      });
    }
  };

  const render = () => {
    const main = document.querySelector(".main");
    const mainScroll = main ? main.scrollTop : 0;
    const customers = filterCustomers(state.customers, state.searchQuery);
    updateCustomerCount($("#customer-count"), customers.length);

    $("#customer-error").style.display = state.errors.customers ? "flex" : "none";
    renderCustomerTable({
      customers,
      selectedCustomerId: state.selectedCustomerId,
      target: $("#customer-table-body"),
      emptyEl: $("#customer-empty")
    });

    const selectedCustomer = findCustomerById(state.customers, state.selectedCustomerId);
    renderCustomerDetail(selectedCustomer, $("#customer-detail"));
    setSelectedCustomerStatus($("#selected-customer-status"), selectedCustomer);

    const consultError = state.errors.consultations;
    $("#consult-error").style.display = consultError ? "flex" : "none";
    $("#global-error").style.display =
      state.errors.customers || state.errors.consultations ? "block" : "none";

    let consultList = [];
    if (selectedCustomer) {
      consultList = applyConsultFilters(
        getConsultationsByCustomer(state.consultations, selectedCustomer.id),
        state.filters
      );
    }
    updateConsultCount($("#consult-count"), consultList.length);
    renderConsultList({
      consultations: consultList,
      target: $("#consult-list"),
      emptyEl: $("#consult-empty")
    });
    $("#consult-empty").style.display = "none";

    toggleFormHint(!selectedCustomer);

    const statusCounts = state.consultations.reduce(
      (acc, consult) => {
        if (consult.status === "접수") acc.received += 1;
        if (consult.status === "처리중") acc.inProgress += 1;
        if (consult.status === "완료") acc.complete += 1;
        return acc;
      },
      { received: 0, inProgress: 0, complete: 0 }
    );
    updateMetrics(statusCounts);
    renderAnalytics({ customers: state.customers, consultations: state.consultations });
    renderClaims({ consultations: state.consultations });

    if (selectedCustomer && consultList.length === 0) {
      const hasFilter =
        state.filters.type !== "ALL" || state.filters.status !== "ALL";
      if (hasFilter) {
        const key = `${selectedCustomer.id}|${state.filters.type}|${state.filters.status}|${state.filters.sort}`;
        if (lastEmptyAlertKey !== key) {
          alert("선택한 조건에 해당하는 상담 기록이 없습니다.");
          lastEmptyAlertKey = key;
        }
      }
    }

    if (main) {
      main.scrollTop = mainScroll;
    }
  };

  const bindTableEvents = () => {
    $("#customer-table-body").addEventListener("click", (event) => {
      const row = event.target.closest("tr");
      if (!row) return;
      setState({ selectedCustomerId: row.dataset.customerId });
      setFormMode({ isEdit: false });
      resetForm();
    });
  };

  const bindConsultEvents = () => {
    $("#consult-list").addEventListener("click", (event) => {
      const action = event.target.dataset.action;
      if (!action) return;
      const card = event.target.closest(".consult-card");
      if (!card) return;
      const consultId = card.dataset.consultId;
      const consult = state.consultations.find((item) => item.id === consultId);
      if (!consult) return;

      if (action === "edit-consult") {
        setFormMode({ isEdit: true });
        populateForm(consult);
        $("#consult-summary").focus();
      }

      if (action === "toggle-memo") {
        const memo = card.querySelector(".memo");
        const isCollapsed = memo.dataset.collapsed === "true";
        memo.dataset.collapsed = isCollapsed ? "false" : "true";
        memo.style.maxHeight = isCollapsed ? "none" : "56px";
        memo.style.overflow = isCollapsed ? "visible" : "hidden";
        event.target.textContent = isCollapsed ? "메모 접기" : "메모 펼치기";
      }
    });
  };

  const bindFormEvents = () => {
    $("#consult-form").addEventListener("submit", (event) => {
      event.preventDefault();
      if (!state.selectedCustomerId) return;

      const payload = buildFormPayload(state.selectedCustomerId);
      if (payload.id) {
        const existing = state.consultations.find((item) => item.id === payload.id);
        if (existing) {
          payload.ticketNo = existing.ticketNo;
          payload.orderId = existing.orderId;
          payload.tags = existing.tags;
          payload.resolutionCode = existing.resolutionCode;
          payload.agent = existing.agent;
        }
      }
      pendingPayload = payload;
      openModal();
    });

    $("#form-reset").addEventListener("click", () => {
      setFormMode({ isEdit: false });
    });

    $("#new-consult-btn").addEventListener("click", () => {
      if (!state.selectedCustomerId) {
        alert("고객을 먼저 선택하세요.");
        return;
      }
      setFormMode({ isEdit: false });
      resetForm();
      $("#consult-type").focus();
    });
  };

  const openModal = () => {
    const modal = $("#consult-modal");
    if (!modal) return;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    $("#modal-behavior").value = "";
    $("#modal-refund-reason").value = "해당없음";
    $("#modal-note").value = "";
  };

  const closeModal = () => {
    const modal = $("#consult-modal");
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
  };

  const bindModalEvents = () => {
    $("#consult-modal").addEventListener("click", (event) => {
      if (event.target.dataset.action === "close-modal") {
        closeModal();
      }
    });

    $("#modal-confirm").addEventListener("click", () => {
      if (!pendingPayload) return;
      const behavior = $("#modal-behavior").value;
      if (!behavior) {
        alert("고객 성향을 선택하세요.");
        return;
      }
      const refundReason = $("#modal-refund-reason").value;
      const note = $("#modal-note").value.trim();
      const extraTags = [`고객성향:${behavior}`, `환불사유:${refundReason}`];
      pendingPayload.tags = [...(pendingPayload.tags || []), ...extraTags];
      const extraMemo = [
        "---- 내부 기록 ----",
        `고객 성향: ${behavior}`,
        `환불 사유: ${refundReason}`,
        note ? `특이사항: ${note}` : ""
      ]
        .filter(Boolean)
        .join("\n");
      pendingPayload.memo = `${pendingPayload.memo}\n\n${extraMemo}`;

      const updated = upsertConsultation(state.consultations, pendingPayload);
      setState({ consultations: updated });
      pendingPayload = null;
      closeModal();
      resetForm();
      setFormMode({ isEdit: false });
    });
  };

  const bindGlobalEvents = () => {
    const logoutButton = document.querySelector("#logout-btn");
    if (logoutButton) {
      logoutButton.addEventListener("click", () => {
        alert("고생했다!! 집에가서 치맥해라 🍗🍺");
      });
    }
  };

  const bindFilterEvents = () => {
    bindFilters({
      onFilterChange: (partial) => setState({ filters: { ...state.filters, ...partial } }),
      onReset: () => {
        setState({ filters: { ...defaultFilters } });
        $("#filter-type").value = "ALL";
        $("#filter-status").value = "ALL";
        $("#filter-sort").value = "DESC";
      }
    });

    bindSearch({
      onSearch: (query) => setState({ searchQuery: query }),
      onClear: () => setState({ searchQuery: "" })
    });
  };

  const init = () => {
    initTabs();
    bindTableEvents();
    bindConsultEvents();
    bindFormEvents();
    bindModalEvents();
    bindFilterEvents();
    bindGlobalEvents();
    subscribe(render);
    initData();
  };

  init();
})();
