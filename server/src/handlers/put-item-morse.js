const uuid = require("uuid")
const dynamodb = require("aws-sdk/clients/dynamodb")
const docClient = new dynamodb.DocumentClient()
const tableName = process.env.STREAM_TABLE
const { MORSE } = require("../constants")

const validateBody = ({ from = undefined, msg = undefined }) => {
  if (!from || !msg) {
    return false
  }

  if (!Boolean(msg.length)) {
    return false
  }

  return typeof msg == "string"
}

const convert = (text, mapping = MORSE) => {
  return [...text.toLowerCase()].reduce(
    (stream, char) => [...stream, ...mapping[char], 2],
    []
  )
}

exports.putItemMorseHandler = async (event) => {
  if (event.httpMethod !== "POST") {
    throw new Error(
      `postMethod only accepts POST method, you tried: ${event.httpMethod} method.`
    )
  }

  console.info("received:", event)

  const body = JSON.parse(event.body)

  let response = {
    statusCode: 418,
    body: JSON.stringify(body),
    msg: "Invalid Request",
  }

  if (!validateBody(body)) {
    console.info(
      `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
    )
    return response
  }

  encoded = convert(body.msg)

  const params = {
    TableName: tableName,
    Item: {
      id: uuid.v4(),
      from: body.from,
      msg: body.msg,
      m: encoded,
      created_at: Date.now(),
    },
  }

  response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type,x-api-key",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST",
    },
    body: JSON.stringify({ ...body, encoded: encoded }),
  }

  await docClient.put(params).promise()

  console.info(
    `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  )
  return response
}
