#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <iostream>
#include "ArduinoJson.h"

#define PIN LED_BUILTIN

const char *API_KEY;
const char *URL;
const char *FINGER_PRINT;
const int POLL_INTERVAL = 50000;

const char *SSID;
const char *WL_PASSWORD;

HTTPClient https;

void connect_to_wifi()
{
    WiFi.begin(SSID, WL_PASSWORD);

    Serial.print("Connecting to wifi");
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
    }
    Serial.println();

    Serial.print("Connected, IP address: ");
    Serial.println(WiFi.localIP());
}

void setup()
{
    Serial.begin(9600);
    connect_to_wifi();

    pinMode(PIN, OUTPUT);
    digitalWrite(PIN, LOW);
}

void loop()
{

    https.begin(URL, FINGER_PRINT);
    https.addHeader("x-api-key", API_KEY);

    int code = https.GET();
    String response = https.getString();

    StaticJsonDocument<1024> doc;
    deserializeJson(doc, response);

    String author = doc["author"];

    Serial.println(code);
    Serial.println(author);

    JsonArray stream = doc["stream"].as<JsonArray>();

    for (JsonVariant row : stream)
    {
        JsonArray item = row.as<JsonArray>();
        int state = item[0];
        int duration = item[1];

        Serial.print("Setting PIN: ");
        Serial.println(item[0].as<int>());
        digitalWrite(PIN, !state);
        Serial.print("Waiting for...: ");
        Serial.print(duration);
        Serial.print("ms");
        delay(duration);
    }

    https.end();
    delay(POLL_INTERVAL);
}