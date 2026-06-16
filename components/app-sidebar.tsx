"use client"

import * as React from "react"
import {
  AudioWaveform,
  Blocks,
  Calendar,
  Camera,
  ChartBar,
  ChefHat,
  CircleCheck,
  Clapperboard,
  Command,
  Dumbbell,
  Home,
  House,
  Inbox,
  Languages,
  Map,
  MessageCircleQuestion,
  Music,
  NotebookPen,
  Palette,
  Search,
  Settings2,
  Sparkles,
  Sprout,
  Target,
  Trash2,
  WalletCards,
  Wrench,
  BookOpen,
  Brain,
  Briefcase,
  FileText,
  Globe,
  Handshake,
  Image,
} from "lucide-react"

import { NavFavorites } from "@/components/nav-favorites"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavWorkspaces } from "@/components/nav-workspaces"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  teams: [
    {
      name: "Alibaba Inc",
      logo: Command,
      plan: "Enterprise",
    },
    {
      name: "Alibaba Cloud",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Alibaba Design",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Search",
      url: "#",
      icon: Search,
    },
    {
      title: "Ask AI",
      url: "#",
      icon: Sparkles,
    },
    {
      title: "Home",
      url: "#",
      icon: Home,
      isActive: true,
    },
    {
      title: "Inbox",
      url: "#",
      icon: Inbox,
      badge: "10",
    },
  ],
  navSecondary: [
    {
      title: "Calendar",
      url: "#",
      icon: Calendar,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
    },
    {
      title: "Templates",
      url: "#",
      icon: Blocks,
    },
    {
      title: "Trash",
      url: "#",
      icon: Trash2,
    },
    {
      title: "Help",
      url: "#",
      icon: MessageCircleQuestion,
    },
  ],
  favorites: [
    {
      name: "Project Management & Task Tracking",
      url: "#",
      icon: ChartBar,
    },
    {
      name: "Family Recipe Collection & Meal Planning",
      url: "#",
      icon: ChefHat,
    },
    {
      name: "Fitness Tracker & Workout Routines",
      url: "#",
      icon: Dumbbell,
    },
    {
      name: "Book Notes & Reading List",
      url: "#",
      icon: BookOpen,
    },
    {
      name: "Sustainable Gardening Tips & Plant Care",
      url: "#",
      icon: Sprout,
    },
    {
      name: "Language Learning Progress & Resources",
      url: "#",
      icon: Languages,
    },
    {
      name: "Home Renovation Ideas & Budget Tracker",
      url: "#",
      icon: House,
    },
    {
      name: "Personal Finance & Investment Portfolio",
      url: "#",
      icon: WalletCards,
    },
    {
      name: "Movie & TV Show Watchlist with Reviews",
      url: "#",
      icon: Clapperboard,
    },
    {
      name: "Daily Habit Tracker & Goal Setting",
      url: "#",
      icon: CircleCheck,
    },
  ],
  workspaces: [
    {
      name: "Personal Life Management",
      icon: House,
      pages: [
        {
          name: "Daily Journal & Reflection",
          url: "#",
          icon: NotebookPen,
        },
        {
          name: "Health & Wellness Tracker",
          url: "#",
          icon: CircleCheck,
        },
        {
          name: "Personal Growth & Learning Goals",
          url: "#",
          icon: Sparkles,
        },
      ],
    },
    {
      name: "Professional Development",
      icon: Briefcase,
      pages: [
        {
          name: "Career Objectives & Milestones",
          url: "#",
          icon: Target,
        },
        {
          name: "Skill Acquisition & Training Log",
          url: "#",
          icon: Brain,
        },
        {
          name: "Networking Contacts & Events",
          url: "#",
          icon: Handshake,
        },
      ],
    },
    {
      name: "Creative Projects",
      icon: Palette,
      pages: [
        {
          name: "Writing Ideas & Story Outlines",
          url: "#",
          icon: FileText,
        },
        {
          name: "Art & Design Portfolio",
          url: "#",
          icon: Image,
        },
        {
          name: "Music Composition & Practice Log",
          url: "#",
          icon: Music,
        },
      ],
    },
    {
      name: "Home Management",
      icon: Home,
      pages: [
        {
          name: "Household Budget & Expense Tracking",
          url: "#",
          icon: WalletCards,
        },
        {
          name: "Home Maintenance Schedule & Tasks",
          url: "#",
          icon: Wrench,
        },
        {
          name: "Family Calendar & Event Planning",
          url: "#",
          icon: Calendar,
        },
      ],
    },
    {
      name: "Travel & Adventure",
      icon: Map,
      pages: [
        {
          name: "Trip Planning & Itineraries",
          url: "#",
          icon: Map,
        },
        {
          name: "Travel Bucket List & Inspiration",
          url: "#",
          icon: Globe,
        },
        {
          name: "Travel Journal & Photo Gallery",
          url: "#",
          icon: Camera,
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent>
        <NavFavorites favorites={data.favorites} />
        <NavWorkspaces workspaces={data.workspaces} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
