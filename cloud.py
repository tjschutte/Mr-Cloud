import pyowm
import time

# Getting API KEy to use with openweather
weatherapifile = open('weather-api.key', 'r')
weatherkey = weatherapifile.readline().rstrip('\n')

# Setting up API key
owm = pyowm.OWM(str(weatherkey))

# Search for current weather in Madison
observation = owm.weather_at_place('Madison,us')

def loop():
  while(True):
    w = observation.get_weather()
    # Weather details
    currentweather = w.get_detailed_status()
    print(currentweather)

    if (str(currentweather) == 'clear sky'):
      print('weathers looking nice')
    elif (str(currentweather) == 'few clouds'):
      print('looks a lil cloudy...')
    else:
      print('ooooh boy oooh boy')

    time.sleep(15) # check weather every 15 seconds..

loop()

