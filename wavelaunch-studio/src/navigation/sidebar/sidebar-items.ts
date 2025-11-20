import {
  LayoutDashboard,
  FolderKanban,
  ImagePlus,
  CheckSquare,
  FileText,
  DollarSign,
  Bell,
  Users,
  BarChart3,
  type LucideIcon,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Wavelaunch",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Projects",
        url: "/dashboard/projects",
        icon: FolderKanban,
      },
      {
        title: "Analytics",
        url: "/dashboard/analytics",
        icon: BarChart3,
        isNew: true,
      },
      {
        title: "Asset Generation",
        url: "/dashboard/asset-generation",
        icon: ImagePlus,
        comingSoon: true,
      },
      {
        title: "Approvals Queue",
        url: "/dashboard/approvals",
        icon: CheckSquare,
        comingSoon: true,
      },
      {
        title: "Files",
        url: "/dashboard/files",
        icon: FileText,
        comingSoon: true,
      },
    ],
  },
  {
    id: 2,
    label: "Management",
    items: [
      {
        title: "Team",
        url: "/dashboard/team",
        icon: Users,
      },
      {
        title: "Finance",
        url: "/dashboard/finance",
        icon: DollarSign,
        comingSoon: true,
      },
      {
        title: "Notifications",
        url: "/dashboard/notifications",
        icon: Bell,
        comingSoon: true,
      },
    ],
  },
];
