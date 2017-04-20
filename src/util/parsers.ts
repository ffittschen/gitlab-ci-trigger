export function parseMergeRequestBody(input: any): boolean {
  const requirements = [
    { key: "object_kind", type: "string" },
    { key: "object_attributes", type: "object" },
  ]
  return requirements.every((req) => {
    return input.hasOwnProperty(req.key) && typeof input[req.key] === req.type
  })
}
