import { claimById, defaultRegionContext, layerMeta, regionContext, sourceById, type Claim, type PerspectiveId, type ResourceMarker } from '../data/resourceData'
import { ResourceIcon } from './ResourceIcon'

type Props = { marker?: ResourceMarker; region?: string; perspective: PerspectiveId }

function Citation({ claim }: { claim: Claim }) {
  const source = sourceById[claim.sourceId]
  return <a className="claim-citation" href={source.url} target="_blank" rel="noreferrer" title={source.title + ' — ' + claim.pageTable}>{source.organization} · {claim.period} ↗</a>
}

function Evidence({ claimIds }: { claimIds: string[] }) {
  const unique = [...new Set(claimIds)].map((id) => claimById[id]).filter(Boolean)
  return (
    <ul className="evidence-list" aria-label="Evidence for this field note">
      {unique.map((claim) => (
        <li key={claim.id}>
          <p>{claim.claim} <Citation claim={claim} /></p>
          <small><strong>{claim.evidenceType}</strong> · {claim.pageTable} · Limitation: {claim.limitation}</small>
        </li>
      ))}
    </ul>
  )
}

export function InfoPanel({ marker, region, perspective }: Props) {
  if (marker) {
    const meta = layerMeta[marker.layer]
    const allClaimIds = marker.sections.flatMap((item) => item.claimIds)
    return (
      <aside className="field-guide" aria-live="polite" aria-label={'Field note for ' + marker.name}>
        <div className="field-guide__eyebrow"><span style={{ color: meta.color }}><ResourceIcon type={marker.layer} size={23} /></span>{meta.label} · Field note</div>
        <h2>{marker.name}</h2>
        <p className="field-guide__location">{marker.location}</p>
        <dl className="field-guide__facts">
          {marker.sections.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.text} {item.claimIds.map((id) => <Citation key={id} claim={claimById[id]} />)}</dd></div>)}
          <div><dt>Data period</dt><dd>{marker.dataYear}</dd></div>
          <div><dt>Map certainty</dt><dd><span className="confidence">{marker.confidence}</span>{marker.uncertainty}</dd></div>
        </dl>
        {marker.caution && <p className="caution"><span aria-hidden="true">!</span>{marker.caution}</p>}
        <details className="evidence-drawer">
          <summary>Evidence details ({new Set(allClaimIds).size})</summary>
          <Evidence claimIds={allClaimIds} />
        </details>
      </aside>
    )
  }

  if (region) {
    const context = regionContext[region] ?? defaultRegionContext
    return (
      <aside className="field-guide" aria-live="polite" aria-label={'Field note for ' + region}>
        <div className="field-guide__eyebrow">State & region guide</div>
        <h2>{region}</h2>
        <p className="field-guide__location">Administrative orientation</p>
        <dl className="field-guide__facts">
          <div><dt>Why it matters</dt><dd>{context.text} {context.claimIds.map((id) => <Citation key={id} claim={claimById[id]} />)}</dd></div>
          <div><dt>Data period</dt><dd>{context.dataYear}</dd></div>
          <div><dt>Map certainty</dt><dd>{context.uncertainty}</dd></div>
        </dl>
        <Evidence claimIds={context.claimIds} />
      </aside>
    )
  }

  return (
    <aside className="field-guide field-guide--empty">
      <div className="field-guide__eyebrow">Field guide · {perspective === 'dailyLife' ? 'Daily life' : perspective === 'jobs' ? 'Jobs' : 'Exports'}</div>
      <h2>Choose a place to begin</h2>
      <p>Select a resource symbol or a state/region. Every factual note links to its exact source and records its time period and limitation.</p>
      <div className="empty-compass" aria-hidden="true">✦</div>
      <p className="field-guide__hint">Keyboard: tab to a symbol or region, then press Enter or Space.</p>
    </aside>
  )
}
