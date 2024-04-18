import { deleteTodo } from "../../businessLogic/todos.mjs";
import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import cors from "@middy/http-cors";
import { getUserId } from "../utils.mjs";


export const handler = middy()
    .use(httpErrorHandler())
    .use(
        cors({
          credentials: true
        })
    )
    .handler(async (event) => {

        const todoId = event.pathParameters.todoId

        const userId = getUserId(event)

        const deletedItem = await deleteTodo(todoId, userId)

        return {
            statusCode: 200,
            body: ""
        }
    })


