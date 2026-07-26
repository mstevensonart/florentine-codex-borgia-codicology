(function(){
  "use strict";

  // ---------------- Tabs ----------------
  var tabBtns = document.querySelectorAll(".tab-btn");
  var panels = document.querySelectorAll(".panel");
  tabBtns.forEach(function(btn){
    btn.addEventListener("click", function(){
      tabBtns.forEach(function(b){ b.classList.remove("is-active"); });
      panels.forEach(function(p){ p.classList.remove("is-active"); });
      btn.classList.add("is-active");
      document.getElementById("panel-" + btn.dataset.tab).classList.add("is-active");
    });
  });

  // ---------------- State ----------------
  var state = {
    dataset: "technical",   // "technical" | "codicology"
    manuscripts: new Set(), // active manuscript filter values
    noteTypes: new Set(),   // active note_type filter values
    search: ""
  };

  var technicalData = null;
  var codicologyData = null;

  function titleCase(s){
    return String(s).replace(/-/g, " ").replace(/\b\w/g, function(c){ return c.toUpperCase(); });
  }

  // Flatten the per-volume watermark logs (data/watermarks-florentine-codex/)
  // and the descriptive folio notes (data/florentine/folio_notes.json) into a
  // list of entries shaped like technical entries, so all datasets share one renderer.
  function flattenCodicology(watermarkVols, folioNotes){
    var out = [];
    watermarkVols.forEach(function(data){
      (data.entries || []).forEach(function(e){
        var markDesc;
        if(e.watermark_type){
          markDesc = e.watermark_type +
            (e.orientation ? (e.orientation === "up" ? "\u2191" : e.orientation === "down" ? "\u2193" : " " + e.orientation) : "") +
            (e.suffix ? "-" + e.suffix : "");
        } else {
          markDesc = "No watermark recorded.";
        }
        if(e.notes){ markDesc += " \u2014 " + e.notes; }
        out.push({
          manuscript: "Florentine Codex",
          volume: data.volume,
          location: String(e.folio),
          note_type: e.watermark_type ? "watermark" : "no-mark-recorded",
          note_text: markDesc,
          confidence: (e.flags || []).indexOf("check") !== -1 ? "flagged" : "high",
          flags: e.flags || []
        });
      });
    });
    (folioNotes.entries || []).forEach(function(e){
      out.push({
        manuscript: "Florentine Codex",
        volume: e.volume,
        location: e.folio,
        note_type: (e.observation_types || []).join(", ") || "other",
        note_text: e.description,
        confidence: (e.uncertain_readings && e.uncertain_readings.length) ? "flagged" : "high",
        uncertain_readings: e.uncertain_readings || []
      });
    });
    return out;
  }

  function currentEntries(){
    if(state.dataset === "technical"){
      return (technicalData && technicalData.entries) || [];
    }
    return codicologyData || [];
  }

  function uniqueValues(entries, field){
    var s = new Set();
    entries.forEach(function(e){ if(e[field]) s.add(e[field]); });
    return Array.from(s).sort();
  }

  // ---------------- Filter rail ----------------
  function buildFilters(){
    var entries = currentEntries();

    var manuscriptWrap = document.getElementById("manuscript-filters");
    var manuscriptLabel = document.getElementById("manuscript-label");
    var manuscripts = uniqueValues(entries, "manuscript");

    if(manuscripts.length <= 1){
      manuscriptWrap.style.display = "none";
      manuscriptLabel.style.display = "none";
    } else {
      manuscriptWrap.style.display = "";
      manuscriptLabel.style.display = "";
      manuscriptWrap.innerHTML = "";
      manuscripts.forEach(function(m){
        if(!state.manuscripts.has(m)) state.manuscripts.add(m); // default: all on
        var id = "ms-" + m.replace(/\s+/g, "-");
        var row = document.createElement("label");
        row.className = "check-row";
        row.innerHTML = '<input type="checkbox" id="'+id+'" checked> <span>'+m+'</span>';
        manuscriptWrap.appendChild(row);
        row.querySelector("input").addEventListener("change", function(ev){
          if(ev.target.checked) state.manuscripts.add(m); else state.manuscripts.delete(m);
          render();
        });
      });
    }

    var noteWrap = document.getElementById("notetype-filters");
    var noteTypes = uniqueValues(entries, "note_type");
    state.noteTypes = new Set(noteTypes); // default: all on
    noteWrap.innerHTML = "";
    noteTypes.forEach(function(nt){
      var id = "nt-" + nt;
      var row = document.createElement("label");
      row.className = "check-row";
      row.innerHTML = '<input type="checkbox" id="'+id+'" checked> <span>'+titleCase(nt)+'</span>';
      noteWrap.appendChild(row);
      row.querySelector("input").addEventListener("change", function(ev){
        if(ev.target.checked) state.noteTypes.add(nt); else state.noteTypes.delete(nt);
        render();
      });
    });
  }

  // ---------------- Render ----------------
  function escapeHtml(str){
    return String(str).replace(/[&<>"']/g, function(c){
      return ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"})[c];
    });
  }

  function render(){
    var entries = currentEntries();
    var q = state.search.trim().toLowerCase();

    var filtered = entries.filter(function(e){
      if(e.manuscript && state.manuscripts.size && !state.manuscripts.has(e.manuscript)) return false;
      if(e.note_type && state.noteTypes.size && !state.noteTypes.has(e.note_type)) return false;
      if(!e.note_text) return false; // skip blank/no-mark entries from the noisy raw log by default
      if(q){
        var hay = ((e.location||"") + " " + (e.note_text||"") + " " + (e.note_type||"")).toLowerCase();
        if(hay.indexOf(q) === -1) return false;
      }
      return true;
    });

    var resultsEl = document.getElementById("results");
    var countEl = document.getElementById("result-count");
    countEl.textContent = filtered.length + " record" + (filtered.length === 1 ? "" : "s");

    if(!filtered.length){
      resultsEl.innerHTML = '<div class="empty-state">No matching records. Try clearing a filter or search term.</div>';
      return;
    }

    resultsEl.innerHTML = filtered.map(function(e){
      var msClass = e.manuscript === "Codex Borgia" ? "manuscript-Borgia" : "manuscript-Florentine";
      var confBit = e.confidence === "flagged" ? '<span class="flagged">reading unconfirmed</span>' : "";
      var refBit = e.essay_reference ? "source: " + escapeHtml(e.essay_reference) : "";
      var metaParts = [confBit, refBit].filter(Boolean).join(" &middot; ");
      return (
        '<div class="entry">' +
          '<div class="entry-head">' +
            '<span class="entry-loc">' + escapeHtml(e.location || "") + '</span>' +
            (e.manuscript ? '<span class="tag ' + msClass + '">' + escapeHtml(e.manuscript) + '</span>' : "") +
            (e.note_type ? '<span class="tag mark">' + escapeHtml(titleCase(e.note_type)) + '</span>' : "") +
            (e.volume ? '<span class="tag">Vol. ' + e.volume + '</span>' : "") +
          '</div>' +
          '<div class="entry-note">' + escapeHtml(e.note_text || "") + '</div>' +
          (metaParts ? '<div class="entry-meta">' + metaParts + '</div>' : "") +
        '</div>'
      );
    }).join("");
  }

  // ---------------- Wire up controls ----------------
  document.querySelectorAll('input[name="dataset"]').forEach(function(radio){
    radio.addEventListener("change", function(){
      state.dataset = radio.value;
      buildFilters();
      render();
    });
  });

  document.getElementById("search-input").addEventListener("input", function(ev){
    state.search = ev.target.value;
    render();
  });

  // ---------------- Methodology panel ----------------
  function renderMethodology(){
    var el = document.getElementById("methodology-content");
    el.innerHTML =
      '<h2>Method</h2>' +
      '<p>Both manuscripts were examined in person under magnification; the Florentine Codex was also examined under both daylight and ultraviolet light. The vocabulary used throughout this dataset comes from that fieldwork and the thesis-era essays it produced, rather than a vocabulary invented after the fact for the website.</p>' +
      '<h2>Watermark codes</h2>' +
      '<p>The Volume Three watermark log uses four shorthand codes, devised in the field: <code>P(CCA)</code>, <code>P(ARA)</code>, <code>P(CCM)</code>, and <code>+(AM)</code>. <code>P</code> most likely marks a primary watermark motif; <code>+</code> a countermark &mdash; in period papermaking, a countermark is often simply the mill owner\u2019s initials, which fits <code>AM</code> better than a motif abbreviation would. An earlier essay independently identified two broad watermark families present in the Florentine Codex using the standard reference works (Mena, Briquet): a \u201cTeardrop and Cross\u201d type and a \u201cPilgrim\u201d type. The four shorthand codes most likely sort into those two families as motif variants, though no plate-by-plate concordance has been attempted &mdash; that is offered here as a plain working explanation, not a verified one.</p>' +
      '<table><tr><th>Code</th><th>Likely sense</th></tr>' +
      '<tr><td><code>P(CCA)</code></td><td>Primary mark, motif variant CCA</td></tr>' +
      '<tr><td><code>P(ARA)</code></td><td>Primary mark, motif variant ARA</td></tr>' +
      '<tr><td><code>P(CCM)</code></td><td>Primary mark, motif variant CCM</td></tr>' +
      '<tr><td><code>+(AM)</code></td><td>Countermark, likely papermaker\u2019s initials</td></tr>' +
      '</table>' +
      '<p>One open question, visible directly in the data: <code>P(...)</code> entries consistently take a plain <code>s</code> suffix, while <code>+(AM)</code> entries consistently take <code>As</code> &mdash; a clean pattern repeated across roughly a hundred entries, not noise, but its meaning is not yet resolved.</p>' +
      '<h2>Evidence categories</h2>' +
      '<p>Technical-evidence entries follow the same production sequence identified across both manuscripts: a dry-media (lead/metal-point) underdrawing, black-line ink, color fill, then one of two correction types &mdash; white paint laid over an unwanted area, or physical scraping of the support to remove paint. Tool evidence (split-nib marks, a slipped tool stroke) and hand changes are recorded the same way for both manuscripts, since the methodology was developed for direct comparison between them.</p>' +
      '<h2>Confidence flags</h2>' +
      '<p>Entries marked <em>reading unconfirmed</em> reflect genuine uncertainty in transcription &mdash; faint pencil, ambiguous abbreviation, or a note that does not yet have a clear referent &mdash; rather than confidence in the underlying observation. These are listed openly rather than silently resolved.</p>';
  }

  // ---------------- Load data ----------------
  var statusEl = document.getElementById("status-note");
  function showStatus(msg){
    statusEl.textContent = msg;
    statusEl.classList.add("is-visible");
  }

  Promise.all([
    fetch("data/florentine/technical.json").then(function(r){ return r.json(); }),
    fetch("data/borgia/technical.json").then(function(r){ return r.json(); }),
    fetch("data/watermarks-florentine-codex/codicology_vol1.json").then(function(r){ return r.json(); }),
    fetch("data/watermarks-florentine-codex/codicology_vol2.json").then(function(r){ return r.json(); }),
    fetch("data/watermarks-florentine-codex/codicology_vol3.json").then(function(r){ return r.json(); }),
    fetch("data/florentine/folio_notes.json").then(function(r){ return r.json(); })
  ]).then(function(results){
    var fcTechnical = results[0], borgiaTechnical = results[1];
    var vol1 = results[2], vol2 = results[3], vol3 = results[4], folioNotes = results[5];

    technicalData = {
      description: "Execution-level technical evidence across both manuscripts.",
      status: fcTechnical.status,
      entries: (fcTechnical.entries || []).concat(borgiaTechnical.entries || [])
    };
    codicologyData = flattenCodicology([vol1, vol2, vol3], folioNotes);
    buildFilters();
    render();
    renderMethodology();
    if(technicalData.status){ showStatus(technicalData.status); }
  }).catch(function(err){
    document.getElementById("results").innerHTML =
      '<div class="empty-state">Could not load data files. If you opened this page directly from disk, ' +
      'browsers block local file access &mdash; run a local server (e.g. <code>python3 -m http.server</code>) ' +
      'from the project root, or view via GitHub Pages.</div>';
    console.error(err);
  });

})();
