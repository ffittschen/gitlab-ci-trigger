import { NextFunction, Request, Response, Router } from "express"
import request from "request"
import { parseMergeRequestBody } from "../util/parsers"
import { genTriggerURL } from "../util/urlGenerators"

export class TriggerRouter {
  router: Router

  constructor() {
    this.router = Router()
    this.init()
  }

  /**
   * Return a 404 on any GET
   */
  public getCatchAll(req: Request, res: Response, next: NextFunction) {
    res.sendStatus(404)
  }

  /**
   * Parse incoming data and call generated trigger URL
   */
  public post(req: Request, res: Response) {
    const isMergeRequestBody: boolean = parseMergeRequestBody(req.body)
    const newMergeRequestEvent = (isMergeRequestBody) ? req.body : null
    const triggerToken: string | null = process.env.GitlabTriggerToken
    const gitlabEvent: string = req.header("X-Gitlab-Event")

    if (triggerToken === null) {
      res.status(501).send("Trigger token not defined!")
      return
    }

    if (gitlabEvent !== "Merge Request Hook") {
      const eventName = gitlabEvent === undefined ? "no event hook" : "a " + gitlabEvent
      res.status(400).send("Bad Request. Received " + eventName + " instead of a Merge Request Hook")
      return
    }

    if (isMergeRequestBody) {
      const triggerURL = genTriggerURL(newMergeRequestEvent, triggerToken)
      res.status(200).json(triggerURL)

      console.log("Posting request to: " + triggerURL.url)
      request.post({url: triggerURL.url, form: triggerURL.form}, (err, response, body) => {
        if (err) {
          console.log(err)
          return
        }
        console.log("Trigger response: " + response.statusCode)
        console.log("Response body: " + body)
      })
      return
    } else {
      res.status(400).send("Bad Request. Could not parse message body.")
      return
    }
  }

  init() {
    this.router.get("/", this.getCatchAll)
    this.router.post("/", this.post)
  }

}

// Create the TriggerRouter, and export its configured Express.Router
const triggerRoutes = new TriggerRouter()
triggerRoutes.init()

export default triggerRoutes.router
