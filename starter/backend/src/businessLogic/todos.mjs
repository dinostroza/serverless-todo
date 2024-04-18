import * as uuid from 'uuid'

import { TodosAccess } from '../dataLayer/todosAccess.mjs'
import { deleteImage } from "../fileStorage/attachmentUtils.mjs";

const imagesBucket = process.env.IMAGES_S3_BUCKET
const todoAccess = new TodosAccess()

export async function getTodosPerUser(userId) {
    return todoAccess.getTodosPerUser(userId)
}

export async function createTodo(createTodoRequest, userId) {
    const itemId = uuid.v4()
    const currentDatetime = new Date().toISOString()


    return await todoAccess.createTodo({
        todoId: itemId,
        userId: userId,
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate,
        attachmentUrl: null,
        createdAt: currentDatetime,
        done: false
    })
}

export async function deleteTodo(todoId, userId) {

    await todoAccess.deleteTodo(todoId, userId)
    await deleteImage(todoId)

    return todoId
}

export async function updateTodo(updateTodoRequest, todoId, userId) {
    return await todoAccess.updateTodo({
        todoId: todoId,
        userId: userId,
        name: updateTodoRequest.name,
        dueDate: updateTodoRequest.dueDate,
        done: updateTodoRequest.done
    })
}


export async function updateAttachmentURL(todoId) {
    return await todoAccess.updateAttachmentURL(todoId)
}