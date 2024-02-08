import Header from "@/components/Header";
import EmptyState from "@/components/abatement-projects/empty-state";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authOptions } from "@/lib/utils";
import { getActiveAbatementProjects } from "@/services/abatement.api";
import { Plus } from "lucide-react";
import { getServerSession } from "next-auth/next";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Page = async () => {
  const session = await getServerSession(authOptions);
  const res = await getActiveAbatementProjects(
    session?.user?.organizations[0].id!
  );

  console.log("projects", res);

  return (
    <div className="px-8">
      <Header />
      {/* <EmptyState link="/abatement-project/active" /> */}
      <div className="bg-white rounded-md p-6 border border-slate-100 space-y-6">
        <div className="flex items-center space-x-2">
          <Image
            src={"/assets/images/folder-tick.svg"}
            height={24}
            width={24}
            alt="folder icon"
          />
          <p className="text-lg font-bold text-slate-700">
            Active Abatement Projects
          </p>
        </div>

        <p className="text-slate-800 font-semibold">
          Total Abatement to date:{" "}
          <span className="font-normal">128,441 tCO2e / year</span>
        </p>

        <div className="grid grid-cols-3 gap-6">
          <Card className="px-4 py-3 space-y-4 h-fit">
            <Link href={"/abatement-projects/active/details-page"}>
              <CardTitle className="text-xs font-medium text-slate-800">
                Sao Paulo Refinery
              </CardTitle>
              <Image
                height={102}
                width={300}
                src={"https://source.unsplash.com/300x102?solar"}
                alt="project image"
              />
            </Link>
            <CardContent className="p-0 flex flex-col space-y-2">
              <Link href={"/abatement-projects/active/details-page"}>
                <div className="space-x-2 flex">
                  <Image
                    height={16}
                    width={16}
                    src="/assets/images/briefcase.svg"
                    alt="briefcase icon"
                  />
                  <p className="text-xs font-medium text-slate-800">
                    Agropalma Group
                  </p>
                </div>
              </Link>
              <div className="text-xs text-slate-600 line-clamp-2">
                Features natural gas boilers and solar powered lights.
              </div>
              <p className="text-xs font-bold text-slate-600">
                Est. Emission Reduction per year:{" "}
                <span className="font-medium">59,547 tCO2e</span>
              </p>

              <CardFooter className="p-0 justify-end">
                <Link
                  href={"/abatement-projects/active/some-other-project/edit"}
                >
                  <Button
                    type="button"
                    variant={"ghost"}
                    className="text-blue-600 hover:text-blue-600 px-3"
                  >
                    Edit
                  </Button>
                </Link>
              </CardFooter>
            </CardContent>
          </Card>
          <Card className="px-4 py-3 space-y-4 h-fit">
            <CardTitle className="text-xs font-medium text-slate-800">
              Sao Paulo Refinery
            </CardTitle>
            {/* <Image
              height={102}
              width={300}
              src={"https://source.unsplash.com/300x102?solar"}
              alt="project image"
            /> */}
            <CardContent className="p-0 flex flex-col space-y-2">
              <div className="space-x-2 flex">
                <Image
                  height={16}
                  width={16}
                  src="/assets/images/briefcase.svg"
                  alt="briefcase icon"
                />
                <p className="text-xs font-medium text-slate-800">
                  Agropalma Group
                </p>
              </div>
              <div className="text-xs text-slate-600">
                Features natural gas boilers and solar powered lights.
              </div>
              <p className="text-xs font-bold text-slate-600">
                Est. Emission Reduction per year:{" "}
                <span className="font-medium">59,547 tCO2e</span>
              </p>

              <CardFooter className="p-0 justify-end">
                <Link href={"/abatement-projects/active/Someproject/edit"}>
                  <Button
                    type="button"
                    variant={"ghost"}
                    className="text-blue-600 hover:text-blue-600 px-3"
                  >
                    Edit
                  </Button>
                </Link>
              </CardFooter>
            </CardContent>
          </Card>

          {/* new Card */}
          <Link href={"/abatement-projects/active/add"}>
            <Card className="h-[302px] w-full col-span-1 flex justify-center items-center">
              <div className="flex items-center space-x-2">
                <Plus size={24} className="text-slate-400" />
                <p className="text-slate-400 font-semibold">Add a project</p>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
