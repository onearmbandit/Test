'use client';
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import Accounts from './popups/accounts/accounts';
import { signOut, useSession } from 'next-auth/react';
import { ChevronDown, MailPlus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn, isSuperAdmin } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { exportSupplierDataCsv } from '@/services/user.api';
import { toast } from 'sonner';

const Sidebar = () => {
  const pathname = usePathname();
  const session = useSession();

  const firstName = session?.data?.user?.first_name || '';
  const lastName = session?.data?.user?.last_name || '';

  const firstLetterOfFirstName = firstName.charAt(0);
  const firstLetterOfLastName = lastName.charAt(0);

  const organizationLinks = ['/facilities'];
  const supplychainLinks = ['/supply-chain'];

  function urlContainsElements(url: string, elements: string[]) {
    for (const element of elements) {
      if (url.includes(element)) {
        return true;
      }
    }
    return false;
  }

  const superAdmin: Boolean = isSuperAdmin(
    session?.data?.user?.roles,
    'super-admin'
  );

  const { mutate, isSuccess, isPending } = useMutation({
    mutationKey: ['supplier-data-csv'],
    mutationFn: exportSupplierDataCsv,
    onSuccess: (data: any) => {
      // Create a Blob from the response data
      if (data) {
        // Extract the filename from the response
        const fileName = data.fileName || 'suppliers.csv';

        // Decode the base64-encoded CSV data
        const csvData = atob(data.csv);

        // Create a Blob from the decoded CSV data
        const blob = new Blob([csvData], { type: 'application/csv' });

        // Create a link element to trigger the download
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;

        // Append the link to the document and trigger the download
        document.body.appendChild(link);
        link.click();

        // Clean up by removing the link element
        document.body.removeChild(link);

        toast.success('Data exported successfully');
      }
      toast.success('Data exported successfully');
    },
    onError: (error) => {
      toast.error('Error exporting data:' + error.message);
    },
  });

  return (
    <div className='flex flex-col sticky top-0 bg-gray-50 border-r border-gray-200 justify-between w-full h-screen max-w-[240px] px-4 py-5'>
      <nav>
        <header className='items-center border-b-[color:var(--Gray-200,#E5E7EB)] flex justify-between gap-2 pl-4 pr-10 py-3.5 border-b border-solid'>
          <div className='text-blue-700 text-xs font-semibold leading-4 whitespace-nowrap flex justify-center items-center bg-blue-100 aspect-square h-8 my-auto px-2.5 rounded-md'>
            {firstLetterOfFirstName}
            {firstLetterOfLastName}
          </div>
          <div className='justify-center items-stretch self-stretch flex grow basis-[0%] flex-col'>
            <h1 className='overflow-hidden text-slate-800 text-ellipsis text-sm font-semibold leading-5 whitespace-nowrap'>
              {session.data?.user?.first_name} {session.data?.user?.last_name}
            </h1>
            <div className='overflow-hidden text-slate-500 text-ellipsis text-xs leading-4 whitespace-nowrap'>
              {session.data?.user?.organizations[0]?.company_name}
            </div>
          </div>
        </header>

        <Link
          href={'/'}
          className={cn(
            'items-center hover:bg-blue-100 group hover:text-blue-700 text-slate-800 flex justify-between gap-3 mt-3 px-2 py-1.5 rounded-md',
            urlContainsElements(pathname, organizationLinks) ||
              (pathname == '/' &&
                'bg-blue-100 text-blue-700 [&>svg]:fill-blue-500')
          )}
        >
          <svg
            width='16'
            height='16'
            viewBox='0 0 16 16'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className='fill-gray-500 group-hover:fill-blue-500'
          >
            <g id='home'>
              <path
                id='Vector'
                fillRule='evenodd'
                clipRule='evenodd'
                d='M7.43482 1.83482C7.58484 1.68484 7.78828 1.60059 8.00042 1.60059C8.21255 1.60059 8.41599 1.68484 8.56602 1.83482L14.166 7.43482C14.2779 7.5467 14.354 7.68923 14.3849 7.84439C14.4157 7.99955 14.3999 8.16038 14.3394 8.30654C14.2788 8.4527 14.1763 8.57763 14.0448 8.66554C13.9133 8.75344 13.7586 8.80038 13.6004 8.80042H12.8004V13.6004C12.8004 13.8126 12.7161 14.0161 12.5661 14.1661C12.4161 14.3161 12.2126 14.4004 12.0004 14.4004H10.4004C10.1882 14.4004 9.98476 14.3161 9.83473 14.1661C9.6847 14.0161 9.60042 13.8126 9.60042 13.6004V11.2004C9.60042 10.9882 9.51613 10.7848 9.3661 10.6347C9.21607 10.4847 9.01259 10.4004 8.80042 10.4004H7.20042C6.98824 10.4004 6.78476 10.4847 6.63473 10.6347C6.4847 10.7848 6.40042 10.9882 6.40042 11.2004V13.6004C6.40042 13.8126 6.31613 14.0161 6.1661 14.1661C6.01607 14.3161 5.81259 14.4004 5.60042 14.4004H4.00042C3.78824 14.4004 3.58476 14.3161 3.43473 14.1661C3.2847 14.0161 3.20042 13.8126 3.20042 13.6004V8.80042H2.40042C2.24222 8.80038 2.08758 8.75344 1.95605 8.66554C1.82452 8.57763 1.72201 8.4527 1.66147 8.30654C1.60094 8.16038 1.58509 7.99955 1.61595 7.84439C1.6468 7.68923 1.72297 7.5467 1.83482 7.43482L7.43482 1.83482Z'
              />
            </g>
          </svg>

          <h2 className=' text-xs font-medium leading-5 self-stretch grow whitespace-nowrap'>
            Organization Profile
          </h2>
        </Link>
        <Accordion type='single' collapsible>
          <AccordionItem value='item-1' className='border-none'>
            <AccordionTrigger className='hover:bg-blue-100 group hover:text-blue-700 rounded-md mt-2 text-slate-800 py-1.5 pr-2'>
              <div className='items-stretch flex gap-3 px-2'>
                <svg
                  width='16'
                  height='16'
                  viewBox='0 0 16 16'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                  className='group-hover:fill-blue-600 fill-gray-500'
                >
                  <g id='folder-open'>
                    <path
                      id='Vector'
                      d='M3.8002 2.40039C3.4289 2.40039 3.07281 2.54789 2.81025 2.81044C2.5477 3.07299 2.4002 3.42909 2.4002 3.80039V6.00199L2.4834 6.00039H13.517C13.545 6.00039 13.573 6.00039 13.6002 6.00199V5.40039C13.6002 5.02909 13.4527 4.67299 13.1902 4.41044C12.9276 4.14789 12.5715 4.00039 12.2002 4.00039H9.1314C9.10512 4.00044 9.07909 3.9953 9.05479 3.98528C9.03049 3.97526 9.00841 3.96055 8.9898 3.94199L7.8586 2.81079C7.5962 2.5482 7.24024 2.40058 6.869 2.40039H3.8002ZM2.4834 7.20039C2.26426 7.20033 2.04817 7.25171 1.85251 7.3504C1.65685 7.44909 1.48709 7.59234 1.35689 7.76861C1.22669 7.94488 1.13969 8.14925 1.10289 8.36528C1.06609 8.5813 1.08051 8.80295 1.145 9.01239L2.253 12.6124C2.34108 12.8984 2.51849 13.1487 2.75922 13.3265C2.99995 13.5043 3.29132 13.6003 3.5906 13.6004H12.409C12.7084 13.6005 13 13.5046 13.2409 13.3267C13.4818 13.1489 13.6593 12.8985 13.7474 12.6124L14.8546 9.01239C14.9191 8.80302 14.9335 8.58144 14.8967 8.36547C14.86 8.14951 14.7731 7.94518 14.643 7.76893C14.5128 7.59268 14.3432 7.44942 14.1476 7.35067C13.9521 7.25193 13.7361 7.20045 13.517 7.20039H2.4834Z'
                    />
                  </g>
                </svg>
                <h2 className=' text-xs font-medium leading-5 whitespace-nowrap no-underline'>
                  Abatement Projects
                </h2>
              </div>
              <ChevronDown className='h-4 w-4 text-slate-500 shrink-0 transition-transform duration-200' />
            </AccordionTrigger>
            <AccordionContent>
              <div className='flex flex-col items-stretch mt-2 space-y-2'>
                <Link
                  href={'/abatement-projects/active'}
                  className={cn(
                    'text-slate-800 pl-9 hover:bg-blue-100 hover:text-blue-700  text-xs font-medium leading-5 whitespace-nowrap py-1.5 rounded-md',
                    urlContainsElements(pathname, ['active']) &&
                      'bg-blue-100 text-blue-700 pl-9'
                  )}
                >
                  Active
                </Link>
                <Link href='/abatement-projects/completed'>
                  <div
                    className={cn(
                      'text-slate-800 pl-9 hover:bg-blue-100 hover:text-blue-700 text-xs font-medium leading-5 whitespace-nowrap py-1.5 rounded-md',
                      urlContainsElements(pathname, ['completed']) &&
                        'bg-blue-100 text-blue-700'
                    )}
                  >
                    Completed
                  </div>
                </Link>
                <Link href='/abatement-projects/proposed'>
                  <div
                    className={cn(
                      'text-slate-800 pl-9 hover:bg-blue-100 hover:text-blue-700 text-xs font-medium leading-5 whitespace-nowrap py-1.5 rounded-md',
                      urlContainsElements(pathname, ['proposed']) &&
                        'bg-blue-100 text-blue-700'
                    )}
                  >
                    Proposed
                  </div>
                </Link>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Link
          href={'/supply-chain'}
          className={cn(
            'items-center hover:bg-blue-100 group hover:text-blue-700 text-slate-800 flex justify-between gap-3 mt-3 px-2 py-1.5 rounded-md',
            pathname == '/supply-chain' &&
              'bg-blue-100 text-blue-700 [&>svg]:fill-blue-500'
          )}
        >
          <svg
            width='16'
            height='16'
            viewBox='0 0 16 16'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className='fill-gray-500 group-hover:fill-blue-600'
          >
            <g id='chart-bar'>
              <path
                id='Vector'
                d='M12.3996 1.59961C12.0813 1.59961 11.7761 1.72604 11.5511 1.95108C11.326 2.17612 11.1996 2.48135 11.1996 2.79961V13.1996C11.1996 13.5179 11.326 13.8231 11.5511 14.0481C11.7761 14.2732 12.0813 14.3996 12.3996 14.3996H13.1996C13.5179 14.3996 13.8231 14.2732 14.0481 14.0481C14.2732 13.8231 14.3996 13.5179 14.3996 13.1996V2.79961C14.3996 2.48135 14.2732 2.17612 14.0481 1.95108C13.8231 1.72604 13.5179 1.59961 13.1996 1.59961H12.3996ZM7.59961 4.79961C7.28135 4.79961 6.97612 4.92604 6.75108 5.15108C6.52604 5.37612 6.39961 5.68135 6.39961 5.99961V13.1996C6.39961 13.5179 6.52604 13.8231 6.75108 14.0481C6.97612 14.2732 7.28135 14.3996 7.59961 14.3996H8.39961C8.71787 14.3996 9.02309 14.2732 9.24814 14.0481C9.47318 13.8231 9.59961 13.5179 9.59961 13.1996V5.99961C9.59961 5.68135 9.47318 5.37612 9.24814 5.15108C9.02309 4.92604 8.71787 4.79961 8.39961 4.79961H7.59961ZM2.79961 7.99961C2.48135 7.99961 2.17612 8.12604 1.95108 8.35108C1.72604 8.57612 1.59961 8.88135 1.59961 9.19961V13.1996C1.59961 13.5179 1.72604 13.8231 1.95108 14.0481C2.17612 14.2732 2.48135 14.3996 2.79961 14.3996H3.59961C3.91787 14.3996 4.22309 14.2732 4.44814 14.0481C4.67318 13.8231 4.79961 13.5179 4.79961 13.1996V9.19961C4.79961 8.88135 4.67318 8.57612 4.44814 8.35108C4.22309 8.12604 3.91787 7.99961 3.59961 7.99961H2.79961Z'
              />
            </g>
          </svg>

          <h2 className='text-xs font-medium leading-5 self-stretch grow whitespace-nowrap'>
            Supply Chain
          </h2>
        </Link>
        {superAdmin && (
          <>
            <Link
              href={'/invite-organization'}
              className='items-center group hover:bg-blue-100 hover:text-blue-700 text-slate-800 flex justify-between gap-3 mt-2 px-2 py-1.5 rounded-md'
            >
              <MailPlus />

              <h2 className='text-xs font-medium leading-5 self-stretch grow whitespace-nowrap'>
                Invite Organization (For test)
              </h2>
            </Link>
            <span
              role='button'
              onClick={() =>
                mutate({
                  organizationId: session.data?.user?.organizations[0]?.id,
                  supplyChainReportingPeriodId:
                    'e9e5112f-cd18-45ad-bf8e-fefb9dc63a76',
                })
              }
            >
              Export Supplier data
            </span>
          </>
        )}
      </nav>
      <footer>
        <Dialog>
          <DialogTrigger className='w-full'>
            <div className='items-center hover:bg-blue-100 hover:text-blue-700 group text-slate-800 flex gap-3 px-2 py-1.5 rounded-md'>
              <svg
                width='16'
                height='16'
                viewBox='0 0 16 16'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                className='fill-gray-500 group-hover:fill-blue-600'
              >
                <g id='user-circle'>
                  <path
                    id='Vector'
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M14.3996 8.00156C14.3996 9.69895 13.7253 11.3268 12.5251 12.527C11.3249 13.7273 9.69699 14.4016 7.99961 14.4016C6.30222 14.4016 4.67436 13.7273 3.47413 12.527C2.27389 11.3268 1.59961 9.69895 1.59961 8.00156C1.59961 6.30418 2.27389 4.67631 3.47413 3.47608C4.67436 2.27585 6.30222 1.60156 7.99961 1.60156C9.69699 1.60156 11.3249 2.27585 12.5251 3.47608C13.7253 4.67631 14.3996 6.30418 14.3996 8.00156ZM9.99961 6.00156C9.99961 6.532 9.7889 7.0407 9.41382 7.41578C9.03875 7.79085 8.53004 8.00156 7.99961 8.00156C7.46918 8.00156 6.96047 7.79085 6.5854 7.41578C6.21032 7.0407 5.99961 6.532 5.99961 6.00156C5.99961 5.47113 6.21032 4.96242 6.5854 4.58735C6.96047 4.21228 7.46918 4.00156 7.99961 4.00156C8.53004 4.00156 9.03875 4.21228 9.41382 4.58735C9.7889 4.96242 9.99961 5.47113 9.99961 6.00156ZM7.99961 9.60156C7.25595 9.60088 6.52233 9.77329 5.85681 10.1051C5.1913 10.437 4.61215 10.9192 4.16521 11.5136C4.6518 12.0461 5.24415 12.4713 5.90438 12.762C6.56462 13.0526 7.27823 13.2023 7.99961 13.2016C8.72099 13.2023 9.4346 13.0526 10.0948 12.762C10.7551 12.4713 11.3474 12.0461 11.834 11.5136C11.3871 10.9192 10.8079 10.437 10.1424 10.1051C9.47689 9.77329 8.74327 9.60088 7.99961 9.60156Z'
                  />
                </g>
              </svg>

              <h2 className='text-xs font-medium leading-5 self-stretch whitespace-nowrap'>
                Accounts
              </h2>
            </div>
          </DialogTrigger>
          <DialogContent className='shadow w-full max-w-[857px] rounded-lg h-full max-h-[551px] p-0'>
            <Accounts />
          </DialogContent>
        </Dialog>

        <div className='items-center hover:bg-blue-100 hover:text-blue-700 group text-slate-800 flex justify-between gap-3 px-2 py-1.5 rounded-md'>
          <svg
            width='16'
            height='16'
            viewBox='0 0 16 16'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className='fill-gray-500 group-hover:fill-blue-600'
          >
            <g id='question-mark-circle'>
              <path
                id='Vector'
                fillRule='evenodd'
                clipRule='evenodd'
                d='M14.3996 8.00156C14.3996 9.69895 13.7253 11.3268 12.5251 12.527C11.3249 13.7273 9.69699 14.4016 7.99961 14.4016C6.30222 14.4016 4.67436 13.7273 3.47413 12.527C2.27389 11.3268 1.59961 9.69895 1.59961 8.00156C1.59961 6.30418 2.27389 4.67631 3.47413 3.47608C4.67436 2.27585 6.30222 1.60156 7.99961 1.60156C9.69699 1.60156 11.3249 2.27585 12.5251 3.47608C13.7253 4.67631 14.3996 6.30418 14.3996 8.00156ZM7.15161 5.55356C7.09588 5.6093 7.02971 5.65351 6.95689 5.68367C6.88407 5.71383 6.80603 5.72935 6.72721 5.72935C6.64839 5.72935 6.57034 5.71383 6.49753 5.68367C6.42471 5.65351 6.35854 5.6093 6.30281 5.55356C6.24708 5.49783 6.20287 5.43166 6.1727 5.35885C6.14254 5.28603 6.12702 5.20798 6.12702 5.12916C6.12702 5.05034 6.14254 4.9723 6.1727 4.89948C6.20287 4.82666 6.24708 4.7605 6.30281 4.70476C6.56377 4.44376 6.8814 4.24646 7.23103 4.1282C7.58065 4.00994 7.95284 3.97391 8.31865 4.02291C8.68446 4.07191 9.03405 4.20462 9.34022 4.41073C9.6464 4.61683 9.90091 4.89077 10.084 5.21125C10.267 5.53173 10.3737 5.89011 10.3957 6.25853C10.4178 6.62696 10.3545 6.9955 10.2109 7.33549C10.0673 7.67549 9.8472 7.97778 9.56774 8.21888C9.28828 8.45997 8.95699 8.63335 8.59961 8.72556V9.00156C8.59961 9.16069 8.5364 9.3133 8.42387 9.42583C8.31135 9.53835 8.15874 9.60156 7.99961 9.60156C7.84048 9.60156 7.68787 9.53835 7.57535 9.42583C7.46282 9.3133 7.39961 9.16069 7.39961 9.00156V8.60156C7.39961 8.02556 7.85561 7.66396 8.26441 7.57196C8.44604 7.5311 8.61567 7.44853 8.75988 7.3308C8.90409 7.21307 9.01893 7.0634 9.09532 6.89362C9.17171 6.72385 9.20755 6.53863 9.20001 6.35261C9.19247 6.1666 9.14175 5.98489 9.05187 5.82186C8.96198 5.65882 8.8354 5.51894 8.68213 5.41327C8.52885 5.3076 8.3531 5.23904 8.16876 5.21302C7.98442 5.18699 7.79655 5.20421 7.62002 5.26331C7.44348 5.32242 7.28312 5.42179 7.15161 5.55356ZM7.99961 12.0016C8.21178 12.0016 8.41527 11.9173 8.56529 11.7672C8.71532 11.6172 8.79961 11.4137 8.79961 11.2016C8.79961 10.9894 8.71532 10.7859 8.56529 10.6359C8.41527 10.4858 8.21178 10.4016 7.99961 10.4016C7.78744 10.4016 7.58395 10.4858 7.43392 10.6359C7.2839 10.7859 7.19961 10.9894 7.19961 11.2016C7.19961 11.4137 7.2839 11.6172 7.43392 11.7672C7.58395 11.9173 7.78744 12.0016 7.99961 12.0016Z'
              />
            </g>
          </svg>

          <h2 className='text-xs font-medium leading-5 self-stretch grow whitespace-nowrap'>
            Help
          </h2>
        </div>
        <div
          role='button'
          onClick={() => signOut()}
          className='items-center hover:bg-blue-100 hover:text-red-600 group text-slate-800 flex justify-between gap-3 px-2 py-1.5 rounded-md'
        >
          <svg
            width='14'
            height='14'
            viewBox='0 0 14 14'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className='fill-gray-500 group-hover:fill-red-600'
          >
            <path
              id='Vector'
              fillRule='evenodd'
              clipRule='evenodd'
              d='M7 14C8.85652 14 10.637 13.2625 11.9497 11.9497C13.2625 10.637 14 8.85652 14 7C14 5.14348 13.2625 3.36301 11.9497 2.05025C10.637 0.737498 8.85652 0 7 0C5.14348 0 3.36301 0.737498 2.05025 2.05025C0.737498 3.36301 0 5.14348 0 7C0 8.85652 0.737498 10.637 2.05025 11.9497C3.36301 13.2625 5.14348 14 7 14ZM9.78 9.78C9.63937 9.92045 9.44875 9.99934 9.25 9.99934C9.05125 9.99934 8.86063 9.92045 8.72 9.78L7 8.06L5.28 9.78C5.21134 9.85369 5.12854 9.91279 5.03654 9.95378C4.94454 9.99477 4.84523 10.0168 4.74452 10.0186C4.64382 10.0204 4.54379 10.0018 4.4504 9.96412C4.35701 9.9264 4.27218 9.87026 4.20096 9.79904C4.12974 9.72782 4.0736 9.64299 4.03588 9.5496C3.99816 9.45621 3.97963 9.35618 3.98141 9.25548C3.98319 9.15477 4.00523 9.05546 4.04622 8.96346C4.08721 8.87146 4.14631 8.78866 4.22 8.72L5.94 7L4.22 5.28C4.08752 5.13783 4.0154 4.94978 4.01883 4.75548C4.02225 4.56118 4.10097 4.37579 4.23838 4.23838C4.37579 4.10097 4.56118 4.02225 4.75548 4.01883C4.94978 4.0154 5.13783 4.08752 5.28 4.22L7 5.94L8.72 4.22C8.78866 4.14631 8.87146 4.08721 8.96346 4.04622C9.05546 4.00523 9.15477 3.98319 9.25548 3.98141C9.35618 3.97963 9.45621 3.99816 9.5496 4.03588C9.64299 4.0736 9.72782 4.12974 9.79904 4.20096C9.87026 4.27218 9.9264 4.35701 9.96412 4.4504C10.0018 4.54379 10.0204 4.64382 10.0186 4.74452C10.0168 4.84523 9.99477 4.94454 9.95378 5.03654C9.91279 5.12854 9.85369 5.21134 9.78 5.28L8.06 7L9.78 8.72C9.92045 8.86063 9.99934 9.05125 9.99934 9.25C9.99934 9.44875 9.92045 9.63937 9.78 9.78Z'
            />
          </svg>
          <h2 className='text-xs font-medium leading-5 self-stretch grow whitespace-nowrap'>
            Logout
          </h2>
        </div>
      </footer>
    </div>
  );
};

export default Sidebar;
