# Data schema & taxonomy

This project tracks physical evidence across several files, grouped by aspect of the project.

## watermarks-florentine-codex/codicology_vol{1,2,3}.json

One file per volume, Florentine Codex only (the Borgia's support is prepared
deerskin, not watermarked paper). `samples/` holds a few web-sized illustrative
scans for documentation; full-resolution TIFFs are excluded from this repo
(see `.gitignore`) and are deposited on Zenodo alongside the dataset release.

Top-level fields: `manuscript`, `volume`, `shelfmark`, `notebook_date`,
`transcribed`, `source_images`, `schema_notes`, `binding_note`, `total_entries`.

### `entries` (one per leaf)

| Field | Values |
|---|---|
| `folio` | folio number or label (`cover`, `prel_I`, etc.) |
| `watermark_type` | `P` (Pelegrino), `+` (cross-and-anchor composite), `CROSS`, `R` (rotated variant); `null` if no mark |
| `orientation` | `up` / `down` (mark position relative to mold), or `null` |
| `suffix` | paper-stock group code, e.g. `CCM`, `CCA`, `BM`, `AM`, `ARA`, `1M`, `1A`, `M2`; or `null` |
| `flags` | array; values include `struck_through`, `best`, `asterisk`, `check` (uncertain reading), `new_type` (first occurrence of a stock) |
| `notes` | free text, present when there's something to say beyond the coded fields |

**Open questions still unresolved in Vol. I** (flagged with `"check"`, not silently resolved): RLS notation (ff. 80, 121), "Cursivo" at f. 296 (paper vs. script note), CCM suffix meaning (ff. 332, 334). The A→S direction convention and cross-watermark arrow convention are noted at the `schema_notes` level as open questions rather than resolved.

## florentine/folio_notes.json

Descriptive/narrative notebook annotations for the Florentine Codex, all three
volumes: paper stock, hand changes, pentimenti, wear patterns, text
corrections, gloss notes.

| Field | Values |
|---|---|
| `folio` | folio number |
| `volume` | 1, 2, or 3 |
| `observation_types` | array, e.g. `paper_evidence`, `wear_pattern`, `text_correction`, `hand_change` |
| `description` | free text |
| `flags` | `check`, `new_type`, etc. |
| `uncertain_readings` | array of free-text notes on ambiguous transcriptions, when present |

## florentine/technical.json and borgia/technical.json

Each is `{ description, status, entries }`, split by manuscript. Execution-level
evidence: stroke direction, tool behavior (split-nib marks, slipped strokes),
corrections (white-paint overpaint vs. physical scraping), hand changes.

| Field | Values |
|---|---|
| `manuscript` | `Codex Borgia` / `Florentine Codex` |
| `location` | panel number (Borgia) or folio (Florentine Codex) |
| `volume` | Florentine Codex only, 1-3 |
| `note_type` | controlled vocabulary: `dry-media`, `stroke-direction`, `split-nib-evidence`, `white-paint-correction`, `pasted-correction`, `hand-change`, `gloss`, `other`, etc. |
| `note_text` | free text |
| `confidence` | `high` / `flagged` |
| `uncertain_readings` | array, present on flagged entries |
| `essay_reference` | which essay draft/version the entry supports, when applicable |
