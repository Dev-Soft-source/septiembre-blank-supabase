
interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export async function validateAffinityRequest(req: Request): Promise<ValidationResult> {
  // Check HTTP method
  if (req.method !== "GET" && req.method !== "POST") {
    return {
      isValid: false,
      error: `Method ${req.method} not allowed. Use GET or POST.`
    };
  }

  // Check content type for POST requests
  if (req.method === "POST") {
    const contentType = req.headers.get("content-type");
    if (contentType && !contentType.includes("application/json")) {
      return {
        isValid: false,
        error: "Content-Type must be application/json for POST requests"
      };
    }
  }

  // Validate query parameters for GET requests
  if (req.method === "GET") {
    const url = new URL(req.url);
    const limit = url.searchParams.get("limit");
    
    if (limit) {
      const limitNum = parseInt(limit);
      if (isNaN(limitNum) || limitNum < 1 || limitNum > 1000) {
        return {
          isValid: false,
          error: "Limit parameter must be a number between 1 and 1000"
        };
      }
    }
  }

  // All validations passed
  return { isValid: true };
}
