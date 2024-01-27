import React from "react";
import Link from "next/link";
import Globe from "./icons/Globe";
import { ChevronDown } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem } from "./ui/accordion";
import { AccordionTrigger } from "@radix-ui/react-accordion";
import ClimateCommitments from "./ClimateCommitments";
import NeedHelp from "./NeedHelp";
import AutocompleteInput from "./Autocomplete";

const Dashboard = () => {
  return (
    <div className="items-center w-full min-h-screen shadow bg-gray-50 flex flex-col px-8 pb-8 max-md:px-5">
      <header className="overflow-hidden text-slate-800 text-ellipsis text-lg font-bold leading-7 self-start max-md:max-w-full py-9">
        <span className="text-base leading-6">Organization</span>
      </header>
      <AutocompleteInput />
      <div className="h-full flex justify-center items-center">
        <div className="text-center space-y-6">
          <h3 className="text-slate-700 text-center text-3xl font-semibold leading-9 self-center max-md:max-w-full max-md:mt-10">
            Lets set up your organization profile
          </h3>
          <h4 className="text-slate-700 text-center text-lg font-light leading-7 self-center max-w-[547px] mt-6 max-md:max-w-full">
            We&apos;ll spend a few minutes setting up your company profile so we
            can upload emissions data to share with your clients.
          </h4>
          <div className="flex flex-col space-y-3">
            <Link
              // as={"p"}
              href={"/create-organisation"}
              className="text-white text-center text-base font-bold mt-3 leading-6 whitespace-nowrap justify-center items-stretch rounded bg-blue-600 self-center px-6 py-4 max-md:px-5"
              role="button"
            >
              Set up company profile
            </Link>

            <div className="justify-center items-center flex gap-2.5">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="clock">
                  <path
                    id="Vector"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.0001 14.3996C9.69748 14.3996 11.3253 13.7253 12.5256 12.5251C13.7258 11.3249 14.4001 9.69699 14.4001 7.99961C14.4001 6.30222 13.7258 4.67436 12.5256 3.47413C11.3253 2.27389 9.69748 1.59961 8.0001 1.59961C6.30271 1.59961 4.67485 2.27389 3.47461 3.47413C2.27438 4.67436 1.6001 6.30222 1.6001 7.99961C1.6001 9.69699 2.27438 11.3249 3.47461 12.5251C4.67485 13.7253 6.30271 14.3996 8.0001 14.3996ZM8.6001 3.99961C8.6001 3.84048 8.53688 3.68787 8.42436 3.57535C8.31184 3.46282 8.15923 3.39961 8.0001 3.39961C7.84097 3.39961 7.68836 3.46282 7.57583 3.57535C7.46331 3.68787 7.4001 3.84048 7.4001 3.99961V7.99961C7.4001 8.33081 7.6689 8.59961 8.0001 8.59961H11.2001C11.3592 8.59961 11.5118 8.5364 11.6244 8.42387C11.7369 8.31135 11.8001 8.15874 11.8001 7.99961C11.8001 7.84048 11.7369 7.68787 11.6244 7.57535C11.5118 7.46282 11.3592 7.39961 11.2001 7.39961H8.6001V3.99961Z"
                    fill="#64748B"
                  />
                </g>
              </svg>

              <div className="text-gray-600 text-center text-sm font-bold leading-5 self-stretch whitespace-nowrap">
                Takes 5 minutes
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <ClimateCommitments />
      <NeedHelp /> */}
    </div>
  );
};

export default Dashboard;
