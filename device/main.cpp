#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <iostream>
#include "ArduinoJson.h"

#define PIN 12

const char *API_KEY = "xxxxxxx";
const char *URL = "https://xxxxxxxxxx.eu-west-1.amazonaws.com/Prod/latest/morse";
const char *FINGER_PRINT = "SHA1 Finger Print";
const int POLL_INTERVAL = 50000;
const char *SSID = "your-ssid";
const char *WL_PASSWORD = "your-password";

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
    digitalWrite(PIN, 0); // When using LED_BUILTIN "HIGH" is off and "LOW" is on?

}

void loop()
{

    https.begin(URL, FINGER_PRINT);
    https.addHeader("x-api-key", API_KEY);

    int code = https.GET();
    String response = https.getString();

    StaticJsonDocument<1264> doc;
    deserializeJson(doc, response);

    Serial.println(code);

    JsonArray m = doc.as<JsonArray>();

    for (JsonVariant i : m)
    {

        int state = i;
        int p = 100;

        Serial.print(i.as<int>());

        if (i == 2)
        {
            digitalWrite(PIN, 0);
            delay(500);
        }
        else
        {
            digitalWrite(PIN, 1);
            delay(i == 0 ? p : 300);
            digitalWrite(PIN, 0);
            delay(p);
        }
    }

    digitalWrite(PIN, 0);
    https.end();
    delay(POLL_INTERVAL);
}