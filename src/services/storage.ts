import { Event } from '@/types/event';

const EVENTS_KEY = '@eventos-pira:events';
const VENUES_KEY = '@eventos-pira:venues';

export interface Venue {
  id: string;
  name: string;
  address: string;
  description: string;
  image: string;
  category: string;
  lat: number;
  lng: number;
}

// Events
export function getStoredEvents(): Event[] {
  try {
    const storedEvents = localStorage.getItem(EVENTS_KEY);
    return storedEvents ? JSON.parse(storedEvents) : [];
  } catch (error) {
    console.error('Error getting stored events:', error);
    return [];
  }
}

export function saveEvents(events: Event[]): void {
  try {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  } catch (error) {
    console.error('Error saving events:', error);
  }
}

// Venues
export function getStoredVenues(): Venue[] {
  try {
    const storedVenues = localStorage.getItem(VENUES_KEY);
    return storedVenues ? JSON.parse(storedVenues) : [];
  } catch (error) {
    console.error('Error getting stored venues:', error);
    return [];
  }
}

export function saveVenues(venues: Venue[]): void {
  try {
    localStorage.setItem(VENUES_KEY, JSON.stringify(venues));
  } catch (error) {
    console.error('Error saving venues:', error);
  }
}

// Helper functions
export function addEvent(event: Event): void {
  const events = getStoredEvents();
  events.push(event);
  saveEvents(events);
}

export function updateEvent(eventId: string, updatedEvent: Event): void {
  const events = getStoredEvents();
  const index = events.findIndex(e => e.id === eventId);
  if (index !== -1) {
    events[index] = updatedEvent;
    saveEvents(events);
  }
}

export function deleteEvent(eventId: string): void {
  const events = getStoredEvents();
  const filteredEvents = events.filter(e => e.id !== eventId);
  saveEvents(filteredEvents);
}

export function addVenue(venue: Venue): void {
  const venues = getStoredVenues();
  venues.push(venue);
  saveVenues(venues);
}

export function updateVenue(venueId: string, updatedVenue: Venue): void {
  const venues = getStoredVenues();
  const index = venues.findIndex(v => v.id === venueId);
  if (index !== -1) {
    venues[index] = updatedVenue;
    saveVenues(venues);
  }
}

export function deleteVenue(venueId: string): void {
  const venues = getStoredVenues();
  const filteredVenues = venues.filter(v => v.id !== venueId);
  saveVenues(filteredVenues);
} 