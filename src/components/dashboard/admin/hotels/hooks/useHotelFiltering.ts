
import { useState, useMemo } from 'react';

export const useHotelFiltering = (hotels: any[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');

  const filteredHotels = useMemo(() => {
    return hotels.filter(hotel => {
      const matchesSearch = !searchTerm || 
        hotel.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.country?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = !statusFilter || hotel.status === statusFilter;
      const matchesCountry = !countryFilter || hotel.country === countryFilter;

      return matchesSearch && matchesStatus && matchesCountry;
    });
  }, [hotels, searchTerm, statusFilter, countryFilter]);

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    countryFilter,
    setCountryFilter,
    filteredHotels
  };
};
