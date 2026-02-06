(() => {
  const { clearChildren, createEl, setText } = window.CRM.utils.dom;
  const { formatNumber } = window.CRM.utils.format;

  const buildListItem = (label, value) => {
    const item = createEl("div", "list-item");
    const left = createEl("div");
    left.append(createEl("strong", "", label), createEl("div", "muted", "집계 기준"));
    const right = createEl("strong", "", value);
    item.append(left, right);
    return item;
  };

  const renderAnalytics = ({ customers, consultations }) => {
    const total = customers.length;
    const wow = customers.filter((c) => c.grade === "로켓와우").length;
    const premium = customers.filter((c) => c.grade === "프리미엄").length;
    const dormant = customers.filter((c) => c.accountStatus === "휴면").length;

    setText(document.querySelector("#analytics-total"), formatNumber(total));
    setText(document.querySelector("#analytics-wow"), formatNumber(wow));
    setText(document.querySelector("#analytics-premium"), formatNumber(premium));
    setText(document.querySelector("#analytics-dormant"), formatNumber(dormant));

    const regionCounts = customers.reduce((acc, customer) => {
      acc[customer.region] = (acc[customer.region] || 0) + 1;
      return acc;
    }, {});

    const regionList = document.querySelector("#region-list");
    clearChildren(regionList);
    Object.entries(regionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .forEach(([region, count]) => regionList.append(buildListItem(region, `${count}명`)));

    const typeCounts = consultations.reduce((acc, consult) => {
      acc[consult.type] = (acc[consult.type] || 0) + 1;
      return acc;
    }, {});

    const issueList = document.querySelector("#issue-list");
    clearChildren(issueList);
    Object.entries(typeCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([type, count]) => issueList.append(buildListItem(type, `${count}건`)));
  };

  window.CRM.ui.analytics = { renderAnalytics };
})();
