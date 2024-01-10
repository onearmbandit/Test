import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

const Sidebar = () => {
  return (
    <div className="flex flex-col justify-between w-full h-screen max-w-[240px] px-4 py-5">
      <nav>
        <header className="items-center border-b-[color:var(--Gray-200,#E5E7EB)] flex justify-between gap-2 pl-4 pr-10 py-3.5 border-b border-solid">
          <div className="text-blue-700 text-xs font-semibold leading-4 whitespace-nowrap justify-center items-center bg-blue-100 aspect-square h-8 my-auto px-2.5 rounded-md">
            JS
          </div>
          <div className="justify-center items-stretch self-stretch flex grow basis-[0%] flex-col">
            <h1 className="overflow-hidden text-slate-800 text-ellipsis text-sm font-semibold leading-5 whitespace-nowrap">
              John Smith
            </h1>
            <div className="overflow-hidden text-slate-500 text-ellipsis text-xs leading-4 whitespace-nowrap">
              Pepsi Co
            </div>
          </div>
        </header>

        <div className="items-center hover:bg-blue-100 hover:text-blue-700 text-slate-800 flex justify-between gap-3 mt-3 px-2 py-1.5 rounded-md">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/bcd894161b089fc2fafec369c1aab64c078854be6771a83a03e0d70d255c4b6c?apiKey=002bbebf53d24be9931c4a3693df9457&"
            className="aspect-square object-contain object-center w-4 overflow-hidden shrink-0 max-w-full my-auto"
            alt="Organization Profile"
          />
          <h2 className=" text-xs font-medium leading-5 self-stretch grow whitespace-nowrap">
            Organization Profile
          </h2>
        </div>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1" className="border-none">
            <AccordionTrigger className="hover:bg-blue-100 hover:text-blue-700 rounded-md mt-2 text-slate-800 py-1.5 pr-2">
              <div className="items-stretch  flex gap-3 px-2">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/b850b766d0f674e63a6b0718ba243c74766724f92d078831b8a5885529376d49?apiKey=002bbebf53d24be9931c4a3693df9457&"
                  className="aspect-square object-contain object-center w-4 overflow-hidden self-center shrink-0 max-w-full my-auto"
                  alt="Abatement Projects"
                />
                <h2 className=" text-xs font-medium leading-5 whitespace-nowrap no-underline">
                  Abatement Projects
                </h2>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col items-stretch mt-2 pl-11 space-y-2">
                <div className="text-slate-800 hover:bg-blue-100 hover:text-blue-700  text-xs font-medium leading-5 whitespace-nowrap px-2 py-1.5 rounded-md">
                  Active
                </div>
                <div className="text-slate-800 hover:bg-blue-100 hover:text-blue-700 text-xs font-medium leading-5 whitespace-nowrap px-2 py-1.5 rounded-md">
                  Completed
                </div>
                <div className="text-slate-800 hover:bg-blue-100 hover:text-blue-700 text-xs font-medium leading-5 whitespace-nowrap px-2 py-1.5 rounded-md">
                  Proposed
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="items-center hover:bg-blue-100 hover:text-blue-700 text-slate-800 flex justify-between gap-3 mt-2 px-2 py-1.5 rounded-md">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/0024857dca061deb054aa3045dd442ed1c6fd208940bc020f928e762cfa79b60?apiKey=002bbebf53d24be9931c4a3693df9457&"
            className="aspect-square object-contain object-center w-4 overflow-hidden shrink-0 max-w-full my-auto"
            alt="Supply Chain"
          />
          <h2 className="text-xs font-medium leading-5 self-stretch grow whitespace-nowrap">
            {" "}
            Supply Chain{" "}
          </h2>
        </div>
      </nav>
      <footer>
        <div className="items-center hover:bg-blue-100 hover:text-blue-700 text-slate-800 flex justify-between gap-3 px-2 py-1.5 rounded-md">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/ebe229b307cee73330f224e5c81d60b2de854cad62017f38aaf456bcfda6e98b?apiKey=002bbebf53d24be9931c4a3693df9457&"
            className="aspect-square object-contain object-center w-4 overflow-hidden shrink-0 max-w-full my-auto"
            alt="Accounts"
          />
          <h2 className="text-xs font-medium leading-5 self-stretch grow whitespace-nowrap">
            {" "}
            Accounts{" "}
          </h2>
        </div>
        <div className="items-center hover:bg-blue-100 hover:text-blue-700 text-slate-800 flex justify-between gap-3 px-2 py-1.5 rounded-md">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/cbb943fd5c3f420db74ee2191068d4c338de2ee8484feea8931bf8f1ed52439c?apiKey=002bbebf53d24be9931c4a3693df9457&"
            className="aspect-square object-contain object-center w-4 overflow-hidden shrink-0 max-w-full my-auto"
            alt="Help"
          />
          <h2 className="text-xs font-medium leading-5 self-stretch grow whitespace-nowrap">
            {" "}
            Help{" "}
          </h2>
        </div>
        <div className="text-slate-800 text-xs font-medium leading-5 whitespace-nowrap mt-2">
          Logout
        </div>
      </footer>
    </div>
  );
};

export default Sidebar;
