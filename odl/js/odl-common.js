(function () {
  "use strict";

  function setRevisionDate() {
    var targets = document.querySelectorAll("[data-odl-revision-date]");
    if (!targets.length) return;

    var now = new Date();
    var stamp = now.getUTCFullYear() + "-" + String(now.getUTCMonth() + 1).padStart(2, "0") + "-" + String(now.getUTCDate()).padStart(2, "0");
    targets.forEach(function (el) {
      el.textContent = stamp;
    });
  }

  function wireCopyButtons() {
    var buttons = document.querySelectorAll("[data-copy-text]");
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var text = btn.getAttribute("data-copy-text") || "";
        if (!navigator.clipboard) return;
        navigator.clipboard.writeText(text);
      });
    });
  }

  window.ODLCommon = {
    setRevisionDate: setRevisionDate,
    wireCopyButtons: wireCopyButtons,
  };

  document.addEventListener("DOMContentLoaded", function () {
    setRevisionDate();
    wireCopyButtons();
  });
})();