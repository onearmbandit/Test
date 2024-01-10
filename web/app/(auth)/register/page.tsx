import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex h-screen w-full items-center">
      <form className="items-center flex max-w-[840px] w-full flex-col px-20 py-12 max-md:px-5">
        <header className="header justify-center text-neutral-900 text-center text-6xl font-semibold mt-5 max-md:max-w-full max-md:text-4xl">
          Create your account
        </header>
        <div className="input-wrapper justify-center items-stretch self-stretch flex flex-col ml-5 mr-4 mt-14 mb-9 px-8 py-6 max-md:max-w-full max-md:mr-2.5 max-md:mt-10 max-md:px-5">
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
              aria-role="input"
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
              aria-role="input"
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
              <div className="input-help-item items-stretch flex justify-between gap-2 mt-2.5">
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
        <div className="button-wrapper justify-end flex flex-col w-full mt-6 py-2.5 items-end max-md:max-w-full max-md:pl-5">
          <Button
            size={"lg"}
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
      </form>

      <div className="flex max-w-[579px] flex-col items-end">
        <header className="header">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/016980bf7cc1c4d078e3f7a80bdae9db28bcd1f4fc12c0dde3b4f3f84f917e53?apiKey=011554aff43544e6af46800a427fd184&"
            className="aspect-[6.81] object-contain object-center w-[177px] overflow-hidden max-w-full"
            alt=""
          />
        </header>
        <div className="image-container">
          <img
            loading="lazy"
            srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/a36e5cbd058a02a9474fcf92e68d4b5b4807e9f53a4a8ad178d3583a0611a1a0?apiKey=011554aff43544e6af46800a427fd184&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/a36e5cbd058a02a9474fcf92e68d4b5b4807e9f53a4a8ad178d3583a0611a1a0?apiKey=011554aff43544e6af46800a427fd184&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/a36e5cbd058a02a9474fcf92e68d4b5b4807e9f53a4a8ad178d3583a0611a1a0?apiKey=011554aff43544e6af46800a427fd184&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/a36e5cbd058a02a9474fcf92e68d4b5b4807e9f53a4a8ad178d3583a0611a1a0?apiKey=011554aff43544e6af46800a427fd184&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/a36e5cbd058a02a9474fcf92e68d4b5b4807e9f53a4a8ad178d3583a0611a1a0?apiKey=011554aff43544e6af46800a427fd184&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/a36e5cbd058a02a9474fcf92e68d4b5b4807e9f53a4a8ad178d3583a0611a1a0?apiKey=011554aff43544e6af46800a427fd184&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/a36e5cbd058a02a9474fcf92e68d4b5b4807e9f53a4a8ad178d3583a0611a1a0?apiKey=011554aff43544e6af46800a427fd184&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/a36e5cbd058a02a9474fcf92e68d4b5b4807e9f53a4a8ad178d3583a0611a1a0?apiKey=011554aff43544e6af46800a427fd184&"
            className="aspect-[0.73] object-contain object-center w-full overflow-hidden self-stretch mt-1.5 max-md:max-w-full"
            alt=""
          />
        </div>
      </div>
    </div>
  );
}
