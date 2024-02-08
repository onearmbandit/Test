import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  Calendar,
  ChevronLeft,
  CircleDollarSignIcon,
  TrendingDown,
} from "lucide-react";
import Image from "next/image";
import React from "react";

const ActiveDetailPage = ({ params }: { params: { slug: string } }) => {
  return (
    <div className="bg-white p-6 min-h-screen">
      <div className="items-center self-stretch flex gap-2.5 pl-3 py-3 max-md:flex-wrap">
        <ChevronLeft size={24} className="text-slate-500" />
        <nav className="text-blue-700 text-sm justify-center items-stretch grow py-1.5 max-md:max-w-full">
          <a href="/abatement-projects/active" className="text-slate-500">
            Active Abatement Projects
          </a>{" "}
          &gt; <span className="text-blue-600 font-bold">{params.slug}</span>{" "}
        </nav>
      </div>

      <div className="px-10">
        <div className="flex items-start justify-between pb-2 border-b ">
          <div className="p-[10px] space-y-2">
            <p className="text-xs font-medium text-slate-800">Proposed By</p>

            <Image
              src={"/assets/images/Logo.svg"}
              height={54}
              width={223}
              alt="company logo"
            />
          </div>
          {/* TODO: conditional if website is present */}
          <a
            href={"https://google.com"}
            className="text-blue-600 text-xs font-medium gap-1 flex"
          >
            <ArrowUpRight size={16} />
            View website
          </a>
        </div>

        <div className="py-2 space-y-2">
          <h2 className="text-2xl font-bold text-slate-800">
            Alfa Laval POMEVap{" "}
          </h2>
          <div className="w-full h-[205px] relative">
            <Image
              src={"https://source.unsplash.com/1072x300?solar"}
              fill={true}
              objectFit="contain"
              alt="project image"
            />
          </div>

          <p className="text-sm text-slate-800">
            The Alfa Laval POMEVap technology offers an innovative and
            space-efficient solution for treating palm oil mill effluent (POME),
            an acidic and organically rich byproduct that can contaminate water
            and emit greenhouse gases. Utilizing advanced evaporation and
            separation techniques, POMEVap not only neutralizes harmful waste,
            but also reduces energy costs, achieves zero liquid discharge, and
            generates additional income through oil recovery. With a small
            footprint and quick payback, it stands out as a more sustainable
            alternative to conventional ponding systems, which are
            space-intensive and contribute to methane emissions. Additionally,
            the liquid by-product from POMEVap can be further polished for safe
            environmental release, enhancing its eco-friendly profile.
          </p>

          <div className="py-2 flex items-center space-x-1">
            <CircleDollarSignIcon
              size={18}
              className="text-white fill-slate-500"
            />

            <p className="text-xs font-medium text-slate-800">
              Estimated Project Cost: $6,956,685
            </p>
          </div>

          <div className="py-2 flex items-center space-x-1">
            <TrendingDown size={18} className="text-slate-500" />

            <p className="text-xs font-medium text-slate-800">
              Estimated Emission Reduction: $1,516,547
            </p>
          </div>

          <div className="py-2 flex items-center space-x-1">
            <Calendar size={18} className="text-slate-500" />

            <p className="text-xs font-medium text-slate-800">
              Completed since: 04/23/2022
            </p>
          </div>

          <Button type="button">Contact Project Owner</Button>
        </div>
      </div>
    </div>
  );
};

export default ActiveDetailPage;
