import { useId } from 'react'
import { countryFeature, riverFeatures, stateFeatures, type Geometry, type Position } from '../data/mapData'
import { layerMeta, resourceMarkers, type LayerId, type PerspectiveId, type ResourceMarker } from '../data/resourceData'
import { ResourceIcon } from './ResourceIcon'

type Props = {
  enabledLayers: Set<LayerId>
  perspective: PerspectiveId
  emphasis: LayerId[]
  selectedMarkerId?: string
  selectedRegion?: string
  onMarkerSelect: (marker: ResourceMarker) => void
  onRegionSelect: (region: string) => void
}

const width = 760
const height = 920
const bounds = { west: 91.6, east: 101.45, south: 9.15, north: 28.85 }

function project([longitude, latitude]: Position): [number, number] {
  const x = 46 + ((longitude - bounds.west) / (bounds.east - bounds.west)) * (width - 92)
  const y = 34 + ((bounds.north - latitude) / (bounds.north - bounds.south)) * (height - 68)
  return [x, y]
}

function linePath(points: Position[], close = false) {
  if (!points.length) return ''
  return points.map((point, index) => {
    const [x, y] = project(point)
    return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ') + (close ? ' Z' : '')
}

function geometryPath(geometry: Geometry) {
  if (geometry.type === 'Polygon') {
    return (geometry.coordinates as Position[][]).map((ring) => linePath(ring, true)).join(' ')
  }
  if (geometry.type === 'MultiPolygon') {
    return (geometry.coordinates as Position[][][]).flatMap((polygon) => polygon.map((ring) => linePath(ring, true))).join(' ')
  }
  if (geometry.type === 'LineString') {
    return linePath(geometry.coordinates as Position[])
  }
  return (geometry.coordinates as Position[][]).map((line) => linePath(line)).join(' ')
}

function activate(event: React.KeyboardEvent, callback: () => void) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    callback()
  }
}

export function AtlasMap({ enabledLayers, emphasis, selectedMarkerId, selectedRegion, onMarkerSelect, onRegionSelect }: Props) {
  const id = useId().replace(/:/g, '')
  const countryPath = geometryPath(countryFeature.geometry)
  const markerGroups = resourceMarkers.filter((marker) => enabledLayers.has(marker.layer))

  return (
    <div className="map-frame" aria-label="Interactive map of Myanmar natural-resource locations">
      <div className="map-corner map-corner--top" aria-hidden="true" />
      <div className="map-corner map-corner--bottom" aria-hidden="true" />
      <svg className="atlas-map" viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby={`${id}-title ${id}-desc`}>
        <title id={`${id}-title`}>Myanmar natural-resource atlas</title>
        <desc id={`${id}-desc`}>A recognizable map of Myanmar with selectable state and region boundaries, major rivers, and approximate resource-area markers.</desc>
        <defs>
          <linearGradient id={`${id}-sea`} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#b8d9d3" />
            <stop offset=".55" stopColor="#91c2c1" />
            <stop offset="1" stopColor="#75aeb2" />
          </linearGradient>
          <linearGradient id={`${id}-land`} x1="0" x2=".8" y1="0" y2="1">
            <stop offset="0" stopColor="#e9d8a3" />
            <stop offset=".48" stopColor="#d9c686" />
            <stop offset="1" stopColor="#c9ae6f" />
          </linearGradient>
          <linearGradient id={`${id}-mountain`} x1="0" x2="1">
            <stop offset="0" stopColor="#6e8863" stopOpacity=".08" />
            <stop offset="1" stopColor="#435d4b" stopOpacity=".62" />
          </linearGradient>
          <pattern id={`${id}-paper`} width="7" height="7" patternUnits="userSpaceOnUse">
            <rect width="7" height="7" fill="transparent" />
            <rect width="1.2" height="1.2" x="1" y="1" fill="#fff" opacity=".12" />
            <rect width="1" height="1" x="5" y="4" fill="#173d3a" opacity=".1" />
          </pattern>
          <pattern id={`${id}-farm`} width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(14)">
            <rect width="16" height="16" fill="#ddb653" opacity=".5" />
            <path d="M0 4h16M0 12h16" stroke="#8e6d2d" strokeWidth="1" opacity=".42" />
          </pattern>
          <pattern id={`${id}-forest`} width="24" height="22" patternUnits="userSpaceOnUse">
            <path d="m6 2 5 8H8l4 6H1l4-6H2l4-8Zm12 5 4 7h-3l3 5h-9l3-5h-2l4-7Z" fill="#315f42" opacity=".52" />
          </pattern>
          <filter id={`${id}-shadow`} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#173d3a" floodOpacity=".32" />
          </filter>
          <clipPath id={`${id}-country`}><path d={countryPath} /></clipPath>
        </defs>

        <rect width={width} height={height} rx="28" fill={`url(#${id}-sea)`} />
        <g className="sea-lines" aria-hidden="true">
          {[140, 230, 320, 410, 500, 590, 680, 770, 860].map((y) => <path key={y} d={`M18 ${y} C150 ${y - 22}, 250 ${y + 20}, 388 ${y} S620 ${y - 15}, 742 ${y + 4}`} />)}
        </g>
        <text className="sea-label" x="75" y="475" transform="rotate(-78 75 475)">BAY OF BENGAL</text>
        <text className="sea-label sea-label--small" x="652" y="725" transform="rotate(-72 652 725)">ANDAMAN SEA</text>

        <path d={countryPath} fill={`url(#${id}-land)`} stroke="#173d3a" strokeWidth="5" strokeLinejoin="round" filter={`url(#${id}-shadow)`} />

        <g clipPath={`url(#${id}-country)`} aria-hidden="true">
          <rect width={width} height={height} fill={`url(#${id}-paper)`} />
          <path d="M420 20 C610 140 555 300 690 430 C575 500 600 650 700 800 L760 0Z" fill={`url(#${id}-mountain)`} />
          <path d="M220 70 C300 190 240 280 310 410 C220 520 270 650 185 770 L70 920 L40 0Z" fill="#7b8d5a" opacity=".18" />
          {enabledLayers.has('farmland') && (
            <g className={`landscape-layer ${emphasis.includes('farmland') ? 'is-emphasized' : ''}`}>
              <ellipse cx="318" cy="570" rx="88" ry="190" fill={`url(#${id}-farm)`} transform="rotate(-7 318 570)" />
              <ellipse cx="284" cy="742" rx="118" ry="76" fill={`url(#${id}-farm)`} />
            </g>
          )}
          {enabledLayers.has('forests') && (
            <g className={`landscape-layer ${emphasis.includes('forests') ? 'is-emphasized' : ''}`}>
              <path d="M330 35 C520 36 575 140 552 260 C480 210 430 160 348 132Z" fill={`url(#${id}-forest)`} />
              <path d="M540 520 C650 580 660 800 560 900 L498 855 C570 730 515 650 540 520Z" fill={`url(#${id}-forest)`} />
              <path d="M175 180 C255 230 237 400 170 455 C120 352 142 258 175 180Z" fill={`url(#${id}-forest)`} />
            </g>
          )}
        </g>

        <g className="regions">
          {stateFeatures.map((feature) => {
            const name = String(feature.properties.name)
            const isSelected = selectedRegion === name
            return (
              <path
                key={name}
                d={geometryPath(feature.geometry)}
                className={`region ${isSelected ? 'is-selected' : ''}`}
                role="button"
                tabIndex={0}
                aria-label={`Open field note for ${name}`}
                aria-pressed={isSelected}
                onClick={() => onRegionSelect(name)}
                onKeyDown={(event) => activate(event, () => onRegionSelect(name))}
              />
            )
          })}
        </g>

        {enabledLayers.has('rivers') && (
          <g className={`rivers ${emphasis.includes('rivers') ? 'is-emphasized' : ''}`} clipPath={`url(#${id}-country)`}>
            {riverFeatures.map((feature, index) => <path key={`${feature.properties.name}-${index}`} d={geometryPath(feature.geometry)} />)}
          </g>
        )}

        <g className="place-labels" aria-hidden="true">
          <text x="425" y="162">KACHIN</text>
          <text x="252" y="335">SAGAING</text>
          <text x="518" y="405">SHAN</text>
          <text x="180" y="460">RAKHINE</text>
          <text x="310" y="727">AYEYARWADY</text>
          <text x="505" y="817">TANINTHARYI</text>
        </g>

        <g className="resource-markers">
          {markerGroups.map((marker) => {
            const [x, y] = project([marker.longitude, marker.latitude])
            const isSelected = selectedMarkerId === marker.id
            const isEmphasized = emphasis.includes(marker.layer)
            const color = layerMeta[marker.layer].color
            return (
              <g
                key={marker.id}
                className={`map-marker ${isSelected ? 'is-selected' : ''} ${isEmphasized ? 'is-emphasized' : 'is-muted'}`}
                transform={`translate(${x} ${y})`}
                role="button"
                tabIndex={0}
                aria-label={`Open field note: ${marker.name}`}
                aria-pressed={isSelected}
                onClick={() => onMarkerSelect(marker)}
                onKeyDown={(event) => activate(event, () => onMarkerSelect(marker))}
              >
                <circle className="marker-pulse" r="25" fill={color} />
                <circle className="marker-disc" r="18" fill="#fff4d8" stroke={color} strokeWidth="4" />
                <foreignObject x="-12" y="-12" width="24" height="24" pointerEvents="none">
                  <span className="marker-icon" style={{ color }}><ResourceIcon type={marker.layer} size={24} /></span>
                </foreignObject>
                <g className="marker-label" transform="translate(24 -12)">
                  <rect x="0" y="0" width={Math.max(64, marker.shortName.length * 8 + 18)} height="25" rx="7" />
                  <text x="9" y="17">{marker.shortName}</text>
                </g>
              </g>
            )
          })}
        </g>

        <g className="compass" transform="translate(676 88)" aria-hidden="true">
          <circle r="35" />
          <path d="M0-29 7-6 0 0-7-6Z" />
          <path d="M0 29 7 6 0 0-7 6Z" opacity=".35" />
          <text y="-40">N</text>
        </g>
        <g className="scale" transform="translate(42 865)" aria-hidden="true">
          <path d="M0 0h82M0-5v10M41-5v10M82-5v10" />
          <text x="0" y="20">0</text><text x="63" y="20">200 km</text>
        </g>
      </svg>
      <p className="map-caption">Illustrated reference map · Symbols show broad locations, not exact sites</p>
    </div>
  )
}
