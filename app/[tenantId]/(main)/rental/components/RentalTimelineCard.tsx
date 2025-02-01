"use client"

import { Card } from "@/components/ui/card"
import { RentalActivity } from "../rental-types"
import { formatDateTime } from "@/lib/utils"
import { MessageSquare, Calendar, FileUp, AlertCircle } from "lucide-react"

interface RentalTimelineCardProps {
  activities: RentalActivity[]
}

export function RentalTimelineCard({ activities }: RentalTimelineCardProps) {
  const getActivityIcon = (type: RentalActivity["type"]) => {
    switch (type) {
      case "comment":
        return <MessageSquare className="h-4 w-4 text-blue-500" />
      case "payment":
        return <Calendar className="h-4 w-4 text-green-500" />
      case "file_upload":
        return <FileUp className="h-4 w-4 text-purple-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getActivityColor = (type: RentalActivity["type"]) => {
    switch (type) {
      case "comment":
        return "bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
      case "payment":
        return "bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800"
      case "file_upload":
        return "bg-purple-100 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800"
      default:
        return "bg-gray-100 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800"
    }
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Aktivite Geçmişi</h3>
      <div className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            Henüz aktivite bulunmamaktadır.
          </p>
        ) : (
          activities.map((activity, index) => (
            <div
              key={activity.id}
              className={`relative pl-6 pb-4 ${
                index !== activities.length - 1
                  ? "border-l-2 border-gray-200 dark:border-gray-700"
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
                  <span className="font-medium">{activity.createdByName}</span>
                  <span className="text-sm text-muted-foreground">
                    {formatDateTime(activity.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {activity.description}
                </p>
                {activity.type === "status_change" && activity.oldStatus && activity.newStatus && (
                  <div className="mt-2 text-sm">
                    <span className="text-muted-foreground">Durum değişikliği: </span>
                    <span className="font-medium">{activity.oldStatus}</span>
                    <span className="text-muted-foreground"> → </span>
                    <span className="font-medium">{activity.newStatus}</span>
                  </div>
                )}
                {activity.metadata?.fileUrl && (
                  <a
                    href={activity.metadata.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <FileUp className="h-4 w-4 mr-1" />
                    Dosyayı Görüntüle
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
