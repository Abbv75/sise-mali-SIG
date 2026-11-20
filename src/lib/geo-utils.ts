export function createInvertedGeoJSON(featureCollection: any) {
  if (!featureCollection || !featureCollection.features) return null

  // World bounds ring
  const worldRing = [
    [-180, 90],
    [-180, -90],
    [180, -90],
    [180, 90],
    [-180, 90]
  ]

  const invertedFeatures = featureCollection.features.map((feature: any) => {
    if (feature.geometry.type === 'Polygon') {
      return {
        ...feature,
        geometry: {
          type: 'Polygon',
          coordinates: [worldRing, ...feature.geometry.coordinates]
        }
      }
    } else if (feature.geometry.type === 'MultiPolygon') {
      const allRings: any[] = []
      feature.geometry.coordinates.forEach((polygon: any[]) => {
        polygon.forEach((ring: any) => {
          allRings.push(ring)
        })
      })

      return {
        ...feature,
        geometry: {
          type: 'Polygon',
          coordinates: [worldRing, ...allRings]
        }
      }
    }
    return feature
  })

  return {
    ...featureCollection,
    features: invertedFeatures
  }
}
