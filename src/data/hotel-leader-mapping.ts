import { DEMO_LEADERS } from './demo-leaders';

// Mapping of hotel IDs to Group Leader data - using safe lookups to prevent module loading failures
export const HOTEL_LEADER_MAP: Record<string, typeof DEMO_LEADERS[0]> = {};

// Initialize mapping safely
const initializeMapping = () => {
  const leaders = {
    'sofia-ribeiro': DEMO_LEADERS.find(l => l.slug === 'sofia-ribeiro'), 
    'bruno-silva': DEMO_LEADERS.find(l => l.slug === 'bruno-silva'),
    'andrei-lucian': DEMO_LEADERS.find(l => l.slug === 'andrei-lucian'),
    'martina-bianchi': DEMO_LEADERS.find(l => l.slug === 'martina-bianchi'),
    'laura-campos': DEMO_LEADERS.find(l => l.slug === 'laura-campos'),
    'diego-mendez': DEMO_LEADERS.find(l => l.slug === 'diego-mendez'),
    'emma-williams': DEMO_LEADERS.find(l => l.slug === 'emma-williams'),
    'oliver-johnson': DEMO_LEADERS.find(l => l.slug === 'oliver-johnson'),
    'maya-chen': DEMO_LEADERS.find(l => l.slug === 'maya-chen'),
    'marcus-brown': DEMO_LEADERS.find(l => l.slug === 'marcus-brown'),
    'elena-rodriguez': DEMO_LEADERS.find(l => l.slug === 'elena-rodriguez'),
    'james-wilson': DEMO_LEADERS.find(l => l.slug === 'james-wilson'),
    'nina-petrov': DEMO_LEADERS.find(l => l.slug === 'nina-petrov'),
    'carlos-santos': DEMO_LEADERS.find(l => l.slug === 'carlos-santos'),
    'amira-hassan': DEMO_LEADERS.find(l => l.slug === 'amira-hassan'),
    'thomas-mueller': DEMO_LEADERS.find(l => l.slug === 'thomas-mueller'),
    'sophie-martin': DEMO_LEADERS.find(l => l.slug === 'sophie-martin')
  };

  // Distribute all 17 leaders across real hotel IDs from the database
  if (leaders['sofia-ribeiro']) {
    HOTEL_LEADER_MAP['788a32ff-b9d4-46e0-9a92-bb571178a933'] = leaders['sofia-ribeiro'];
  }
  if (leaders['bruno-silva']) {
    HOTEL_LEADER_MAP['e944f639-9af1-48a1-a6a7-8605bc466e28'] = leaders['bruno-silva'];
  }
  if (leaders['andrei-lucian']) {
    HOTEL_LEADER_MAP['497da7b1-86db-4883-ab5b-85d88263c69a'] = leaders['andrei-lucian'];
  }
  if (leaders['martina-bianchi']) {
    HOTEL_LEADER_MAP['a6cc5c07-fa3c-4f0d-acce-3f7ed78c6100'] = leaders['martina-bianchi'];
  }
  if (leaders['laura-campos']) {
    HOTEL_LEADER_MAP['ff075b77-b608-46fa-9ad5-c477c6b19729'] = leaders['laura-campos'];
  }
  if (leaders['diego-mendez']) {
    HOTEL_LEADER_MAP['ac98f132-251f-4165-b69f-78f493d740b6'] = leaders['diego-mendez'];
  }
  if (leaders['emma-williams']) {
    HOTEL_LEADER_MAP['e7230349-c4e3-45c9-a7a2-21f8a66b04b6'] = leaders['emma-williams'];
  }
  if (leaders['oliver-johnson']) {
    HOTEL_LEADER_MAP['f3aae399-efbb-448a-b112-167d24539da7'] = leaders['oliver-johnson'];
  }
  if (leaders['maya-chen']) {
    HOTEL_LEADER_MAP['9b866877-a0e6-4925-8378-f17a00631309'] = leaders['maya-chen'];
  }
  if (leaders['marcus-brown']) {
    HOTEL_LEADER_MAP['1f9a7d3e-be01-4ace-acf1-65ec44b3c4fa'] = leaders['marcus-brown'];
  }
  if (leaders['elena-rodriguez']) {
    HOTEL_LEADER_MAP['6ffcf504-8b60-456f-8564-8507a0714c3e'] = leaders['elena-rodriguez'];
  }
  if (leaders['james-wilson']) {
    HOTEL_LEADER_MAP['641d4443-fcce-4587-8b02-bcf001d01005'] = leaders['james-wilson'];
  }
  if (leaders['nina-petrov']) {
    HOTEL_LEADER_MAP['8ed05a9c-873c-4a7b-9770-dc82095cb134'] = leaders['nina-petrov'];
  }
  if (leaders['carlos-santos']) {
    HOTEL_LEADER_MAP['d4404dc8-4c2a-4162-9e44-f7d862905795'] = leaders['carlos-santos'];
  }
  if (leaders['amira-hassan']) {
    HOTEL_LEADER_MAP['984d2175-8f38-439f-af06-052ef8d3f24a'] = leaders['amira-hassan'];
  }
  if (leaders['thomas-mueller']) {
    HOTEL_LEADER_MAP['56974c55-9293-46ec-903e-45b26e8b5c11'] = leaders['thomas-mueller'];
  }
  if (leaders['sophie-martin']) {
    HOTEL_LEADER_MAP['cf897d81-bd6f-4a75-afdf-b65a35a384de'] = leaders['sophie-martin'];
  }
};

// Initialize the mapping
try {
  initializeMapping();
} catch (error) {
  console.warn('Failed to initialize hotel leader mapping:', error);
}

export function getHotelLeader(hotelId: string) {
  return HOTEL_LEADER_MAP[hotelId] || null;
}