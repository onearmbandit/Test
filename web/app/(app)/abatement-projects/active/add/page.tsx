"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, ChevronLeft, Upload, X } from "lucide-react";
import Image from "next/image";
import React from "react";
import Dropzone from "react-dropzone";

const page = () => {
  const selections = ["Supplier 1", "Supplier 2", "Supplier 3"];
  return (
    <div className="bg-white px-8 py-6 min-h-screen">
      <div className="items-center self-stretch flex gap-2.5 pl-3 py-3 max-md:flex-wrap">
        <ChevronLeft size={24} className="text-slate-500" />
        <nav className="text-blue-700 text-sm justify-center items-stretch grow py-1.5 max-md:max-w-full">
          <a href="/abatement-projects/active" className="text-slate-500">
            Active Abatement Projects
          </a>{" "}
          &gt;{" "}
          <span className="text-blue-600 font-bold">
            New Emissions Abatement Project
          </span>{" "}
        </nav>
      </div>

      <div className="pt-6 space-y-6">
        <h2 className="text-gray-700 font-bold text-lg">
          New Emissions Abatement Project
        </h2>

        {/* Project Name */}
        <Card>
          <CardHeader>
            {/* TODO : conditionally render blue tick after save */}
            <div className="flex items-center space-x-2.5">
              {/* <div className="bg-slate-200 h-5 w-5 rounded-full grid place-items-center text-xs">
                1
              </div> */}
              <CheckCircle2 size={24} className="text-white fill-blue-600" />
              <p className="flex-1 font-bold">Project Name*</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <label className="text-sm">
              Add the name of the Abatement Project
            </label>

            <Input
              className="h-16 bg-gray-50 text-slate-700 text-sm font-light w-1/2"
              placeholder="Add project name"
            />
          </CardContent>
          <CardFooter className="justify-end">
            <Button
              type="button"
              variant={"outline"}
              className="border-2 border-blue-600 text-blue-600 hover:text-blur-600"
            >
              Save
            </Button>
          </CardFooter>
        </Card>

        {/* Project Descripton */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2.5">
              <div className="bg-slate-200 h-5 w-5 rounded-full grid place-items-center text-xs">
                2
              </div>
              <p className="flex-1 font-bold">Project Description*</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-6">
              <label className="text-sm">
                Provide a short description of the project
              </label>

              <Input
                className="h-16 bg-gray-50 text-slate-700 text-sm font-light"
                placeholder="Add description"
              />
            </div>
            <div className="space-y-6">
              <label className="text-sm">Add a website if available</label>

              <Input
                className="h-16 bg-gray-50 text-slate-700 text-sm font-light w-1/2"
                placeholder="Add website"
              />
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button
              type="button"
              variant={"outline"}
              className="border-2 border-blue-600 text-blue-600 hover:text-blur-600"
            >
              Save
            </Button>
          </CardFooter>
        </Card>

        {/* Estimated Emission Reduction */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2.5">
              <div className="bg-slate-200 h-5 w-5 rounded-full grid place-items-center text-xs">
                3
              </div>
              <p className="flex-1 font-bold">Estimated Emission Reduction*</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-6">
              <label className="text-sm">
                What is the estimated emission reductions?
              </label>

              <Input
                className="h-16 bg-gray-50 text-slate-700 text-sm font-light w-1/2"
                placeholder="Add emission reduction"
              />
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button
              type="button"
              variant={"outline"}
              className="border-2 border-blue-600 text-blue-600 hover:text-blur-600"
            >
              Save
            </Button>
          </CardFooter>
        </Card>

        {/* Proposed To  */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2.5">
              <div className="bg-slate-200 h-5 w-5 rounded-full grid place-items-center text-xs">
                4
              </div>
              <p className="flex-1 font-bold">Proposed To*</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-6">
              <label className="text-sm">
                Which Supplier or Organization are you proposing this project
                to?
              </label>

              <Select>
                <SelectTrigger className="w-1/2 bg-gray-50 h-16 border-none">
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {selections?.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button
              type="button"
              variant={"outline"}
              className="border-2 border-blue-600 text-blue-600 hover:text-blur-600"
            >
              Save
            </Button>
          </CardFooter>
        </Card>

        {/* Photo and Logo */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2.5">
              <div className="bg-slate-200 h-5 w-5 rounded-full grid place-items-center text-xs">
                5
              </div>
              <p className="flex-1 font-bold">Photo and Logo</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-6">
              <label className="text-sm">
                Upload a photo representing the project proposal
              </label>

              <Dropzone>
                {({ getInputProps, getRootProps }) => (
                  <>
                    <div
                      {...getRootProps()}
                      className="flex justify-center cursor-pointer items-center space-x-3 w-1/2 h-[129px] rounded-lg bg-gray-200/60"
                    >
                      <input {...getInputProps()} />
                      <Upload size={12} className="text-slate-600" />
                      <p className="text-sm font-bold text-slate-600 uppercase">
                        upload png, jpg, jpeg
                      </p>
                    </div>
                  </>
                )}
              </Dropzone>
            </div>
            <div className="space-y-6">
              <label className="text-sm">Upload your company Logo</label>

              <Dropzone>
                {({ getInputProps, getRootProps }) => (
                  <>
                    <div
                      {...getRootProps()}
                      className="flex justify-center cursor-pointer items-center space-x-3 w-1/2 h-[129px] rounded-lg bg-gray-200/60"
                    >
                      <input {...getInputProps()} />
                      <Upload size={12} className="text-slate-600" />
                      <p className="text-sm font-bold text-slate-600 uppercase">
                        upload png, jpg, jpeg
                      </p>
                    </div>

                    {/* TODO: below is after dropstate. use condition to render below state */}
                    <div className="flex items-center space-x-3">
                      <div className="bg-gray-200 h-16 w-16 rounded grid place-items-center">
                        <Image
                          height={24}
                          width={24}
                          src={"/assets/images/folder-open.svg"}
                          alt="foler icon"
                        />
                      </div>
                      <p className="font-semibold text-gray-700">
                        something new
                      </p>

                      <X size={16} className="text-slate-500" />
                    </div>
                  </>
                )}
              </Dropzone>
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button
              type="button"
              variant={"outline"}
              className="border-2 border-blue-600 text-blue-600 hover:text-blur-600"
            >
              Save
            </Button>
          </CardFooter>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled>
            Save & Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default page;
