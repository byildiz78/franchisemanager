"use client"

import Link from "next/link"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useTabStore } from "@/stores/tab-store"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Building2, FileText, Store, LayoutDashboard, Receipt } from "lucide-react"

interface NavItem {
  title: string
  icon?: any
  isActive?: boolean
  url?: string
}

interface NavMainProps {
  items?: NavItem[]
}

export function NavMain({ items }: NavMainProps) {
  const pathname = usePathname()
  const params = useParams()
  const tenantId = params?.tenantId

  const defaultRoutes = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      isActive: pathname === `/${tenantId}/dashboard`,
      url: `/${tenantId}/dashboard`,
    },
    {
      title: "Bayi Başvuru Yönetimi",
      icon: Store,
      isActive: pathname === `/${tenantId}/branchapplication`,
      url: `/${tenantId}/branchapplication`,
    },
    {
      title: "Bayi Sözleşme Yönetimi",
      icon: FileText,
      isActive: pathname === `/${tenantId}/contract`,
      url: `/${tenantId}/contract`,
    },
    {
      title: "Kiralama Yönetimi",
      icon: Building2,
      isActive: pathname === `/${tenantId}/rental`,
      url: `/${tenantId}/rental`,
    },
    {
      title: "Royalty Yönetimi",
      icon: Receipt,
      isActive: pathname === `/${tenantId}/royalty`,
      url: `/${tenantId}/royalty`,
    }
  ]

  const { addTab, setActiveTab } = useTabStore()
  const router = useRouter()

  const handleNavigation = (route: NavItem) => {
    if (route.title === "Dashboard") {
      router.push(route.url || "#")
      return
    }

    addTab({
      id: route.title,
      title: route.title,
      url: route.url,
      lazyComponent: () => {
        switch (route.title) {
          case "Bayi Başvuru Yönetimi":
            return import("@/app/[tenantId]/(main)/branchapplication/page")
          case "Bayi Sözleşme Yönetimi":
            return import("@/app/[tenantId]/(main)/contract/page")
          case "Kiralama Yönetimi":
            return import("@/app/[tenantId]/(main)/rental/page")
          case "Royalty Yönetimi":
            return import("@/app/[tenantId]/(main)/royalty/page")
          default:
            return Promise.reject(new Error("Unknown component"))
        }
      }
    })
  }

  const routes = items || defaultRoutes

  return (
    <ScrollArea className="my-4 h-[calc(100vh-8rem)]">
      <div className="flex flex-col gap-2 p-2">
        {routes.map((route) => (
          <Button
            key={route.url}
            variant={route.isActive ? "default" : "ghost"}
            className={cn(
              "w-full justify-start gap-2",
              route.isActive && "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            )}
            asChild
          >
            <div onClick={() => handleNavigation(route)}>
              {route.icon && <route.icon className="h-4 w-4" />}
              {route.title}
            </div>
          </Button>
        ))}
      </div>
    </ScrollArea>
  )
}
