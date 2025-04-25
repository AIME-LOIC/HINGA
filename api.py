import requests
from flask import Flask, render_template, request

app = Flask(__name__)

# Function to fetch weather info
def get_weather(city):
    url = f"https://wttr.in/{city}?format=%C+%t+%w"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            return response.text
        else:
            return "Error fetching data."
    except Exception as e:
        return f"Error: {e}"

# Route to display the form and weather
@app.route('/', methods=['GET', 'POST'])
def index():
    weather_info = ''
    if request.method == 'POST':
        city = request.form['city']
        weather_info = get_weather(city)
    return render_template('index.html', weather_info=weather_info)

if __name__ == '__main__':
    app.run(debug=True)
