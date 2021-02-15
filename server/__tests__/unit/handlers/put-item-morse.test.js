const lambda = require("../../../src/handlers/put-item-morse.js")
const dynamodb = require("aws-sdk/clients/dynamodb")
const { MORSE } = require("../../../src/constants")

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
      from: "John",
      msg: "sos s",
    }
    const testResult = {
      from: "John",
      msg: "sos s",
      encoded: [0,0,0,2,1,1,1,2,0,0,0,2,2,2,0,0,0,2]
    }

    putSpy.mockReturnValue({
      promise: () => Promise.resolve(testData),
    })

    const event = {
      httpMethod: "POST",
      body: JSON.stringify(testData),
    }

    const result = await lambda.putItemMorseHandler(event)

    const expectedResult = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type,x-api-key",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST",
      },
      body: JSON.stringify(testResult),
    }

    expect(result).toEqual(expectedResult)
  })

  // it("should return an error", async () => {
  //   const testData = {
  //     stream: [["0", "1"]],
  //   }

  //   putSpy.mockReturnValue({
  //     promise: () => Promise.resolve(testData),
  //   })

  //   const event = {
  //     httpMethod: "POST",
  //     body: JSON.stringify(testData),
  //   }

  //   const result = await lambda.putItemHandler(event)
  //   const expectedResult = {
  //     statusCode: 401,
  //     msg: "Invalid Request",
  //     body: JSON.stringify(testData),
  //   }

  //   expect(result).toEqual(expectedResult)
  // })
})
