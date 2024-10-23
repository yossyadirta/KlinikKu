import { StatusIcon } from "@/constants";
import clsx from "clsx";
import Image from "next/image";
import React from "react";

const StatusBadge = ({ status }: { status: Status }) => {
  let label = "Menunggu Konfirmasi";

  switch (status) {
    case "cancelled":
      label = "Dibatalkan";
      break;
    case "scheduled":
      label = "Dijadwalkan";
      break;
    default:
      break;
  }
  return (
    <div
      className={clsx("status-badge", {
        "bg-green-600": status === "scheduled",
        "bg-blue-600": status === "pending" || status === null,
        "bg-red-600": status === "cancelled",
      })}
    >
      <Image
        src={StatusIcon[status]}
        alt={status}
        width={24}
        height={24}
        className="h-fit w-3"
      />
      <p
        className={clsx("text-12-semibold capitalize", {
          "text-green-500": status === "scheduled",
          "text-blue-500": status === "pending" || status === null,
          "text-red-500": status === "cancelled",
        })}
      >
        {label}
      </p>
    </div>
  );
};

export default StatusBadge;
