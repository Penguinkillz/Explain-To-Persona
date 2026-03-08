const form = document.getElementById("explain-form");
const conceptEl = document.getElementById("concept");
const personaEl = document.getElementById("persona");
const sourcesEl = document.getElementById("sources-text");
const filesEl = document.getElementById("source-files");
const btn = document.getElementById("explain-btn");
const btnLabel = document.getElementById("explain-label");
const spinner = document.getElementById("explain-spinner");
const statusEl = document.getElementById("status");
const explanationsEl = document.getElementById("explanations");
const keyInsightWrap = document.getElementById("key-insight-wrap");
const metaEl = document.getElementById("results-meta");
const emptyEl = document.getElementById("empty-state");

function setLoading(on) {
  btn.disabled = on;
  btnLabel.style.display = on ? "none" : "";
  spinner.style.display = on ? "inline" : "none";
}

function setStatus(msg, isError) {
  statusEl.textContent = msg;
  statusEl.className = "status" + (isError ? " error" : "");
}

function clearResults() {
  explanationsEl.innerHTML = "";
  keyInsightWrap.innerHTML = "";
  keyInsightWrap.style.display = "none";
  emptyEl.style.display = "block";
  metaEl.textContent = "Nothing yet.";
}

function renderResult(data) {
  explanationsEl.innerHTML = "";
  keyInsightWrap.innerHTML = "";
  emptyEl.style.display = "none";
  metaEl.textContent = data.persona;

  (data.explanations || []).forEach(function (text, i) {
    const card = document.createElement("div");
    card.className = "explanation-card";
    const num = document.createElement("div");
    num.className = "explanation-num";
    num.textContent = "Explanation " + (i + 1);
    const p = document.createElement("p");
    p.style.margin = "0";
    p.textContent = text;
    card.append(num, p);
    explanationsEl.appendChild(card);
  });

  if (data.key_insight) {
    const card = document.createElement("div");
    card.className = "key-insight-card";
    const label = document.createElement("div");
    label.className = "key-insight-label";
    label.textContent = "One thing this person would care about most";
    const p = document.createElement("p");
    p.style.margin = "0";
    p.textContent = data.key_insight;
    card.append(label, p);
    keyInsightWrap.appendChild(card);
    keyInsightWrap.style.display = "block";
  }
}

async function callApi() {
  var concept = conceptEl.value.trim();
  var persona = personaEl.value;
  var sourcesText = sourcesEl.value.trim();
  var files = filesEl.files;

  var hasFiles = files && files.length > 0;
  var hasSources = sourcesText.length > 0;

  if (!concept && !hasFiles && !hasSources) {
    throw new Error("Enter a concept, paste text, or upload a file.");
  }

  if (concept && !hasFiles && !hasSources) {
    var res = await fetch("/api/explain-to-persona/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        concept: concept,
        persona: persona,
        sources_text: sourcesText || null,
      }),
    });
    if (!res.ok) {
      var err = await res.json().catch(function () { return {}; });
      throw new Error(err.detail || "Server error " + res.status);
    }
    return res.json();
  }

  var fd = new FormData();
  fd.append("concept", concept);
  fd.append("persona", persona);
  fd.append("sources_text", sourcesText);
  for (var i = 0; i < (files ? files.length : 0); i++) fd.append("files", files[i]);

  var res2 = await fetch("/api/explain-to-persona/explain-from-files", {
    method: "POST",
    body: fd,
  });
  if (!res2.ok) {
    var err2 = await res2.json().catch(function () { return {}; });
    throw new Error(err2.detail || "Server error " + res2.status);
  }
  return res2.json();
}

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  setLoading(true);
  setStatus("Thinking...");
  clearResults();

  try {
    var data = await callApi();
    renderResult(data);
    setStatus("");
  } catch (err) {
    setStatus(err.message || "Something went wrong.", true);
  } finally {
    setLoading(false);
  }
});
