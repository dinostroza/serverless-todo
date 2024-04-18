import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument, UpdateCommand} from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'

import { createLogger } from '../utils/logger.mjs'
const logger = createLogger('todos-access')

export class TodosAccess {
    constructor(
        documentClient = AWSXRay.captureAWSv3Client(new DynamoDB()),
        todosTable = process.env.TODOS_TABLE,
        todoIdIndex = process.env.TODOS_ID_INDEX,
        imagesBucket = process.env.IMAGES_S3_BUCKET
    ) {
        this.documentClient = documentClient
        this.todosTable = todosTable
        this.todoIdIndex = todoIdIndex
        this.imagesBucket = imagesBucket
        this.dynamoDbClient = DynamoDBDocument.from(this.documentClient)
    }

    async getTodosPerUser(userId) {

        logger.info('Getting all todos for user', {userId})
        const result = await this.dynamoDbClient.query({
            TableName: this.todosTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            },
            ScanIndexForward: false
        })

        logger.info('All todos for user were found', {userId: userId, count: result.Count})
        return result.Items
    }

    async createTodo(todo) {
        //console.log(`Creating a todo with id ${todo.todoId}`)
        logger.info(`Creating a todo for user`, { todoId: todo.todoId })

        await this.dynamoDbClient.put({
            TableName: this.todosTable,
            Item: todo
        })

        logger.info(`todo was created`, {todoId: todo.todoId})

        return todo
    }

    async updateTodo(todo) {
        //console.log(`Updating a todo with id ${todo.todoId}`)
        logger.info('Updating check/uncheck todo', { todoId: todo.todoId })

        const command = new UpdateCommand({
            TableName: this.todosTable,
            Key: {
                userId: todo.userId,
                todoId: todo.todoId
            },
            UpdateExpression: "set #nm = :nm, dueDate = :dueDate, done = :done",
            ExpressionAttributeValues: {
                ":nm": todo.name,
                ":dueDate": todo.dueDate,
                ":done": todo.done,
            },
            ExpressionAttributeNames: {
                "#nm": "name"
            },
            ReturnValues: "ALL_NEW",
        });

        await this.dynamoDbClient.send(command)

        logger.info('Todo was updated', { todoId: todo.todoId })

        return todo
    }

    async updateAttachmentURL(todoId){

        //console.log('Updating attachment Url for todo with id: ', todoId)
        logger.info('Updating attachment url', { todoId })

        const result = await this.dynamoDbClient
            .query({
                TableName: this.todosTable,
                IndexName: this.todoIdIndex,
                KeyConditionExpression: 'todoId = :todoId',
                ExpressionAttributeValues: {
                    ':todoId': todoId
                }
            })

        if (result.Count === 0) {
            logger.warn('Stop updating attachment url. TodoId does not exist.', { todoId })
            return
        }

        const userId = result.Items[0].userId

        const attachmentUrl = `https://${this.imagesBucket}.s3.amazonaws.com/${todoId}`

        const command = new UpdateCommand({
            TableName: this.todosTable,
            Key: {
                todoId: todoId,
                userId: userId,
            },
            UpdateExpression: "set attachmentUrl = :attachmentUrl",
            ExpressionAttributeValues: {
                ":attachmentUrl": attachmentUrl,
            },
            ReturnValues: "ALL_NEW",
        });

        await this.dynamoDbClient.send(command)

        logger.info('Attachment url was updated', { todoId })

        return attachmentUrl
    }

    async deleteTodo(todoId, userId) {
        //console.log(`Deleting a todo with id ${todoId}`)
        logger.info('Deleting todo', { todoId })
        await this.dynamoDbClient.delete({
            TableName: this.todosTable,
            Key: {
                userId: userId,
                todoId: todoId
            }
        })

        logger.info('Todo was deleted', { todoId })

        return todoId
    }


}