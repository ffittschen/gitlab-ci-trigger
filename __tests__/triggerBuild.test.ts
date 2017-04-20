import * as request from "supertest"
import App from "../src/App"

const secret = "123456789"
const app = new App(secret).express

describe("GitLab CI Trigger API", () => {
  const xGitlabToken = { "X-Gitlab-Token": secret }
  const mrTriggerHead = { "X-Gitlab-Event": "Merge Request Hook" }
  process.env.GitlabTriggerToken = "trigger123456"

  describe("GET /v1/triggerBuildOnMR", () => {
    it("should return 404 on GET", () => {
      return request(app).get("/v1/triggerBuildOnMR")
      .set(xGitlabToken)
      .expect(404)
    })
  })

  describe("POST /v1/triggerBuildOnMR - trigger build on merge request", () => {
    const webhookBody = {
      object_kind: "merge_request",
      object_attributes: {
        id: 99,
        target_branch: "master",
        source_branch: "ms-viewport",
        source_project_id: 14,
        target_project_id: 14,
        iid: 1,
      },
    }

    it("should accept and trigger a build", () => {
      return request(app).post("/v1/triggerBuildOnMR")
      .set(xGitlabToken)
      .set(mrTriggerHead)
      .send(webhookBody)
      .then((res) => {
        expect(res.status).toBe(200)
        expect(res.body.url).toBe("https://gitlab.com/api/v4/projects/14/trigger/pipeline")
        expect(res.body.form.ref).toBe("ms-viewport")
        expect(res.body.form.token).toBe("trigger123456")
        expect(res.body.form.variables.CI_MERGE_REQUEST_ID).toBe(1)
      })
    })
    it("should reject post w/o X-Gitlab-Token", () => {
      return request(app).post("/v1/triggerBuildOnMR")
      .set(mrTriggerHead)
      .send(webhookBody)
      .then((res) => {
        expect(res.status).toBe(401)
      })
    })
    it("should reject post with wrong X-Gitlab-Event", () => {
      const badEvents = [
        { "X-Gitlab-Event": "Push Hook" },
        { "X-Gitlab-Event": "Note Hook" },
        { "X-Gitlab-Event": "Issue Hook" },
      ]
      return Promise.all(badEvents.map(badEvent => {
        return request(app).post("/v1/triggerBuildOnMR")
        .set(xGitlabToken)
        .set(badEvent)
        .send(webhookBody)
        .then((res) => {
          expect(res.status).toBe(400)
          expect(res.text.startsWith("Bad Request")).toBe(true)
        })
      }))
    })
    it("should reject post with wrong body", () => {
      const badBodies = [
        null,
        { wrong_element: true },
        { object_kind: "push" },
      ]
      return Promise.all(badBodies.map(badBody => {
        return request(app).post("/v1/triggerBuildOnMR")
        .set(xGitlabToken)
        .set(mrTriggerHead)
        .send(badBody)
        .then((res) => {
          expect(res.status).toBe(400)
          expect(res.text.startsWith("Bad Request")).toBe(true)
        })
      }))
    })
  })

})
