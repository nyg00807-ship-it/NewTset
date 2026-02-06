(() => {
  const { clearChildren, createEl, setText } = window.CRM.utils.dom;
  const { formatDateTime, isRecent } = window.CRM.utils.date;

  const buildTag = (label, className) => createEl("span", className, label);

  const renderConsultList = ({ consultations, target, emptyEl }) => {
    clearChildren(target);
    if (!consultations.length) {
      emptyEl.style.display = "flex";
      return;
    }
    emptyEl.style.display = "none";

    consultations.forEach((consult) => {
      const card = createEl(
        "article",
        `consult-card${isRecent(consult.createdAt) ? " is-recent" : ""}`
      );
      card.dataset.consultId = consult.id;

      const header = createEl("div", "consult-header");
      const title = createEl("div", "consult-title", consult.summary);
      const meta = createEl(
        "div",
        "consult-meta",
        `${formatDateTime(consult.createdAt)} · ${consult.channel}`
      );
      header.append(title, meta);

      const tags = createEl("div", "consult-tags");
      tags.append(
        buildTag(consult.type, "type-chip"),
        buildTag(consult.status, `status-badge status--${consult.status}`),
        buildTag(`우선순위 ${consult.priority}`, "type-chip")
      );
      if (consult.followUpAt) {
        tags.append(buildTag(`후속 ${consult.followUpAt}`, "type-chip"));
      }

      const memo = createEl("div", "memo");
      memo.textContent = consult.memo;
      memo.dataset.collapsed = "true";
      memo.style.maxHeight = "56px";
      memo.style.overflow = "hidden";

      const toggle = createEl("button", "memo-toggle", "메모 펼치기");
      toggle.type = "button";
      toggle.dataset.action = "toggle-memo";

      const footer = createEl("div", "consult-footer");
      const editBtn = createEl("button", "ghost-button", "수정");
      editBtn.type = "button";
      editBtn.dataset.action = "edit-consult";

      const info = createEl(
        "div",
        "consult-meta",
        `담당: ${consult.agent?.name || "-"} · 티켓 ${consult.ticketNo}`
      );

      footer.append(info, editBtn);

      card.append(header, tags, memo, toggle, footer);
      target.append(card);
    });
  };

  const updateConsultCount = (target, count) => {
    setText(target, `${count}건`);
  };

  window.CRM.consult.ui = { renderConsultList, updateConsultCount };
})();
