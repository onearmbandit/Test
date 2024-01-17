import React from "react";

const Dashboard = () => {
  return (
    <div className="justify-center items-stretch content-start flex-wrap shadow bg-gray-50 flex flex-col pb-6 w-full">
      <div className="justify-between items-center flex w-full gap-5 pl-8 pr-10 py-2 max-md:max-w-full max-md:flex-wrap max-md:px-5">
        <div className="overflow-hidden text-slate-800 text-ellipsis text-base font-semibold leading-6 my-auto">
          Pepsi Co
        </div>
        <div className="justify-center self-stretch flex flex-col pl-16 py-6 items-end max-md:max-w-full max-md:pl-5">
          <div className="text-gray-900 text-xs font-medium leading-4 whitespace-nowrap justify-center items-stretch bg-gray-50 p-2 rounded-md">
            NAICS: 3241
          </div>
        </div>
      </div>
      <div className="items-stretch flex w-full flex-col pb-6 px-9 max-md:max-w-full max-md:px-5">
        <div className="justify-center items-stretch border border-[color:var(--Gray-50,#F9FAFB)] bg-white flex flex-col px-14 py-12 rounded-lg border-solid max-md:max-w-full max-md:px-5">
          <div className="max-md:max-w-full">
            <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
              <div className="flex flex-col items-stretch w-[33%] max-md:w-full max-md:ml-0">
                <div className="items-stretch border border-[color:var(--Gray-100,#F3F4F6)] shadow-sm bg-white flex grow flex-col w-full pt-7 pb-3 px-11 border-solid max-md:mt-2.5 max-md:px-5">
                  <div className="text-slate-800 text-center text-base font-bold leading-4 whitespace-nowrap">
                    Total Product Level Emissions
                  </div>
                  <div className="text-slate-800 text-center text-5xl font-bold leading-[84px] self-center whitespace-nowrap mt-16 max-md:text-4xl max-md:leading-[78px] max-md:mt-10">
                    7,380.72
                  </div>
                  <div className="text-gray-500 text-center text-sm font-bold leading-4 self-center whitespace-nowrap mt-20 max-md:mt-10">
                    tCO2e
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-stretch w-[67%] ml-5 max-md:w-full max-md:ml-0">
                <div className="justify-between border border-[color:var(--Gray-100,#F3F4F6)] shadow-sm bg-white flex grow flex-col w-full py-4 rounded-lg border-solid items-end max-md:max-w-full max-md:mt-2.5">
                  <div className="flex gap-4 mr-7 items-start max-md:mr-2.5">
                    <div className="justify-center items-stretch rounded border border-[color:var(--Gray-200,#E5E7EB)] shadow-sm bg-white flex grow basis-[0%] flex-col px-2.5 py-1 border-solid">
                      <div className="justify-between items-stretch flex gap-1">
                        <div className="text-gray-800 text-xs font-semibold leading-4 grow whitespace-nowrap">
                          All Product Ty..
                        </div>
                        <img
                          loading="lazy"
                          src="https://cdn.builder.io/api/v1/image/assets/TEMP/8067aef4562be8ab67ababa81eef48b726f3872a0733b97b173588d42834e3c2?apiKey=002bbebf53d24be9931c4a3693df9457&"
                          className="aspect-square object-contain object-center w-4 overflow-hidden shrink-0 max-w-full"
                        />
                      </div>
                    </div>
                    <div className="justify-center items-stretch rounded border border-[color:var(--Gray-200,#E5E7EB)] shadow-sm bg-white flex grow basis-[0%] flex-col px-2.5 py-1 border-solid">
                      <div className="justify-between items-stretch flex gap-5">
                        <div className="text-gray-800 text-xs font-semibold leading-4">
                          All Time{" "}
                        </div>
                        <img
                          loading="lazy"
                          src="https://cdn.builder.io/api/v1/image/assets/TEMP/8067aef4562be8ab67ababa81eef48b726f3872a0733b97b173588d42834e3c2?apiKey=002bbebf53d24be9931c4a3693df9457&"
                          className="aspect-square object-contain object-center w-4 overflow-hidden shrink-0 max-w-full"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="self-stretch flex flex-col mt-3 pl-8 items-start max-md:max-w-full max-md:pl-5">
                    <div className="self-stretch flex items-stretch justify-between gap-5 max-md:max-w-full max-md:flex-wrap">
                      <div className="text-slate-800 text-2xl font-bold leading-7 grow shrink basis-auto max-md:max-w-full">
                        Scope 3 Emissions by Product Type
                      </div>
                      <div className="text-gray-500 text-center text-sm font-bold leading-4 mt-3 self-start">
                        tCO2e
                      </div>
                    </div>
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/866857e163dde3b8522f2c8fa363071db0d98962ec2a8433ce4d05e29134863b?apiKey=002bbebf53d24be9931c4a3693df9457&"
                      className="aspect-[610] object-contain object-center w-[610px] stroke-[1px] stroke-slate-200 overflow-hidden max-w-full mt-5"
                    />
                    <div className="self-stretch flex w-full items-center justify-between gap-5 mt-2.5 px-px max-md:max-w-full max-md:flex-wrap">
                      <div className="flex flex-col my-auto max-md:max-w-full">
                        <div className="text-slate-700 text-sm leading-4 self-stretch max-md:max-w-full">
                          Food Packaging
                        </div>
                        <div className="rounded bg-green-200 self-stretch flex shrink-0 h-4 flex-col mt-1.5 max-md:max-w-full" />
                        <div className="text-slate-700 text-sm leading-4 self-stretch mt-5 max-md:max-w-full">
                          Accessories
                        </div>
                        <div className="rounded bg-green-200 self-stretch flex shrink-0 h-4 flex-col mt-2.5 max-md:max-w-full" />
                        <div className="text-slate-700 text-sm leading-4 self-stretch mt-5 max-md:max-w-full">
                          Textile
                        </div>
                        <div className="rounded bg-green-200 flex w-[124px] shrink-0 h-4 flex-col mt-2 self-start" />
                        <div className="text-slate-700 text-sm leading-4 self-stretch mt-5 max-md:max-w-full">
                          Paper Packaging
                        </div>
                        <div className="rounded bg-green-200 flex w-[27px] shrink-0 h-4 flex-col mt-1.5 self-start" />
                      </div>
                      <div className="self-stretch flex justify-between gap-5 items-start">
                        <div className="flex flex-col mt-2">
                          <div className="text-slate-700 text-right text-xs font-medium leading-4 self-stretch whitespace-nowrap">
                            121,799
                          </div>
                          <div className="text-slate-700 text-right text-xs font-medium leading-4 self-stretch whitespace-nowrap mt-11 max-md:mt-10">
                            50,799
                          </div>
                          <div className="text-slate-700 text-right text-xs font-medium leading-4 self-stretch whitespace-nowrap mt-11 max-md:mt-10">
                            25,567
                          </div>
                          <div className="text-slate-700 text-right text-xs font-medium leading-4 whitespace-nowrap ml-3 mt-11 self-start max-md:ml-2.5 max-md:mt-10">
                            5,789
                          </div>
                        </div>
                        <div className="self-stretch bg-gray-300 flex w-px shrink-0 h-[212px] flex-col rounded-2xl" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="items-stretch rounded-3xl bg-gray-100 flex justify-between gap-5 mt-6 pl-1.5 pr-3 py-3 max-md:max-w-full max-md:flex-wrap">
          <div className="text-slate-800 text-xs font-bold leading-4 self-center grow my-auto max-md:max-w-full">
            Suppliers{" "}
          </div>
          <div className="justify-between items-center rounded bg-blue-600 flex gap-1.5 px-3.5 py-1.5">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/35ed8cc5f71095d3aff19bf2708a39b7dd1d5e066ad7fcd829e3df59ff8f8482?apiKey=002bbebf53d24be9931c4a3693df9457&"
              className="aspect-square object-contain object-center w-4 overflow-hidden shrink-0 max-w-full my-auto"
            />
            <div className="text-white text-sm font-semibold leading-5 self-stretch grow whitespace-nowrap">
              Add New Supplier
            </div>
          </div>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/923fe2f0d012272e031bb4401be096c1dfa92c06a21ef54140386123f8ccff12?apiKey=002bbebf53d24be9931c4a3693df9457&"
            className="aspect-square object-contain object-center w-4 overflow-hidden self-center shrink-0 max-w-full my-auto"
          />
        </div>
        <div className="items-stretch border-b-[color:var(--Gray-200,#E5E7EB)] flex justify-between gap-5 pr-3 py-2.5 border-b border-solid max-md:max-w-full max-md:flex-wrap">
          <div className="overflow-hidden text-slate-800 text-ellipsis text-sm font-bold leading-5 grow whitespace-nowrap">
            Supplier
          </div>
          <div className="overflow-hidden text-slate-800 text-ellipsis text-sm font-bold leading-5">
            Product Type
          </div>
          <div className="overflow-hidden text-slate-800 text-ellipsis text-sm font-bold leading-5">
            Product Name{" "}
          </div>
          <div className="overflow-hidden text-slate-800 text-ellipsis text-sm font-bold leading-5">
            Product Level Contribution
          </div>
          <div className="overflow-hidden text-slate-800 text-ellipsis text-sm font-bold leading-5 grow whitespace-nowrap">
            Last Updated
          </div>
        </div>
        <div className="items-start border-t-[color:var(--Gray-200,#E5E7EB)] flex gap-0 border-t border-solid max-md:max-w-full max-md:flex-wrap">
          <div className="items-center border-r-[color:var(--Gray-200,#E5E7EB)] self-stretch flex justify-between gap-2 px-1.5 py-2.5 border-r border-solid">
            <div className="rounded border border-[color:var(--Gray-200,#E5E7EB)] bg-white flex w-4 shrink-0 h-4 flex-col my-auto border-solid" />
            <div className="overflow-hidden text-slate-800 text-ellipsis text-sm leading-5 self-stretch grow whitespace-nowrap">
              Supplier
            </div>
          </div>
          <div className="overflow-hidden text-slate-800 text-ellipsis text-sm leading-5 whitespace-nowrap items-stretch border-r-[color:var(--Gray-200,#E5E7EB)] self-stretch grow justify-center px-4 py-2.5 border-r border-solid">
            Food Packaging{" "}
          </div>
          <div className="overflow-hidden text-slate-800 text-ellipsis text-sm leading-5 whitespace-nowrap items-stretch border-r-[color:var(--Gray-200,#E5E7EB)] self-stretch grow justify-center px-4 py-2.5 border-r border-solid">
            Lays Chips
          </div>
          <div className="overflow-hidden text-slate-700 text-ellipsis text-base leading-4 my-auto">
            662 tCO2e
          </div>
          <div className="overflow-hidden text-slate-800 text-ellipsis text-sm leading-5 whitespace-nowrap items-stretch border-l-[color:var(--Gray-200,#E5E7EB)] self-stretch grow justify-center pl-4 pr-1.5 py-2.5 border-l border-solid">
            12/20/23
          </div>
        </div>
        <div className="items-start border-t-[color:var(--Gray-200,#E5E7EB)] flex gap-0 border-t border-solid max-md:max-w-full max-md:flex-wrap">
          <div className="items-center border-r-[color:var(--Gray-200,#E5E7EB)] self-stretch flex justify-between gap-2 px-1.5 py-2.5 border-r border-solid">
            <div className="rounded border border-[color:var(--Gray-200,#E5E7EB)] bg-white flex w-4 shrink-0 h-4 flex-col my-auto border-solid" />
            <div className="overflow-hidden text-slate-800 text-ellipsis text-sm leading-5 self-stretch grow whitespace-nowrap">
              Supplier
            </div>
          </div>
          <div className="overflow-hidden text-slate-800 text-ellipsis text-sm leading-5 whitespace-nowrap items-stretch border-r-[color:var(--Gray-200,#E5E7EB)] self-stretch grow justify-center px-4 py-2.5 border-r border-solid">
            Food Packaging{" "}
          </div>
          <div className="overflow-hidden text-slate-800 text-ellipsis text-sm leading-5 whitespace-nowrap items-stretch border-r-[color:var(--Gray-200,#E5E7EB)] self-stretch grow justify-center px-4 py-2.5 border-r border-solid">
            Lays Chips
          </div>
          <div className="overflow-hidden text-slate-700 text-ellipsis text-base leading-4 my-auto">
            662 tCO2e
          </div>
          <div className="overflow-hidden text-slate-800 text-ellipsis text-sm leading-5 whitespace-nowrap items-stretch border-l-[color:var(--Gray-200,#E5E7EB)] self-stretch grow justify-center pl-4 pr-1.5 py-2.5 border-l border-solid">
            12/20/23
          </div>
        </div>
        <div className="items-start border-t-[color:var(--Gray-200,#E5E7EB)] flex gap-0 border-t border-solid max-md:max-w-full max-md:flex-wrap">
          <div className="items-center border-r-[color:var(--Gray-200,#E5E7EB)] self-stretch flex justify-between gap-2 px-1.5 py-2.5 border-r border-solid">
            <div className="rounded border border-[color:var(--Gray-200,#E5E7EB)] bg-white flex w-4 shrink-0 h-4 flex-col my-auto border-solid" />
            <div className="overflow-hidden text-slate-800 text-ellipsis text-sm leading-5 self-stretch grow whitespace-nowrap">
              Supplier
            </div>
          </div>
          <div className="overflow-hidden text-slate-800 text-ellipsis text-sm leading-5 whitespace-nowrap items-stretch border-r-[color:var(--Gray-200,#E5E7EB)] self-stretch grow justify-center px-4 py-2.5 border-r border-solid">
            Food Packaging{" "}
          </div>
          <div className="overflow-hidden text-slate-800 text-ellipsis text-sm leading-5 whitespace-nowrap items-stretch border-r-[color:var(--Gray-200,#E5E7EB)] self-stretch grow justify-center px-4 py-2.5 border-r border-solid">
            Lays Chips
          </div>
          <div className="overflow-hidden text-slate-700 text-ellipsis text-base leading-4 my-auto">
            662 tCO2e
          </div>
          <div className="overflow-hidden text-slate-800 text-ellipsis text-sm leading-5 whitespace-nowrap items-stretch border-l-[color:var(--Gray-200,#E5E7EB)] self-stretch grow justify-center pl-4 pr-1.5 py-2.5 border-l border-solid">
            12/20/23
          </div>
        </div>
        <div className="items-start border-t-[color:var(--Gray-200,#E5E7EB)] flex gap-0 border-t border-solid max-md:max-w-full max-md:flex-wrap">
          <div className="items-center border-r-[color:var(--Gray-200,#E5E7EB)] self-stretch flex justify-between gap-2 px-1.5 py-2.5 border-r border-solid">
            <div className="rounded border border-[color:var(--Gray-200,#E5E7EB)] bg-white flex w-4 shrink-0 h-4 flex-col my-auto border-solid" />
            <div className="overflow-hidden text-slate-800 text-ellipsis text-sm leading-5 self-stretch grow whitespace-nowrap">
              Supplier
            </div>
          </div>
          <div className="overflow-hidden text-slate-800 text-ellipsis text-sm leading-5 whitespace-nowrap items-stretch border-r-[color:var(--Gray-200,#E5E7EB)] self-stretch grow justify-center px-4 py-2.5 border-r border-solid">
            Food Packaging{" "}
          </div>
          <div className="overflow-hidden text-slate-800 text-ellipsis text-sm leading-5 whitespace-nowrap items-stretch border-r-[color:var(--Gray-200,#E5E7EB)] self-stretch grow justify-center px-4 py-2.5 border-r border-solid">
            Lays Chips
          </div>
          <div className="overflow-hidden text-slate-700 text-ellipsis text-base leading-4 my-auto">
            662 tCO2e
          </div>
          <div className="overflow-hidden text-slate-800 text-ellipsis text-sm leading-5 whitespace-nowrap items-stretch border-l-[color:var(--Gray-200,#E5E7EB)] self-stretch grow justify-center pl-4 pr-1.5 py-2.5 border-l border-solid">
            12/20/23
          </div>
        </div>
        <div className="items-start border-t-[color:var(--Gray-200,#E5E7EB)] flex gap-0 border-t border-solid max-md:max-w-full max-md:flex-wrap">
          <div className="items-center border-r-[color:var(--Gray-200,#E5E7EB)] self-stretch flex justify-between gap-2 px-1.5 py-2.5 border-r border-solid">
            <div className="rounded border border-[color:var(--Gray-200,#E5E7EB)] bg-white flex w-4 shrink-0 h-4 flex-col my-auto border-solid" />
            <div className="overflow-hidden text-slate-800 text-ellipsis text-sm leading-5 self-stretch grow whitespace-nowrap">
              Supplier
            </div>
          </div>
          <div className="overflow-hidden text-slate-800 text-ellipsis text-sm leading-5 whitespace-nowrap items-stretch border-r-[color:var(--Gray-200,#E5E7EB)] self-stretch grow justify-center px-4 py-2.5 border-r border-solid">
            Food Packaging{" "}
          </div>
          <div className="overflow-hidden text-slate-800 text-ellipsis text-sm leading-5 whitespace-nowrap items-stretch border-r-[color:var(--Gray-200,#E5E7EB)] self-stretch grow justify-center px-4 py-2.5 border-r border-solid">
            Lays Chips
          </div>
          <div className="overflow-hidden text-slate-700 text-ellipsis text-base leading-4 my-auto">
            662 tCO2e
          </div>
          <div className="overflow-hidden text-slate-800 text-ellipsis text-sm leading-5 whitespace-nowrap items-stretch border-l-[color:var(--Gray-200,#E5E7EB)] self-stretch grow justify-center pl-4 pr-1.5 py-2.5 border-l border-solid">
            12/20/23
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
