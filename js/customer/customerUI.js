(() => {
  const { clearChildren, createEl, setText } = window.CRM.utils.dom;
  const { formatNumber, maskPhone } = window.CRM.utils.format;
  const { formatDate } = window.CRM.utils.date;

  const renderCustomerTable = ({ customers, selectedCustomerId, target, emptyEl }) => {
    clearChildren(target);
    if (!customers.length) {
      emptyEl.style.display = "flex";
      return;
    }
    emptyEl.style.display = "none";
    customers.forEach((customer) => {
      const row = createEl("tr", customer.id === selectedCustomerId ? "is-selected" : "");
      row.dataset.customerId = customer.id;
      row.append(
        createEl("td", "", customer.name),
        createEl("td", "", customer.customerNo),
        createEl("td", "", maskPhone(customer.phone)),
        createEl("td", "", customer.grade)
      );
      target.append(row);
    });
  };

  const renderCustomerDetail = (customer, target) => {
    clearChildren(target);
    if (!customer) {
      const empty = createEl("div", "detail-empty", "고객을 선택하면 상세 정보가 표시됩니다.");
      target.append(empty);
      return;
    }

    const header = createEl("div", "detail-header");
    const name = createEl("h3", "", customer.name);
    const badge = createEl("span", "badge badge--grade", customer.grade);
    header.append(name, badge);

    const list = createEl("div", "detail-list");
    const addItem = (label, value) => {
      const item = createEl("div", "detail-item");
      item.append(createEl("span", "muted", label), createEl("strong", "", value));
      list.append(item);
    };

    addItem("고객번호", customer.customerNo);
    addItem("연락처", maskPhone(customer.phone));
    addItem("이메일", customer.email || "-");
    addItem("회원등급", `${customer.grade} (${customer.vipLevel})`);
    addItem("가입일", formatDate(customer.joinDate));
    addItem("최근 활동", formatDate(customer.lastActiveAt));
    addItem("총 주문", `${formatNumber(customer.totalOrders)}건`);
    addItem("누적 구매", `${formatNumber(customer.totalSpend)}원`);
    addItem("선호 채널", customer.preferredContact);
    addItem("상태", customer.accountStatus);
    addItem("지역", customer.region);

    const notes = createEl("div", "detail-item");
    notes.append(createEl("span", "muted", "메모"), createEl("strong", "", customer.notes || "-"));

    target.append(header, list, notes);
  };

  const updateCustomerCount = (target, count) => {
    setText(target, `${count}명`);
  };

  window.CRM.customer.ui = { renderCustomerTable, renderCustomerDetail, updateCustomerCount };
})();
