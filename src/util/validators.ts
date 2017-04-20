import { Request, Response } from "express"

export function validateHeader(header: string, expectedValue: string) {
  if (!header) {
    throw new Error("Error in headers middleware. Expected header to be a valid string")
  }

  return (req: Request, res: Response, next: any) => {
    const headerValue = req.header(header)

    if (headerValue !== undefined && expectedValue === headerValue) {
      return next()
    }

    return res.status(401)
    .send("Unauthorized")
  }
}
