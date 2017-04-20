import * as bodyParser from "body-parser"
import * as express from "express"
import * as logger from "morgan"
import * as path from "path"
import TriggerRouter from "./routes/TriggerRouter"
import { validateHeader } from "./util/validators"

export default class App {

  public express: express.Application
  public secret: string

  constructor(secret: string) {
    this.express = express()
    this.secret = secret
    this.middleware()
    this.routes()
  }

  private middleware(): void {
    this.express.use(logger("dev"))
    this.express.use(validateHeader("X-Gitlab-Token", this.secret))
    this.express.use(bodyParser.json())
    this.express.use(bodyParser.urlencoded({ extended: false }))
  }

  private routes(): void {
    this.express.use("/v1/triggerBuildOnMR", TriggerRouter)
  }
}
