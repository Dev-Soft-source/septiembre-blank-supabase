
interface ValidationResult {
  isValid: boolean;
  error?: string;
  data?: {
    bookingId?: string;
    userId?: string;
    hotelId?: string;
    checkIn?: string;
    checkOut?: string;
  };
}

export async function validateBookingRequest(req: Request): Promise<ValidationResult> {
  // Check HTTP method
  if (req.method !== "GET" && req.method !== "POST") {
    return {
      isValid: false,
      error: `Method ${req.method} not allowed. Use GET or POST.`
    };
  }

  let params: any = {};

  // Extract parameters based on request method
  if (req.method === "GET") {
    const url = new URL(req.url);
    params = {
      bookingId: url.searchParams.get("booking_id"),
      userId: url.searchParams.get("user_id"),
      hotelId: url.searchParams.get("hotel_id"),
      checkIn: url.searchParams.get("check_in"),
      checkOut: url.searchParams.get("check_out"),
    };
  } else if (req.method === "POST") {
    try {
      const contentType = req.headers.get("content-type");
      if (contentType && !contentType.includes("application/json")) {
        return {
          isValid: false,
          error: "Content-Type must be application/json for POST requests"
        };
      }
      
      params = await req.json();
    } catch (error) {
      return {
        isValid: false,
        error: "Invalid JSON in request body"
      };
    }
  }

  // Validate that at least one identifier is provided
  const { bookingId, userId, hotelId, checkIn, checkOut } = params;
  
  if (!bookingId && !userId && !hotelId) {
    return {
      isValid: false,
      error: "At least one of booking_id, user_id, or hotel_id must be provided"
    };
  }

  // Validate date formats if provided
  if (checkIn && !isValidDate(checkIn)) {
    return {
      isValid: false,
      error: "Invalid check_in date format. Use YYYY-MM-DD."
    };
  }

  if (checkOut && !isValidDate(checkOut)) {
    return {
      isValid: false,
      error: "Invalid check_out date format. Use YYYY-MM-DD."
    };
  }

  // Validate date logic
  if (checkIn && checkOut) {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    if (checkOutDate <= checkInDate) {
      return {
        isValid: false,
        error: "check_out date must be after check_in date"
      };
    }
  }

  // All validations passed
  return { 
    isValid: true, 
    data: { bookingId, userId, hotelId, checkIn, checkOut }
  };
}

function isValidDate(dateString: string): boolean {
  // Check format YYYY-MM-DD
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) {
    return false;
  }
  
  // Check if it's a valid date
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}
