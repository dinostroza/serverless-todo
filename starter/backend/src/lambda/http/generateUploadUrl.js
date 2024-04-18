import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import cors from "@middy/http-cors";
import { getUploadUrl } from "../../fileStorage/attachmentUtils.mjs";



export const handler = middy()
    .use(httpErrorHandler())
    .use(
        cors({
          credentials: true
        })
    ).handler(async  (event) => {
        const todoId = event.pathParameters.todoId

        const uploadUrl = await getUploadUrl(todoId)

        return {
            statusCode: 201,
            body: JSON.stringify({
                uploadUrl
            })
        }
    })


