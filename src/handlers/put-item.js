const uuid = require("uuid")
const dynamodb = require("aws-sdk/clients/dynamodb")
const docClient = new dynamodb.DocumentClient()
const tableName = process.env.STREAM_TABLE

const validateBody = ({ author = undefined, stream = undefined }) => {
  if (!author | !stream) {
    return false
  }

  if (!Boolean(stream.length)) {
    return false
  }

  return Boolean(
    stream.filter((bit) => !isNaN(bit[0]) || !isNaN(bit[1])).length
  )
}

exports.putItemHandler = async (event) => {
  if (event.httpMethod !== "POST") {
    throw new Error(
      `postMethod only accepts POST method, you tried: ${event.httpMethod} method.`
    )
  }

  console.info("received:", event)

  const body = JSON.parse(event.body)

  const success = {
    statusCode: 200,
    body: JSON.stringify(body),
  }

  const errored = {
    statusCode: 401,
    body: JSON.stringify(body),
    msg: "Invalid Request",
  }

  response = success

  if (!validateBody(body)) {
    response = errored

    console.info(
      `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
    )
    return response
  }

  var params = {
    TableName: tableName,
    Item: { id: uuid.v4(), author: body.author, stream: body.stream },
  }

  await docClient.put(params).promise()

  console.info(
    `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  )
  return response
}
