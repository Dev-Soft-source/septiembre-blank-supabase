
import { supabase } from "@/integrations/supabase/client";
import { GroupedFilters } from "./types";

export const fetchFiltersFromAPI = async (): Promise<GroupedFilters> => {
  const groupedFilters: GroupedFilters = {};

  try {
    // Fetch countries
    const { data: countries, error: countriesError } = await supabase
      .from('countries')
      .select('id, name')
      .order('name');

    if (!countriesError && countries) {
      groupedFilters.countries = countries.map(country => ({
        id: country.id,
        value: country.name
      }));
    }

    // Fetch activities
    const { data: activities, error: activitiesError } = await supabase
      .from('activities')
      .select('id, name')
      .order('name');

    if (!activitiesError && activities) {
      groupedFilters.activities = activities.map(activity => ({
        id: activity.id,
        value: activity.name
      }));
    }

    // Fetch affinities (themes)
    const { data: affinities, error: affinitiesError } = await supabase
      .from('affinities')
      .select('id, name')
      .order('name');

    if (!affinitiesError && affinities) {
      groupedFilters.affinities = affinities.map(affinity => ({
        id: affinity.id,
        value: affinity.name
      }));
    }

    return groupedFilters;
  } catch (error) {
    console.error('Error fetching filters:', error);
    throw error;
  }
};

export const addFilterToAPI = async (category: string, value: string) => {
  let tableName = '';
  let fieldName = 'name';
  
  switch (category) {
    case 'countries':
      tableName = 'countries';
      break;
    case 'activities':
      tableName = 'activities';
      break;
    case 'affinities':
      tableName = 'affinities';
      break;
    default:
      throw new Error(`Unsupported category: ${category}`);
  }

  // Check if a filter with this value already exists
  const { data: existingFilters } = await supabase
    .from(tableName)
    .select('id')
    .eq(fieldName, value)
    .limit(1);

  if (existingFilters && existingFilters.length > 0) {
    throw new Error("This filter already exists");
  }

  const { data, error } = await supabase
    .from(tableName)
    .insert([{ [fieldName]: value }])
    .select();

  if (error) {
    throw error;
  }

  return data && data.length > 0 ? data[0] : null;
};

export const updateFilterInAPI = async (id: string, category: string, newValue: string) => {
  let tableName = '';
  let fieldName = 'name';
  
  switch (category) {
    case 'countries':
      tableName = 'countries';
      break;
    case 'activities':
      tableName = 'activities';
      break;
    case 'affinities':
      tableName = 'affinities';
      break;
    default:
      throw new Error(`Unsupported category: ${category}`);
  }

  // Check for duplicates before updating
  const { data: existingFilters } = await supabase
    .from(tableName)
    .select('id')
    .eq(fieldName, newValue)
    .neq('id', id)
    .limit(1);

  if (existingFilters && existingFilters.length > 0) {
    throw new Error("This filter value already exists");
  }

  const { error } = await supabase
    .from(tableName)
    .update({ [fieldName]: newValue })
    .eq('id', id);

  if (error) {
    throw error;
  }

  return true;
};

export const deleteFilterFromAPI = async (id: string, category: string) => {
  let tableName = '';
  
  switch (category) {
    case 'countries':
      tableName = 'countries';
      break;
    case 'activities':
      tableName = 'activities';
      break;
    case 'affinities':
      tableName = 'affinities';
      break;
    default:
      throw new Error(`Unsupported category: ${category}`);
  }

  const { error } = await supabase
    .from(tableName)
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }

  return true;
};
