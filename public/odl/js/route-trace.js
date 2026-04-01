(function () {
  "use strict";

  var expected = ["C4", "C1", "C7"];

  function normalize(value) {
    return String(value || "")
      .toUpperCase()
      .replace(/[^A-Z0-9 ]/g, " ")
      .trim()
      .split(/\s+/)
      .filter(Boolean);
  }

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.querySelector("[data-route-trace-form]");
    var output = document.querySelector("[data-route-trace-output]");
    if (!form || !output) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var input = form.querySelector("input[name='corridors']");
      var tokens = normalize(input ? input.value : "");

      if (tokens.length !== expected.length) {
        output.textContent = "Trace rejected: expected exactly three corridor segments.";
        return;
      }

      var valid = expected.every(function (segment, index) {
        return tokens[index] === segment;
      });

      if (!valid) {
        output.textContent = "Trace mismatch: apply Notice 194, then 207, then 311, with deferred precedence.";
        return;
      }

      output.innerHTML = "Trace accepted. Continuity corridor sequence resolved: <strong>C4 C1 C7</strong>. Now consult the C-Table and registry extract.";
    });
  });
})();