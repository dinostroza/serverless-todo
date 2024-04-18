import { updateAttachmentURL } from "../../businessLogic/todos.mjs";

export async function handler(event) {
    console.log('Processing S3 event ', JSON.stringify(event))

    for (const record of event.Records) {
        const todoId = record.s3.object.key
        await updateAttachmentURL(todoId)
    }
}
