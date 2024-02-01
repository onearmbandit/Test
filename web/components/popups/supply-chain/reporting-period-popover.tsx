import React, { ReactNode, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Input } from '@/components/ui/input';

const TabsWithDynamicPopover = ({
  sendDatatoTabs,
}: {
  sendDatatoTabs: any;
}) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const dataToSend = {
    startDate: startDate,
    endDate: endDate,
  };
  const renderMonthContent = (
    monthIndex: number,
    shortMonthIndex: string,
    longMonthText: string
  ): ReactNode => {
    const fullYear = new Date(monthIndex).getFullYear();
    const tooltipText = `Tooltip for month: ${longMonthText} ${fullYear}`;

    return (
      <p title={tooltipText} className='p-1.5'>
        {shortMonthIndex}
      </p>
    );
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    sendDatatoTabs(dataToSend);
  };

  return (
    <div className='relative'>
      <div className='absolute left-0 z-40'>
        <section className='flex flex-col items-stretch px-6 py-7 bg-white rounded-sm  shadow-sm border border-gray-50 max-w-[456px]'>
          <form onSubmit={handleSubmit} className='flex flex-col'>
            <div className='flex gap-3 items-stretch pr-7 pl-2 text-xs font-light leading-4 text-slate-700'>
              <label
                className='grow my-auto whitespace-nowrap'
                aria-label='Start Date Label'
              >
                Start Date
              </label>
              <DatePicker
                selected={startDate}
                customInput={
                  <Input className='w-[6.125rem] px-2 bg-gray-50 text-xs font-light text-slate-700' />
                }
                renderMonthContent={renderMonthContent}
                showMonthYearPicker
                dateFormat='yyyy/MM'
                onChange={(date: any) => setStartDate(date)} //only when value has changed
              />
              <label className='my-auto'>End Date</label>
              <DatePicker
                selected={endDate}
                customInput={
                  <Input className='w-[6.125rem] px-2 bg-gray-50 text-xs font-light text-slate-700' />
                }
                renderMonthContent={renderMonthContent}
                showMonthYearPicker
                dateFormat='yyyy/MM'
                onChange={(date: any) => setEndDate(date)} //only when value has changed
              />
            </div>
            <button
              type='submit'
              className='self-end mt-5 mr-4 text-sm font-semibold leading-5 text-blue-600'
              aria-label='Save Button'
              role='button'
            >
              Save
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default TabsWithDynamicPopover;
