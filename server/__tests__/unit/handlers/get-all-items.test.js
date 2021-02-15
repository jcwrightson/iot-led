const lambda = require("../../../src/handlers/get-all-items.js")
const dynamodb = require("aws-sdk/clients/dynamodb")


describe("Test getAllItemsHandler", () => {
  let scanSpy

  beforeAll(() => {
    scanSpy = jest.spyOn(dynamodb.DocumentClient.prototype, "scan")
  })


  afterAll(() => {
    scanSpy.mockRestore()
  })

  it("should return ids", async () => {
    const items = [{ id: "id1" }, { id: "id2" }]

    scanSpy.mockReturnValue({
      promise: () => Promise.resolve({ Items: items }),
    })

    const event = {
      httpMethod: "GET",
    }

    const result = await lambda.getAllItemsHandler(event)

    const expectedResult = {
      statusCode: 200,
      body: JSON.stringify(items),
      headers: {
        "Access-Control-Allow-Headers": "Content-Type, x-api-key",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,GET",
      },
    }

    expect(result).toEqual(expectedResult)
  })
})
