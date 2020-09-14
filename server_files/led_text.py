#!/usr/bin/python3
import json
import time
from sense_emu import SenseHat

sense = SenseHat()

time.sleep(1)
red = (255, 0, 0)
green = (0, 255, 0)
blue = (0, 0, 255)
filename = "led_text.json";


if filename:
    with open(filename, 'r') as f:
        ledDisplayArray = json.load(f)

if ledDisplayArray["kolor"] == "red" or ledDisplayArray["kolor"] == "Red":
    sense.show_message(ledDisplayArray["text"], text_colour=red)
elif ledDisplayArray["kolor"] == "blue" or ledDisplayArray["kolor"] == "Blue":
    sense.show_message(ledDisplayArray["text"], text_colour=blue)
elif ledDisplayArray["kolor"] == "green" or ledDisplayArray["kolor"] == "Green":
    sense.show_message(ledDisplayArray["text"], text_colour=green)