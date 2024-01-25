"use client";
import React, { useState } from "react";
import {
  Autocomplete,
  Circle,
  GoogleMap,
  MarkerF,
  useLoadScript,
} from "@react-google-maps/api";
import { Input } from "./ui/input";

const GOOGLE_MAP = process.env.NEXT_PUBLIC_GOOGLE_KEY!;

const loadScript: any = {
  googleMapsApiKey: GOOGLE_MAP,
  libraries: ["places"],
};

const AutocompleteInput = () => {
  const { isLoaded } = useLoadScript(loadScript);
  const [autoCompleteLoaded, setAutoCompleteLoaded] = useState(null);

  const onLoadAutocomplete = (autocomplete: any) => {
    setAutoCompleteLoaded(autocomplete);
  };

  const onPlaceChanged = () => {
    if (autoCompleteLoaded == null) {
      console.log("autocomplete yet to load");
    } else {
      console.log(autoCompleteLoaded.getPlace());
    }
  };
  return (
    <div>
      {isLoaded && (
        <Autocomplete
          onLoad={onLoadAutocomplete}
          onPlaceChanged={onPlaceChanged}
        >
          <Input />
        </Autocomplete>
      )}
    </div>
  );
};

export default AutocompleteInput;
