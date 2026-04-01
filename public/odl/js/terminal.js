(function () {
  "use strict";

  var CANONICAL = "NINEAMBERLINE";

  function normalizeCode(value) {
    return String(value || "")
      .trim()
      .toUpperCase()
      .replace(/[\s\-]+/g, "");
  }

  function appendLog(logEl, line) {
    logEl.textContent += "\n" + line;
    logEl.scrollTop = logEl.scrollHeight;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.querySelector("[data-terminal-form]");
    var logEl = document.querySelector("[data-terminal-log]");
    var result = document.querySelector("[data-terminal-result]");
    if (!form || !logEl || !result) return;

    appendLog(logEl, "ODL CONTINUITY TERMINAL :: LINE 9 ACCESS NODE");
    appendLog(logEl, "Awaiting reactivation phrase.");

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var input = form.querySelector("input[name='passcode']");
      var normalized = normalizeCode(input ? input.value : "");
      appendLog(logEl, "> " + String(input ? input.value : "").trim().toUpperCase());

      if (!normalized) {
        appendLog(logEl, "ERR-NIL: No phrase received.");
        result.innerHTML = "<div class='odl-alert'>No phrase was entered.</div>";
        return;
      }

      if (normalized !== CANONICAL) {
        appendLog(logEl, "ERR-SIG: Phrase not recognised.");
        appendLog(logEl, "Hint: Decode the retention transmission using Service Key 9.");
        result.innerHTML = "<div class='odl-alert'>Access denied. Check your decoding.</div>";
        return;
      }

      appendLog(logEl, "PHRASE ACCEPTED");
      appendLog(logEl, "Line 9 reactivation record available.");
      result.innerHTML = "<div class='odl-success'>Access granted. Open record: <a href='/odl/terminal/solved.html'>/odl/terminal/solved.html</a></div>";
    });
  });
})();