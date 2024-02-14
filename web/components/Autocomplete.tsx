"use client";
import React, { useEffect, useState } from "react";

import { Input } from "./ui/input";

import usePlacesAutocomplete, {
  getDetails,
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { formatAddress } from "@/lib/utils";

const AutocompleteInput = ({
  setAddress,
  isDisabled = false,
  address,
}: {
  setAddress: React.Dispatch<React.SetStateAction<string>> | ((e: any) => void);
  isDisabled?: boolean;
  address?: string;
}) => {
  const [val, setVal] = useState<string>(address || "");

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    callbackName: "initMap",
    requestOptions: {
      /* Define search scope here */

      types: ["geocode", "establishment"],
    },
    debounce: 300,
  });

  const handleInput = (e: any) => {
    setValue(e.target.value);
  };

  const handleSelect =
    ({ description, place_id }: any) =>
    () => {
      // When the user selects a place, we can replace the keyword without request data from API
      // by setting the second parameter to "false"
      let add = formatAddress(description);

      setValue(add, false);
      setVal(add);
      setAddress(add);
      clearSuggestions();
      const parameter = {
        placeId: place_id,
      };

      getDetails(parameter)
        .then((details) => {
          console.log("Details: ", details);
        })
        .catch((error) => {
          console.log("Error: ", error);
        });

      // Get latitude and longitude via utility functions
      getGeocode({ address: description }).then((results) => {
        const { lat, lng } = getLatLng(results[0]);
        console.log("📍 Coordinates: ", { lat, lng });
      });
    };

  const renderSuggestions = () =>
    data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        <li
          key={place_id}
          className="hover:bg-black/5 p-1 break-words"
          onClick={handleSelect(suggestion)}
        >
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });

  useEffect(() => {
    setAddress(val);
  }, [val]);

  return (
    <div className="relative">
      {val == "" ? (
        <Input
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder="Address"
          className="text-slate-500 text-xs font-light mt-3 leading-4 items-stretch bg-gray-50 self-stretch justify-center px-2 py-7 rounded-md max-md:max-w-full"
        />
      ) : (
        <textarea
          className="min-h-20 h-full resize-none w-full text-sm focus:outline-none disabled:cursor-not-allowed font-light rounded-lg px-2 py-1 bg-gray-50 text-slate-500"
          value={val}
          disabled={isDisabled}
          onChange={(e) => {
            setVal(e.target.value);
            setValue(e.target.value);
          }}
        />
      )}

      {status == "OK" && (
        <ul className="absolte bottom-0 mt-1 max-w-full rounded-md border p-3">
          {renderSuggestions()}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteInput;
