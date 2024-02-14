"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  addAbatementProjects,
  getActiveAbatementProjectById,
} from "@/services/abatement.api";
import { getAllSuppliers } from "@/services/supply.chain";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import _ from "lodash";
import {
  CheckCircle2,
  ChevronLeft,
  Clock3,
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

const EditActiveAbatement = ({ params }: { params: { slug: string } }) => {
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
  const [currentSection, setCurrentSection] = useState(0);
  const [projectDetails, setProjectDetails] = useState({
    1: { name: "" },
    2: { description: "", estimatedCost: 0, websiteUrl: "" },
    3: { emissionReductions: 0 },
    4: { organizationId: { id: "", name: "" } },
    5: {
      photoUrl: {
        name: "",
        file: {},
      },
      logoUrl: { name: "", file: {} },
    },
  });

  const abatementProject = useQuery({
    queryKey: ["activeProject"],
    queryFn: () => getActiveAbatementProjectById(params.slug),
  });
  const project = abatementProject.isSuccess ? abatementProject.data.data : {};

  console.log("project", project);

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
      router.push("/abatement-projects/active");
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
    // validateOnChange: true,
    // validateOnBlur: true,
    // validationSchema: toFormikValidationSchema(validation),
    // validate: (values) => {},
    onSubmit: (data) => {
      console.log("formdata", data);
      const modified = {
        ...data,
        organizationId,
      };
      mutate(modified);
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
        emissionUnit: project.emission_unit,
        proposedBy: project?.proposed_by,
        photoUrl: project?.photo_url,
        logoUrl: project?.logo_url,
        status: 0,
      });

      setProjectDetails({
        1: { name: project.name },
        2: {
          description: project.description,
          estimatedCost: project.estimated_cost,
          websiteUrl: project.website_url,
        },
        3: { emissionReductions: project.emission_reductions },
        4: {
          organizationId: {
            id: project.proposed_by,
            name: project.proposedSupplier?.name,
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

  //   TODO: toggle edit state of a section on click to show forms
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
          <a href="/abatement-projects/active" className="text-slate-500">
            Active Abatement Projects
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
              {/* <div className="bg-slate-200 h-5 w-5 rounded-full grid place-items-center text-xs">
                2
              </div> */}
              <CheckCircle2 size={24} className="text-white fill-blue-600" />
              <p className="flex-1 font-bold">Project Description*</p>
            </div>
            <Button
              type="button"
              variant={"ghost"}
              className="text-blue-600 hover:text-blue-600 font-semibold px-2 text-sm"
            >
              Edit
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-green-900 font-light">
              The Alfa Laval POMEVap technology offers an innovative and
              space-efficient solution for treating palm oil mill effluent
              (POME), an acidic and organically rich byproduct that can
              contaminate water and emit greenhouse gases. Utilizing advanced
              evaporation and separation techniques, POMEVap not only neutral...
            </p>
            <p className="text-sm text-green-900 font-light ">
              www.alfalavalproject.com/sustainability
            </p>
            {/* <div className="space-y-6">
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
            </div> */}
          </CardContent>
          <CardFooter className="justify-end">
            {/* <Button
              type="button"
              variant={"outline"}
              className="border-2 border-blue-600 text-blue-600 hover:text-blur-600"
            >
              Save
            </Button> */}
          </CardFooter>
        </Card>

        {/* Estimated Emission Reduction */}
        <Card>
          <CardHeader className="flex-row justify-between">
            <div className="flex items-center space-x-2.5">
              {/* <div className="bg-slate-200 h-5 w-5 rounded-full grid place-items-center text-xs">
                3
              </div> */}
              <CheckCircle2 size={24} className="text-white fill-blue-600" />
              <p className="flex-1 font-bold">Estimated Emission Reduction*</p>
            </div>
            <Button
              type="button"
              variant={"ghost"}
              className="text-blue-600 hover:text-blue-600 font-semibold px-2 text-sm"
            >
              Edit
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* <div className="space-y-6">
              <label className="text-sm">
                What is the estimated emission reductions?
              </label>

              <Input
                className="h-16 bg-gray-50 text-slate-700 text-sm font-light w-1/2"
                placeholder="Add emission reduction"
              />
            </div> */}
            <p className="text-sm font-light text-green-900">88,990 tCO2e</p>
          </CardContent>
          <CardFooter className="justify-end">
            {/* <Button
              type="button"
              variant={"outline"}
              className="border-2 border-blue-600 text-blue-600 hover:text-blur-600"
            >
              Save
            </Button> */}
          </CardFooter>
        </Card>

        {/* Proposed To  */}
        <Card>
          <CardHeader className="flex-row justify-between">
            <div className="flex items-center space-x-2.5">
              {/* <div className="bg-slate-200 h-5 w-5 rounded-full grid place-items-center text-xs">
                4
              </div> */}
              <CheckCircle2 size={24} className="text-white fill-blue-600" />
              <p className="flex-1 font-bold">Proposed To*</p>
            </div>
            <Button
              type="button"
              variant={"ghost"}
              className="text-blue-600 hover:text-blue-600 font-semibold px-2 text-sm"
            >
              Edit
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm font-light text-green-900">88,990 tCO2e</p>
            {/* <div className="space-y-6">
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
            </div> */}
          </CardContent>
          <CardFooter className="justify-end">
            {/* <Button
              type="button"
              variant={"outline"}
              className="border-2 border-blue-600 text-blue-600 hover:text-blur-600"
            >
              Save
            </Button> */}
          </CardFooter>
        </Card>

        {/* Photo and Logo */}
        <Card>
          <CardHeader className="flex-row justify-between">
            <div className="flex items-center space-x-2.5">
              {/* <div className="bg-slate-200 h-5 w-5 rounded-full grid place-items-center text-xs">
                5
              </div> */}
              <CheckCircle2 size={24} className="text-white fill-blue-600" />
              <p className="flex-1 font-bold">Photo and Logo</p>
            </div>
            <Button
              type="button"
              variant={"ghost"}
              className="text-blue-600 hover:text-blue-600 font-semibold px-2 text-sm"
            >
              Edit
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* <div className="space-y-6">
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
            </div> */}
            <p className="text-sm font-light text-green-900">
              image_name_here.png
            </p>
            <p className="text-sm font-light text-green-900">
              image_name_here.png
            </p>
          </CardContent>
          <CardFooter className="justify-end">
            {/* <Button
              type="button"
              variant={"outline"}
              className="border-2 border-blue-600 text-blue-600 hover:text-blur-600"
            >
              Save
            </Button> */}
          </CardFooter>
        </Card>
        <div className="space-y-2">
          <p className="font-semibold">Update Status</p>
          <RadioGroup
            defaultValue="default"
            value={`${values.status}`}
            onValueChange={(e) => setFieldValue("status", e)}
            className="flex"
          >
            <div
              className={cn(
                "flex items-center space-x-2 border-2 rounded px-4 py-1",
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
                className="text-sm font-semibold text-gray-800"
              >
                Proposed
              </label>
            </div>
            <div
              className={cn(
                "flex items-center space-x-2 border-2 rounded px-4 py-1",
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
                className="text-sm font-semibold text-gray-800"
              >
                Active
              </label>
            </div>
            <div
              className={cn(
                "flex items-center space-x-2 border-2 rounded px-4 py-1",
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
                className="text-sm font-semibold text-gray-800"
              >
                Completed
              </label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex justify-between items-center">
          <Button
            variant={"ghost"}
            type="button"
            className="text-red-500 font-semibold hover:text-red-500"
          >
            DELETE
          </Button>
          <Button type="submit" disabled>
            Save & Continue
          </Button>
        </div>

        <div className="space-y-6">
          <div className="flex space-x-3 items-center">
            <UserCircle2 size={16} />
            <p className="text-xs font-medium text-slate-800">
              Updated By: John Smith
            </p>
          </div>
          <div className="flex space-x-3 items-center">
            <Clock3 size={18} className="text-white fill-gray-400" />
            <p className="text-xs font-medium text-slate-800">
              Last Updated: 12/20/23
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditActiveAbatement;
