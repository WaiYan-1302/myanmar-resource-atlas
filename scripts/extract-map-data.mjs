import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const sourceDir = process.argv[2] || path.join(os.tmpdir(), 'myanmar-atlas-natural-earth')
const output = path.resolve('src/data/mapData.ts')

const read = (name) => JSON.parse(fs.readFileSync(path.join(sourceDir, name), 'utf8'))
const countries = read('countries.geojson')
const states = read('states10.geojson')
const rivers = read('rivers10.geojson')

const sqSegmentDistance = (point, start, end) => {
  let x = start[0]
  let y = start[1]
  let dx = end[0] - x
  let dy = end[1] - y
  if (dx !== 0 || dy !== 0) {
    const t = ((point[0] - x) * dx + (point[1] - y) * dy) / (dx * dx + dy * dy)
    if (t > 1) { x = end[0]; y = end[1] }
    else if (t > 0) { x += dx * t; y += dy * t }
  }
  dx = point[0] - x
  dy = point[1] - y
  return dx * dx + dy * dy
}

function simplifyStep(points, first, last, toleranceSquared, simplified) {
  let maxDistance = toleranceSquared
  let index = 0
  for (let i = first + 1; i < last; i += 1) {
    const distance = sqSegmentDistance(points[i], points[first], points[last])
    if (distance > maxDistance) { index = i; maxDistance = distance }
  }
  if (maxDistance > toleranceSquared) {
    if (index - first > 1) simplifyStep(points, first, index, toleranceSquared, simplified)
    simplified.push(points[index])
    if (last - index > 1) simplifyStep(points, index, last, toleranceSquared, simplified)
  }
}

function simplifyLine(input, tolerance = 0.008, closed = false) {
  const rounded = input.map(([x, y]) => [Number(x.toFixed(4)), Number(y.toFixed(4))])
  const points = closed && rounded.length > 1 ? rounded.slice(0, -1) : rounded
  if (points.length <= 2) return rounded
  const simplified = [points[0]]
  simplifyStep(points, 0, points.length - 1, tolerance * tolerance, simplified)
  simplified.push(points[points.length - 1])
  if (closed) simplified.push(simplified[0])
  return simplified
}

function simplifyGeometry(geometry, tolerance) {
  if (geometry.type === 'Polygon') return { ...geometry, coordinates: geometry.coordinates.map((ring) => simplifyLine(ring, tolerance, true)) }
  if (geometry.type === 'MultiPolygon') return { ...geometry, coordinates: geometry.coordinates.map((polygon) => polygon.map((ring) => simplifyLine(ring, tolerance, true))) }
  if (geometry.type === 'LineString') return { ...geometry, coordinates: simplifyLine(geometry.coordinates, tolerance) }
  if (geometry.type === 'MultiLineString') return { ...geometry, coordinates: geometry.coordinates.map((line) => simplifyLine(line, tolerance)) }
  return geometry
}

const country = countries.features.find((feature) => feature.properties.ADM0_A3 === 'MMR')
if (!country) throw new Error('Myanmar was not found in the Natural Earth countries file.')

const stateFeatures = states.features
  .filter((feature) => feature.properties.adm0_a3 === 'MMR')
  .map((feature) => ({
    type: 'Feature',
    properties: {
      name: feature.properties.name,
      type: feature.properties.type_en || feature.properties.type,
      latitude: feature.properties.latitude,
      longitude: feature.properties.longitude,
    },
    geometry: simplifyGeometry(feature.geometry, 0.008),
  }))

const riverNames = new Set(['Ayeyarwady', 'Irrawaddy Delta', 'Chindwin', 'Salween'])
const riverFeatures = rivers.features
  .filter((feature) => riverNames.has(feature.properties.name))
  .map((feature) => ({
    type: 'Feature',
    properties: {
      name: feature.properties.name === 'Irrawaddy Delta' ? 'Ayeyarwady Delta' : feature.properties.name,
      nameEn: feature.properties.name_en,
    },
    geometry: simplifyGeometry(feature.geometry, 0.006),
  }))

const countryFeature = {
  type: 'Feature',
  properties: { name: 'Myanmar' },
  geometry: simplifyGeometry(country.geometry, 0.006),
}

const source = `// Generated from Natural Earth public-domain data.\n// Source: https://github.com/nvkelso/natural-earth-vector\n// License: https://www.naturalearthdata.com/about/terms-of-use/\n\nexport type Position = [number, number]\nexport type Geometry = { type: 'Polygon' | 'MultiPolygon' | 'LineString' | 'MultiLineString'; coordinates: unknown }\nexport type MapFeature = { type: 'Feature'; properties: Record<string, string | number | null>; geometry: Geometry }\n\nexport const countryFeature = ${JSON.stringify(countryFeature)} as MapFeature\nexport const stateFeatures = ${JSON.stringify(stateFeatures)} as MapFeature[]\nexport const riverFeatures = ${JSON.stringify(riverFeatures)} as MapFeature[]\n`

fs.mkdirSync(path.dirname(output), { recursive: true })
fs.writeFileSync(output, source)
console.log(`Wrote ${output} with ${stateFeatures.length} regions and ${riverFeatures.length} river features.`)
