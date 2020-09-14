from sense_emu import SenseHat
import sys
import json
import time
workflag = 1
sense = SenseHat()

data_basic = {"Temperature" : 0,  "Humidity" : 0,  "Pressure" : 0,  "roll" : 0,  "pitch" : 0,  "yaw" : 0,  "xaxis" : 0,  "yaxis" : 0,  "buttonpressed" : 0}

try:
    while True:
        degrees = sense.get_orientation_degrees()
        data_basic['Temperature'] = sense.temp
        data_basic['Humidity'] = sense.humidity
        data_basic['Pressure'] = sense.pressure
        data_basic['roll'] = degrees["roll"]
        data_basic['pitch'] = degrees["pitch"]
        data_basic['yaw'] = degrees["yaw"]
        
        for event in sense.stick.get_events():  
            if event.action == "pressed":
                if event.direction == "up":
                    data_basic['yaxis']+=1
                if event.direction == "down":
                    data_basic['yaxis']-=1					
                if event.direction == "left":
                    data_basic['xaxis']-=1				
                if event.direction == "right":
                    data_basic['xaxis']+=1				
                if event.direction == "middle":
                    data_basic['buttonpressed']+=1		

        jsonStr = json.dumps(data_basic)
        try:
            fp = open("dane_pomiarowe.json", "w")
            fp.write(jsonStr)
        except:
            print("Write Error")
        finally:
            fp.close()
            
        time.sleep(1)

except KeyboardInterrupt:
    pass