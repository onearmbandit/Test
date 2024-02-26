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
          <h1 className="text-center text-2xl font-semibold">
            Terms of Service
          </h1>
          <p className="italic font-light text-slate-700">
            Effective Date: 02/22/2024
          </p>

          <ol className="">
            <div>
              <li className="font-bold">1. Overview and Acceptance of Use</li>
              <p className="mt-2 font-light text-slate-700">
                Welcome to Terralab.ai! Terralab.ai (“the Company”) is a
                software as a service platform specializing in carbon emissions
                data management and analysis. Throughout these Terms of Service
                (“Terms”), “Terralab.ai”, “our”, “us”, and/or “we” refer to the
                Company. The terms “you” and/or “your” refer to any visitor of
                our website and/or user of our services. These Terms govern your
                access to and use of our services, website, and software
                (collectively, the “Services”). By using the Services, you
                represent and warrant that you are of legal age to form a
                binding contract with Terralab.ai and meet all eligibility
                requirements. If you do not meet these requirements, you must
                not access or use the Services. If you represent a company or
                other legal entity, you confirm that you have the authority to
                bind that entity to these Terms.
                <br />
                <br />
                <br />
                YOUR ACCESS OR USE OF THE SERVICES INDICATES YOUR AGREEMENT TO
                THESE TERMS. IF YOU DO NOT AGREE, YOU MUST NOT ACCESS OR USE THE
                SERVICES.
              </p>
            </div>
            <div className="mt-8">
              <li className="font-bold">2. Modification</li>
              <p className="mt-2 font-light text-slate-700">
                We reserve the right to modify these Terms at any time. Any
                changes will be posted on our website and effective upon
                posting. Your continued use of the Services after any
                modification confirms your acceptance of these changes. If you
                do not agree to the modified Terms, you should discontinue your
                use of the Services.
              </p>
            </div>
            <div className="mt-8">
              <li className="font-bold">3. Account Registration</li>
              <p className="mt-1 font-light text-slate-700">
                To access certain features of the Services, you must register
                and create an account. You agree to provide accurate, current,
                and complete information and keep your account information
                updated. You are responsible for all activities that occur under
                your account and for keeping your password confidential.
              </p>
            </div>
            <div className="mt-8">
              <li className="font-bold">4. Use of the Services</li>
              <p className="mt-1 font-light text-slate-700">
                The Services are provided for tracking and analyzing carbon
                emissions data. You agree to use the Services only for lawful
                purposes and in accordance with these Terms.
              </p>
            </div>

            <div className="mt-8">
              <li className="font-bold">5. Intellectual Property Rights</li>
              <p className="mt-1 font-light text-slate-700">
                The Services, including all related intellectual property, are
                the exclusive property of Terralab.ai or its licensors. You
                agree not to reproduce, redistribute, or exploit any part of the
                Services without our express written permission.
              </p>
            </div>
            <div className="mt-8">
              <li className="font-bold">6. User Content</li>
              <p className="mt-1 font-light text-slate-700">
                You retain rights to any data or content you submit through the
                Services. By submitting content, you grant Terralab.ai a license
                to use, reproduce, and display this content in connection with
                the Services.
              </p>
            </div>
            <div className="mt-8">
              <li className="font-bold">7. Privacy Policy</li>
              <p className="mt-1 font-light text-slate-700">
                Your use of the Services is subject to our Privacy Policy, which
                describes how we handle your data.
              </p>
            </div>
            <div className="mt-8">
              <li className="font-bold">8. Termination</li>
              <p className="mt-1 font-light text-slate-700">
                We may terminate your access to the Services for breach of these
                Terms without notice.
              </p>
            </div>
            <div className="mt-8">
              <li className="font-bold">9. Disclaimers</li>
              <p className="mt-1 font-light text-slate-700">
                THE SERVICES ARE PROVIDED “AS IS” WITHOUT WARRANTIES OF ANY
                KIND. Terralab.ai DISCLAIMS ALL WARRANTIES, EITHER EXPRESS OR
                IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF
                MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
              </p>
            </div>
            <div className="mt-8">
              <li className="font-bold">10. Limitation of Liability</li>
              <p className="mt-1 font-light text-slate-700">
                Terralab.ai WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
                SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR
                USE OF THE SERVICES.
              </p>
            </div>
            <div className="mt-8">
              <li className="font-bold">11. Governing Law</li>
              <p className="mt-1 font-light text-slate-700">
                These Terms are governed by the laws of [Jurisdiction] without
                regard to conflict of law principles.
              </p>
            </div>
            <div className="mt-8">
              <li className="font-bold">12. General</li>
              <p className="mt-1 font-light text-slate-700">
                These Terms constitute the entire agreement between you and
                Terralab.ai regarding the Services. Our failure to enforce any
                right or provision is not a waiver of that right or provision.
              </p>
            </div>
            <div className="mt-8">
              <li className="font-bold">13. Contact Information</li>
              <p className="mt-1 font-light text-slate-700">
                For any questions about these Terms, please contact us at{" "}
                <a href="mailto:hello@terralab.ai" className="text-blue-600">
                  hello@terralab.ai.
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
