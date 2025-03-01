import { supabase } from './supabase';

/**
 * Updates the user's login analytics
 * @param userId The user's ID
 * @param location Optional location information
 */
export async function updateLoginAnalytics(userId: string, location?: { city: string, country: string }) {
  try {
    const updateData: any = {
      last_login: new Date().toISOString(),
      login_count: supabase.rpc('increment', { row_id: userId, table_name: 'profiles', column_name: 'login_count' })
    };

    if (location) {
      updateData.last_location = `${location.city}, ${location.country}`;
    }

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId);

    if (error) throw error;
    
    console.log('Login analytics updated successfully');
  } catch (error) {
    console.error('Error updating login analytics:', error);
  }
}

/**
 * Gets the user's location based on their IP address
 * Uses ipinfo.io API
 */
export async function getLoginLocation() {
  try {
    const response = await fetch('https://ipinfo.io/json?token=YOUR_API_KEY');
    if (!response.ok) throw new Error('Failed to fetch location data');
    
    const data = await response.json();
    return { 
      city: data.city || 'Unknown', 
      country: data.country || 'Unknown', 
      ip: data.ip 
    };
  } catch (error) {
    console.error('Error getting login location:', error);
    return { city: 'Unknown', country: 'Unknown', ip: 'Unknown' };
  }
}

/**
 * Detects suspicious logins based on location changes
 * @param userId The user's ID
 */
export async function detectSuspiciousLogin(userId: string) {
  try {
    // Get current login location
    const newLoginLocation = await getLoginLocation();
    
    // Fetch last known location from database
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('last_location')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    const currentLocation = `${newLoginLocation.city}, ${newLoginLocation.country}`;
    
    // Check if location has changed
    if (profile?.last_location && profile.last_location !== currentLocation) {
      console.warn('Suspicious login detected! New location:', currentLocation);
      // Here you could implement additional security measures like 2FA
      return true;
    }
    
    // Update location in database
    await updateLoginAnalytics(userId, newLoginLocation);
    return false;
  } catch (error) {
    console.error('Error detecting suspicious login:', error);
    return false;
  }
}