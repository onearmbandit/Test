"use client";
import { Button } from "@/components/ui/button";
import { useAccountStore } from "@/lib/stores/organisation.store";
import { setupOrganizationStep2 } from "@/services/organizations.api";
import { getUser } from "@/services/user.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { FormEventHandler, useEffect, useState } from "react";
import { toast } from "sonner";

const EditEmployees = ({
  setSection,
}: {
  setSection: (val: string) => void;
}) => {
  const { setNav } = useAccountStore();
  // const { data: session, update } = useSession();
  const [selected, setSelected] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const userQ = useQuery({
    queryKey: ["employee-details"],
    queryFn: () => getUser(),
  });
  const user = userQ.isSuccess ? userQ.data : null;

  const sizes = [
    "1 to 10",
    "10 to 25",
    "26 to 50",
    "51 to 100",
    "101 to 200",
    "201 to 500",
    "501 to 1000",
    "1001 to 10,000",
    "10,000+",
  ];

  const { mutate, isSuccess, isPending } = useMutation({
    mutationFn: setupOrganizationStep2,
    onSuccess: (organization) => {
      toast.success("Your organization profile has been updated", {
        style: { color: "green" },
      });
      queryClient.invalidateQueries({ queryKey: ["account-details"] });
      setSection("home");
    },
    onError: (err) => {
      toast.error(err.message, { style: { color: "red" } });
    },
  });

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const orgId = user.organizations[0].id;

    mutate({ id: orgId!, formdata: { companySize: sizes[selected!] } });
  };

  useEffect(() => {
    if (userQ.isSuccess) {
      const companySize = user.data.organizations[0].company_size;
      const index = sizes.indexOf(companySize);
      setSelected(index);
    }
  }, [userQ.status]);

  return (
    <form
      onSubmit={handleSubmit}
      className="items-start self-stretch grow bg-white flex rounded-e-lg space-y-6 flex-col pt-6 px-8 max-md:px-5"
    >
      <header className="text-blue-600 text-xs font-medium leading-5 self-stretch mr-2.5 max-md:max-w-full">
        <span className="text-slate-500">
          {" "}
          <span
            role="button"
            onClick={() => {
              setNav("myAccount");
              setSection("home");
            }}
          >
            Account
          </span>{" "}
          &gt;{" "}
          <span role="button" onClick={() => setSection("home")}>
            Organization Account
          </span>{" "}
          &gt;{" "}
        </span>{" "}
        <span className="text-blue-600">Edit Number of Employees</span>
      </header>

      <h2 className="text-gray-700 text-lg font-bold leading-7 self-stretch mr-2.5 pb-3 border-b border-gray-300  max-md:max-w-full">
        Edit Number of Employees
      </h2>

      <div className="text-slate-700 text-base font-semibold leading-6 self-stretch max-md:max-w-full">
        <label htmlFor="employees">Number of Employees</label>
      </div>

      <div className="company-size-container grid grid-cols-3 gap-4 max-md:max-w-full max-md:flex-wrap">
        {sizes.map((item, i) => (
          <button
            type="button"
            key={i}
            onClick={() => setSelected(i)}
            className={`company-size-option  text-lg font-bold leading-7 whitespace-nowrap active:bg-blue-300 hover:bg-blue-200 justify-center items-center grow px-7 py-4 rounded-2xl border-solid max-md:px-5 ${
              selected == i
                ? "bg-blue-200 border-2 border-blue-500 text-blue-700"
                : "border border-slate-500 text-slate-800"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="flex justify-end w-full">
        <Button
          disabled={selected == null}
          className="text-sm font-bold whitespace-nowrap rounded"
          type="submit"
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default EditEmployees;
