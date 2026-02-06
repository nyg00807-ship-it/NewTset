(() => {
  const { clearChildren, createEl } = window.CRM.utils.dom;

  const renderClaims = ({ consultations }) => {
    const types = ["배송", "환불", "결제", "상품 문의", "기타"];
    const statuses = ["접수", "처리중", "완료"];

    const tableBody = document.querySelector("#claim-table-body");
    clearChildren(tableBody);

    types.forEach((type) => {
      const row = createEl("tr");
      row.append(createEl("td", "", type));
      statuses.forEach((status) => {
        const count = consultations.filter(
          (consult) => consult.type === type && consult.status === status
        ).length;
        row.append(createEl("td", "", `${count}건`));
      });
      tableBody.append(row);
    });

    const openList = document.querySelector("#claim-open-list");
    clearChildren(openList);
    const openItems = consultations
      .filter((consult) => consult.status !== "완료")
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    openItems.forEach((consult) => {
      const item = createEl("div", "list-item");
      const left = createEl("div");
      left.append(
        createEl("strong", "", consult.summary),
        createEl("div", "muted", `${consult.type} · ${consult.ticketNo}`)
      );
      const badge = createEl("span", `status-badge status--${consult.status}`, consult.status);
      item.append(left, badge);
      openList.append(item);
    });
  };

  window.CRM.ui.claims = { renderClaims };
})();
