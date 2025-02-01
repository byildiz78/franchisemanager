"use client"

import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { FileUp, X } from "lucide-react"
import { useCallback } from "react"
import { useDropzone } from "react-dropzone"

interface FileUploadCardProps {
  files: File[]
  onFilesChange: (files: File[]) => void
  onFileRemove: (fileName: string) => void
}

export function RentalFileUploadCard({ files, onFilesChange, onFileRemove }: FileUploadCardProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesChange(acceptedFiles)
  }, [onFilesChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    }
  })

  return (
    <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 p-8 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/20 dark:to-gray-900/50 backdrop-blur-sm border-2 border-indigo-100/50 dark:border-indigo-900/20 shadow-lg shadow-indigo-100/30 dark:shadow-indigo-900/20 rounded-xl">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center shadow-inner transform group-hover:scale-110 transition-transform duration-300">
          <FileUp className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-900 dark:from-indigo-400 dark:to-indigo-200">
            Dosya Yükleme
          </h3>
          <p className="text-sm text-indigo-600/80 dark:text-indigo-400/80">
            Kiralama ile ilgili belgeleri yükleyin
          </p>
        </div>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors ${
          isDragActive
            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
            : "border-gray-300 dark:border-gray-700"
        }`}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          <FileUp className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Dosyaları buraya sürükleyin veya seçmek için tıklayın
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
            PDF, DOC, DOCX, PNG, JPG (max. 10MB)
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-4">
          <Label>Yüklenen Dosyalar</Label>
          <div className="mt-2 space-y-2">
            {files.map((file) => (
              <div
                key={file.name}
                className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <span className="text-sm truncate">{file.name}</span>
                <button
                  onClick={() => onFileRemove(file.name)}
                  className="text-gray-500 hover:text-red-500 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}
