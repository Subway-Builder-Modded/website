(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var triggers = document.querySelectorAll("[data-reveal-target]");
    triggers.forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        var targetId = trigger.getAttribute("data-reveal-target");
        if (!targetId) return;
        var target = document.getElementById(targetId);
        if (!target) return;
        target.classList.toggle("odl-hidden");
      });
    });
  });
})();