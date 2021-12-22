import requests
from pprint import pprint

API_Key = '7ee41b1d6cc366853ce2341e256f4b73'

city = input("Enter a city: ")

base_url = "http://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="

weather_data = requests.get(base_url).json()

pprint(weather_data)
