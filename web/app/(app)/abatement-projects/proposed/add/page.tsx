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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { addAbatementProjects } from "@/services/abatement.api";
import { uploadImage } from "@/services/auth.api";
import { getAllSuppliers } from "@/services/supply.chain";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import _ from "lodash";
import { CheckCircle2, ChevronLeft, Loader2, Upload, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Dropzone from "react-dropzone";
import { toast } from "sonner";
import { object, z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

const AddProposedPage = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const router = useRouter();
  const organizationId = session?.user?.organizations[0]?.id;
  const userId = session?.user?.id;
  const [err, setErr] = useState<{
    name?: string;
    description?: string;
    estimatedCost?: string;
    websiteUrl?: string;
    emissionReductions?: string;
    proposedBy?: string;
    photoUrl?: string;
    logoUrl?: string;
  }>({});

  const [uploading, setUploading] = useState(false);
  const [currentSection, setCurrentSection] = useState(1);
  const [projectDetails, setProjectDetails] = useState({
    1: { name: "" },
    2: { description: "", estimatedCost: 0, websiteUrl: "" },
    3: { emissionReductions: 0, emissionUnit: "" },
    4: { organizationId: { id: "", name: "" } },
    5: {
      photoUrl: {
        name: "",
        file: {},
      },
      logoUrl: { name: "", file: {} },
    },
  });

  const units = ["tCO2e", "Gallons of water", "Metric tonnes of waste"];

  const suppliers = useQuery({
    queryKey: ["supplier-list"],
    queryFn: () => getAllSuppliers(),
  });
  const supplierList = suppliers.isSuccess ? suppliers.data.data : [];

  const { mutate } = useMutation({
    mutationFn: addAbatementProjects,
    onSuccess: (data) => {
      if (data.errors) {
        throw new Error(data.errors[0].message);
      }

      toast.success("Project Created Successfully.", {
        style: { color: "green" },
      });
      queryClient.invalidateQueries();
      router.push("/abatement-projects/active");
      console.log(data);
    },
    onError(error, variables, context) {
      toast.error(error.message, { style: { color: "red" } });
    },
  });

  const validation = z.object({
    name: z.string().min(3, { message: "length" }),
    description: z.string().min(3, { message: "length" }),
    estimatedCost: z.number().min(0, { message: "must be greater than 0" }),
    websiteUrl: z.string(),
    emissionReductions: z
      .number()
      .min(0, { message: "must be greater than 0" }),
    emissionUnit: z.string().min(3, { message: "length" }),
    proposedBy: z.string().min(3, { message: "length" }),
    photoUrl: z.string().min(3, { message: "length" }),
    logoUrl: z.string().min(3, { message: "length" }),
    status: z.number().min(0, { message: "must be greater than 0" }),
  });

  const {
    values,
    setFieldValue,
    handleSubmit,
    setFieldError,
    submitForm,
    errors,
  } = useFormik({
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
      status: 0,
    },

    onSubmit: (data) => {
      console.log("formdata", data);
      const modified = {
        ...data,
        organizationId,
      };
      mutate(modified);
    },
  });

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
          <CardHeader className="flex-row justify-between">
            <div className="flex items-center space-x-2.5">
              {values.name === "" || currentSection == 1 ? (
                <div className="bg-slate-200 h-5 w-5 rounded-full grid place-items-center text-xs">
                  1
                </div>
              ) : (
                <CheckCircle2 size={24} className="text-white fill-blue-600" />
              )}
              <p className="flex-1 font-bold">Project Name*</p>
            </div>
            {values.name !== "" && (
              <Button
                variant={"ghost"}
                onClick={() => setCurrentSection(1)}
                className="text-blue-600 hover:text-blue-600 font-semibold"
              >
                Edit
              </Button>
            )}
          </CardHeader>
          {currentSection == 1 ? (
            <>
              <CardContent className="space-y-6">
                {" "}
                <label className="text-sm">
                  Add the name of the Abatement Project
                </label>
                <div>
                  <Input
                    name="name"
                    value={projectDetails[1].name}
                    onChange={(e) => {
                      const copy = _.cloneDeep(projectDetails);
                      copy[1].name = e.target.value;
                      setProjectDetails(copy);
                    }}
                    className={cn(
                      "h-16 bg-gray-50 text-slate-700 text-sm font-light w-1/2",
                      err.name && "border border-red-600"
                    )}
                    placeholder="Add project name"
                  />
                  <p className="text-xs text-red-500 mt-0.5">{err.name}</p>
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button
                  type="button"
                  variant={"outline"}
                  onClick={() => {
                    setFieldValue("name", projectDetails[1].name);

                    const res = z
                      .object({
                        name: z.string().min(3, {
                          message: "Project name must be at least 3 characters",
                        }),
                      })
                      .safeParse({ name: projectDetails[1].name });

                    if (res.success) {
                      setErr({});
                      setCurrentSection(2);
                    } else {
                      setFieldError("name", res.error.errors[0].message);
                      setErr({ name: res.error.errors[0].message });
                    }
                  }}
                  className="border-2 border-blue-600 text-blue-600 hover:text-blur-600"
                >
                  Save
                </Button>
              </CardFooter>
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
        </Card>

        {/* Project Descripton */}
        <Card>
          <CardHeader className="flex-row justify-between">
            <div className="flex items-center space-x-2.5">
              {(values.description == "" && values.estimatedCost == 0) ||
              currentSection == 2 ? (
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

                  <div>
                    <textarea
                      name="description"
                      onChange={(e) => {
                        const copy = _.cloneDeep(projectDetails);
                        copy[2].description = e.target.value;
                        setProjectDetails(copy);
                      }}
                      value={projectDetails[2].description}
                      className={cn(
                        "min-h-20 px-2 py-3 rounded-md focus:outline-none resize-none bg-gray-50 w-full text-slate-700 text-sm font-light",
                        err.description && "border border-red-600"
                      )}
                      placeholder="Add description"
                    />
                    <p className="text-xs text-red-500 mt-0.5">
                      {err.description}
                    </p>
                  </div>
                </div>
                <div className="space-y-6">
                  <label className="text-sm">
                    Add estimated project cost (USD)
                  </label>

                  <div>
                    <Input
                      name="estimatedCost"
                      type="number"
                      onChange={(e) => {
                        const copy = _.cloneDeep(projectDetails);
                        copy[2].estimatedCost = Number(e.target.value);
                        setProjectDetails(copy);
                      }}
                      value={projectDetails[2].estimatedCost}
                      className={cn(
                        "h-16 bg-gray-50 w-1/2 text-slate-700 text-sm font-light",
                        err.estimatedCost && "border border-red-600"
                      )}
                      placeholder="Add description"
                    />
                    <p className="text-xs text-red-500 mt-0.5">
                      {err.estimatedCost}
                    </p>
                  </div>
                </div>
                <div className="space-y-6">
                  <label className="text-sm">Add a website if available</label>

                  <div>
                    <Input
                      name="websiteUrl"
                      onChange={(e) => {
                        const copy = _.cloneDeep(projectDetails);
                        copy[2].websiteUrl = e.target.value;
                        setProjectDetails(copy);
                      }}
                      value={projectDetails[2].websiteUrl}
                      className={cn(
                        "h-16 bg-gray-50 text-slate-700 text-sm font-light w-1/2",
                        err.websiteUrl && "border border-red-600"
                      )}
                      placeholder="Add website"
                    />
                    <p className="text-xs text-red-500 mt-0.5">
                      {err.websiteUrl}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button
                  type="button"
                  variant={"outline"}
                  onClick={() => {
                    const res = z
                      .object({
                        description: z.string().min(3, {
                          message: "description minimum lenth should be 3",
                        }),
                        estimatedCost: z
                          .number()
                          .min(1, { message: "cost must be greater than 0" }),
                        websiteUrl: z.string().optional(),
                      })
                      .safeParse({
                        description: projectDetails[2].description,
                        estimatedCost: projectDetails[2].estimatedCost,
                        websiteUrl: projectDetails[2].websiteUrl,
                      });

                    if (res.success) {
                      setErr({});
                      setFieldValue(
                        "description",
                        projectDetails[2].description
                      );
                      setFieldValue(
                        "estimatedCost",
                        projectDetails[2].estimatedCost
                      );
                      setFieldValue("websiteUrl", projectDetails[2].websiteUrl);
                      setCurrentSection(3);
                    } else {
                      res.error.errors.map((item) => {
                        // setFieldError(`${item.path[0]}`, item.message);
                        setErr({ ...err, [`${item.path[0]}`]: item.message });
                      });
                    }
                  }}
                  className="border-2 border-blue-600 text-blue-600 hover:text-blur-600"
                >
                  Save
                </Button>
              </CardFooter>
            </>
          ) : values.description == "" &&
            values.estimatedCost == 0 &&
            values.websiteUrl == "" ? (
            <CardContent>
              <p className="text-sm">
                Provide a short description of the project
              </p>
            </CardContent>
          ) : (
            <CardContent className="space-y-6">
              <p className="text-green-900 text-sm line-clamp-2">
                {values.description}
              </p>
              <p className="text-green-900 text-sm line-clamp-2">
                {values.estimatedCost}
              </p>
              <p className="text-green-900 text-sm line-clamp-2">
                {values.websiteUrl}
              </p>
            </CardContent>
          )}
        </Card>

        {/* Estimated Emission Reduction */}
        <Card>
          <CardHeader className="flex-row justify-between">
            <div className="flex items-center space-x-2.5">
              {values.emissionReductions == 0 || currentSection == 3 ? (
                <div className="bg-slate-200 h-5 w-5 rounded-full grid place-items-center text-xs">
                  3
                </div>
              ) : (
                <CheckCircle2 size={24} className="text-white fill-blue-600" />
              )}
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
                  <div className="flex">
                    <Input
                      name="emissionReductions"
                      onChange={(e) => {
                        const copy = _.cloneDeep(projectDetails);
                        copy[3].emissionReductions = Number(e.target.value);
                        setProjectDetails(copy);
                      }}
                      value={projectDetails[3].emissionReductions}
                      className={cn(
                        "h-16 bg-gray-50 text-slate-700 text-sm font-light w-1/2",
                        err.emissionReductions && "border border-red-600"
                      )}
                      placeholder="Add emission reduction"
                    />

                    <Select
                      name="emissionUnit"
                      value={values.emissionUnit}
                      onValueChange={(e) => {
                        setFieldValue("emissionUnit", e);
                      }}
                    >
                      <SelectTrigger
                        className={cn(
                          "text-slate-500 text-sm w-28 font-light leading-5  bg-gray-50 mx-3    rounded-md ",
                          errors?.emissionUnit && "border border-red-500"
                        )}
                      >
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Select a unit</SelectLabel>

                          {units?.map((unit: any, index: number) => (
                            <SelectItem key={index} value={unit}>
                              {unit}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    <p className="text-xs text-red-500 mt-0.5">
                      {err.emissionReductions}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button
                  type="button"
                  variant={"outline"}
                  onClick={() => {
                    const res = z
                      .object({
                        emissionReductions: z
                          .number({
                            invalid_type_error: "Emissions should be a number",
                          })
                          .min(1, {
                            message: "emissions must be greater than 0",
                          }),
                      })
                      .safeParse({
                        emissionReductions:
                          projectDetails[3].emissionReductions,
                      });

                    if (res.success) {
                      setErr({});
                      setFieldValue(
                        "emissionReductions",
                        projectDetails[3].emissionReductions
                      );
                      setCurrentSection(4);
                    } else {
                      setFieldError("emissionReductions", res.error.message);
                      setErr({
                        emissionReductions: res.error.errors[0].message,
                      });
                    }
                  }}
                  className="border-2 border-blue-600 text-blue-600 hover:text-blur-600"
                >
                  Save
                </Button>
              </CardFooter>
            </>
          ) : (
            <CardContent>
              {values.emissionReductions == 0 ? (
                <p className="text-sm">
                  What is the estimated emission reductions?
                </p>
              ) : (
                <p className="text-sm text-green-900">
                  {projectDetails[3].emissionReductions} {values.emissionUnit}
                </p>
              )}
            </CardContent>
          )}
        </Card>

        {/* Proposed To  */}
        <Card>
          <CardHeader className="flex-row justify-between">
            <div className="flex items-center space-x-2.5">
              {values.proposedBy == "" || currentSection == 4 ? (
                <div className="bg-slate-200 h-5 w-5 rounded-full grid place-items-center text-xs">
                  4
                </div>
              ) : (
                <CheckCircle2 size={24} className="text-white fill-blue-600" />
              )}
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

                  <div>
                    <Select
                      onValueChange={(e: any) => {
                        const copy = _.cloneDeep(projectDetails);
                        copy[4].organizationId = e;
                        setProjectDetails(copy);
                      }}
                    >
                      <SelectTrigger className="w-1/2 bg-gray-50 h-16 border-none">
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        {supplierList?.map((item: any) => (
                          <SelectItem key={item.id} value={item}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-red-500 mt-0.5">
                      {err.proposedBy}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button
                  type="button"
                  variant={"outline"}
                  onClick={() => {
                    setFieldValue(
                      "proposedBy",
                      projectDetails[4].organizationId.id
                    );

                    // const res = z.object({ proposedBy: z.string() }).safeParse({
                    //   proposedBy: projectDetails[4].organizationId.id,
                    // });

                    if (projectDetails[4].organizationId.id != "") {
                      setCurrentSection(5);
                    } else {
                      setFieldError(
                        "proposedBy",
                        projectDetails[4].organizationId.id
                      );
                      setErr({ proposedBy: "This field is required." });
                    }
                  }}
                  className="border-2 border-blue-600 text-blue-600 hover:text-blur-600"
                >
                  Save
                </Button>
              </CardFooter>
            </>
          ) : (
            <CardContent>
              {values.proposedBy == "" ? (
                <p className="text-sm">
                  Which Supplier or Organization are you proposing this project
                  to?
                </p>
              ) : (
                <p className="text-sm text-green-900">
                  {projectDetails[4].organizationId.name}
                </p>
              )}
            </CardContent>
          )}
        </Card>

        {/* Photo and Logo */}
        <Card>
          <CardHeader className="flex-row justify-between">
            <div className="flex items-center space-x-2.5">
              {(values.photoUrl == "" && values.logoUrl == "") ||
              currentSection == 5 ? (
                <div className="bg-slate-200 h-5 w-5 rounded-full grid place-items-center text-xs">
                  5
                </div>
              ) : (
                <CheckCircle2 size={24} className="text-white fill-blue-600" />
              )}
              <p className="flex-1 font-bold">Photo and Logo</p>
            </div>

            {values.photoUrl != "" && values.logoUrl && (
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
                      copy[5].photoUrl.file = accpeted[0];
                      copy[5].photoUrl.name = accpeted[0].name;
                      console.log(accpeted[0]);
                      setProjectDetails(copy);
                    }}
                  >
                    {({ getInputProps, getRootProps }) => (
                      <>
                        {projectDetails[5].photoUrl.name == "" ? (
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
                        ) : (
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
                              {projectDetails[5].photoUrl.name}
                            </p>

                            <X
                              size={16}
                              role="button"
                              className="text-slate-500"
                              onClick={() => {
                                const copy = _.cloneDeep(projectDetails);
                                copy[5].photoUrl = { name: "", file: {} };
                                setProjectDetails(copy);
                              }}
                            />
                          </div>
                        )}
                      </>
                    )}
                  </Dropzone>
                </div>
                <div className="space-y-6">
                  <label className="text-sm">Upload your company Logo</label>

                  <Dropzone
                    onDrop={(accpeted, rejected) => {
                      const copy = _.cloneDeep(projectDetails);
                      console.log(accpeted);
                      copy[5].logoUrl.file = accpeted[0];
                      copy[5].logoUrl.name = accpeted[0].name;
                      setProjectDetails(copy);
                    }}
                  >
                    {({ getInputProps, getRootProps }) => (
                      <>
                        {projectDetails[5].logoUrl.name == "" ? (
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
                        ) : (
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
                              {projectDetails[5].logoUrl.name}
                            </p>

                            <X
                              size={16}
                              role="button"
                              className="text-slate-500"
                              onClick={() => {
                                const copy = _.cloneDeep(projectDetails);
                                copy[5].logoUrl = { name: "", file: {} };
                                setProjectDetails(copy);
                              }}
                            />
                          </div>
                        )}
                      </>
                    )}
                  </Dropzone>
                </div>
              </CardContent>

              <CardFooter className="justify-end">
                {uploading && (
                  <Loader2 className="text-blue-600 animate-spin" />
                )}
                <Button
                  type="button"
                  disabled={uploading}
                  variant={"outline"}
                  onClick={async () => {
                    const photo = new FormData();
                    const logo = new FormData();
                    photo.append(
                      "image",
                      projectDetails[5].photoUrl.file as Blob
                    );
                    logo.append(
                      "image",
                      projectDetails[5].logoUrl.file as Blob
                    );
                    setUploading(true);
                    let res1 = null;
                    let res2 = null;

                    if (projectDetails[5].photoUrl.name != "") {
                      res1 = await uploadImage(photo);
                      if (res1.errors) {
                        return toast.error(
                          "Something went wrong while uploading the photo ",
                          { style: { color: "red" } }
                        );
                      }
                      setFieldValue("photoUrl", res1.data);
                    }

                    if (projectDetails[5].logoUrl.name != "") {
                      res2 = await uploadImage(logo);

                      if (res2.errors) {
                        return toast.error(
                          "Something went wrong while uploading the logo",
                          { style: { color: "red" } }
                        );
                      }
                      setFieldValue("logoUrl", res2.data);
                    }

                    if (res1 != null && res2 != null) {
                      setUploading(false);
                      setCurrentSection(0);
                    }
                  }}
                  className="border-2 border-blue-600 text-blue-600 hover:text-blur-600"
                >
                  Save
                </Button>
              </CardFooter>
            </>
          ) : (
            <CardContent className="space-y-6">
              {values.photoUrl == "" && values.logoUrl ? (
                <p className="text-sm">
                  Upload a photo representing the project proposal
                </p>
              ) : (
                <>
                  <p className="text-sm text-green-900">
                    {projectDetails[5].photoUrl.name}
                  </p>
                  <p className="text-sm text-green-900">
                    {projectDetails[5].logoUrl.name}
                  </p>
                </>
              )}
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
