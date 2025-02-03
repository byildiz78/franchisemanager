"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ContractActivity } from "../supplier-contract-types"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { MessageSquare, FileText, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ContractTimelineCardProps {
  activities: ContractActivity[]
  newActivity: {
    type: ContractActivity["type"]
    description: string
  }
  setNewActivity: (activity: { type: ContractActivity["type"]; description: string }) => void
  onAddActivity: () => void
}

export function ContractTimelineCard({
  activities,
  newActivity,
  setNewActivity,
  onAddActivity,
}: ContractTimelineCardProps) {
  const activityTypeIcons = {
    comment: MessageSquare,
    document: FileText,
    status_change: AlertCircle,
  }

  const activityTypeColors = {
    comment: "text-blue-500",
    document: "text-green-500",
    status_change: "text-orange-500",
  }

  const activityTypeLabels = {
    comment: "Yorum",
    document: "Döküman",
    status_change: "Durum Değişikliği",
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Aktiviteler</h3>
        
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Select
              value={newActivity.type}
              onValueChange={(value: ContractActivity["type"]) =>
                setNewActivity({ ...newActivity, type: value })
              }
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Aktivite tipi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="comment">Yorum</SelectItem>
                <SelectItem value="document">Döküman</SelectItem>
                <SelectItem value="status_change">Durum Değişikliği</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={onAddActivity}>Ekle</Button>
          </div>
          <Textarea
            placeholder="Aktivite açıklaması..."
            value={newActivity.description}
            onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
          />
        </div>

        <div className="space-y-4 mt-6">
          {activities.map((activity) => {
            const Icon = activityTypeIcons[activity.type]
            return (
              <div
                key={activity.id}
                className="flex gap-4 p-4 rounded-lg bg-muted/50"
              >
                <div
                  className={cn(
                    "p-2 rounded-lg bg-background",
                    activityTypeColors[activity.type]
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">
                      {activityTypeLabels[activity.type]}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(activity.createdAt), "d MMMM yyyy HH:mm", {
                        locale: tr,
                      })}
                    </div>
                  </div>
                  <p className="text-sm mt-1">{activity.description}</p>
                  <div className="text-xs text-muted-foreground mt-2">
                    {activity.createdByName} tarafından
                  </div>
                </div>
              </div>
            )
          })}

          {activities.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              Henüz aktivite bulunmamaktadır.
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
