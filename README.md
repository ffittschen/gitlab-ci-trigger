# GitLab CI Trigger

This is a simple [Node.js] + [express] API written in [TypeScript],
that mainly acts as a workaround to enable [Danger] to be run on
GitLab CI runners.

## Table of Contents

- [Description](#description)
- [Usage](#usage)
- [Contribute](#contribute)
- [License](#license)

## Description

GitLab CI runners currently don't have an environment variable, that allows Danger to determine the ID
of the merge request. A proposal to enable pipelines for merge requests is currently discussed:
https://gitlab.com/gitlab-org/gitlab-ce/issues/23902. For the meantime, this application can be used as a workaround.

The principle is quite simple: You run this application on a publicly available server and register the endpoint
as a webhook in your GitLab repository. The webhook should only fire for merge requests!
Additionally, you create a trigger in the same GitLab repository. Now, when you create a new merge request,
GitLab will send a JSON object to your endpoint, the application will extract the project id and the merge request id
and send a request to GitLab to trigger a new build with additional parameters.

The additional parameter (that Danger is looking for) is `CI_MERGE_REQUEST_ID`.

## Usage

### Docker

1. Create a integration (webhook) in your GitLab repository, targeting `<your-FQDN>.com:3000/v1/triggerBuildOnMR`. Make sure to enter a `Secret Token`, you will need it in step XXXX
2. Create a new trigger for the same GitLab repository.
3. Pull my image from Docker Hub: [ffittschen/gitlab-ci-trigger] `docker pull ffittschen/gitlab-ci-trigger:latest`
4. Run the docker image: `docker run -p 3000:3000 -e X-GITLAB-TOKEN='YOUR-SECRET-TOKEN' -e GitlabTriggerToken='YOUR-TRIGGER-TOKEN' ffittschen/gitlab-ci-trigger:latest`

**Note:** Replace `YOUR-SECRET-TOKEN` and `YOUR-TRIGGER-TOKEN` in the command above with your tokens from steps 1 and 2!

### Manual

1. Follow steps 1. and 2. from the [Usage > Docker](#docker) section
2. Set the tokens as environment variables, e.g. `export X-GITLAB-TOKEN=YOUR-SECRET-TOKEN`, `export GitlabTriggerToken=YOUR-TRIGGER-TOKEN`
3. Clone this repository: `git clone https://github.com/ffittschen/gitlab-ci-trigger.git`
4. Install all dependencies: `yarn install`
5. Start the server: `yarn start`

## Contribute

PRs are welcome!


## License

MIT © Florian Fittschen

[Node.js]: https://github.com/nodejs/node
[express]: https://github.com/expressjs/express
[TypeScript]: https://github.com/Microsoft/TypeScript
[Danger]: https://github.com/danger/danger
[ffittschen/gitlab-ci-trigger]: https://hub.docker.com/r/ffittschen/gitlab-ci-trigger/
