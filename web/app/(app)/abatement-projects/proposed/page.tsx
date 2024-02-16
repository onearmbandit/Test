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
import { getProposedAbatementProjects } from "@/services/abatement.api";
import { Plus } from "lucide-react";
import { getServerSession } from "next-auth/next";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ProposedPage = async () => {
  const session = await getServerSession(authOptions);
  const res = await getProposedAbatementProjects(
    session?.user?.organizations[0].id!
  );
  const projects = res?.data;

  console.log("projects: ", projects);

  return (
    <div className="px-8">
      <Header />
      {projects.length == 0 ? (
        <EmptyState link="/abatement-projects/proposed/add" />
      ) : (
        <div className="bg-white rounded-md p-6 border border-slate-100 space-y-6">
          <div className="flex items-center space-x-2">
            <Image
              src={"/assets/images/folder-tick.svg"}
              height={24}
              width={24}
              alt="folder icon"
            />
            <p className="text-lg font-bold text-slate-700">
              Proposed Abatement Projects
            </p>
          </div>

          {/* todo: make it dynamic */}
          <p className="text-slate-800 font-semibold">
            Total Abatement to date:{" "}
            <span className="font-normal">NA NA / year</span>
          </p>

          <div className="grid grid-cols-3 gap-6">
            {projects.map((item: any) => (
              <Card key={item.id} className="px-4 py-3 space-y-4 h-fit">
                <Link href={`/abatement-projects/proposed/${item.id}`}>
                  <CardTitle className="text-xs leading-5 pb-4 font-medium text-slate-800">
                    {item.name}
                  </CardTitle>
                  {item.photo_url && (
                    <Image
                      height={102}
                      width={300}
                      src={item.photo_url}
                      alt="project image"
                    />
                  )}
                </Link>
                <CardContent className="p-0 flex flex-col space-y-2">
                  <Link href={`/abatement-projects/proposed/${item.id}`}>
                    <div className="space-x-2 flex">
                      <Image
                        height={16}
                        width={16}
                        src="/assets/images/briefcase.svg"
                        alt="briefcase icon"
                      />
                      <p className="text-xs font-medium text-slate-800">
                        {item.proposed_type == "supplier"
                          ? `${item?.proposedSupplier?.name}`
                          : `${item?.proposedOrganization?.name}`}
                      </p>
                    </div>
                  </Link>
                  <div className="text-xs text-slate-600 line-clamp-2">
                    {item.description}
                  </div>
                  <p className="text-xs font-bold text-slate-600">
                    Est. Emission Reduction per year:{" "}
                    <span className="font-medium">
                      {item.emission_reductions} tCO2e
                    </span>
                  </p>

                  <CardFooter className="p-0 justify-end">
                    <Link href={`/abatement-projects/proposed/${item.id}/edit`}>
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
            ))}

            {/* new Card */}
            <Link href={"/abatement-projects/proposed/add"}>
              <Card className="h-[302px] w-full col-span-1 flex justify-center items-center">
                <div className="flex items-center space-x-2">
                  <Plus size={24} className="text-slate-400" />
                  <p className="text-slate-400 font-semibold">Add a project</p>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProposedPage;
