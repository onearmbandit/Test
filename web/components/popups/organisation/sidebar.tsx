import React from "react";

const AccountsNav = () => {
  return (
    <div className="flex flex-col items-stretch w-[28%] max-md:w-full max-md:ml-0">
      <div className="items-stretch bg-gray-50 flex w-full grow rounded-s-lg flex-col mx-auto pt-6 pb-12 px-6 max-md:px-5">
        <h2 className="text-gray-500 text-xs font-bold leading-4">Accounts</h2>
        <div className="items-stretch bg-gray-100 bg-opacity-0 flex flex-col mt-2.5 py-3.5">
          <div
            aria-label="User full name"
            className="overflow-hidden text-slate-800 text-ellipsis text-sm font-bold leading-5 whitespace-nowrap"
          >
            John Smith
          </div>
          <div
            aria-label="User email"
            className="overflow-hidden text-gray-500 text-ellipsis text-xs leading-4"
          >
            johnsmith@pepsico.com
          </div>
        </div>
        <span className="items-center hover:bg-blue-50 hover:text-blue-700 cursor-default flex justify-between gap-3 mt-2.5 px-2.5 py-1.5 rounded-md">
          <a
            href="#"
            className="aspect-square object-contain object-center w-4 overflow-hidden shrink-0 max-w-full my-auto"
          >
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/1905b383fa92fd8617ddcdb4231b581c79dc55e495e9cb3e4c5d960c1347e2a7?apiKey=011554aff43544e6af46800a427fd184&"
              alt="Account icon"
            />
          </a>
          <div className="text-xs font-medium leading-5 self-stretch grow whitespace-nowrap">
            My account
          </div>
        </span>
        <span className="items-center hover:bg-blue-50 hover:text-blue-700 flex cursor-default justify-between gap-3 mt-2.5 mb-60 px-2 py-1.5 rounded-md max-md:mb-10 max-md:pr-5">
          <a
            href="#"
            className="aspect-square object-contain object-center w-4 overflow-hidden shrink-0 max-w-full my-auto"
          >
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/6a8109a28d027733b2973f335a1a6505c2a85e896493267b51fd050ddb9dfb2b?apiKey=011554aff43544e6af46800a427fd184&"
              alt="Organization icon"
            />
          </a>
          <div className="text-xs font-medium leading-5 self-stretch grow whitespace-nowrap">
            Organization account
          </div>
        </span>
      </div>
    </div>
  );
};

export default AccountsNav;
