(() => {
  const { $, setText } = window.CRM.utils.dom;

  const buildFormPayload = (selectedCustomerId) => ({
    id: $("#consult-id").value || "",
    customerId: selectedCustomerId,
    type: $("#consult-type").value,
    status: $("#consult-status").value,
    channel: $("#consult-channel").value,
    priority: $("#consult-priority").value,
    summary: $("#consult-summary").value,
    memo: $("#consult-memo").value,
    followUpAt: $("#consult-followup").value,
    tags: [],
    ticketNo: `CS-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(
      1000 + Math.random() * 9000
    )}`,
    orderId: "",
    resolutionCode: "",
    agent: {
      id: "AG-0031",
      name: "홍지연",
      team: "고객경험팀-3센터"
    }
  });

  const populateForm = (consult) => {
    if (!consult) return;
    $("#consult-id").value = consult.id;
    $("#consult-type").value = consult.type;
    $("#consult-status").value = consult.status;
    $("#consult-channel").value = consult.channel;
    $("#consult-priority").value = consult.priority;
    $("#consult-summary").value = consult.summary;
    $("#consult-memo").value = consult.memo;
    $("#consult-followup").value = consult.followUpAt || "";
  };

  const resetForm = () => {
    $("#consult-id").value = "";
    $("#consult-form").reset();
  };

  const setFormMode = ({ isEdit }) => {
    setText($("#form-title"), isEdit ? "상담 기록 수정" : "상담 기록 등록");
    setText(
      $("#form-subtitle"),
      isEdit ? "기존 상담 기록을 수정합니다." : "신규 상담 기록을 입력하세요."
    );
  };

  const toggleFormHint = (show) => {
    $("#form-hint").style.display = show ? "block" : "none";
    $("#consult-form").style.opacity = show ? 0.6 : 1;
    $("#consult-form").style.pointerEvents = show ? "none" : "auto";
  };

  window.CRM.consult.form = { buildFormPayload, populateForm, resetForm, setFormMode, toggleFormHint };
})();
