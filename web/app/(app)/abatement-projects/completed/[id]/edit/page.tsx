"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogPortal,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import {
  deleteAbatementProject,
  editAbatementProjects,
  getActiveAbatementProjectById,
  getSupplierOrganization,
} from "@/services/abatement.api";
import { uploadImage } from "@/services/auth.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useFormik } from "formik";
import _ from "lodash";
import {
  CheckCircle2,
  ChevronLeft,
  Clock3,
  Loader2,
  Upload,
  UserCircle2,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import { toast } from "sonner";
import { z } from "zod";

const EditCompletedAbatement = ({ params }: { params: { id: string } }) => {
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
    proposedTo?: string;
    photoUrl?: string;
    logoUrl?: string;
  }>({});

  const [uploading, setUploading] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [projectDetails, setProjectDetails] = useState({
    1: { name: "" },
    2: { description: "", estimatedCost: 0, websiteUrl: "" },
    3: { emissionReductions: 0, emissionUnit: "" },
    4: { organizationId: { id: "", name: "", type: "" } },
    5: {
      photoUrl: {
        name: "",
        file: {},
      },
      logoUrl: { name: "", file: {} },
    },
  });

  const [confirmationPopup, setConfirmationPopup] = useState(false);
  const [confirmationCompletedPopup, setConfirmationCompletedPopup] =
    useState(false);

  const units = ["tCO2e", "Gallons of water", "Metric tonnes of waste"];
  const urlPattern =
    /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/g;

  const abatementProject: any = useQuery({
    queryKey: ["completedProject", params.id],
    queryFn: () => getActiveAbatementProjectById(params.id),
  });
  const project = abatementProject.isSuccess ? abatementProject.data.data : {};

  const suppliers = useQuery({
    queryKey: ["supplier-list"],
    queryFn: () =>
      getSupplierOrganization(organizationId ? organizationId : ""),
  });
  const supplierList = suppliers.isSuccess ? suppliers.data.data : [];

  const deleteProjectMut = useMutation({
    mutationFn: deleteAbatementProject,
    onSuccess: (data: any) => {
      if (data.errors) {
        throw new Error(data.errors[0].message);
      }
      toast.success("Project Deleted Successfully.", {
        style: { color: "green" },
      });

      queryClient.invalidateQueries();
      router.push("/abatement-projects/completed");
      console.log(data);
    },
    onError(error, variables, context) {
      toast.error(error.message, { style: { color: "red" } });
    },
  });

  const { mutate } = useMutation({
    mutationFn: editAbatementProjects,
    onSuccess: (data) => {
      if (data.errors) {
        throw new Error(data.errors[0].message);
      }

      toast.success("Project Updated Successfully.", {
        style: { color: "green" },
      });
      queryClient.invalidateQueries();
      router.push("/abatement-projects/completed");
      console.log(data);
    },
    onError(error, variables, context) {
      toast.error(error.message, { style: { color: "red" } });
    },
  });

  const {
    values,
    setFieldValue,
    setValues,
    handleSubmit,
    setFieldError,
    submitForm,
    errors,
    isSubmitting,
  } = useFormik({
    initialValues: {
      name: "",
      description: "",
      estimatedCost: 0,
      websiteUrl: "",
      emissionReductions: 0,
      emissionUnit: "",
      proposedTo: "",
      photoUrl: "",
      logoUrl: "",
      status: 0,
    },
    onSubmit: (data) => {
      console.log("formdata", data);

      mutate({ id: project.id, obj: data });
    },
  });

  useEffect(() => {
    if (abatementProject.isSuccess) {
      setValues({
        name: project?.name,
        description: project?.description,
        estimatedCost: project?.estimated_cost,
        websiteUrl: project.website_url,
        emissionReductions: project.emission_reductions,
        emissionUnit: project?.emission_unit,
        proposedTo: project?.proposed_to,
        photoUrl: project?.photo_url,
        logoUrl: project?.logo_url,
        status: project?.status,
      });

      setProjectDetails({
        1: { name: project.name },
        2: {
          description: project.description,
          estimatedCost: project.estimated_cost,
          websiteUrl: project.website_url,
        },
        3: {
          emissionReductions: project.emission_reductions,
          emissionUnit: project?.emission_unit,
        },
        4: {
          organizationId: {
            id: project.proposed_to,
            name: project.proposedSupplier?.name,
            type: project.proposed_type,
          },
        },
        5: {
          photoUrl: {
            name: project.photo_url,
            file: {},
          },
          logoUrl: { name: project.logo_url, file: {} },
        },
      });
    }
  }, [abatementProject.data]);

  return (
    <div className="bg-white px-8 py-6 min-h-screen">
      <div className="items-center self-stretch flex gap-2.5 pl-3 py-3 max-md:flex-wrap">
        <ChevronLeft
          size={24}
          role="button"
          className="text-slate-500"
          onClick={() => router.back()}
        />
        <nav className="text-blue-700 text-sm justify-center items-stretch grow py-1.5 max-md:max-w-full">
          <a href="/abatement-projects/completed" className="text-slate-500">
            Completed Abatement Projects
          </a>{" "}
          &gt; <span className="text-blue-600 font-bold">{project?.name}</span>{" "}
        </nav>
      </div>

      <div className="pt-6 space-y-6">
        <h2 className="text-gray-700 font-bold text-lg">{project?.name}</h2>

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
                  <p className="text-xs text-red-500 mt-0.5">{errors.name}</p>
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
                        name: z
                          .string()
                          .min(3, { message: "must be at least 3 characters" }),
                      })
                      .safeParse({ name: projectDetails[1].name });

                    if (res.success) {
                      setErr({});
                      setCurrentSection(0);
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
                      value={
                        projectDetails[2].estimatedCost === 0
                          ? ""
                          : projectDetails[2].estimatedCost
                      }
                      className={cn(
                        "h-16 bg-gray-50 w-1/2 text-slate-700 text-sm font-light",
                        err.estimatedCost && "border border-red-600"
                      )}
                      placeholder="Add project cost"
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
                        websiteUrl: z
                          .string()
                          .refine(
                            (url) => {
                              // Regular expression to validate URLs without the scheme
                              return (
                                url === "" || url.match(urlPattern) !== null
                              );
                            },
                            { message: "Invalid URL" }
                          )
                          .optional(),
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
                      setCurrentSection(0);
                      toast.success("The changes have been saved.", {
                        style: { color: "green" },
                      });
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
                $ {values.estimatedCost}
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
                  <div className="flex items-center space-x-3">
                    <Input
                      type="number"
                      name="emissionReductions"
                      onChange={(e) => {
                        const copy = _.cloneDeep(projectDetails);
                        copy[3].emissionReductions = Number(e.target.value);
                        setProjectDetails(copy);
                      }}
                      value={
                        projectDetails[3].emissionReductions === 0
                          ? ""
                          : projectDetails[3].emissionReductions
                      }
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
                          "text-slate-500 text-sm w-[200px] h-16 font-light leading-5  bg-gray-50 mx-3    rounded-md ",
                          errors?.emissionUnit && "border border-red-500"
                        )}
                      >
                        <SelectValue
                          placeholder={units[0]}
                          defaultValue={units[0]}
                        />
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
                  </div>
                  <p className="text-xs text-red-500 mt-0.5">
                    {err.emissionReductions || errors.emissionUnit}
                  </p>
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

                    if (values.emissionUnit == "") {
                      setFieldError("emissionUnit", "Please select a unit");
                      return;
                    }

                    if (res.success) {
                      setErr({});
                      setFieldValue(
                        "emissionReductions",
                        projectDetails[3].emissionReductions
                      );
                      setCurrentSection(0);
                      toast.success("The changes have been saved.", {
                        style: { color: "green" },
                      });
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
                  {projectDetails[3].emissionReductions} tCO2e
                </p>
              )}
            </CardContent>
          )}
        </Card>

        {/* Proposed To  */}
        <Card>
          <CardHeader className="flex-row justify-between">
            <div className="flex items-center space-x-2.5">
              {values.proposedTo == "" || currentSection == 4 ? (
                <div className="bg-slate-200 h-5 w-5 rounded-full grid place-items-center text-xs">
                  4
                </div>
              ) : (
                <CheckCircle2 size={24} className="text-white fill-blue-600" />
              )}
              <p className="flex-1 font-bold">Proposed To*</p>
            </div>
            {values.proposedTo != "" && (
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
                        copy[4].organizationId = supplierList.find(
                          (item: any) => item.id == e
                        );
                        setProjectDetails(copy);
                      }}
                      value={projectDetails[4].organizationId.id}
                    >
                      <SelectTrigger className="w-1/2 bg-gray-50 h-16 border-none">
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        {supplierList?.map((item: any) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-red-500 mt-0.5">
                      {err.proposedTo}
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
                      "proposedTo",
                      projectDetails[4].organizationId.id
                    );
                    setFieldValue(
                      "proposedType",
                      projectDetails[4].organizationId.type
                    );

                    // const res = z.object({ proposedBy: z.string() }).safeParse({
                    //   proposedBy: projectDetails[4].organizationId.id,
                    // });

                    if (projectDetails[4].organizationId.id != "") {
                      setCurrentSection(5);
                      toast.success("The changes have been saved.", {
                        style: { color: "green" },
                      });
                    } else {
                      setFieldError(
                        "proposedTo",
                        projectDetails[4].organizationId.id
                      );
                      setErr({ proposedTo: "This field is required." });
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
              {values.proposedTo == "" ? (
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
            {currentSection !== 5 && (
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

                    if (res1 != null || res2 != null) {
                      setUploading(false);
                      setCurrentSection(0);
                      toast.success("The changes have been saved.", {
                        style: { color: "green" },
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
        <div className="space-y-2">
          <p className="font-semibold">Update Status</p>
          <RadioGroup
            defaultValue="default"
            value={`${values.status}`}
            onValueChange={(e) => {
              if (e == "1") {
                setConfirmationPopup(true);
              } else if (e == "2") {
                setConfirmationCompletedPopup(true);
              } else {
                setFieldValue("status", 0);
              }
            }}
            className="flex"
          >
            <div
              className={cn(
                "flex items-center space-x-2 border-2 rounded px-4 py-1 cursor-pointer",
                values.status == 0 && "border-blue-600"
              )}
            >
              <RadioGroupItem
                value={"0"}
                id="r1"
                className={cn(
                  "text-blue-600 border-2 border-gray-200",
                  values.status == 0 && "border-blue-600"
                )}
              />
              <label
                htmlFor="r1"
                className="text-sm font-semibold text-gray-800 cursor-pointer"
              >
                Proposed
              </label>
            </div>
            <div
              className={cn(
                "flex items-center space-x-2 border-2 rounded px-4 py-1 cursor-pointer",
                values.status == 1 && "border-blue-600"
              )}
            >
              <RadioGroupItem
                value="1"
                id="r2"
                className={cn(
                  "text-blue-600 border-2 border-gray-200",
                  values.status == 1 && "border-blue-600"
                )}
              />
              <label
                htmlFor="r2"
                className="text-sm font-semibold text-gray-800 cursor-pointer"
              >
                Active
              </label>
            </div>
            <div
              className={cn(
                "flex items-center space-x-2 border-2 rounded px-4 py-1 cursor-pointer",
                values.status == 2 && "border-blue-600"
              )}
            >
              <RadioGroupItem
                value="2"
                id="r3"
                className={cn(
                  "text-blue-600 border-2 border-gray-200",
                  values.status == 2 && "border-blue-600"
                )}
              />
              <label
                htmlFor="r3"
                className="text-sm font-semibold text-gray-800 cursor-pointer"
              >
                Completed
              </label>
            </div>
          </RadioGroup>

          {/* completed confirmation */}
          <Dialog
            open={confirmationCompletedPopup}
            onOpenChange={setConfirmationCompletedPopup}
          >
            <DialogPortal>
              <DialogContent className="p-6 space-y-5">
                <p className="text text-center">
                  Are you sure you want to mark this project as completed? This
                  will indicate to your suppliers that this project has
                  finished. You can always go back and change the project
                  status.
                </p>
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant={"outline"}
                    className="border-2 border-blue-500 w-full font-semibold text-blue-500 hover:bg-blue-50 hover:text-blue-600"
                  >
                    No, don&apos;t mark this project as completed
                  </Button>
                </DialogClose>
                <DialogClose>
                  <Button
                    type="button"
                    variant={"outline"}
                    onClick={() => setFieldValue("status", 2)}
                    className="border-2 border-gray-400 w-full font-semibold text-gray-400 hover:text-gray-600"
                  >
                    Yes, continue
                  </Button>
                </DialogClose>
              </DialogContent>
            </DialogPortal>
          </Dialog>

          {/* active confirmation */}
          <Dialog open={confirmationPopup} onOpenChange={setConfirmationPopup}>
            <DialogPortal>
              <DialogContent className="p-6 space-y-5">
                <p className="text text-center">
                  Are you sure you want to mark this project as active? This
                  will indicate to your suppliers that this project has started.
                  You can always go back and change the project status.
                </p>
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant={"outline"}
                    className="border-2 border-blue-500 w-full font-semibold text-blue-500 hover:bg-blue-50 hover:text-blue-600"
                  >
                    No, don&apos;t activate this project
                  </Button>
                </DialogClose>
                <DialogClose>
                  <Button
                    type="button"
                    variant={"outline"}
                    onClick={() => setFieldValue("status", 1)}
                    className="border-2 border-gray-400 w-full font-semibold text-gray-400 hover:text-gray-600"
                  >
                    Yes, continue
                  </Button>
                </DialogClose>
              </DialogContent>
            </DialogPortal>
          </Dialog>
        </div>

        <div className="flex justify-between items-center">
          <Dialog>
            <DialogTrigger>
              <Button
                variant={"ghost"}
                type="button"
                className="text-red-500 font-semibold hover:text-red-500"
              >
                DELETE
              </Button>
            </DialogTrigger>
            <DialogContent className="p-6 space-y-5">
              <p className="text text-center">
                Are you sure you want to delete this Emissions Abatement
                Project? Once the project is deleted it cannot be retreived.
              </p>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant={"outline"}
                  className="border-2 border-red-500 w-full font-semibold text-red-500 hover:bg-red-50 hover:text-red-600"
                >
                  No, don&apos;t delete this project
                </Button>
              </DialogClose>
              <DialogClose>
                <Button
                  type="button"
                  variant={"outline"}
                  onClick={() => deleteProjectMut.mutate(params.id)}
                  className="border-2 border-gray-400 w-full font-semibold text-gray-400 hover:text-gray-600"
                >
                  Yes, continue
                </Button>
              </DialogClose>
            </DialogContent>
          </Dialog>

          <Button
            type="submit"
            disabled={isSubmitting}
            onClick={() => {
              submitForm();
            }}
          >
            Save & Continue
          </Button>
        </div>

        <div className="space-y-6">
          <div className="flex space-x-3 items-center">
            <UserCircle2 size={16} />
            <p className="text-xs font-medium text-slate-800">
              Updated By: {project?.updated_by}
            </p>
          </div>
          <div className="flex space-x-3 items-center">
            <Clock3 size={18} className="text-white fill-gray-400" />
            <p className="text-xs font-medium text-slate-800">
              Last Updated: {dayjs(project?.updated_at).format("DD/MM/YY")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCompletedAbatement;
