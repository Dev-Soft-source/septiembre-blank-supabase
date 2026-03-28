
interface ValidationResult {
  isValid: boolean;
  error?: string;
  data?: {
    hotelId: string;
  };
}

export async function validateHotelRequest(req: Request): Promise<ValidationResult> {
  // Check HTTP method
  if (req.method !== "GET" && req.method !== "POST") {
    return {
      isValid: false,
      error: `Method ${req.method} not allowed. Use GET or POST.`
    };
  }

  let hotelId: string | null = null;

  // Extract hotel ID based on request method
  if (req.method === "GET") {
    const url = new URL(req.url);
    hotelId = url.searchParams.get("hotel_id") || url.searchParams.get("id");
  } else if (req.method === "POST") {
    try {
      const contentType = req.headers.get("content-type");
      if (contentType && !contentType.includes("application/json")) {
        return {
          isValid: false,
          error: "Content-Type must be application/json for POST requests"
        };
      }
      
      const body = await req.json();
      hotelId = body.hotel_id || body.id;
    } catch (error) {
      return {
        isValid: false,
        error: "Invalid JSON in request body"
      };
    }
  }

  // Validate hotel ID is provided
  if (!hotelId) {
    return {
      isValid: false,
      error: "Hotel ID is required. Provide 'hotel_id' or 'id' parameter."
    };
  }

  // Validate hotel ID format (should be UUID)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(hotelId)) {
    return {
      isValid: false,
      error: "Invalid hotel ID format. Must be a valid UUID."
    };
  }

  // All validations passed
  return { 
    isValid: true, 
    data: { hotelId }
  };
}
