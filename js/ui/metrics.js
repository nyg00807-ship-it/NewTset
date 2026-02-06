(() => {
  const { setText } = window.CRM.utils.dom;

  const updateMetrics = ({ received, inProgress, complete }) => {
    setText(document.querySelector("#metric-received"), received);
    setText(document.querySelector("#metric-inprogress"), inProgress);
    setText(document.querySelector("#metric-complete"), complete);
  };

  window.CRM.ui.metrics = { updateMetrics };
})();
