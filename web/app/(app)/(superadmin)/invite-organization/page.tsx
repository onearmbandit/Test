import AutocompleteInput from "@/components/Autocomplete";
import { Input } from "@/components/ui/input";
import * as React from "react";

const InviteUser = () => {
  return (
    <div className="min-h-screen w-full grid place-items-center bg-blue-100">
      <section className="flex flex-col justify-center items-stretch px-11 py-8 bg-white rounded max-w-[50rem] w-full max-md:px-5">
        <header className="text-2xl font-semibold leading-8 text-center text-slate-700 max-md:max-w-full">
          Invite Organization
        </header>
        <form className="space-y-4">
          <div>
            <label
              className="text-slate-700 text-base font-light leading-6 max-md:max-w-full"
              htmlFor="firstNameInput"
            >
              First Name
            </label>
            <div className="text-slate-500 text-sm font-light leading-5 items-stretch bg-gray-50 justify-center mt-3 px-2 py-6 rounded-md max-md:max-w-full">
              <Input
                type="text"
                id="firstNameInput"
                placeholder="First Name"
                name="firstName"
                // onChange={step2Form.handleChange}
                className="bg-transparent"
              />
            </div>
          </div>
          <div>
            <label
              className="text-slate-700 text-base font-light leading-6 max-md:max-w-full"
              htmlFor="firstNameInput"
            >
              First Name
            </label>
            <div className="text-slate-500 text-sm font-light leading-5 items-stretch bg-gray-50 justify-center mt-3 px-2 py-6 rounded-md max-md:max-w-full">
              <Input
                type="text"
                id="firstNameInput"
                placeholder="First Name"
                name="firstName"
                // onChange={step2Form.handleChange}
                className="bg-transparent"
              />
            </div>
          </div>
          <div>
            <label
              className="text-slate-700 text-base font-light leading-6 max-md:max-w-full"
              htmlFor="firstNameInput"
            >
              First Name
            </label>
            <div className="text-slate-500 text-sm font-light leading-5 items-stretch bg-gray-50 justify-center mt-3 px-2 py-6 rounded-md max-md:max-w-full">
              <AutocompleteInput />
            </div>
          </div>
          <label
            className="mt-11 text-base font-light leading-6 text-slate-700 max-md:mt-10 max-md:max-w-full"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="justify-center items-stretch px-2 py-7 mt-3 text-xs font-light leading-4 bg-gray-50 rounded-md text-slate-500 max-md:max-w-full"
            id="email"
          />
          <label
            className="mt-11 text-base font-light leading-6 text-slate-700 max-md:mt-10 max-md:max-w-full"
            htmlFor="companyName"
          >
            Company Name
          </label>
          <div className="flex gap-2 justify-between items-stretch px-2 py-7 mt-3 bg-gray-50 rounded-md max-md:flex-wrap max-md:max-w-full">
            <input
              className="grow text-xs font-light leading-4 text-slate-500 max-md:max-w-full"
              id="companyName"
            />
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/eba19c44aa69b32d52b8c351f9dde138ffa6f8d7cf86462b966aac7032b91cea?apiKey=011554aff43544e6af46800a427fd184&"
              className="object-contain object-center shrink-0 w-4 aspect-square"
            />
          </div>
          <button
            className="justify-center items-stretch self-center px-4 py-1.5 mt-8 text-sm font-semibold leading-5 text-white whitespace-nowrap bg-blue-600 rounded"
            aria-label="Invite to Terralab"
          >
            Invite to Terralab
          </button>
        </form>
      </section>
    </div>
  );
};

export default InviteUser;
