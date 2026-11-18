import { defaultRegionContext, layerMeta, regionContext, sources, type PerspectiveId, type ResourceMarker } from '../data/resourceData'
import { ResourceIcon } from './ResourceIcon'

type Props = {
  marker?: ResourceMarker
  region?: string
  perspective: PerspectiveId
}

function SourceLink({ sourceId }: { sourceId: string }) {
  const source = sources.find((item) => item.id === sourceId)
  if (!source) return null
  return (
    <a className="source-link" href={source.url} target="_blank" rel="noreferrer">
      <span>Open direct source</span>
      <span aria-hidden="true">↗</span>
    </a>
  )
}

export function InfoPanel({ marker, region, perspective }: Props) {
  if (marker) {
    const meta = layerMeta[marker.layer]
    const source = sources.find((item) => item.id === marker.sourceId)
    return (
      <aside className="field-guide" aria-live="polite" aria-label={`Field note for ${marker.name}`}>
        <div className="field-guide__eyebrow"><span style={{ color: meta.color }}><ResourceIcon type={marker.layer} size={23} /></span>{meta.label} · Field note</div>
        <h2>{marker.name}</h2>
        <p className="field-guide__location">{marker.location}</p>
        <dl className="field-guide__facts">
          <div><dt>Why it matters</dt><dd>{marker.significance}</dd></div>
          <div><dt>Data year</dt><dd>{marker.dataYear}</dd></div>
          <div><dt>Map certainty</dt><dd><span className="confidence">{marker.confidence}</span>{marker.uncertainty}</dd></div>
        </dl>
        {marker.caution && <p className="caution"><span aria-hidden="true">!</span>{marker.caution}</p>}
        <div className="source-stamp">
          <span>Source</span>
          <strong>{source?.organization}</strong>
          <small>{source?.date}</small>
        </div>
        <SourceLink sourceId={marker.sourceId} />
      </aside>
    )
  }

  if (region) {
    const context = regionContext[region] ?? defaultRegionContext
    const source = sources.find((item) => item.id === context.sourceId)
    return (
      <aside className="field-guide" aria-live="polite" aria-label={`Field note for ${region}`}>
        <div className="field-guide__eyebrow">State & region guide</div>
        <h2>{region}</h2>
        <p className="field-guide__location">Administrative orientation</p>
        <dl className="field-guide__facts">
          <div><dt>Why it matters</dt><dd>{context.significance}</dd></div>
          <div><dt>Data year</dt><dd>{context.dataYear}</dd></div>
          <div><dt>Map certainty</dt><dd>{context.uncertainty}</dd></div>
        </dl>
        <div className="source-stamp"><span>Source</span><strong>{source?.organization}</strong><small>{source?.date}</small></div>
        <SourceLink sourceId={context.sourceId} />
      </aside>
    )
  }

  return (
    <aside className="field-guide field-guide--empty">
      <div className="field-guide__eyebrow">Field guide · {perspective === 'dailyLife' ? 'Daily life' : perspective === 'jobs' ? 'Jobs' : 'Exports'}</div>
      <h2>Choose a place to begin</h2>
      <p>Select a resource symbol or a state/region on the map. Each note separates what the source says from what the illustration can show.</p>
      <div className="empty-compass" aria-hidden="true">✦</div>
      <p className="field-guide__hint">Keyboard: tab to a symbol or region, then press Enter or Space.</p>
    </aside>
  )
}
