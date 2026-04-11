import React, { useState } from 'react'
import { 
  MapPin, 
  Navigation,
  Clock,
  Truck,
  Dumbbell,
  Heart,
  Filter,
  List,
  Map as MapIcon
} from 'lucide-react'
import { mockLocations } from '../data/mockData'

const Locations = () => {
  const [viewMode, setViewMode] = useState('list') // 'list' or 'map'
  const [filter, setFilter] = useState('all') // 'all', 'gyms', 'dot-centers', 'truck-stops'
  
  const filteredLocations = mockLocations.filter(location => {
    if (filter === 'all') return true
    if (filter === 'gyms') return location.type === 'gym'
    if (filter === 'dot-centers') return location.type === 'dot-center'
    if (filter === 'truck-stops') return location.type === 'truck-stop'
    return true
  })

  const getTypeIcon = (type) => {
    switch (type) {
      case 'gym': return <Dumbbell size={20} style={{ color: '#2563eb' }} />
      case 'dot-center': return <Heart size={20} style={{ color: '#dc2626' }} />
      case 'truck-stop': return <Truck size={20} style={{ color: '#059669' }} />
      default: return <MapPin size={20} />
    }
  }

  const getTypeLabel = (type) => {
    switch (type) {
      case 'gym': return 'Gym'
      case 'dot-center': return 'DOT Physical'
      case 'truck-stop': return 'Truck Stop'
      default: return 'Location'
    }
  }

  return (
    <div className="screen">
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
          Nearby Locations
        </h1>
        <p style={{ color: '#6b7280' }}>
          Gyms, truck stops, and DOT physical centers
        </p>
      </header>

      {/* View Mode & Filter Controls */}
      <div style={{ marginBottom: '20px' }}>
        {/* View Mode Toggle */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <button
            onClick={() => setViewMode('list')}
            className={viewMode === 'list' ? 'btn-primary' : 'btn-secondary'}
            style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}
          >
            <List size={16} style={{ marginRight: '6px' }} />
            List
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={viewMode === 'map' ? 'btn-primary' : 'btn-secondary'}
            style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}
          >
            <MapIcon size={16} style={{ marginRight: '6px' }} />
            Map
          </button>
        </div>

        {/* Filter Buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { value: 'all', label: 'All' },
            { value: 'gyms', label: 'Gyms' },
            { value: 'dot-centers', label: 'DOT Centers' },
            { value: 'truck-stops', label: 'Truck Stops' }
          ].map(filterOption => (
            <button
              key={filterOption.value}
              onClick={() => setFilter(filterOption.value)}
              style={{
                padding: '6px 12px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                background: filter === filterOption.value ? '#2563eb' : 'white',
                color: filter === filterOption.value ? 'white' : '#374151',
                fontSize: '14px'
              }}
            >
              {filterOption.label}
            </button>
          ))}
        </div>
      </div>

      {/* Map View Placeholder */}
      {viewMode === 'map' && (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <MapIcon size={48} style={{ color: '#6b7280', marginBottom: '16px', margin: '0 auto' }} />
          <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Map View Coming Soon</h3>
          <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '20px' }}>
            Interactive map with truck-friendly routing will be available in the next update.
          </p>
          <p style={{ color: '#6b7280', fontSize: '12px' }}>
            {/* TODO: Integrate Google Maps or Mapbox */}
            TODO: Add Maps SDK integration
          </p>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div>
          {filteredLocations.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
              <p style={{ color: '#6b7280' }}>No locations found matching your filter.</p>
            </div>
          ) : (
            filteredLocations.map(location => (
              <LocationCard key={location.id} location={location} />
            ))
          )}
        </div>
      )}

      {/* Current Location Note */}
      <div style={{ 
        marginTop: '32px',
        padding: '16px',
        background: '#f3f4f6',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#6b7280'
      }}>
        <p>
          <strong>Note:</strong> Distances shown are from your current location. 
          {/* TODO: Add GPS location services */}
          GPS location services will be integrated in the next update.
        </p>
      </div>
    </div>
  )
}

const LocationCard = ({ location }) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case 'gym': return <Dumbbell size={20} style={{ color: '#2563eb' }} />
      case 'dot-center': return <Heart size={20} style={{ color: '#dc2626' }} />
      case 'truck-stop': return <Truck size={20} style={{ color: '#059669' }} />
      default: return <MapPin size={20} />
    }
  }

  const getTypeLabel = (type) => {
    switch (type) {
      case 'gym': return 'Gym'
      case 'dot-center': return 'DOT Physical Center'
      case 'truck-stop': return 'Truck Stop'
      default: return 'Location'
    }
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
            {getTypeIcon(location.type)}
            <span style={{ 
              marginLeft: '8px', 
              fontSize: '12px', 
              color: '#6b7280',
              textTransform: 'uppercase',
              fontWeight: '600'
            }}>
              {getTypeLabel(location.type)}
            </span>
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
            {location.name}
          </h3>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            {location.address}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '18px', fontWeight: '600', color: '#2563eb' }}>
            {location.distance} mi
          </p>
        </div>
      </div>

      {/* Amenities */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {location.amenities.map((amenity, index) => (
            <span
              key={index}
              style={{
                background: '#f3f4f6',
                color: '#374151',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px'
              }}
            >
              {amenity}
            </span>
          ))}
        </div>
      </div>

      {/* Special Notes */}
      {(location.notes || location.truckParkingNotes || location.hours) && (
        <div style={{ marginBottom: '16px', fontSize: '14px' }}>
          {location.notes && (
            <p style={{ color: '#374151', marginBottom: '4px' }}>
              <strong>Info:</strong> {location.notes}
            </p>
          )}
          {location.truckParkingNotes && (
            <p style={{ color: '#dc2626', marginBottom: '4px' }}>
              <strong>Parking:</strong> {location.truckParkingNotes}
            </p>
          )}
          {location.hours && (
            <p style={{ color: '#374151', marginBottom: '4px' }}>
              <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} />
              {location.hours}
            </p>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button 
          className="btn-primary"
          style={{ 
            flex: 1,
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}
          onClick={() => {
            window.open(
              `https://maps.google.com/?q=${encodeURIComponent(location.address)}`,
              '_blank',
              'noopener,noreferrer'
            )
          }}
        >
          <Navigation size={16} style={{ marginRight: '6px' }} />
          Navigate
        </button>
        <button 
          className="btn-secondary"
          onClick={() => {
            // TODO: Add to favorites/save location
            console.log(`Save location: ${location.name}`)
          }}
        >
          Save
        </button>
      </div>
    </div>
  )
}

export default Locations