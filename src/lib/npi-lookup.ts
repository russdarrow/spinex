// NPI Registry API - Free public API from CMS (Centers for Medicare & Medicaid Services)
// https://npiregistry.cms.hhs.gov/api-page

export interface NPIResult {
  npi: string;
  name: string;
  credential: string;
  specialty: string;
  address: string;
  city: string;
  state: string;
  isValid: boolean;
}

export interface NPISearchParams {
  firstName?: string;
  lastName?: string;
  npiNumber?: string;
  state?: string;
}

export async function searchNPI(params: NPISearchParams): Promise<NPIResult[]> {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('version', '2.1');
    queryParams.append('enumeration_type', 'NPI-1'); // Individual providers only

    if (params.npiNumber) {
      queryParams.append('number', params.npiNumber);
    }
    if (params.firstName) {
      queryParams.append('first_name', params.firstName);
    }
    if (params.lastName) {
      queryParams.append('last_name', params.lastName);
    }
    if (params.state) {
      queryParams.append('state', params.state);
    }

    // Filter for spine-related specialties
    queryParams.append('taxonomy_description', 'Orthopaedic Surgery');

    const response = await fetch(
      `https://npiregistry.cms.hhs.gov/api/?${queryParams.toString()}`
    );

    if (!response.ok) {
      throw new Error('NPI lookup failed');
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return [];
    }

    return data.results.map((result: any) => {
      const basic = result.basic || {};
      const address = result.addresses?.[0] || {};
      const taxonomy = result.taxonomies?.[0] || {};

      return {
        npi: result.number || '',
        name: `${basic.first_name || ''} ${basic.last_name || ''}`.trim(),
        credential: basic.credential || '',
        specialty: taxonomy.desc || '',
        address: address.address_1 || '',
        city: address.city || '',
        state: address.state || '',
        isValid: true,
      };
    });
  } catch (error) {
    console.log('[NPI Lookup] Error:', error);
    return [];
  }
}

export async function verifyNPI(npiNumber: string): Promise<NPIResult | null> {
  const results = await searchNPI({ npiNumber });
  return results.length > 0 ? results[0] : null;
}
