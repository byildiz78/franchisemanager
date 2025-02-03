"use client"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { FileUp, X } from "lucide-react"

interface ContractFileUploadCardProps {
  files: File[]
  onFilesChange: (files: File[]) => void
  onFileRemove: (fileName: string) => void
}

export function ContractFileUploadCard({
  files,
  onFilesChange,
  onFileRemove,
}: ContractFileUploadCardProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFilesChange(Array.from(e.target.files))
    }
  }

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Dökümanlar</h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="file" className="cursor-pointer">
            <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-primary transition-colors">
              <FileUp className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Dosya yüklemek için tıklayın veya sürükleyin
              </p>
            </div>
          </Label>
          <Input
            id="file"
            type="file"
            className="hidden"
            onChange={handleFileChange}
            multiple
          />
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.name}
                className="flex items-center justify-between p-2 bg-muted rounded-lg"
              >
                <span className="text-sm truncate">{file.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onFileRemove(file.name)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}
