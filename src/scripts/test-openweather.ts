async function testOpenWeather() {
  const apiKey = '7d8309a71a6e2fc287d5fdebe4494827';
  console.log('Testing OpenWeatherMap API with key:', apiKey);

  // Test Pune coordinates (18.5204, 73.8567)
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=18.5204&lon=73.8567&units=metric&appid=${apiKey}`;
  const res = await fetch(url);
  const data: any = await res.json();

  if (res.ok) {
    console.log('✅ OpenWeatherMap Live Data Response:');
    console.log(`Location: ${data.name}, ${data.sys?.country}`);
    console.log(`Temperature: ${data.main?.temp}°C (Feels like: ${data.main?.feels_like}°C)`);
    console.log(`Humidity: ${data.main?.humidity}%`);
    console.log(`Condition: ${data.weather?.[0]?.main} - ${data.weather?.[0]?.description}`);
    console.log(`Wind: ${data.wind?.speed} m/s`);
    console.log(`Cloudiness: ${data.clouds?.all}%`);
  } else {
    console.error('❌ OpenWeatherMap API Error:', JSON.stringify(data));
  }
}

testOpenWeather();
