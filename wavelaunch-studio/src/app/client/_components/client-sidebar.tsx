"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderOpen,
  Upload,
  CheckSquare,
  MessageSquare,
  FileText,
  HelpCircle,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/client/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "My Projects",
    href: "/client/projects",
    icon: FolderOpen,
  },
  {
    name: "Files",
    href: "/client/files",
    icon: Upload,
  },
  {
    name: "Approvals",
    href: "/client/approvals",
    icon: CheckSquare,
  },
  {
    name: "Messages",
    href: "/client/messages",
    icon: MessageSquare,
  },
  {
    name: "Documents",
    href: "/client/documents",
    icon: FileText,
  },
  {
    name: "Help & Support",
    href: "/client/support",
    icon: HelpCircle,
  },
];

export function ClientSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-64 lg:flex-col lg:pt-16">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-purple-100 bg-white px-6 pb-4">
          <nav className="flex flex-1 flex-col pt-6">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className={cn(
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors",
                            isActive
                              ? "bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700"
                              : "text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                          )}
                        >
                          <item.icon
                            className={cn(
                              "h-5 w-5 shrink-0",
                              isActive ? "text-purple-600" : "text-gray-400 group-hover:text-purple-600"
                            )}
                          />
                          {item.name}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </li>

              {/* Quick Links */}
              <li className="mt-auto">
                <div className="text-xs font-semibold leading-6 text-gray-400">
                  Quick Links
                </div>
                <ul role="list" className="-mx-2 mt-2 space-y-1">
                  <li>
                    <a
                      href="mailto:support@wavelaunch.studio"
                      className="text-gray-700 hover:text-purple-600 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold hover:bg-purple-50"
                    >
                      Contact Support
                    </a>
                  </li>
                  <li>
                    <a
                      href="/client/resources"
                      className="text-gray-700 hover:text-purple-600 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold hover:bg-purple-50"
                    >
                      Resources
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Mobile Sidebar - TODO: Add mobile menu functionality */}
    </>
  );
}
