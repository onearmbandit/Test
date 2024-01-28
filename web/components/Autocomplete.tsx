"use client";
import React, { LegacyRef, RefObject, useState } from "react";

import { Input } from "./ui/input";
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import { usePlacesWidget } from "react-google-autocomplete";
const GOOGLE_MAP = process.env.NEXT_PUBLIC_GOOGLE_KEY!;

const loadScript: any = {
  googleMapsApiKey: GOOGLE_MAP,
  libraries: ["places"],
};

const AutocompleteInput = () => {
  const [val, setVal] = useState("");
  const { ref, autocompleteRef } = usePlacesWidget({
    apiKey: GOOGLE_MAP,
    onPlaceSelected: (place) => {
      console.log("somethings", { place });
      setVal(place);
    },
    options: {
      types: ["geocode", "establishment"],
      fields: [
        "address_components",
        "geometry.location",
        "place_id",
        "formatted_address",
      ],
    },
  });

  return (
    <Input
      ref={ref}
      className="text-slate-500 text-xs font-light mt-3 leading-4 items-stretch bg-gray-50 self-stretch justify-center px-2 py-7 rounded-md max-md:max-w-full"
    />
  );
};

export default AutocompleteInput;
