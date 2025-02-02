'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { FileIcon, UploadCloud, X, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from '@/lib/utils'

interface FileUploadZoneProps {
    onFileSelect: (file: File) => void
    selectedFile: File | null
    accept?: Record<string, string[]>
    maxSize?: number
}

export function FileUploadZone({ onFileSelect, selectedFile, accept, maxSize = 100 * 1024 * 1024 }: FileUploadZoneProps) {
    const [uploadProgress, setUploadProgress] = useState(0)
    const [error, setError] = useState<string | null>(null)

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0]
        if (file.size > maxSize) {
            setError('Dosya boyutu çok büyük')
            return
        }
        setError(null)
        onFileSelect(file)
        simulateUpload()
    }, [maxSize, onFileSelect])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        maxFiles: 1
    })

    const simulateUpload = () => {
        setUploadProgress(0)
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval)
                    return 100
                }
                return prev + 10
            })
        }, 100)
    }

    const removeFile = () => {
        onFileSelect(null as any)
        setUploadProgress(0)
        setError(null)
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    return (
        <div className="space-y-4">
            <div
                {...getRootProps()}
                className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
                    isDragActive ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-300 dark:border-gray-700",
                    selectedFile && "border-green-500 dark:border-green-700 bg-green-50 dark:bg-green-900/20"
                )}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-2">
                    <UploadCloud className={cn(
                        "h-12 w-12 mb-2",
                        isDragActive ? "text-blue-500" : "text-gray-400",
                        selectedFile && "text-green-500"
                    )} />
                    {selectedFile ? (
                        <>
                            <p className="text-sm font-medium">Dosya yüklendi</p>
                            <p className="text-xs text-muted-foreground">Değiştirmek için tıklayın veya yeni bir dosya sürükleyin</p>
                        </>
                    ) : (
                        <>
                            <p className="text-sm font-medium">
                                {isDragActive ? "Dosyayı buraya bırakın" : "Dosya yüklemek için tıklayın veya sürükleyin"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Maximum dosya boyutu: {formatFileSize(maxSize)}
                            </p>
                        </>
                    )}
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 text-red-500 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                </div>
            )}

            {selectedFile && !error && (
                <Card className="p-4">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                <FileIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">{selectedFile.name}</p>
                                <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={removeFile}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Yükleme durumu</span>
                            <span>{uploadProgress}%</span>
                        </div>
                        <Progress value={uploadProgress} className="h-1" />
                    </div>
                </Card>
            )}
        </div>
    )
}
