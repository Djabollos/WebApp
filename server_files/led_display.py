#!/usr/bin/python3
import json
from sense_emu import SenseHat

sense = SenseHat()

red = (255, 0, 0)
green = (0, 255, 0)
blue = (0, 0, 255)
filename = "led_single.json";


if filename:
    with open(filename, 'r') as f:
        ledDisplayArray = json.load(f)

if ledDisplayArray["kolor"] == "red" or ledDisplayArray["kolor"] == "Red":
    sense.set_pixel(ledDisplayArray["poziom"], ledDisplayArray["pion"], red)
elif ledDisplayArray["kolor"] == "blue" or ledDisplayArray["kolor"] == "Blue":
    sense.set_pixel(ledDisplayArray["poziom"], ledDisplayArray["pion"], blue)
elif ledDisplayArray["kolor"] == "green" or ledDisplayArray["kolor"] == "Green":
    sense.set_pixel(ledDisplayArray["poziom"], ledDisplayArray["pion"], green)
