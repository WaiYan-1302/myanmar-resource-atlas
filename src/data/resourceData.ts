export type LayerId = 'gas' | 'jade' | 'rareEarths' | 'tin' | 'copper' | 'forests' | 'farmland' | 'rivers'
export type PerspectiveId = 'exports' | 'jobs' | 'dailyLife'
export type Confidence = 'High' | 'Medium' | 'Broad area'

export type Source = {
  id: string
  title: string
  organization: string
  url: string
  date: string
  note?: string
}

export type ResourceMarker = {
  id: string
  name: string
  shortName: string
  layer: Exclude<LayerId, 'rivers'>
  longitude: number
  latitude: number
  location: string
  significance: string
  dataYear: string
  uncertainty: string
  confidence: Confidence
  sourceId: string
  caution?: string
}

export const sources: Source[] = [
  {
    id: 'usgs-2024',
    title: 'Burma: 2024 Minerals Yearbook data release',
    organization: 'U.S. Geological Survey',
    url: 'https://www.usgs.gov/centers/national-minerals-information-center/burma',
    date: '2024 data; published 2026',
    note: 'Mine-output estimates and broad production areas; some values are estimated.',
  },
  {
    id: 'eiti-2018',
    title: 'Myanmar EITI Reconciliation Report 2017–2018',
    organization: 'Extractive Industries Transparency Initiative',
    url: 'https://eiti.org/sites/default/files/attachments/meiti_reconciliation_report_2017-2018_final_signed_31st_march_2020.pdf',
    date: 'FY 2017–2018; published 2020',
    note: 'Historical disclosure. It does not describe present territorial control or current operations.',
  },
  {
    id: 'worldbank-2025',
    title: 'Myanmar Economic Monitor: Surviving, Not Thriving',
    organization: 'World Bank',
    url: 'https://documents1.worldbank.org/curated/en/099120625204042781/pdf/P507203-7c4662b6-c1d8-4c3c-9b0c-d4835f2763cb.pdf',
    date: 'December 2025',
    note: 'Agriculture accounted for more than one-third of total employment in 2024.',
  },
  {
    id: 'wits-2025',
    title: 'Myanmar natural gas exports by country, 2025',
    organization: 'World Integrated Trade Solution / UN Comtrade',
    url: 'https://wits.worldbank.org/trade/comtrade/en/country/MMR/year/2025/tradeflow/Exports/partner/ALL/product/271121',
    date: '2025 trade data',
    note: 'US$3.059 billion is gross export value, not government or public revenue.',
  },
  {
    id: 'fao-fra',
    title: 'Global Forest Resources Assessment 2020: Myanmar country report',
    organization: 'Food and Agriculture Organization of the United Nations',
    url: 'https://www.fao.org/forest-resources-assessment/past-assessments/fra-2020/country-reports/en',
    date: '2020 assessment',
    note: 'National forest reporting; the map overlay here is illustrative, not a forest inventory.',
  },
  {
    id: 'natural-earth',
    title: 'Natural Earth vector map data',
    organization: 'Natural Earth',
    url: 'https://www.naturalearthdata.com/about/terms-of-use/',
    date: 'Version 5.x; accessed November 2026',
    note: 'Public-domain 1:50m country and 1:10m administrative and river data.',
  },
]

export const layerMeta: Record<LayerId, { label: string; color: string; description: string }> = {
  gas: { label: 'Natural gas', color: '#2f7794', description: 'Offshore project context and export trade' },
  jade: { label: 'Jade', color: '#2f8060', description: 'Historical jade-producing areas' },
  rareEarths: { label: 'Rare earths', color: '#9d58a3', description: 'Broad extraction area, not mine coordinates' },
  tin: { label: 'Tin', color: '#b36b44', description: 'Man Maw district context' },
  copper: { label: 'Copper', color: '#c45537', description: 'Monywa and Letpadaung context' },
  forests: { label: 'Forests', color: '#487a47', description: 'Illustrative forest landscapes' },
  farmland: { label: 'Farmland', color: '#c59b3e', description: 'Illustrative farming heartlands' },
  rivers: { label: 'Rivers', color: '#4d91ad', description: 'Natural Earth major river centerlines' },
}

export const perspectives: Record<PerspectiveId, { label: string; kicker: string; title: string; body: string; stat: string; sourceId: string; emphasis: LayerId[] }> = {
  exports: {
    label: 'Exports',
    kicker: 'Perspective 01',
    title: 'Resources cross borders, but export value is not public revenue.',
    body: 'WITS records about US$3.06 billion in Myanmar gas exports in 2025. That is gross trade value. It should not be read as tax receipts, state income, or money available for public services.',
    stat: 'US$3.06B gross gas exports · 2025',
    sourceId: 'wits-2025',
    emphasis: ['gas', 'jade', 'rareEarths', 'tin', 'copper'],
  },
  jobs: {
    label: 'Jobs',
    kicker: 'Perspective 02',
    title: 'The widest livelihood footprint is in fields, farms, and food systems.',
    body: 'The World Bank estimates agriculture accounted for more than one-third of total employment in 2024. Extractive projects can shape local work, but comparable current employment data are uneven.',
    stat: '>⅓ of employment in agriculture · 2024',
    sourceId: 'worldbank-2025',
    emphasis: ['farmland', 'forests', 'rivers'],
  },
  dailyLife: {
    label: 'Daily life',
    kicker: 'Perspective 03',
    title: 'Water, land, and forests connect resource decisions to daily life.',
    body: 'Rivers support farms, transport, fisheries, and settlements. Forests hold ecological and livelihood value. Extraction can also bring displacement, pollution, unsafe work, and conflict—impacts this atlas treats as costs, never rewards.',
    stat: 'Look for connections, not a single score',
    sourceId: 'worldbank-2025',
    emphasis: ['rivers', 'farmland', 'forests', 'copper', 'jade', 'rareEarths'],
  },
}

export const resourceMarkers: ResourceMarker[] = [
  {
    id: 'shwe-gas', name: 'Shwe offshore gas project', shortName: 'Shwe', layer: 'gas', longitude: 92.75, latitude: 20.25,
    location: 'Offshore from Rakhine State, Bay of Bengal',
    significance: 'The historical EITI report identifies the A-1 and A-3 offshore blocks near Kyaukpyu. Gas is part of a national export trade that WITS values at about US$3.06B gross in 2025.',
    dataYear: 'Location: FY 2017–18 report · Trade context: 2025',
    uncertainty: 'The marker is an intentionally approximate offshore label anchor, not a wellhead or platform coordinate.',
    confidence: 'Broad area', sourceId: 'eiti-2018',
  },
  {
    id: 'hpakant-jade', name: 'Hpakant jade area', shortName: 'Hpakant', layer: 'jade', longitude: 96.32, latitude: 25.62,
    location: 'Hpakant area, Kachin State',
    significance: 'Myanmar EITI’s historical report identifies Hpakant as the predominant jadeite-producing area and records environmental-management work responding to damage from extraction.',
    dataYear: 'FY 2017–2018 (historical)',
    uncertainty: 'The marker represents a mining area around Hpakant, not an individual pit. Current activity and control are not inferred.',
    confidence: 'Medium', sourceId: 'eiti-2018',
    caution: 'Jade extraction has severe environmental and human consequences. The map does not score or gamify them.',
  },
  {
    id: 'kachin-rare-earths', name: 'Kachin rare-earth areas', shortName: 'Rare earths', layer: 'rareEarths', longitude: 97.95, latitude: 25.45,
    location: 'Broad area in Kachin State',
    significance: 'USGS reports that rare-earth extraction in 2024 was concentrated in Kachin State. Myanmar accounted for an estimated 7.1% of global rare-earth mine output that year.',
    dataYear: '2024 mine output',
    uncertainty: 'USGS describes a broad state-level concentration. This deliberately offset marker is not a mine coordinate and does not map control.',
    confidence: 'Broad area', sourceId: 'usgs-2024',
    caution: 'Reporting links extraction with conflict and serious environmental harm; those impacts are integral to interpreting the resource.',
  },
  {
    id: 'man-maw-tin', name: 'Man Maw tin district', shortName: 'Man Maw', layer: 'tin', longitude: 98.95, latitude: 22.55,
    location: 'Eastern Shan State / Wa Self-Administered Region',
    significance: 'USGS describes Man Maw as the country’s dominant tin mine and reports Myanmar at an estimated 6.8% of global tin mine output in 2024.',
    dataYear: '2024 mine output',
    uncertainty: 'The marker locates the district broadly. USGS reported production suspended for a resource audit at the end of 2024.',
    confidence: 'Broad area', sourceId: 'usgs-2024',
  },
  {
    id: 'monywa-copper', name: 'Monywa / Letpadaung copper', shortName: 'Monywa', layer: 'copper', longitude: 95.08, latitude: 22.1,
    location: 'Salingyi Township, Sagaing Region',
    significance: 'The historical EITI report describes four copper deposits in the Monywa district, including Letpadaung and the linked S&K operation.',
    dataYear: 'FY 2017–2018 report (historical)',
    uncertainty: 'The marker is a district-level anchor. It does not describe current production, ownership, access, or territorial control.',
    confidence: 'Medium', sourceId: 'eiti-2018',
    caution: 'Land, pollution, protest, and community impacts belong in any assessment of copper’s significance.',
  },
  {
    id: 'forest-landscapes', name: 'Forest landscapes', shortName: 'Forests', layer: 'forests', longitude: 98.45, latitude: 14.2,
    location: 'Representative southern landscape; forests occur across Myanmar',
    significance: 'Forests support biodiversity, climate regulation, and local livelihoods. This layer offers context, not timber-concession or forest-cover claims.',
    dataYear: 'FAO assessment: 2020',
    uncertainty: 'The painted overlay is illustrative and intentionally generalized; consult the FAO country report for national inventory data.',
    confidence: 'Broad area', sourceId: 'fao-fra',
  },
  {
    id: 'farming-heartlands', name: 'Farming heartlands', shortName: 'Farms', layer: 'farmland', longitude: 95.5, latitude: 18.7,
    location: 'Central plains and lower Ayeyarwady basin',
    significance: 'Agriculture accounted for more than one-third of total employment in 2024 and anchors food, income, and rural life.',
    dataYear: 'Employment share: 2024; report: 2025',
    uncertainty: 'The painted area is an explanatory landscape cue, not a parcel or crop map.',
    confidence: 'Broad area', sourceId: 'worldbank-2025',
  },
]

export const regionContext: Record<string, { significance: string; sourceId: string; dataYear: string; uncertainty: string }> = {
  Kachin: { significance: 'This atlas places jade and a broad rare-earth extraction area in Kachin State.', sourceId: 'usgs-2024', dataYear: '2024 minerals context', uncertainty: 'Boundaries are cartographic context; they do not show territorial control.' },
  Rakhine: { significance: 'Rakhine provides the coastal reference for the offshore Shwe gas project.', sourceId: 'eiti-2018', dataYear: 'FY 2017–2018 (historical)', uncertainty: 'The report is historical and does not establish current operations or control.' },
  Sagaing: { significance: 'Sagaing contains the Monywa / Letpadaung copper district shown in this release.', sourceId: 'eiti-2018', dataYear: 'FY 2017–2018 (historical)', uncertainty: 'The report is historical and the region boundary is not a mining boundary.' },
  Shan: { significance: 'Eastern Shan provides the broad context for the Man Maw tin district.', sourceId: 'usgs-2024', dataYear: '2024 minerals context', uncertainty: 'The atlas does not map current control or individual concessions.' },
  Ayeyarwady: { significance: 'The delta is one of Myanmar’s major farming landscapes and is shaped by the Ayeyarwady river system.', sourceId: 'worldbank-2025', dataYear: '2024 employment context', uncertainty: 'The farmland wash is illustrative, not a land-use inventory.' },
  Tanintharyi: { significance: 'The long southern peninsula provides context for forest landscapes and coastal livelihoods.', sourceId: 'fao-fra', dataYear: '2020 forest assessment', uncertainty: 'The forest wash is illustrative, not a forest-cover classification.' },
}

export const defaultRegionContext = {
  significance: 'This administrative area is shown to help readers orient resource locations and river systems.',
  sourceId: 'natural-earth',
  dataYear: 'Natural Earth v5.x',
  uncertainty: 'Boundaries are generalized for atlas-scale use and do not represent territorial control.',
}

export const mapDataNote = 'Country, state/region, and river geometry comes from Natural Earth public-domain datasets. Resource symbols are approximate explanatory anchors; they are not concession, mine, well, or control maps.'
