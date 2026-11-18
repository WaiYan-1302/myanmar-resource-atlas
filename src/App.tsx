import { useMemo, useState } from 'react'
import { AtlasMap } from './components/AtlasMap'
import { InfoPanel } from './components/InfoPanel'
import { ResourceIcon } from './components/ResourceIcon'
import { layerMeta, mapDataNote, perspectives, resourceMarkers, sources, type LayerId, type PerspectiveId } from './data/resourceData'

const allLayers = Object.keys(layerMeta) as LayerId[]

function App() {
  const [enabledLayers, setEnabledLayers] = useState<Set<LayerId>>(() => new Set(allLayers))
  const [perspective, setPerspective] = useState<PerspectiveId>('exports')
  const [selectedMarkerId, setSelectedMarkerId] = useState<string>('shwe-gas')
  const [selectedRegion, setSelectedRegion] = useState<string>()
  const selectedMarker = useMemo(() => resourceMarkers.find((marker) => marker.id === selectedMarkerId), [selectedMarkerId])
  const perspectiveData = perspectives[perspective]
  const perspectiveSource = sources.find((source) => source.id === perspectiveData.sourceId)

  function toggleLayer(layer: LayerId) {
    setEnabledLayers((current) => {
      const next = new Set(current)
      if (next.has(layer)) {
        next.delete(layer)
        if (selectedMarker?.layer === layer) setSelectedMarkerId('')
      } else {
        next.add(layer)
      }
      return next
    })
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Myanmar Field Atlas home">
          <span className="brand-mark" aria-hidden="true"><span>✦</span></span>
          <span><strong>Myanmar</strong><small>Field Atlas</small></span>
        </a>
        <nav aria-label="Page sections">
          <a href="#atlas">Explore</a>
          <a href="#method">Method</a>
          <a href="#sources">Sources</a>
        </nav>
        <span className="edition">First edition · 2026</span>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="page-title">
          <div className="hero__copy">
            <p className="overline"><span>Illustrated atlas</span><span>Source-led</span><span>Approximate locations</span></p>
            <h1 id="page-title">A living map of land, water, work & extraction.</h1>
            <p className="hero__lede">Explore how Myanmar’s natural resources connect to exports, jobs, and daily life—without mistaking a symbol for a precise site, or a trade value for public revenue.</p>
          </div>
          <div className="hero__stamp" aria-hidden="true"><span>Eight</span><strong>map layers</strong><small>one connected landscape</small></div>
        </section>

        <section className="perspective-section" aria-labelledby="perspective-heading">
          <div className="perspective-tabs" role="group" aria-labelledby="perspective-heading">
            <span id="perspective-heading">Choose a perspective</span>
            <div>
              {(Object.keys(perspectives) as PerspectiveId[]).map((id) => (
                <button key={id} className={perspective === id ? 'active' : ''} aria-pressed={perspective === id} onClick={() => setPerspective(id)}>{perspectives[id].label}</button>
              ))}
            </div>
          </div>
          <article className="perspective-card">
            <div><span className="perspective-card__kicker">{perspectiveData.kicker}</span><h2>{perspectiveData.title}</h2></div>
            <p>{perspectiveData.body}</p>
            <a href={perspectiveSource?.url} target="_blank" rel="noreferrer"><strong>{perspectiveData.stat}</strong><span>{perspectiveSource?.organization} ↗</span></a>
          </article>
        </section>

        <section className="atlas-section" id="atlas" aria-labelledby="atlas-heading">
          <div className="section-heading">
            <div><span className="chapter">Chapter 01</span><h2 id="atlas-heading">Explore the resource landscape</h2></div>
            <p>Turn layers on and off. Select a symbol or region for a sourced field note.</p>
          </div>

          <div className="atlas-layout">
            <aside className="layer-panel" aria-label="Map layers">
              <div className="panel-heading"><span>Map layers</span><button onClick={() => setEnabledLayers(new Set(allLayers))}>Show all</button></div>
              <div className="layer-list">
                {allLayers.map((layer) => {
                  const enabled = enabledLayers.has(layer)
                  const meta = layerMeta[layer]
                  const emphasized = perspectiveData.emphasis.includes(layer)
                  return (
                    <button key={layer} className={`layer-toggle ${enabled ? 'is-on' : ''}`} aria-pressed={enabled} onClick={() => toggleLayer(layer)}>
                      <span className="layer-toggle__icon" style={{ color: meta.color }}><ResourceIcon type={layer} size={25} /></span>
                      <span><strong>{meta.label}</strong><small>{meta.description}</small></span>
                      {emphasized && <i title={`Emphasized in the ${perspectiveData.label} perspective`} aria-label="Emphasized in this perspective">✦</i>}
                      <span className="switch" aria-hidden="true"><span /></span>
                    </button>
                  )
                })}
              </div>
              <details className="how-to" open>
                <summary>How to read this map</summary>
                <p>Markers are approximate anchors. Region borders orient the reader. Painted forest and farm areas are explanatory textures, not inventories.</p>
                <p>The ✦ identifies layers emphasized by the current perspective.</p>
              </details>
            </aside>

            <AtlasMap
              enabledLayers={enabledLayers}
              perspective={perspective}
              emphasis={perspectiveData.emphasis}
              selectedMarkerId={selectedMarkerId}
              selectedRegion={selectedRegion}
              onMarkerSelect={(marker) => { setSelectedMarkerId(marker.id); setSelectedRegion(undefined) }}
              onRegionSelect={(region) => { setSelectedRegion(region); setSelectedMarkerId('') }}
            />

            <InfoPanel marker={selectedMarker} region={selectedRegion} perspective={perspective} />
          </div>

          <div className="legend" aria-label="Map legend">
            <strong>Legend</strong>
            <span><i className="legend-marker" />Approximate resource area</span>
            <span><i className="legend-boundary" />State / region boundary</span>
            <span><i className="legend-river" />Major river centerline</span>
            <span><i className="legend-wash" />Illustrative landscape wash</span>
          </div>
        </section>

        <section className="method-section" id="method" aria-labelledby="method-heading">
          <div className="method-intro"><span className="chapter">Chapter 02</span><h2 id="method-heading">Built for context, not certainty theater.</h2><p>{mapDataNote}</p></div>
          <div className="method-cards">
            <article><span>01</span><h3>Known</h3><p>Labels follow public reports from USGS, EITI, the World Bank, WITS, FAO, and Natural Earth.</p></article>
            <article><span>02</span><h3>Approximate</h3><p>Markers identify a field, district, town area, or state-scale concentration—never an invented precise mine coordinate.</p></article>
            <article><span>03</span><h3>Historical</h3><p>EITI’s detailed project locations describe FY 2017–2018. They are not evidence of current operation or territorial control.</p></article>
            <article><span>04</span><h3>Human</h3><p>Conflict, unsafe work, displacement, and environmental damage are material impacts, not game mechanics or rewards.</p></article>
          </div>
        </section>

        <section className="sources-section" id="sources" aria-labelledby="sources-heading">
          <div className="section-heading"><div><span className="chapter">Source shelf</span><h2 id="sources-heading">Read the evidence</h2></div><p>Direct links and data-year notes used by the field guide.</p></div>
          <div className="source-grid">
            {sources.map((source, index) => (
              <a key={source.id} href={source.url} target="_blank" rel="noreferrer" className="source-card">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div><strong>{source.organization}</strong><h3>{source.title}</h3><p>{source.note}</p><small>{source.date}</small></div>
                <i aria-hidden="true">↗</i>
              </a>
            ))}
          </div>
        </section>
      </main>

      <footer><div><span className="brand-mark" aria-hidden="true"><span>✦</span></span><p><strong>Myanmar Field Atlas</strong><br />A compact, source-led first edition.</p></div><p>Map geometry: Natural Earth, public domain.<br />Illustration and interface: original work.</p><a href="#top">Back to top ↑</a></footer>
    </div>
  )
}

export default App
