# Data audit

Audit completed 18 November 2026. The editable claim registry in
src/data/resourceData.ts is the authoritative implementation record. Every
claim includes resource, location, text, value and unit where applicable,
period, direct source (through sourceId), page/table, evidence type, and a
limitation.

## Method

- Primary institutional sources were preferred: USGS, EITI, World Bank/WITS,
  GIA, and Natural Earth.
- Markers are explanatory label anchors, not exact mines, wells, concessions,
  parcels, forest boundaries, or territorial control.
- Current national estimates and historical project locations remain separate
  and separately dated.
- Perspectives do not rank unlike measures. Exports uses gross customs export
  value; Jobs uses employment share; Daily life is explicitly non-ranked.
- No chart existed in the prior interface. Its large perspective figures were
  audited as comparisons below.

## Verified and retained

| Prior item | Result |
|---|---|
| 2025 natural-gas exports of about US$3.06B | WITS product 271121 reports US$3,059,366.72K. It is now always labelled **gross export value**, never public revenue. |
| Shwe offshore near Rakhine / Kyaukpyu | Verified as historical in the EITI FY2017–18 oil-and-gas overview; marker is approximate. |
| Hpakant as a major Kachin jade area | Verified as historical in EITI Table 70. |
| Rare-earth extraction concentrated in Kachin | Verified at broad state level in USGS 2024; no precise site coordinate is used. |
| Myanmar at 7.1% of 2024 world rare-earth mine output | Verified as a USGS estimate; not presented as export share or revenue. |
| Man Maw as dominant tin context in eastern Shan | Verified in USGS 2024; end-2024 suspension/resource-audit status is disclosed. |
| Myanmar at 6.8% of 2024 world tin mine output | Verified as a USGS mine-output estimate. |
| Monywa / Letpadaung in Sagaing | Verified as historical in EITI Table 71; no current-operation claim. |
| Agriculture employed more than one-third of workers | Verified in World Bank December 2025, Special Focus p. 45 / Figure S.1; period is 2024. |
| Natural Earth geometry and public-domain status | Verified; exact source files remain in DATA_LICENSE.md. |
| Historical EITI data must not imply current control | Strengthened: Myanmar was delisted on 29 February 2024 and every EITI project card is dated historical. |

## Corrected or made more precise

| Prior wording or design | Correction |
|---|---|
| Eight layers | Expanded to ten with **Ruby & sapphire** and **Gold**. |
| One source per card | Replaced by claim-level citations, allowing different periods and sources without blending them. |
| One “significance” paragraph | Split into Where found, Extraction & use, Why it matters, and Limits, each with inline sources. |
| Generic forest card | Replaced by documented World Bank historical forest-cover trend and drivers. |
| One central-plains farmland cue | Split into Delta and Dry Zone cards using broad World Bank agroecological zones. |
| Rivers had lines but no cards | Added Ayeyarwady–Chindwin and Thanlwin cards; centerlines remain generalized. |
| Daily-life ecosystem claims cited the agriculture report | River and forest claims now use dedicated World Bank water and environment sources. |
| Generic “data year” | Cards now distinguish location year, estimate year, and report year. |
| Unlike resources emphasized together under Exports | Gas alone is emphasized; the UI states why other layers are not ranked. |
| Ecosystem layers emphasized as if they shared the Jobs metric | Farmland alone is emphasized because agriculture has the verified national employment share. |
| EITI 2017–18 shown without governance-status context | Added EITI’s 2024 delisting status and stronger historical warnings. |

## Removed

| Removed item | Reason |
|---|---|
| Any implication that US$3.06B gas exports are state income | WITS measures gross customs trade value only. |
| Any implied current status for EITI-listed projects | The detailed report is FY2017–18. |
| The prior FAO source shelf card | It did not support a specific quantitative UI claim; replacement forest claims use a directly linked World Bank analysis. |
| Export-view emphasis suggesting jade, rare earths, tin, and copper were comparable | No equally current, common export-value series was verified. |
| Jobs-view emphasis implying forest and river metrics matched agriculture | No comparable national employment-share series was verified. |
| Language that could celebrate extraction | Human and environmental damage is treated as impact and uncertainty, never reward. |

## Unavailable or deliberately not claimed

| Data gap | Treatment |
|---|---|
| Current comparable export values for all ten layers | No cross-resource export ranking. |
| Current comparable extractive employment shares | No extractive jobs ranking. |
| Current site-level gold output, jobs, or export value | Historical location + national USGS estimate + ASM under-coverage warning. |
| Current status of EITI FY2017–18 projects | Not claimed. |
| Precise mine, pit, wellhead, platform, concession, or control coordinates | Not mapped. |
| Current forest cover at painted areas | Not claimed; overlay is illustrative. |
| Parcel crops, tenure, yield, or planting status | Not claimed; zones are broad. |
| Live river flow, quality, flood risk, infrastructure, or allocation | Not claimed; lines are generalized. |
| A single Daily-life score | Rejected because the measures are heterogeneous. |

## Layer coverage after audit

| Layer | Cards | Principal evidence |
|---|---|---|
| Natural gas | Shwe offshore | WITS 2025; EITI FY2017–18 |
| Jade | Hpakant; Hkamti | EITI Table 70; USGS 2024 |
| Ruby & sapphire | Mogok; Mong Hsu | EITI Table 69; GIA 2019/2021 |
| Gold | Yamethin context | USGS 2024; EITI Table 71; EITI ASM guidance |
| Rare earths | Broad Kachin area | USGS 2024 |
| Tin | Man Maw; Heinda | USGS 2024; EITI Table 71 |
| Copper | Monywa / Letpadaung | USGS 2024; EITI Table 71 |
| Forests | Northern uplands; Tanintharyi | World Bank 2019 |
| Farmland | Delta; Central Dry Zone | World Bank 2024/2025 |
| Rivers | Ayeyarwady–Chindwin; Thanlwin | World Bank 2020; Natural Earth |

## Maintenance rule

Do not add a number or factual location directly to a React component. Add or
update a source, then a structured claim, then reference its claim ID from a
card or perspective. If a newer source changes a historical item, retain the
old period in this audit rather than silently overwriting it.
