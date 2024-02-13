import { Button } from "@/components/ui/button";
import { getActiveAbatementProjectById } from "@/services/abatement.api";
import dayjs from "dayjs";
import {
  ArrowUpRight,
  Calendar,
  ChevronLeft,
  CircleDollarSignIcon,
  TrendingDown,
} from "lucide-react";
import Image from "next/image";
import React from "react";

const CompletedDetailPage = async ({ params }: { params: { id: string } }) => {
  const res = await getActiveAbatementProjectById(params?.id);
  const project = res?.data;

  return (
    <div className="bg-white p-6 min-h-screen">
      <div className="items-center self-stretch flex gap-2.5 pl-3 py-3 max-md:flex-wrap">
        <ChevronLeft size={24} className="text-slate-500" />
        <nav className="text-blue-700 text-sm justify-center items-stretch grow py-1.5 max-md:max-w-full">
          <a href="/abatement-projects/completed" className="text-slate-500">
            Completed Abatement Projects
          </a>{" "}
          &gt; <span className="text-blue-600 font-bold">{params.id}</span>{" "}
        </nav>
      </div>

      <div className="px-10">
        <div className="flex items-start justify-between pb-2 border-b ">
          <div className="p-[10px] space-y-2">
            <p className="text-xs font-medium text-slate-800">Proposed By</p>

            <Image
              src={project.logo_url}
              height={54}
              width={223}
              alt="company logo"
            />
          </div>

          {project.website_url && (
            <a
              href={project.website_url}
              className="text-blue-600 text-xs font-medium gap-1 flex"
            >
              <ArrowUpRight size={16} />
              View website
            </a>
          )}
        </div>

        <div className="py-2 space-y-2">
          <h2 className="text-2xl font-bold text-slate-800">{project.name}</h2>
          {project.photo_url && (
            <div className="w-full h-[205px] relative">
              <Image
                src={project.photo_url}
                fill={true}
                objectFit="contain"
                alt="project image"
              />
            </div>
          )}

          <p className="text-sm text-slate-800">{project.description}</p>

          <div className="py-2 flex items-center space-x-1">
            <CircleDollarSignIcon
              size={18}
              className="text-white fill-slate-500"
            />

            <p className="text-xs font-medium text-slate-800">
              Estimated Project Cost: ${project.estimated_cost}
            </p>
          </div>

          <div className="py-2 flex items-center space-x-1">
            <TrendingDown size={18} className="text-slate-500" />

            <p className="text-xs font-medium text-slate-800">
              Estimated Emission Reduction: {project.emission_reductions}
            </p>
          </div>

          <div className="py-2 flex items-center space-x-1">
            <Calendar size={18} className="text-slate-500" />

            <p className="text-xs font-medium text-slate-800">
              Completed since: {dayjs(project.updated_at).format("dd/MM/YY")}
            </p>
          </div>

          <Button type="button">Contact Project Owner</Button>
        </div>
      </div>
    </div>
  );
};

export default CompletedDetailPage;