'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Timer, Upload, Sparkles } from "lucide-react"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown } from "lucide-react"
import { departmentOptions, typeOptions } from "../training-types"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUploadZone } from "./FileUploadZone"
import { TagInput } from "./TagInput"
import { Switch } from "@/components/ui/switch"

const formSchema = z.object({
    title: z.string().min(2, {
        message: "Başlık en az 2 karakter olmalıdır.",
    }),
    description: z.string().min(10, {
        message: "Açıklama en az 10 karakter olmalıdır.",
    }),
    type: z.string({
        required_error: "Lütfen bir eğitim tipi seçin.",
    }),
    department: z.string({
        required_error: "Lütfen bir departman seçin.",
    }),
    requiredFor: z.array(z.string()).min(1, {
        message: "En az bir departman seçmelisiniz.",
    }),
    duration: z.number().min(1, {
        message: "Süre en az 1 dakika olmalıdır.",
    }),
    tags: z.array(z.string()),
    isRequired: z.boolean().default(false),
    hasQuiz: z.boolean().default(false),
    minimumCompletionTime: z.number().min(0).optional(),
})

interface CreateTrainingProps {
    onClose: () => void;
}

export default function CreateTraining({ onClose }: CreateTrainingProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [openDepartments, setOpenDepartments] = useState(false)
    const [selectedDepartments, setSelectedDepartments] = useState<string[]>([])
    const [activeTab, setActiveTab] = useState("details")

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            duration: 0,
            tags: [],
            requiredFor: [],
            isRequired: false,
            hasQuiz: false,
            minimumCompletionTime: 0,
        },
    })

    const { watch } = form
    const hasQuiz = watch("hasQuiz")

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsLoading(true)

            if (!selectedFile) {
                throw new Error("Lütfen bir dosya yükleyin")
            }

            // Dosya yükleme
            const formData = new FormData()
            formData.append('file', selectedFile)
            const uploadResponse = await fetch('/api/upload/training', {
                method: 'POST',
                body: formData
            })

            if (!uploadResponse.ok) {
                throw new Error('Dosya yükleme hatası')
            }

            const { url } = await uploadResponse.json()

            const trainingData = {
                ...values,
                contentUrl: url,
                status: "draft",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                viewCount: 0,
                completionCount: 0,
            }

            // API çağrısı burada yapılacak
            console.log(trainingData)

            onClose()
            router.refresh()
        } catch (error) {
            console.error("Eğitim oluşturulurken hata:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const acceptedFileTypes = {
        'video/*': ['.mp4', '.webm', '.ogg'],
        'application/pdf': ['.pdf'],
        'application/vnd.ms-powerpoint': ['.ppt'],
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
        'application/msword': ['.doc'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    }

    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={onClose}
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-white/50 dark:hover:bg-gray-800/50"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                            Yeni Eğitim Ekle
                        </h2>
                    </div>
                    <p className="text-[0.925rem] text-muted-foreground">
                        Yeni bir eğitim materyali ekleyin ve ayarlarını yapılandırın
                    </p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px] p-1 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border rounded-xl">
                    <TabsTrigger 
                        value="details" 
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
                    >
                        Eğitim Detayları
                    </TabsTrigger>
                    <TabsTrigger 
                        value="content"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
                    >
                        İçerik & Ayarlar
                    </TabsTrigger>
                </TabsList>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <TabsContent value="details" className="space-y-6">
                            <Card className="border-0 shadow-lg bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                                <div className="p-6">
                                    <div className="grid gap-6">
                                        <div className="grid gap-2">
                                            <FormField
                                                control={form.control}
                                                name="title"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-base font-semibold">Başlık</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Eğitim başlığı"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <FormField
                                                control={form.control}
                                                name="description"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-base font-semibold">Açıklama</FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                placeholder="Eğitim içeriği hakkında detaylı açıklama"
                                                                className="min-h-[100px]"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-2">
                                            <FormField
                                                control={form.control}
                                                name="type"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-base font-semibold">Eğitim Tipi</FormLabel>
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            defaultValue={field.value}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger className="bg-white/80 dark:bg-gray-800/80 border-2 border-gray-100 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl transition-all duration-200">
                                                                    <SelectValue placeholder="Eğitim tipi seçin" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {typeOptions.filter(t => t.value !== 'all').map((option) => (
                                                                    <SelectItem key={option.value} value={option.value}>
                                                                        {option.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="department"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-base font-semibold">Ana Departman</FormLabel>
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            defaultValue={field.value}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger className="bg-white/80 dark:bg-gray-800/80 border-2 border-gray-100 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl transition-all duration-200">
                                                                    <SelectValue placeholder="Departman seçin" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {departmentOptions.filter(d => d.value !== 'all').map((option) => (
                                                                    <SelectItem key={option.value} value={option.value}>
                                                                        {option.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="requiredFor"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-base font-semibold">Hedef Departmanlar</FormLabel>
                                                    <Popover open={openDepartments} onOpenChange={setOpenDepartments}>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button
                                                                    variant="outline"
                                                                    role="combobox"
                                                                    aria-expanded={openDepartments}
                                                                    className="w-full justify-between bg-white/80 dark:bg-gray-800/80 border-2 border-gray-100 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl transition-all duration-200"
                                                                >
                                                                    {field.value.length > 0
                                                                        ? `${field.value.length} departman seçildi`
                                                                        : "Departman seçin"}
                                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-full p-0">
                                                            <Command className="rounded-lg border border-gray-100 dark:border-gray-800">
                                                                <CommandInput placeholder="Departman ara..." className="h-9" />
                                                                <CommandEmpty>Departman bulunamadı.</CommandEmpty>
                                                                <CommandGroup className="max-h-[200px] overflow-auto">
                                                                    {departmentOptions.filter(d => d.value !== 'all').map((department) => (
                                                                        <CommandItem
                                                                            key={department.value}
                                                                            value={department.value}
                                                                            onSelect={() => {
                                                                                const newValue = field.value.includes(department.value)
                                                                                    ? field.value.filter((x) => x !== department.value)
                                                                                    : [...field.value, department.value]
                                                                                field.onChange(newValue)
                                                                                setOpenDepartments(false)
                                                                            }}
                                                                            className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                                        >
                                                                            <div className="flex items-center gap-2">
                                                                                <div className={cn(
                                                                                    "h-4 w-4 rounded-sm border border-blue-500 flex items-center justify-center",
                                                                                    field.value.includes(department.value) && "bg-blue-500"
                                                                                )}>
                                                                                    <Check className={cn(
                                                                                        "h-3 w-3 text-white",
                                                                                        !field.value.includes(department.value) && "opacity-0"
                                                                                    )} />
                                                                                </div>
                                                                                {department.label}
                                                                            </div>
                                                                        </CommandItem>
                                                                    ))}
                                                                </CommandGroup>
                                                            </Command>
                                                        </PopoverContent>
                                                    </Popover>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="grid gap-4 md:grid-cols-2">
                                            <FormField
                                                control={form.control}
                                                name="duration"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-base font-semibold">Süre (Dakika)</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Timer className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                                                <Input
                                                                    type="number"
                                                                    placeholder="Eğitim süresi"
                                                                    className="pl-10"
                                                                    {...field}
                                                                    onChange={e => field.onChange(parseInt(e.target.value))}
                                                                />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="minimumCompletionTime"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-base font-semibold">Minimum Tamamlama Süresi (Dakika)</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Timer className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                                                <Input
                                                                    type="number"
                                                                    placeholder="Minimum süre"
                                                                    className="pl-10"
                                                                    {...field}
                                                                    onChange={e => field.onChange(parseInt(e.target.value))}
                                                                />
                                                            </div>
                                                        </FormControl>
                                                        <FormDescription>
                                                            Eğitimin sayılması için gerekli minimum süre
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="tags"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-base font-semibold">Etiketler</FormLabel>
                                                    <FormControl>
                                                        <TagInput
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            placeholder="Etiket ekle..."
                                                            maxTags={5}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </Card>
                        </TabsContent>

                        <TabsContent value="content" className="space-y-6">
                            <Card className="border-0 shadow-lg bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                                <div className="p-6">
                                    <div className="grid gap-6">
                                        <div className="space-y-4">
                                            <FormLabel className="text-base font-semibold">Eğitim İçeriği</FormLabel>
                                            <FileUploadZone
                                                onFileSelect={setSelectedFile}
                                                selectedFile={selectedFile}
                                                accept={acceptedFileTypes}
                                                maxSize={100 * 1024 * 1024} // 100MB
                                            />
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="text-lg font-medium">Gelişmiş Ayarlar</h3>
                                            <div className="space-y-4">
                                                <FormField
                                                    control={form.control}
                                                    name="isRequired"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-row items-center justify-between rounded-xl border-2 border-gray-100 dark:border-gray-700 p-4 space-y-0 bg-white/80 dark:bg-gray-800/80">
                                                            <div className="space-y-0.5">
                                                                <FormLabel className="text-base font-semibold">
                                                                    Zorunlu Eğitim
                                                                </FormLabel>
                                                                <FormDescription>
                                                                    Bu eğitimi tüm hedef departmanlar için zorunlu yap
                                                                </FormDescription>
                                                            </div>
                                                            <FormControl>
                                                                <Switch
                                                                    checked={field.value}
                                                                    onCheckedChange={field.onChange}
                                                                    className="data-[state=checked]:bg-blue-500"
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="hasQuiz"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-row items-center justify-between rounded-xl border-2 border-gray-100 dark:border-gray-700 p-4 space-y-0 bg-white/80 dark:bg-gray-800/80">
                                                            <div className="space-y-0.5">
                                                                <FormLabel className="text-base font-semibold">
                                                                    Quiz Ekle
                                                                </FormLabel>
                                                                <FormDescription>
                                                                    Eğitim sonunda quiz uygula
                                                                </FormDescription>
                                                            </div>
                                                            <FormControl>
                                                                <Switch
                                                                    checked={field.value}
                                                                    onCheckedChange={field.onChange}
                                                                    className="data-[state=checked]:bg-blue-500"
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />

                                                {hasQuiz && (
                                                    <div className="pl-4 border-l-2 border-blue-200 dark:border-blue-800">
                                                        <p className="text-sm text-muted-foreground mb-4">
                                                            Quiz ayarları eğitimi oluşturduktan sonra düzenlenebilir.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </TabsContent>

                        <div className="flex justify-end gap-4 sticky bottom-0 p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-100 dark:border-gray-800">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="bg-white dark:bg-gray-800"
                            >
                                İptal
                            </Button>
                            <Button
                                type="submit"
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/20 dark:shadow-blue-900/30 transition-all duration-200 hover:scale-[1.02]"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                        Oluşturuluyor
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="h-4 w-4" />
                                        Eğitimi Oluştur
                                    </div>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </Tabs>
        </div>
    )
}
