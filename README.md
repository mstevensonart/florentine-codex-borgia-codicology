A codicological survey of the Codex Borgia and the Florentine Codex

A codicological survey of the Codex Borgia and the Florentine Codex — paper, watermarks, tools, hands, and corrections — tracing artisanal continuity from a pre-Conquest screenfold to a colonial encyclopedic manuscript.

Developed from an M.A. thesis (Art History, Arizona State University, 2002, chair: Emily Umberger), with fieldwork and analysis continuing since.

What's here
index.html / styles.css / app.js — a static site: a browsable, filterable, searchable view over the evidence dataset, plus the project's essay and methodology pages.
data/watermarks-florentine-codex/ — the Florentine Codex watermark logs, one file per volume: codicology_vol1.json (362 entries), codicology_vol2.json (381 entries), codicology_vol3.json (501 entries). samples/ holds a few web-sized illustrative scans for documentation — full-resolution archival scans live on Zenodo, not in this repo.
data/florentine/ — folio_notes.json (101 descriptive annotations across all three volumes: paper stock, hand changes, pentimenti, wear patterns, text corrections) and technical.json (80 execution-level evidence entries) for the Florentine Codex.
data/borgia/ — technical.json, execution-level evidence entries for the Codex Borgia — expanded from 8 to 59 entries as of this update, with the full 2000 field notebook now transcribed.
codicology_borgia.json — a 76-panel codicological census for the Codex Borgia (support, condition, grid system, production and revision evidence), new as of this update. The deerskin-manuscript equivalent of the Florentine watermark logs — the Borgia has no watermarks (pre-Conquest, not paper), so this census tracks hide joins, holes, staining, and grid/priming evidence per panel instead.
data/schema.md — full field definitions and the taxonomy used throughout, including open questions still unresolved in the data.
essay/ — "The Black and the Red: A Physical Description of the Codex Borgia" (Phoebus 11, 2022, pp. 59–78).
KNOWN_GAPS.md — documents known gaps, uncertain readings, and flagged items across the dataset and the reconstructed thesis, new as of this update.
Running locally

Browsers block fetch() of local files opened directly from disk. From the project root:

python3 -m http.server 8000

Then visit http://localhost:8000.

Publishing

This is a static site — push to a GitHub repository and enable GitHub Pages (Settings → Pages → deploy from the main branch, root folder). No build step required.

For citability independent of any journal: archive a GitHub release through Zenodo to mint a DOI for both the dataset and the site. Update CITATION.cff and the "How to cite" block in index.html once a DOI is assigned. Consider also depositing on Humanities Commons CORE.

Status

All three watermark logs (Vols. I, II, III) and descriptive folio notes across all three volumes are transcribed. Vol. I retains a small number of honestly flagged open readings (RLS notation, "Cursivo" at f. 296, CCM suffix meaning) pending verification against the physical notebook — see data/schema.md and the in-app status note on the Browse Evidence tab.

The Codex Borgia field notebook is now fully transcribed (59 technical evidence entries, up from 8) and a first codicological census (76 panels) has been built, bringing Borgia dataset coverage roughly to parity with the Florentine side. 12 panels in the census are flagged for verification against the physical notebook.

The reconstructed thesis (Zenodo deposit) is now complete front-to-back — the previously missing page 10 was located and restored, and figures and bibliography are fully included.

PROGRESS.md has the full session-by-session checklist.

Adding new data

Add entries to the relevant file under data/watermarks-florentine-codex/, data/florentine/, or data/borgia/, following the shapes documented in data/schema.md. The site reads all of these at load time — no other code changes needed for new records of an existing type. New note_type / observation_types values are picked up automatically by the filter rail.

License

Code and data in this repository are licensed under CC BY 4.0 — see LICENSE. The essay under essay/ remains under its original Phoebus/Arizona State University copyright and is not covered by the CC BY 4.0 license applied to the rest of this repository.
