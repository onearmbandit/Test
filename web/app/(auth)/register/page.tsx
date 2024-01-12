"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";

export default function Page() {
  const [currentStep, setCurrentStep] = useState(1);
  const steps: { [key: number]: ({ setCurrentStep }: any) => JSX.Element } = {
    1: Step1,
    2: Step2,
    3: Step3,
    4: RegistrationComplete,
  };
  const RegistraionSteps = steps[currentStep];

  return (
    <>
      <div
        className={`h-3 absolute top-0 left-0 z-30 rounded-r-full bg-[#598E69]`}
        style={{ width: `${(currentStep / 4) * 100}vw` }}
      />
      <div className="flex container justify-between h-screen w-full">
        <form>
          <RegistraionSteps setCurrentStep={setCurrentStep} />
        </form>

        <div className="flex-1 mt-9 max-w flex flex-col items-end">
          <header className="header flex justify-end mb-[6px]">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/016980bf7cc1c4d078e3f7a80bdae9db28bcd1f4fc12c0dde3b4f3f84f917e53?apiKey=011554aff43544e6af46800a427fd184&"
              className="aspect-[6.81] object-contain object-center w-[177px] overflow-hidden max-w-full"
              alt=""
            />
          </header>
          <img
            loading="lazy"
            srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/2617de5a-f3cc-40b2-95cc-1b4a8d1167e4?apiKey=011554aff43544e6af46800a427fd184&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/2617de5a-f3cc-40b2-95cc-1b4a8d1167e4?apiKey=011554aff43544e6af46800a427fd184&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/2617de5a-f3cc-40b2-95cc-1b4a8d1167e4?apiKey=011554aff43544e6af46800a427fd184&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/2617de5a-f3cc-40b2-95cc-1b4a8d1167e4?apiKey=011554aff43544e6af46800a427fd184&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/2617de5a-f3cc-40b2-95cc-1b4a8d1167e4?apiKey=011554aff43544e6af46800a427fd184&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/2617de5a-f3cc-40b2-95cc-1b4a8d1167e4?apiKey=011554aff43544e6af46800a427fd184&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/2617de5a-f3cc-40b2-95cc-1b4a8d1167e4?apiKey=011554aff43544e6af46800a427fd184&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/2617de5a-f3cc-40b2-95cc-1b4a8d1167e4?apiKey=011554aff43544e6af46800a427fd184&"
            className="aspect-[0.73] object-contain object-center w-full overflow-hidden max-w-xl"
            alt=""
          />
        </div>
      </div>
    </>
  );
}

const Step1 = ({ setCurrentStep }: any) => {
  return (
    <div className="items-center flex flex-1 max-w-[840px] w-full flex-col px-20 py-12 max-md:px-5">
      <header className="header justify-center text-neutral-900 text-center text-6xl font-semibold mt-5 max-md:max-w-full max-md:text-4xl">
        Create your account
      </header>
      <div className="input-wrapper justify-center items-stretch self-stretch flex flex-col mt-14 py-6 max-md:max-w-full max-md:mr-2.5 max-md:mt-10 max-md:px-5">
        <label
          htmlFor="email"
          className="label text-slate-700 text-base font-light leading-6 max-md:max-w-full"
        >
          Work email*
        </label>
        <div className="input text-slate-500 text-xs font-light leading-4 items-stretch bg-gray-50 justify-center mt-3 px-2 py-7 rounded-md max-md:max-w-full">
          <Input
            type="email"
            className="w-full bg-transparent"
            id="email"
            aria-label="Email"
            placeholder="Email"
          />
        </div>
        <label
          htmlFor="password"
          className="label text-slate-700 text-base font-light leading-6 mt-10 max-md:max-w-full"
        >
          Create your password*
        </label>
        <div className="input-group items-stretch bg-gray-50 flex justify-between gap-2 mt-3 px-2 py-7 rounded-md max-md:max-w-full max-md:flex-wrap">
          <Input
            type="password"
            id="password"
            className="w-full bg-transparent"
            aria-label="Password"
            placeholder="Password"
          />
          <div className="flex items-center cursor-pointer">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/8cc6a76f5ee002a4ceaaf904b30d132424cc73e98f41fd0de093f596d88c473a?apiKey=011554aff43544e6af46800a427fd184&"
              className="aspect-square object-contain object-center w-4 justify-center items-center overflow-hidden shrink-0 max-w-full"
              alt="Password Strength"
            />
          </div>
        </div>
        <div className="input-group items-stretch flex justify-between gap-5 mt-10 max-md:max-w-full max-md:flex-wrap">
          <div className="input-help items-stretch flex grow basis-[0%] flex-col">
            <div className="input-help-item items-stretch flex justify-between gap-2">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/4d9131262a739251a2689313c69c8686a6f9e8288b4553304816b70c87f5b0e6?apiKey=011554aff43544e6af46800a427fd184&"
                className="aspect-square object-contain object-center w-[18px] overflow-hidden shrink-0 max-w-full"
                alt="Lowercase Character"
              />
              <div className="input-help-text text-zinc-950 text-opacity-30 text-sm grow whitespace-nowrap self-start">
                One lowercase character
              </div>
            </div>
            <div className="input-help-item items-stretch flex justify-between gap-2 mt-2.5">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/4d9131262a739251a2689313c69c8686a6f9e8288b4553304816b70c87f5b0e6?apiKey=011554aff43544e6af46800a427fd184&"
                className="aspect-square object-contain object-center w-[18px] overflow-hidden shrink-0 max-w-full"
                alt="Uppercase Character"
              />
              <div className="input-help-text text-zinc-950 text-opacity-30 text-sm grow whitespace-nowrap self-start">
                One uppercase character
              </div>
            </div>
            <div className="input-help-item items-stretch flex gap-2 mt-2.5">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/4d9131262a739251a2689313c69c8686a6f9e8288b4553304816b70c87f5b0e6?apiKey=011554aff43544e6af46800a427fd184&"
                className="aspect-square object-contain object-center w-[18px] overflow-hidden shrink-0 max-w-full"
                alt="Minimum Characters"
              />
              <div className="input-help-text text-zinc-950 text-opacity-30 text-sm">
                8 characters minimum
              </div>
            </div>
          </div>
          <div className="input-help items-stretch flex grow basis-[0%] flex-col self-start">
            <div className="input-help-item items-stretch flex justify-between gap-2">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/4d9131262a739251a2689313c69c8686a6f9e8288b4553304816b70c87f5b0e6?apiKey=011554aff43544e6af46800a427fd184&"
                className="aspect-square object-contain object-center w-[18px] overflow-hidden shrink-0 max-w-full"
                alt="Number"
              />
              <div className="input-help-text text-zinc-950 text-opacity-30 text-sm grow shrink basis-auto self-start">
                One number
              </div>
            </div>
            <div className="input-help-item items-stretch flex justify-between gap-2 mt-2.5">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/4d9131262a739251a2689313c69c8686a6f9e8288b4553304816b70c87f5b0e6?apiKey=011554aff43544e6af46800a427fd184&"
                className="aspect-square object-contain object-center w-[18px] overflow-hidden shrink-0 max-w-full"
                alt="Special Character"
              />
              <div className="input-help-text text-zinc-950 text-opacity-30 text-sm grow shrink basis-auto self-start">
                One special character
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="button-wrapper justify-end flex flex-col w-full py-2.5 items-end max-md:max-w-full max-md:pl-5">
        <Button
          size={"lg"}
          onClick={() => setCurrentStep(2)}
          className="button text-base font-semibold leading-6 whitespace-nowrap rounded bg-blue-600 px-6 py-4 max-md:px-5"
        >
          Continue
        </Button>
      </div>
      <div className="text-blue-700 text-center text-sm font-bold leading-5 mt-6 max-md:max-w-full">
        Or Sign Up with SSO
      </div>
      <div className="text-blue-700 text-center text-xs font-medium leading-5 mt-6 max-md:max-w-full">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-sm text-blue-700">
          Sign In
        </Link>
      </div>
      <div className="text-slate-700 text-center text-xs font-light leading-4 mt-6 max-md:max-w-full">
        By clicking ‘Continue’ above, you agree to our Terms of Service and
        Privacy Policy.
      </div>
    </div>
    // <div className="items-center flex max-w-[840px] flex-col px-20 py-12 max-md:px-5">
    //   <header className="header text-neutral-900 text-center text-6xl font-semibold mt-5 max-md:max-w-full max-md:text-4xl">
    //     Create your account
    //   </header>
    //   <div className="section justify-center items-stretch self-stretch flex flex-col ml-5 mr-4 mt-14 mb-9 px-8 py-6 max-md:max-w-full max-md:mr-2.5 max-md:mt-10 max-md:px-5">
    //     <label
    //       htmlFor="email"
    //       className="text-slate-700 text-base font-light leading-6 max-md:max-w-full"
    //     >
    //       Work email*
    //     </label>
    //     <a
    //       href="#"
    //       className="email text-slate-700 text-sm font-light leading-5 items-stretch bg-gray-50 justify-center mt-3 px-2 py-6 rounded-md max-md:max-w-full"
    //     >
    //       johnsmith@pepsico.com
    //     </a>
    //     <label
    //       htmlFor="password"
    //       className="text-slate-700 text-base font-light leading-6 mt-10 max-md:max-w-full"
    //     >
    //       Create your password*
    //     </label>
    //     <div className="password items-stretch bg-gray-50 flex justify-between gap-2 mt-3 px-2 py-7 rounded-md max-md:max-w-full max-md:flex-wrap">
    //       <label
    //         htmlFor="password"
    //         className="text-slate-500 text-xs font-light leading-4 grow max-md:max-w-full"
    //       >
    //         Password
    //       </label>
    //       <img
    //         loading="lazy"
    //         src="https://cdn.builder.io/api/v1/image/assets/TEMP/3c88747dcf5615a712b4cc1e6a424e2cf3539b97899f91f5fa4cbd83f347afdc?apiKey=011554aff43544e6af46800a427fd184&"
    //         className="aspect-square object-contain object-center w-4 justify-center items-center overflow-hidden shrink-0 max-w-full"
    //       />
    //     </div>
    //   </div>
    //   <div className="requirements items-stretch flex justify-between gap-5 mt-10 max-md:max-w-full max-md:flex-wrap">
    //     <div className="lowercase items-stretch flex grow basis-[0%] flex-col">
    //       <span className="items-stretch flex justify-between gap-2">
    //         <img
    //           loading="lazy"
    //           src="https://cdn.builder.io/api/v1/image/assets/TEMP/723e1fb67ec7c23294acc9e89ef0670888acb429ae6a096deca57fbc7ccc37a0?apiKey=011554aff43544e6af46800a427fd184&"
    //           className="aspect-square object-contain object-center w-[18px] overflow-hidden shrink-0 max-w-full"
    //         />
    //         <div className="text-slate-700 text-sm grow whitespace-nowrap self-start">
    //           One lowercase character
    //         </div>
    //       </span>
    //       <span className="items-stretch flex justify-between gap-2 mt-2.5">
    //         <img
    //           loading="lazy"
    //           src="https://cdn.builder.io/api/v1/image/assets/TEMP/723e1fb67ec7c23294acc9e89ef0670888acb429ae6a096deca57fbc7ccc37a0?apiKey=011554aff43544e6af46800a427fd184&"
    //           className="aspect-square object-contain object-center w-[18px] overflow-hidden shrink-0 max-w-full"
    //         />
    //         <div className="text-slate-700 text-sm grow whitespace-nowrap self-start">
    //           One uppercase character
    //         </div>
    //       </span>
    //       <span className="items-stretch flex justify-between gap-2 mt-2.5">
    //         <img
    //           loading="lazy"
    //           src="https://cdn.builder.io/api/v1/image/assets/TEMP/723e1fb67ec7c23294acc9e89ef0670888acb429ae6a096deca57fbc7ccc37a0?apiKey=011554aff43544e6af46800a427fd184&"
    //           className="aspect-square object-contain object-center w-[18px] overflow-hidden shrink-0 max-w-full"
    //         />
    //         <div className="text-slate-700 text-sm">8 characters minimum</div>
    //       </span>
    //     </div>
    //     <div className="number items-stretch flex grow basis-[0%] flex-col self-start">
    //       <span className="items-stretch flex justify-between gap-2">
    //         <img
    //           loading="lazy"
    //           src="https://cdn.builder.io/api/v1/image/assets/TEMP/723e1fb67ec7c23294acc9e89ef0670888acb429ae6a096deca57fbc7ccc37a0?apiKey=011554aff43544e6af46800a427fd184&"
    //           className="aspect-square object-contain object-center w-[18px] overflow-hidden shrink-0 max-w-full"
    //         />
    //         <div className="text-slate-700 text-sm grow shrink basis-auto self-start">
    //           One number
    //         </div>
    //       </span>
    //       <span className="items-stretch flex justify-between gap-2 mt-2.5">
    //         <img
    //           loading="lazy"
    //           src="https://cdn.builder.io/api/v1/image/assets/TEMP/723e1fb67ec7c23294acc9e89ef0670888acb429ae6a096deca57fbc7ccc37a0?apiKey=011554aff43544e6af46800a427fd184&"
    //           className="aspect-square object-contain object-center w-[18px] overflow-hidden shrink-0 max-w-full"
    //         />
    //         <div className="text-slate-700 text-sm grow shrink basis-auto self-start">
    //           One special character
    //         </div>
    //       </span>
    //     </div>
    //   </div>
    //   <div className="submit justify-center flex flex-col mt-6 pl-16 pr-2.5 py-2.5 items-end max-md:max-w-full max-md:pl-5">
    //     <button
    //       className="text-white text-center text-base font-semibold leading-6 whitespace-nowrap justify-center items-stretch rounded bg-blue-600 px-6 py-4 max-md:px-5"
    //       type="submit"
    //     >
    //       Continue
    //     </button>
    //   </div>
    //   <div className="sso text-blue-700 text-center text-sm font-bold leading-5 mt-6 max-md:max-w-full">
    //     Or Sign Up with SSO
    //   </div>
    //   <div className="existing-account text-blue-700 text-center text-xs font-medium leading-5 mt-6 max-md:max-w-full">
    //     Already have an account?{" "}
    //     <span className="font-bold text-sm text-blue-700">Sign In</span>{" "}
    //   </div>
    //   <div className="terms text-slate-700 text-center text-xs font-light leading-4 mt-6 max-md:max-w-full">
    //     By clicking ‘Continue’ above, you agree to our Terms of Service and
    //     Privacy Policy.
    //   </div>
    // </div>
  );
};

const Step2 = ({ setCurrentStep }: any) => {
  return (
    <div className="items-center flex max-w-[840px] flex-1 flex-col px-20 py-12 max-md:px-5">
      <header
        className="justify-center text-neutral-900 text-6xl font-semibold mt-5 max-md:max-w-full max-md:text-4xl"
        aria-label="Name Question"
      >
        What's your name?
      </header>
      <div className="justify-center items-stretch self-stretch space-y-10 flex flex-col mt-14 mb-52 py-6 max-md:max-w-full max-md:mr-2.5 max-md:my-10 max-md:px-5">
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
              aria-label="First Name"
              className="bg-transparent"
            />
          </div>
        </div>
        <div>
          <label
            className="text-slate-700 text-base font-light leading-6 max-md:max-w-full"
            htmlFor="lastNameInput"
          >
            Last Name
          </label>
          <div className="text-slate-500 text-xs font-light leading-4 items-stretch bg-gray-50 justify-center mt-3 px-2 py-7 rounded-md max-md:max-w-full">
            <Input
              type="text"
              id="lastNameInput"
              className="bg-transparent"
              aria-label="Last Name"
              placeholder="Last Name"
            />
          </div>
        </div>

        <div className="justify-center flex flex-col pl-16 pr-2.5 py-2.5 items-end max-md:max-w-full max-md:pl-5">
          <button
            className="text-white text-center text-base font-semibold leading-6 whitespace-nowrap justify-center items-stretch rounded bg-blue-600 px-6 py-4 max-md:px-5"
            role="button"
            aria-label="Continue"
            onClick={() => setCurrentStep(3)}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

const Step3 = ({ setCurrentStep }: any) => {
  return (
    <div className="items-center flex max-w-[840px] flex-col justify-center px-16 py-12 max-md:px-5">
      <header className="flex w-full max-w-[581px] flex-col mt-5 max-md:max-w-full max-md:mb-10">
        <h1 className="justify-center text-neutral-900 text-center whitespace-nowrap text-6xl font-semibold self-stretch max-md:max-w-full max-md:text-4xl">
          Where do you work?
        </h1>
      </header>
      <div className="w-full max-md:mt-10 mt-14">
        <div>
          <label
            className="text-slate-700 text-base font-light leading-6 max-md:max-w-full"
            htmlFor="companyName"
          >
            Company Name
          </label>

          <Input
            type="text"
            id="companyName"
            placeholder="Company"
            className="text-slate-500 text-sm font-light leading-5 items-stretch bg-gray-50 justify-center mt-3 px-2 py-6 rounded-md max-md:max-w-full"
          />
        </div>
        <div>
          <label
            className="text-slate-700 text-base font-light leading-6 max-md:max-w-full"
            htmlFor="companyAdress"
          >
            Company Address
          </label>

          <Input
            type="text"
            id="companyAdress"
            placeholder="Company"
            className="text-slate-500 text-sm font-light leading-5 items-stretch bg-gray-50 justify-center mt-3 px-2 py-6 rounded-md max-md:max-w-full"
          />
        </div>
        <div>
          <Input
            type="text"
            placeholder="Apt, suite, floor, unit, etc"
            className="text-slate-500 text-sm font-light leading-5 items-stretch bg-gray-50 justify-center mt-3 px-2 py-6 rounded-md max-md:max-w-full"
          />
        </div>

        <div className="items-stretch self-stretch flex justify-between gap-5 mt-3 px-px max-md:max-w-full max-md:flex-wrap">
          <Input
            type="text"
            placeholder="City"
            className="text-slate-500 text-sm font-light leading-5 whitespace-nowrap items-stretch bg-gray-50 justify-center px-2 py-6 rounded-md max-md:max-w-full"
          />

          <div className="items-stretch bg-gray-50 flex justify-between gap-2 w-[35%] px-2 py-6 rounded-md">
            <div
              className="text-slate-500 text-sm font-light leading-5 grow whitespace-nowrap"
              aria-label="State"
            >
              State
            </div>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/e2291a7397fc864d89d99afc7f9d8722720b9685dfa12431141c0d34998ec61f?apiKey=011554aff43544e6af46800a427fd184&"
              className="aspect-square object-contain object-center w-4 overflow-hidden self-center shrink-0 max-w-full my-auto"
              alt="State"
              aria-label="State"
            />
          </div>
        </div>
        <Input
          type="text"
          placeholder="Zipcode"
          className="text-slate-500 text-sm font-light leading-5 items-stretch bg-gray-50 justify-center mt-3 px-2 py-6 rounded-md max-md:max-w-full"
        />

        <div className="justify-between items-center self-stretch flex gap-5 mt-3 pl-1 pr-2.5 py-2.5 max-md:max-w-full max-md:flex-wrap">
          <div className="text-blue-600 text-center text-sm font-semibold leading-4 my-auto">
            <Button
              variant={"ghost"}
              className="font-semibold px-0 hover:bg-transparent"
              type="button"
              aria-label="Back"
              onClick={() => setCurrentStep(2)}
            >
              Back
            </Button>
          </div>
          <Button
            size={"lg"}
            type="submit"
            className="text-white text-center text-base font-semibold leading-6 whitespace-nowrap items-stretch rounded self-stretch justify-center px-6 py-4 max-md:px-5"
            aria-label="Continue"
            onClick={() => setCurrentStep(4)}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

const RegistrationComplete = () => {
  return (
    <div className="items-center flex max-w-[840px] flex-col justify-center px-16 py-12 max-md:px-5">
      <header className="flex w-full max-w-[581px] flex-col mt-5 max-md:max-w-full max-md:mb-10">
        <h1 className="justify-center text-neutral-900 text-center text-6xl font-semibold self-stretch max-md:max-w-full max-md:text-4xl">
          Your account has been created
        </h1>
      </header>
      <p className="mt-6 py-8 max-w-[581px]">
        We sent an email to <strong>johnsmith@pespico.com</strong>. Check your
        inbox to activate your account.
      </p>
      <Link
        href={"/login"}
        className="rounded bg-blue-600 hover:bg-blue-600/90 px-4 py-1 text-white text-sm font-semibold"
      >
        Back to Login
      </Link>
    </div>
  );
};
