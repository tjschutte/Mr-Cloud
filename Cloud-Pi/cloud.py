import pyowm
import time
import serial

# Getting API KEy to use with openweather
weatherapifile = open('weather-api.key', 'r')
weatherkey = weatherapifile.readline().rstrip('\n')
port = '/dev/ttyUSB0'
baudrate = 9600

ser = serial.Serial(port, baudrate)
ser.close()
ser.open()

# Setting up API key
owm = pyowm.OWM(str(weatherkey))

# Search for current weather in Madison
observation = owm.weather_at_place('Madison,us')

def loop():
  while(True):
    for x in range (0, 7):
        ser.write(str(x))
        time.sleep(3)
    #w = observation.get_weather()
    # Weather details
    #currentweather = w.get_detailed_status()
    #print(currentweather)

    #if (str(currentweather) == 'clear sky'):
    #  print('weathers looking nice')
    #elif (str(currentweather) == 'few clouds'):
    #  print('looks a lil cloudy...')
    #else:
    #  print('ooooh boy oooh boy')

    #ser.write('1')
    #time.sleep(15) # check weather every 15 seconds..
    #ser.write('0')

loop()

