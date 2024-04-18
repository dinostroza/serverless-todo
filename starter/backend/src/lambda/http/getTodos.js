import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import cors from "@middy/http-cors";

import { getTodosPerUser } from "../../businessLogic/todos.mjs";
import { getUserId } from "../utils.mjs"

export const handler = middy()
    .use(httpErrorHandler())
    .use(
        cors({
          credentials: true
        })
    )
    .handler(async (event) => {
        console.log('Processing event: ', event)

        const userId = getUserId(event)

        const todos = await getTodosPerUser(userId)

        return {
            statusCode: 200,
            body: JSON.stringify({
              items: todos
            })
        }
    })