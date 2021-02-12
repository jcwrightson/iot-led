const tableName = process.env.STREAM_TABLE
const dynamodb = require("aws-sdk/clients/dynamodb")
const docClient = new dynamodb.DocumentClient()

exports.getLatestItemHandler = async (event) => {
  if (event.httpMethod !== "GET") {
    throw new Error(
      `getAllItems only accept GET method, you tried: ${event.httpMethod}`
    )
  }

  console.info("received:", event)

  var params = {
    TableName: tableName,
    ScanIndexForward: true,
    Limit: 1
  }
  const data = await docClient.scan(params).promise()
  const items = data.Items

  const response = {
    statusCode: 200,
    body: JSON.stringify(items[0]),
  }

  console.info(
    `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  )
  return response
}
