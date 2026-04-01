# Deferred Lines ARG — Solution Guide

## Story

The Office of Deferred Lines (ODL) is a continuity office that maintains internal records for
transit lines that were removed from public maps but never formally cancelled. Line 9, running
from Vantage Cross to Knoll End, was placed on Amber Retention — suspended from public service
but kept alive in the internal registry, encoded and waiting.

Players uncover the internal state of Line 9 and recover its reactivation phrase by navigating
official-looking advisory documents, discovering a hidden registry, and decoding a Service Key 9
transmission.

---

## Answer

**Terminal phrase:** `NINE-AMBER-LINE`

The terminal also accepts `NINE AMBER LINE` or `NINEAMBERLINE` (spaces and dashes are stripped).

---

## Puzzle chain (3 steps)

### Step 1 — Find the advisory

**Entry point:** players are linked to `/odl/status.html`

The status board shows Lines 1–9. Line 9 is highlighted in a faded red row:

> ⊘ SUSPENDED — ADV-094 →

Clicking `ADV-094 →` goes to `/odl/archive/advisory-094.html`.

Alternatively, the status page has an HTML comment visible to anyone who views source:

```html
<!-- Advisory records are archived at /odl/archive/index.html -->
```

`/odl/archive/index.html` lists all advisories; ADV-094 is highlighted and linked.

---

### Step 2 — Discover the hidden page

**Page:** `/odl/archive/advisory-094.html`

Players read the Line 9 suspension advisory. It reads formally and explains that:
- Line 9 is placed on **Amber Retention** (not cancelled)
- All transmissions are encoded with **Service Key 9**
- The Signal Codebook holds the decoding reference

Scrolling to **Appendix A**, players see:

> Retained registry key: **platform** **nine**

A second HTML comment is present in the source:

```html
<!-- Internal designations for retained registries follow lowercase hyphenated naming under /odl/hidden/ (/odl/hidden/platform-nine.html) -->
```

Combining the bold words and the comment, players navigate to `/odl/hidden/platform-nine.html`.

---

### Step 3 — Decode the transmission

**Page:** `/odl/hidden/platform-nine.html`

The hidden page confirms this is the "retained internal registry" for Line 9. It shows:

```
WRWN-JVKNA-URWN
```

With the instruction: "Decode using Service Key 9 — use the Signal Codebook."

Players open `/odl/records/signal-codebook.html`, which provides a clean two-column table:

| Encoded | Original |
|---------|----------|
| A | R |
| B | S |
| … | … |
| J | A |
| K | B |
| … | … |
| W | N |

Decoding `WRWN-JVKNA-URWN` letter by letter:

- W→N, R→I, W→N, N→E = **NINE**
- J→A, V→M, K→B, N→E, A→R = **AMBER**
- U→L, R→I, W→N, N→E = **LINE**

**Answer: `NINE-AMBER-LINE`**

Players enter this at `/odl/terminal/access.html`. The terminal accepts it and
unlocks `/odl/terminal/solved.html`.

---

## Pages involved

| Page | Role |
|------|------|
| `/odl/status.html` | Entry point — Line 9 suspension status |
| `/odl/archive/index.html` | Lists advisories; ADV-094 highlighted |
| `/odl/archive/advisory-094.html` | Main puzzle document; Appendix A has bold clue |
| `/odl/hidden/platform-nine.html` | Encoded transmission `WRWN-JVKNA-URWN` |
| `/odl/records/signal-codebook.html` | ROT-9 decode table (Service Key 9) |
| `/odl/terminal/access.html` | Passcode input |
| `/odl/terminal/solved.html` | Unlock page |
| `/odl/lines/line-9.html` | Background file on Line 9; plants "Amber" context |
| `/odl/archive/notice-317.html` | Transfer protocol atmospheric notice |

---

## Cipher reference

Service Key 9 is ROT-9 — each letter is shifted 9 positions forward in the alphabet to encode,
and 9 positions backward to decode. Dashes are literal separators and are not decoded.

Full decode table:

```
A→R  B→S  C→T  D→U  E→V  F→W  G→X  H→Y  I→Z
J→A  K→B  L→C  M→D  N→E  O→F  P→G  Q→H  R→I
S→J  T→K  U→L  V→M  W→N  X→O  Y→P  Z→Q
```

---

## Discord setup (owner actions)

1. Post the link `https://subwaybuildermodded.com/odl/status.html` in a channel.
2. No additional hints are needed — the puzzle chain is self-contained.
3. When a player submits the correct phrase at the terminal, they see a link to `solved.html`.
4. Award the associated Discord role to members who share their solved.html screenshot.

---

## Notes

- All pages are fully static (no server-side logic)
- The terminal validation runs entirely client-side in `js/terminal.js`
- The puzzle does not require any external tools — the Signal Codebook is provided in-world
- Dashes and spaces in the terminal input are stripped before comparison; any of
  `NINE-AMBER-LINE`, `NINE AMBER LINE`, `NINEAMBERLINE` are accepted


## Full intended story
The Office of Deferred Lines (ODL) is a hidden continuity office that maintained formal planning records for transit lines and stations that were never publicly shown, but were also never administratively canceled.

Public maps omitted deferred corridors by policy, while internal ledgers retained stations, transfer logic, and corridor IDs for contingency planning. The player community is asked to reconstruct the retained network logic from dry archival material and prove that deferred services remained continuously documented.

By the end, players recover the continuity phrase and unlock the terminal disclosure, confirming that omission never meant erasure.

## Pages and files involved

### Core pages
- /odl/index.html
- /odl/status.html
- /odl/bulletin.html

### Archive
- /odl/archive/index.html
- /odl/archive/memo-01.html
- /odl/archive/memo-02.html
- /odl/archive/survey-03.html
- /odl/archive/field-note-a.html
- /odl/archive/continuity-rationale.html
- /odl/archive/appendix-retention.html

### Records
- /odl/records/station-ledger.html
- /odl/records/signal-codes.html
- /odl/records/service-exceptions.html
- /odl/records/corridor-registry.html

### Lines
- /odl/lines/alpha.html
- /odl/lines/beta.html
- /odl/lines/gamma.html
- /odl/lines/delta.html

### Notices
- /odl/notices/notice-194.html
- /odl/notices/notice-207.html
- /odl/notices/notice-311.html

### Manifests
- /odl/manifests/car-assignment.html
- /odl/manifests/yard-transfer.html

### Hidden pages
- /odl/hidden/platformd.html
- /odl/hidden/c-table.html
- /odl/hidden/lower-concourse.html

### Terminal
- /odl/terminal/access.html
- /odl/terminal/solved.html

### Assets
- /odl/css/odl.css
- /odl/js/odl-common.js
- /odl/js/reveal.js
- /odl/js/route-trace.js
- /odl/js/terminal.js
- /odl/assets/txt/registry.txt
- /odl/assets/txt/revision-table.txt
- /odl/assets/diagrams/route-fragment.svg
- /odl/assets/scans/memo-scan-01.svg
- /odl/assets/pdf/continuity-brief-print.html
- /odl/assets/audio/README.txt

## Every clue and intended interpretation
1. Entry clue at status page:
- /odl/status.html has explicit links to archive and station ledger.
- Hidden HTML comment points to /odl/archive/index.html.

2. Archive directive:
- /odl/archive/memo-02.html states exact extraction method:
  - filter station ledger rows where Public Listing = Omitted and Transfer Allowed = Yes
  - take initials in listed order.

3. Station-ledger extraction:
- /odl/records/station-ledger.html filtered initials produce:
  - Pillar, Lattice, Aster, Tern, Forge, Oriole, Rook, Meridian, Dock
  - PLATFORMD
- Intended result: discover /odl/hidden/platformd.html.

4. Reconstruction rule chain:
- /odl/records/service-exceptions.html defines notice order and route tracing process.
- /odl/notices/notice-194.html says suppress public branch IDs where deferred exists.
- /odl/notices/notice-207.html forces transfer via Platform D.
- /odl/notices/notice-311.html applies deferred precedence in sectors C and F.

5. Transit pathing puzzle:
- /odl/lines/alpha.html gives C2 vs C4 in sector C -> choose C4.
- /odl/lines/gamma.html gives C3 vs C1 -> under Notice 194 choose deferred C1.
- /odl/lines/delta.html gives C5 vs C7 in sector F -> choose C7.
- Route trace sequence: C4 C1 C7.
- /odl/bulletin.html route console validates this sequence client-side.

6. Cross-file token derivation:
- /odl/hidden/c-table.html and /odl/records/corridor-registry.html map:
  - C4 -> DEFERRED
  - C1 -> KEY
  - C7 -> 311
- /odl/assets/txt/registry.txt confirms same mapping.
- Join with dashes: DEFERRED-KEY-311.

7. Terminal unlock:
- /odl/terminal/access.html validates passcode entirely client-side via /odl/js/terminal.js.
- Correct passcode reveals link to /odl/terminal/solved.html.

8. Final completion requirement:
- /odl/terminal/solved.html explicitly instructs users to upload an image in Discord showing solved dialogue for role claim.

## Complete solution path
1. Start at /odl/status.html.
2. Follow archive route to /odl/archive/index.html.
3. Read /odl/archive/memo-02.html and apply filter instructions on /odl/records/station-ledger.html.
4. Derive PLATFORMD and open /odl/hidden/platformd.html.
5. Use /odl/records/service-exceptions.html + notices 194/207/311 + line pages (alpha/gamma/delta).
6. Resolve corridor sequence: C4 C1 C7.
7. Use /odl/hidden/c-table.html and /odl/assets/txt/registry.txt to map tokens.
8. Build passcode: DEFERRED-KEY-311.
9. Enter passcode at /odl/terminal/access.html.
10. Open /odl/terminal/solved.html and claim role in Discord per instructions.

## All passwords/codes
- Hidden page phrase (derived): PLATFORMD
- Route trace sequence: C4 C1 C7
- Final terminal passcode: DEFERRED-KEY-311
- Alternate accepted terminal input: DEFERRED KEY 311

## Placeholders still needing owner-supplied assets
- /odl/assets/scans/memo-scan-01.svg is a faux placeholder scan.
- /odl/assets/diagrams/route-fragment.svg is a placeholder diagram.
- /odl/assets/pdf/continuity-brief-print.html is printable HTML, not a true PDF.
- /odl/assets/audio/README.txt is a placeholder location for optional audio clips.

## Owner actions required outside code
1. Post first Discord clue as a direct link to /odl/status.html.
2. If desired, add audio files into /odl/assets/audio/ and announce them as optional flavor.
3. If a real PDF is preferred, export /odl/assets/pdf/continuity-brief-print.html to PDF and store it in the same folder with a stable filename.
4. If you want phased reveals, only share status page first, then progressively share archive/bulletin hints over time.
5. When a player posts proof in Discord, verify they show solved dialogue and then assign the special role manually.
6. Keep passcode unchanged unless you intentionally rotate puzzle content and update all dependent clues.

## Release schedule suggestion
1. Day 1: Drop Discord teaser and link only /odl/status.html.
2. Day 2: If progress stalls, hint to inspect archive and station ledger extraction conditions.
3. Day 3: Hint notice precedence order 194 -> 207 -> 311.
4. Day 4: Hint that route trace result should be corridor IDs, not station names.
5. Day 5: Hint that C-table plus registry text creates dash-form terminal phrase.
6. Day 6+: Celebrate first solve publicly and encourage team-based solving.

## Discord copy
Use these exact or near-exact messages.

Initial drop message:
"Continuity audit mirror is open. Public status board only: https://subwaybuildermodded.com/odl/status.html"

Mid-event hint message:
"Deferred does not mean canceled. Check what remains omitted but transferable in internal records."

Late-event hint message:
"Apply notices in numeric order. Then convert corridor IDs into tokens before terminal entry."

Role-claim moderator reply template:
"Verified. You solved Deferred Lines. Assigning special role now."

## Optional future expansions
1. Add additional hidden shelf pages with alternate extraction chains and decoy registry IDs.
2. Add optional audio clues that repeat notice numbers and sector letters.
3. Add a second terminal endpoint for a post-solve epilogue phrase.
4. Rotate passcode seasonally by updating corridor-token mapping while preserving same structure.
5. Add printable stamp sheets or signed memo variants as collectible non-required clues.

## How to update or reveal later phases
- To reveal faster: link /odl/archive/index.html and /odl/bulletin.html directly from announcements.
- To keep difficulty high: only share status page and let players discover hidden shelf paths.
- To increase accessibility: share /odl/assets/diagrams/route-fragment.svg when players struggle with route tracing.
- To pivot into a second chapter: add new notices and point terminal success to another hidden directory.
