"use client"

import { Card } from "@/components/ui/card"
import { RoyaltyActivity } from "../royalty-types"
import { formatDateTime } from "@/lib/utils"
import { MessageSquare, Calendar, AlertCircle } from "lucide-react"

interface RoyaltyTimelineCardProps {
  activities: RoyaltyActivity[]
}

export function RoyaltyTimelineCard({ activities }: RoyaltyTimelineCardProps) {
  const getActivityIcon = (type: RoyaltyActivity["type"]) => {
    switch (type) {
      case "comment":
        return <MessageSquare className="h-4 w-4 text-blue-500" />
      case "payment":
        return <Calendar className="h-4 w-4 text-green-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getActivityColor = (type: RoyaltyActivity["type"]) => {
    switch (type) {
      case "comment":
        return "bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
      case "payment":
        return "bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800"
      default:
        return "bg-gray-100 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800"
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
          Aktivite Geçmişi
        </h3>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <AlertCircle className="h-8 w-8 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">
                Henüz aktivite bulunmamaktadır.
              </p>
            </div>
          ) : (
            activities.map((activity, index) => (
              <div
                key={activity.id}
                className={`relative pl-6 ${
                  index !== activities.length - 1
                    ? "pb-6 border-l-2 border-gray-200 dark:border-gray-700"
                    : ""
                }`}
              >
                <div
                  className={`absolute left-[-8px] p-2 rounded-full ${getActivityColor(
                    activity.type
                  )}`}
                >
                  {getActivityIcon(activity.type)}
                </div>
                <div className="ml-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{activity.createdByName}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDateTime(activity.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {activity.description}
                  </p>
                  {activity.type === "status_change" && activity.oldStatus && activity.newStatus && (
                    <div className="mt-2 text-xs">
                      <span className="text-muted-foreground">Durum değişikliği: </span>
                      <span className="font-medium">{activity.oldStatus}</span>
                      <span className="text-muted-foreground"> → </span>
                      <span className="font-medium">{activity.newStatus}</span>
                    </div>
                  )}
                  {activity.type === "payment" && activity.metadata?.paymentAmount && (
                    <div className="mt-2 text-xs">
                      <span className="text-muted-foreground">Ödeme tutarı: </span>
                      <span className="font-medium">
                        {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(activity.metadata.paymentAmount)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
