const tableName = process.env.STREAM_TABLE
const dynamodb = require("aws-sdk/clients/dynamodb")
const docClient = new dynamodb.DocumentClient()

exports.getAllItemsHandler = async (event) => {
  if (event.httpMethod !== "GET") {
    throw new Error(
      `getAllItems only accept GET method, you tried: ${event.httpMethod}`
    )
  }

  console.info("received:", event)

  var params = {
    TableName: tableName,
    ScanIndexForward: false,
  }

  const data = await docClient.scan(params).promise()
  const items = data.Items

  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type, x-api-key",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,GET",
    },
    body: JSON.stringify(items),
  }

  console.info(
    `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  )
  return response
}
