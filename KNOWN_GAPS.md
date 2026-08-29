# Known Gaps and Limitations

This file documents known gaps, uncertain readings, and limitations across the
dataset and thesis reconstruction, so they're visible without digging through
individual files. Updated as items are resolved or new gaps are identified.

## Thesis reconstruction (Stevenson_thesis_2002_reconstructed.docx / .pdf)

- **Page 10 missing.** The original 2002 printed thesis is missing page 10 —
  this is a gap in the source document itself, not a digitization or
  reconstruction error. The gap falls within the Chapter 1 discussion of the
  Valladolid debate and includes footnote 18. Earlier drafts and related files
  were searched without success (2026-08-29). An editorial note marking the
  gap is inline in the reconstructed document at the p.9/p.11 break. This note
  will be updated if the original page is located.
- Figures (pp. 96–129) and bibliography (pp. 130–137) are now fully included
  as of 2026-08-29 (56 figures across 34 scanned pages; 70 bibliography
  entries, fully transcribed).

## technical_merged.json (139 entries: 80 Florentine, 59 Borgia)

- Approximately 4 Borgia entries from the original pre-merge notebook
  transcription were not recovered when the file was reconstructed
  (documented gap from the 2026-06-22 merge). Flagged pending spot-check
  against the physical field notebook.
- 3 panels (24, 67, 68) have entries drawn from the original citation-verified
  seed set rather than the fuller 2026-08-29 notebook transcription, to avoid
  duplicating/conflicting descriptions of the same evidence. The fuller
  descriptions for these three panels are preserved in
  `technical_notes_borgia.json` if needed for reference.

## codicology_vol1.json (Florentine Codex, Vol. I — 362 entries)

Five folio readings flagged `"check"`, pending physical notebook verification
(no re-scanning needed):
- f. 80 — uncertain reading (RLS notation)
- f. 121 — uncertain reading (RLS notation)
- f. 296 — Cursivo ambiguity
- f. 332 — CCM suffix meaning unclear
- f. 334 — CCM suffix meaning unclear

## codicology_borgia.json (Codex Borgia — 76 panel entries, new 2026-08-29)

- First codicological census for the Borgia side of the project, built
  entirely from the 2000 field notebook (`Codex_Borgia_notes.pdf`). Coverage
  is only as complete as the original examination sessions — panels the
  notebook covered lightly (44, 45, 71 in particular) have thinner records
  than others.
- 12 panels flagged `"check"`: 3, 4, 19, 27, 28, 32, 39, 45, 55, 57, 68, 71 —
  these reflect grouped/shared notebook entries where per-panel attribution
  was inferred rather than stated explicitly. Worth verifying against the
  physical notebook before treating as final.
- No watermark field exists for this manuscript (pre-Conquest deerskin
  screenfold, not paper) — fields instead cover hide joins, holes, staining,
  grid system, and priming, as the deerskin equivalent.

## Notebook scan file naming

- `Florentine_codex_vol_I/II/III_notes.pdf` and the corresponding
  `_watermarks.pdf` files are zip archives of JPEG scans saved with a `.pdf`
  extension rather than true PDFs. Left as-is for now; worth renaming with a
  correct extension (or converting to true PDF) before long-term archival.

## Comparative essay

- The full comparative argument drawing on both the Borgia and Florentine
  physical descriptions (Chs. 2–3 of the thesis) remains unpublished — a
  potential follow-up article, not yet started.
