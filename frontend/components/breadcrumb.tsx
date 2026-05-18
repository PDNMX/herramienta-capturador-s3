import { cn } from "@/lib/utils";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import React from "react";

type BreadCrumbType = {
  title: string;
  link: string;
};

type BreadCrumbPropsType = {
  items: BreadCrumbType[];
};

export default function BreadCrumb({ items }: BreadCrumbPropsType) {
  return (
    <nav className="mb-6 flex items-center space-x-1 text-xs text-muted-foreground">
      <Link
        href={"/inicio"}
        className="hover:text-foreground transition-colors truncate"
      >
        Inicio
      </Link>
      {items?.map((item: BreadCrumbType, index: number) => (
        <React.Fragment key={item.title}>
          <ChevronRightIcon className="h-3.5 w-3.5 shrink-0 opacity-50" />
          <Link
            href={item.link}
            className={cn(
              "truncate transition-colors",
              index === items.length - 1
                ? "text-foreground font-medium pointer-events-none"
                : "hover:text-foreground",
            )}
          >
            {item.title}
          </Link>
        </React.Fragment>
      ))}
    </nav>
  );
}
