import React from "react";

const PrivacyPolicyPage = () => {
  return (
    <div className="bg-gray-50 flex justify-center">
      <div className="w-full pb-[146px]">
        <img
          src="/assets/images/Logo.png"
          alt="Logo"
          className="object-contain mx-auto h-[38.5px] my-6 mt-14"
        />
        <div className="bg-white rounded py-8 px-[42px] w-full max-w-[800px] mx-auto space-y-4">
          <h1 className="text-center text-2xl font-semibold">Privacy Policy</h1>
          <p className="italic font-light text-slate-700">
            Effective Date: 02/22/2024
          </p>

          <ol className="">
            <div>
              <li className="font-bold">1. Introduction</li>
              <p className="mt-1 font-light text-slate-700">
                Welcome to Terralab.ai, a sustainability-focused tool designed
                to assist companies in tracking and managing their carbon
                emissions. This Privacy Policy outlines our practices regarding
                the collection, use, and disclosure of information we receive
                through our services.
              </p>
            </div>
            <div className="mt-8">
              <li className="font-bold">2. Information Collection</li>
              <p className="mt-2 font-light text-slate-700">
                <span className="block mt-1.5">
                  a. Data Provided by Users: We collect information that you
                  provide directly to us, such as company name, contact
                  information, and details related to your carbon emissions.{" "}
                </span>
                <span className="block mt-1.5">
                  b. Usage Data: We automatically collect information on how our
                  service is accessed and used, including login data, page
                  views, and other diagnostic data.
                </span>
                <span className="block mt-1.5">
                  c. Cookies and Tracking Technologies: We use cookies and
                  similar tracking technologies to track activity on our service
                  and hold certain information.
                </span>
              </p>
            </div>
            <div className="mt-8">
              <li className="font-bold">3. Use of Information</li>
              <p className="mt-1 font-light text-slate-700 gap-y-2 leading-7">
                The information we collect is used to:
                <br />
                Provide and maintain our service.
                <br />
                Analyze and improve our service.
                <br />
                Assist your company in tracking and reducing carbon emissions.
                <br />
                Communicate with you about service updates or offers.
              </p>
            </div>
            <div className="mt-8">
              <li className="font-bold">4. Data Sharing and Disclosure</li>
              <p className="mt-1 font-light text-slate-700 leaading-7">
                We do not sell your personal information. We may share your
                information with: <br /> Service providers who assist us in
                operating our platform.
                <br />
                Affiliates and partners who support our sustainability mission.
                <br />
                Law enforcement or legal requests, if required.
              </p>
            </div>

            <div className="mt-8">
              <li className="font-bold">5. Data Security</li>
              <p className="mt-1 font-light text-slate-700">
                We take reasonable measures to protect your information from
                unauthorized access, use, or disclosure. However, no internet
                transmission is entirely secure or error-free.
              </p>
            </div>
            <div className="mt-8">
              <li className="font-bold">6. User Rights and Control</li>
              <p className="mt-1 font-light text-slate-700">
                You have the right to access, update, delete, or transfer your
                information. Please contact us to exercise these rights.
              </p>
            </div>
            <div className="mt-8">
              <li className="font-bold">7. Policy Updates</li>
              <p className="mt-1 font-light text-slate-700">
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the new policy on our
                platform.
              </p>
            </div>
            <div className="mt-8">
              <li className="font-bold">8. Contact Information</li>
              <p className="mt-1 font-light text-slate-700">
                For any questions or concerns regarding this Privacy Policy,
                please contact us at <br />
                <a href="mailto:hello@terralab.ai" className="text-blue-600">
                  hello@terralab.ai
                </a>
              </p>
            </div>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
