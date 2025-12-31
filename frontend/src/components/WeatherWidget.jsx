import { useState, useEffect } from "react";
import {
    HiOutlineSun,
    HiOutlineCloud,
    HiOutlineMapPin,
} from "react-icons/hi2";

// Default weather icons based on condition
const WEATHER_ICONS = {
    clear: "☀️",
    sunny: "☀️",
    clouds: "☁️",
    cloudy: "☁️",
    partly_cloudy: "⛅",
    rain: "🌧️",
    drizzle: "🌦️",
    thunderstorm: "⛈️",
    snow: "❄️",
    mist: "🌫️",
    fog: "🌫️",
    default: "🌤️",
};

export default function WeatherWidget({ className = "" }) {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [location, setLocation] = useState({ lat: null, lon: null });

    useEffect(() => {
        // Get user's location
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                    });
                },
                (err) => {
                    console.log("Geolocation error:", err);
                    // Default to a sample location (can be configured)
                    setLocation({ lat: 28.6139, lon: 77.209 }); // Delhi
                }
            );
        } else {
            setLocation({ lat: 28.6139, lon: 77.209 });
        }
    }, []);

    useEffect(() => {
        if (location.lat && location.lon) {
            fetchWeather();
        }
    }, [location]);

    const fetchWeather = async () => {
        try {
            setLoading(true);
            setError(null);

            // Using Open-Meteo API (free, no API key required)
            const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
            );

            if (!response.ok) throw new Error("Weather fetch failed");

            const data = await response.json();

            // Map weather codes to conditions
            const weatherCode = data.current?.weather_code;
            const condition = getWeatherCondition(weatherCode);

            setWeather({
                temp: Math.round(data.current?.temperature_2m || 0),
                humidity: data.current?.relative_humidity_2m || 0,
                windSpeed: Math.round(data.current?.wind_speed_10m || 0),
                condition,
                icon: WEATHER_ICONS[condition] || WEATHER_ICONS.default,
                high: Math.round(data.daily?.temperature_2m_max?.[0] || 0),
                low: Math.round(data.daily?.temperature_2m_min?.[0] || 0),
                location: data.timezone?.split("/")?.[1]?.replace("_", " ") || "Local",
            });
        } catch (err) {
            console.error("Weather error:", err);
            setError("Unable to load weather");
            // Set fallback weather
            setWeather({
                temp: 28,
                humidity: 65,
                windSpeed: 12,
                condition: "sunny",
                icon: "☀️",
                high: 32,
                low: 22,
                location: "Local",
            });
        } finally {
            setLoading(false);
        }
    };

    // Map WMO weather codes to conditions
    const getWeatherCondition = (code) => {
        if (!code) return "default";
        if (code === 0) return "sunny";
        if (code <= 3) return "partly_cloudy";
        if (code <= 48) return "fog";
        if (code <= 57) return "drizzle";
        if (code <= 67) return "rain";
        if (code <= 77) return "snow";
        if (code <= 82) return "rain";
        if (code <= 86) return "snow";
        if (code <= 99) return "thunderstorm";
        return "default";
    };

    if (loading) {
        return (
            <div className={`card-organic p-4 animate-pulse ${className}`}>
                <div className="h-16 bg-slate-200 rounded-lg"></div>
            </div>
        );
    }

    if (error && !weather) {
        return (
            <div className={`card-organic p-4 text-center text-slate-500 text-sm ${className}`}>
                <HiOutlineCloud className="mx-auto text-2xl mb-1" />
                {error}
            </div>
        );
    }

    return (
        <div className={`card-organic p-4 bg-gradient-to-br from-sky-50 to-white dark:from-sky-900/20 dark:to-slate-900 ${className}`}>
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
                        <HiOutlineMapPin className="h-3 w-3" />
                        <span>{weather?.location}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                            {weather?.temp}°C
                        </span>
                        <span className="text-lg">{weather?.icon}</span>
                    </div>
                    <p className="text-sm text-slate-500 capitalize mt-1">
                        H: {weather?.high}° L: {weather?.low}°
                    </p>
                </div>
                <div className="text-right text-sm text-slate-600 dark:text-slate-400">
                    <p>💧 {weather?.humidity}%</p>
                    <p>💨 {weather?.windSpeed} km/h</p>
                </div>
            </div>

            {/* Weather Alert for Poultry */}
            {weather?.temp > 35 && (
                <div className="mt-3 p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg text-xs text-rose-700 dark:text-rose-300">
                    ⚠️ High temperature! Monitor birds for heat stress.
                </div>
            )}
            {weather?.temp < 10 && (
                <div className="mt-3 p-2 bg-sky-100 dark:bg-sky-900/30 rounded-lg text-xs text-sky-700 dark:text-sky-300">
                    ❄️ Low temperature! Ensure proper heating for birds.
                </div>
            )}
            {weather?.humidity > 80 && (
                <div className="mt-3 p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-xs text-amber-700 dark:text-amber-300">
                    💧 High humidity! Watch for respiratory issues.
                </div>
            )}
        </div>
    );
}
