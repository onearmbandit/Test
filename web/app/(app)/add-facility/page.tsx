import AutocompleteInput from "@/components/Autocomplete";
import FacilityEmissionsSummary from "@/components/FacilityEmissionsSummary";
import { Input } from "@/components/ui/input";
import { ChevronLeft } from "lucide-react";
import React from "react";

const Page = () => {
  return (
    <div className="p-6 bg-white w-full">
      {/* Nav */}
      <div className="items-center self-stretch flex gap-2.5 pl-3 py-3 max-md:flex-wrap">
        <ChevronLeft size={24} className="text-slate-500" />
        <nav className="text-blue-700 text-sm leading-5 justify-center items-stretch grow py-1.5 max-md:max-w-full">
          <a href="/" className="text-slate-500">
            Organization Profile
          </a>{" "}
          &gt;{" "}
          <a href="?pepsiCoFacilities" className="text-slate-500">
            Pepsi Co&apos;s Facilities
          </a>{" "}
          &gt;{" "}
          <a
            href="/facility1"
            className="font-bold text-blue-700"
            aria-label="Facility 1"
            role="link"
          >
            Facility 1
          </a>
        </nav>
      </div>

      <div className="mt-3 ">
        <h2 className="text-slate-800 text-ellipsis whitespace-nowrap text-lg font-bold leading-7 max-w-[73px]">
          Facility 1
        </h2>

        <section className="justify-center items-stretch self-stretch border border-[color:var(--Slate-200,#E2E8F0)] bg-white flex flex-col p-6 rounded-lg border-solid max-md:px-5">
          <header className="items-stretch flex justify-between gap-5 py-0.5 max-md:max-w-full max-md:flex-wrap">
            <div className="text-gray-700 text-xs font-semibold leading-4 flex justify-center items-center bg-gray-100 aspect-square h-5 w-5 my-auto px-2 rounded-full">
              1
            </div>
            <h1
              className="text-slate-800 text-ellipsis text-lg font-medium leading-7 grow max-md:max-w-full"
              aria-label="Add new facility"
              role="heading"
            >
              Add new facility
            </h1>
          </header>

          <form className="items-stretch gap-5 mt-8 px-16 max-md:max-w-full max-md:flex-wrap max-md:px-5">
            <div className="flex space-x-7">
              <label
                className="text-slate-700 text-xs font-medium leading-4 whitespace-nowrap my-auto"
                htmlFor="facility-name"
              >
                Facility Name
              </label>
              <Input
                id="facility-name"
                type="text"
                className="text-slate-500 text-xs font-light leading-4 whitespace-nowrap max-w-[18.5rem] bg-gray-50  justify-center pl-2 pr-8 py-3.5 rounded-md max-md:pr-5"
                placeholder="Add facility name"
              />
            </div>
            <p
              className="justify-center self-center text-slate-700 text-xs font-medium leading-4 mt-10 max-md:max-w-full"
              aria-label="Facility Location"
              role="text"
            >
              {" "}
              Facility Location{" "}
            </p>
            <AutocompleteInput
            // id="facility-location"
            // type="text"
            // className="text-slate-700 text-sm font-light leading-5 items-stretch self-center rounded-3xl shadow-sm bg-gray-50 w-full max-w-[972px] justify-center mt-6 px-2 py-3 max-md:max-w-full"
            // placeholder="East"
            // aria-label="facility-location"
            />
            <button
              type="submit"
              className="text-sky-100 text-center text-sm font-semibold leading-4 whitespace-nowrap justify-center items-stretch rounded bg-blue-200 mt-8 px-4 py-2 self-end"
            >
              {" "}
              Add Facility{" "}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Page;
