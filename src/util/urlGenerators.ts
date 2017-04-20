export function genTriggerURL(mergeRequestEvent: any, token: string) {
    const projectID: string = mergeRequestEvent.object_attributes.target_project_id
    const branchName: string = mergeRequestEvent.object_attributes.source_branch
    const mergeRequestID: string = mergeRequestEvent.object_attributes.iid

    const urlObject = {
        url: "https://gitlab.com/api/v4/projects/" + projectID + "/trigger/pipeline",
        form: {
            token,
            ref: branchName,
            variables: {
                CI_MERGE_REQUEST_ID: mergeRequestID,
            },
        },
    }

    return urlObject
}
