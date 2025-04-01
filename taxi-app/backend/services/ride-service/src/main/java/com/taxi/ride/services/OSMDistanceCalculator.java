package com.taxi.ride.services;

import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

@Service
public class OSMDistanceCalculator {
    public double getDistanceORM(double lat1, double lon1, double lat2, double lon2){
        try{
            String urlString = String.format(
                    "http://router.project-osrm.org/route/v1/driving/%f,%f;%f,%f?overview=false",
                        lon1, lat1, lon2, lat2
                    );

            JSONObject jsonResponse = getJsonObject(urlString);
            if(jsonResponse.has("routes") && !jsonResponse.getJSONArray("routes").isEmpty()){
                double distanceMeters = jsonResponse.getJSONArray("routes")
                        .getJSONObject(0)
                        .getJSONArray("legs")
                        .getJSONObject(0)
                        .getDouble("distance");
                
                return distanceMeters / 1000;
            }
            else{
                return -1;
            }
        }
        catch (Exception e){
            e.printStackTrace();
            return -1;
        }
    }

    private static JSONObject getJsonObject(String urlString) throws IOException {
        URL url = new URL(urlString);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setConnectTimeout(5000);
        conn.setReadTimeout(5000);

        int responseCode = conn.getResponseCode();

        if(responseCode != 200){
            throw new RuntimeException("Http GET request failed with error code "+responseCode);
        }

        BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
        String inputLine;
        StringBuilder response = new StringBuilder();

        while((inputLine = in.readLine()) != null){
            response.append(inputLine);
        }
        in.close();

        return new JSONObject(response.toString());
    }
}
