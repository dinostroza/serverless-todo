import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import cors from "@middy/http-cors";
import { updateTodo } from "../../businessLogic/todos.mjs";
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
        const updatedTodo = JSON.parse(event.body)
        const userId = getUserId(event)

        const newItem = await updateTodo(updatedTodo, todoId, userId)

        return {
            statusCode: 200,
            body: ""
        }
    })
