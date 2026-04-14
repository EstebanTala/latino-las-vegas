"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps } from "react";

interface NavLinkProps extends ComponentProps<typeof Link> {
  className?: string | ((props: { isActive: boolean }) => string);
  children: React.ReactNode;
}

export default function NavLink({ href, className, children, ...props }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname?.startsWith(href + "/");

  const resolvedClassName = typeof className === "function" ? className({ isActive }) : className;

  return (
    <Link href={href} className={resolvedClassName} {...props}>
      {children}
    </Link>
  );
}
