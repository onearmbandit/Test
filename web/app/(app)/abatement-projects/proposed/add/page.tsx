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
import { addAbatementProjects } from "@/services/abatement.api";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import _ from "lodash";
import { CheckCircle2, ChevronLeft, Upload, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useState } from "react";
import Dropzone from "react-dropzone";
import { toast } from "sonner";

const AddProposedPage = () => {
  const { data: session } = useSession();
  const organizationId = session?.user?.organizations[0]?.id;
  const userId = session?.user?.id;
  const selections = ["Supplier 1", "Supplier 2", "Supplier 3"];
  const [currentSection, setCurrentSection] = useState(1);
  const [projectDetails, setProjectDetails] = useState({
    1: { name: "" },
    2: { description: "", estimatedCost: 0, websiteUrl: "" },
    3: { emissionReductions: 0 },
    4: { organizationId: "" },
    5: { photoUrl: {}, logoUrl: {} },
  });

  const { mutate } = useMutation({
    mutationFn: addAbatementProjects,
    onSuccess: (data) => {
      console.log(data);
    },
    onError(error, variables, context) {
      toast.error(error.message, { style: { color: "red" } });
    },
  });

  const { values, setFieldValue, handleSubmit, submitForm } = useFormik({
    initialValues: {
      name: "",
      description: "",
      estimatedCost: 0,
      websiteUrl: "",
      emissionReductions: 0,
      emissionUnit: "",
      proposedBy: "",
      photoUrl: "",
      logoUrl: "",
      status: 2,
    },
    onSubmit: (data) => {
      console.log("formdata", data);
      const modified = {
        ...data,
        organizationId,
        proposedBy: "35b806f2-066b-4fc6-9845-054025ab46da",
      };
      mutate(modified);
    },
  });

  return (
    <div className="bg-white px-8 py-6 min-h-screen">
      <div className="items-center self-stretch flex gap-2.5 pl-3 py-3 max-md:flex-wrap">
        <ChevronLeft size={24} className="text-slate-500" />
        <nav className="text-blue-700 text-sm justify-center items-stretch grow py-1.5 max-md:max-w-full">
          <a href="/abatement-projects/proposed" className="text-slate-500">
            Proposed Abatement Projects
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
          <CardHeader className="flex-row justify-between">
            {/* TODO : conditionally render blue tick after save */}
            <div className="flex items-center space-x-2.5">
              {values.name != "" ? (
                <div className="bg-slate-200 h-5 w-5 rounded-full grid place-items-center text-xs">
                  1
                </div>
              ) : (
                <CheckCircle2 size={24} className="text-white fill-blue-600" />
              )}
              <p className="flex-1 font-bold">Project Name*</p>
            </div>
            {values.name != "" && (
              <Button
                variant={"ghost"}
                onClick={() => setCurrentSection(1)}
                className="text-blue-600 hover:text-blue-600 font-semibold"
              >
                Edit
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {currentSection == 1 ? (
              <>
                {" "}
                <label className="text-sm">
                  Add the name of the Abatement Project
                </label>
                <Input
                  value={projectDetails[1].name}
                  onChange={(e) => {
                    const copy = _.cloneDeep(projectDetails);
                    copy[1].name = e.target.value;
                    setProjectDetails(copy);
                  }}
                  className="h-16 bg-gray-50 text-slate-700 text-sm font-light w-1/2"
                  placeholder="Add project name"
                />
              </>
            ) : (
              <CardContent>
                {values.name != "" ? (
                  <p className="text-green-900 text-sm">{values.name}</p>
                ) : (
                  <p className="text-sm">
                    Provide a short description of the project
                  </p>
                )}
              </CardContent>
            )}
          </CardContent>
          <CardFooter className="justify-end">
            <Button
              type="button"
              variant={"outline"}
              onClick={() => {
                setFieldValue("name", projectDetails[1].name);
                setCurrentSection(2);
              }}
              className="border-2 border-blue-600 text-blue-600 hover:text-blur-600"
            >
              Save
            </Button>
          </CardFooter>
        </Card>

        {/* Project Descripton */}
        <Card>
          <CardHeader className="flex-row justify-between">
            <div className="flex items-center space-x-2.5">
              {values.description != "" && values.estimatedCost != 0 ? (
                <div className="bg-slate-200 h-5 w-5 rounded-full grid place-items-center text-xs">
                  2
                </div>
              ) : (
                <CheckCircle2 size={24} className="text-white fill-blue-600" />
              )}
              <p className="flex-1 font-bold">Project Description*</p>
            </div>
            {values.description != "" && values.estimatedCost != 0 && (
              <Button
                variant={"ghost"}
                onClick={() => setCurrentSection(2)}
                className="text-blue-600 hover:text-blue-600 font-semibold"
              >
                Edit
              </Button>
            )}
          </CardHeader>
          {currentSection == 2 ? (
            <>
              <CardContent className="space-y-6">
                <div className="space-y-6">
                  <label className="text-sm">
                    Provide a short description of the project
                  </label>

                  <Input
                    onChange={(e) => {
                      const copy = _.cloneDeep(projectDetails);
                      copy[2].description = e.target.value;
                      setProjectDetails(copy);
                    }}
                    className="h-16 bg-gray-50 text-slate-700 text-sm font-light"
                    placeholder="Add description"
                  />
                </div>
                <div className="space-y-6">
                  <label className="text-sm">
                    Add estimated project cost (USD)
                  </label>

                  <Input
                    type="number"
                    onChange={(e) => {
                      const copy = _.cloneDeep(projectDetails);
                      copy[2].estimatedCost = Number(e.target.value);
                      setProjectDetails(copy);
                    }}
                    className="h-16 bg-gray-50 text-slate-700 text-sm font-light"
                    placeholder="Add description"
                  />
                </div>
                <div className="space-y-6">
                  <label className="text-sm">Add a website if available</label>

                  <Input
                    onChange={(e) => {
                      const copy = _.cloneDeep(projectDetails);
                      copy[2].websiteUrl = e.target.value;
                      setProjectDetails(copy);
                    }}
                    className="h-16 bg-gray-50 text-slate-700 text-sm font-light w-1/2"
                    placeholder="Add website"
                  />
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button
                  type="button"
                  variant={"outline"}
                  onClick={() => {
                    setFieldValue("description", projectDetails[2].description);
                    setFieldValue(
                      "estimatedCost",
                      projectDetails[2].estimatedCost
                    );
                    setFieldValue("websiteUrl", projectDetails[2].websiteUrl);
                    setCurrentSection(3);
                  }}
                  className="border-2 border-blue-600 text-blue-600 hover:text-blur-600"
                >
                  Save
                </Button>
              </CardFooter>
            </>
          ) : (
            <CardContent>
              <p className="text-sm">
                Provide a short description of the project
              </p>
            </CardContent>
          )}
        </Card>

        {/* Estimated Emission Reduction */}
        <Card>
          <CardHeader className="flex-row justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="bg-slate-200 h-5 w-5 rounded-full grid place-items-center text-xs">
                3
              </div>
              <p className="flex-1 font-bold">Estimated Emission Reduction*</p>
            </div>
            {values.emissionReductions != 0 && (
              <Button
                variant={"ghost"}
                onClick={() => setCurrentSection(3)}
                className="text-blue-600 hover:text-blue-600 font-semibold"
              >
                Edit
              </Button>
            )}
          </CardHeader>
          {currentSection == 3 ? (
            <>
              <CardContent className="space-y-6">
                <div className="space-y-6">
                  <label className="text-sm">
                    What is the estimated emission reductions?
                  </label>

                  <Input
                    onChange={(e) => {
                      const copy = _.cloneDeep(projectDetails);
                      copy[3].emissionReductions = Number(e.target.value);
                      setProjectDetails(copy);
                    }}
                    className="h-16 bg-gray-50 text-slate-700 text-sm font-light w-1/2"
                    placeholder="Add emission reduction"
                  />
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button
                  type="button"
                  variant={"outline"}
                  onClick={() => {
                    setFieldValue(
                      "emissionReductions",
                      projectDetails[3].emissionReductions
                    );

                    setCurrentSection(4);
                  }}
                  className="border-2 border-blue-600 text-blue-600 hover:text-blur-600"
                >
                  Save
                </Button>
              </CardFooter>
            </>
          ) : (
            <CardContent>
              <p className="text-sm">
                What is the estimated emission reductions?
              </p>
            </CardContent>
          )}
        </Card>

        {/* Proposed To  */}
        <Card>
          <CardHeader className="flex-row justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="bg-slate-200 h-5 w-5 rounded-full grid place-items-center text-xs">
                4
              </div>
              <p className="flex-1 font-bold">Proposed To*</p>
            </div>
            {values.proposedBy != "" && (
              <Button
                variant={"ghost"}
                onClick={() => setCurrentSection(4)}
                className="text-blue-600 hover:text-blue-600 font-semibold"
              >
                Edit
              </Button>
            )}
          </CardHeader>
          {currentSection == 4 ? (
            <>
              <CardContent className="space-y-6">
                <div className="space-y-6">
                  <label className="text-sm">
                    Which Supplier or Organization are you proposing this
                    project to?
                  </label>

                  <Select
                    onValueChange={(e) => {
                      const copy = _.cloneDeep(projectDetails);
                      copy[4].organizationId = e;
                      setProjectDetails(copy);
                    }}
                  >
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
                  onClick={() => {
                    setFieldValue(
                      "organizationId",
                      projectDetails[4].organizationId
                    );

                    setCurrentSection(5);
                  }}
                  className="border-2 border-blue-600 text-blue-600 hover:text-blur-600"
                >
                  Save
                </Button>
              </CardFooter>
            </>
          ) : (
            <CardContent>
              <p className="text-sm">
                Which Supplier or Organization are you proposing this project
                to?
              </p>
            </CardContent>
          )}
        </Card>

        {/* Photo and Logo */}
        <Card>
          <CardHeader className="flex-row justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="bg-slate-200 h-5 w-5 rounded-full grid place-items-center text-xs">
                5
              </div>
              <p className="flex-1 font-bold">Photo and Logo</p>
            </div>

            {values.photoUrl != "" && (
              <Button
                variant={"ghost"}
                onClick={() => setCurrentSection(5)}
                className="text-blue-600 hover:text-blue-600 font-semibold"
              >
                Edit
              </Button>
            )}
          </CardHeader>
          {currentSection == 5 ? (
            <>
              <CardContent className="space-y-6">
                <div className="space-y-6">
                  <label className="text-sm">
                    Upload a photo representing the project proposal
                  </label>

                  <Dropzone
                    onDrop={(accpeted, rejected) => {
                      const copy = _.cloneDeep(projectDetails);
                      copy[5].photoUrl = URL.createObjectURL(accpeted[0]);
                      setProjectDetails(copy);
                    }}
                  >
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

                  <Dropzone
                    onDrop={(accpeted, rejected) => {
                      const copy = _.cloneDeep(projectDetails);
                      copy[5].logoUrl = URL.createObjectURL(accpeted[0]);
                      setProjectDetails(copy);
                    }}
                  >
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
                  onClick={() => {
                    setFieldValue("photoUrl", projectDetails[5].photoUrl);
                    setFieldValue("logoUrl", projectDetails[5].logoUrl);
                  }}
                  className="border-2 border-blue-600 text-blue-600 hover:text-blur-600"
                >
                  Save
                </Button>
              </CardFooter>
            </>
          ) : (
            <CardContent>
              <p className="text-sm">
                Upload a photo representing the project proposal
              </p>
            </CardContent>
          )}
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            // disabled
            onClick={() => {
              submitForm();
            }}
          >
            Save & Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddProposedPage;
