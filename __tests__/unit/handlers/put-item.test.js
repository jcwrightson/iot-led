const lambda = require("../../../src/handlers/put-item.js")
const dynamodb = require("aws-sdk/clients/dynamodb")

describe("Test putItemHandler", function () {
  let putSpy

  beforeAll(() => {
    putSpy = jest.spyOn(dynamodb.DocumentClient.prototype, "put")
  })

  afterAll(() => {
    putSpy.mockRestore()
  })

  it("should add item to the table", async () => {
    const testData = {
      author: "John",
      stream: [[0, 1]],
    }

    putSpy.mockReturnValue({
      promise: () => Promise.resolve(testData),
    })

    const event = {
      httpMethod: "POST",
      body: JSON.stringify(testData),
    }

    const result = await lambda.putItemHandler(event)

    const expectedResult = {
      statusCode: 200,
      body: JSON.stringify(testData),
    }

    expect(result).toEqual(expectedResult)
  })

  it("should return an error", async () => {
    const testData = {
      stream: [["0", "1"]],
    }

    putSpy.mockReturnValue({
      promise: () => Promise.resolve(testData),
    })

    const event = {
      httpMethod: "POST",
      body: JSON.stringify(testData),
    }

    const result = await lambda.putItemHandler(event)
    const expectedResult = {
      statusCode: 401,
      msg: "Invalid Request",
      body: JSON.stringify(testData),
    }

    expect(result).toEqual(expectedResult)
  })
})
