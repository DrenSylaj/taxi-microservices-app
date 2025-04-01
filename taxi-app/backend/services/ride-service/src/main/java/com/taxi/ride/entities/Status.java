package com.taxi.ride.entities;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Status {
    REQUESTED, ACCEPTED, ARRIVED, STARTED, COMPLETED, CANCELLED;

    @JsonCreator
    public static Status formString(String value){
        return Status.valueOf(value.toUpperCase());
    }

    @JsonValue
    public String toJson(){
        return this.name();
    }
}
