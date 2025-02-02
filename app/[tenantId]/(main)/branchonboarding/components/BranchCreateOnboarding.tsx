'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon, ChevronLeft } from "lucide-react"
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
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { tr } from "date-fns/locale"

const formSchema = z.object({
    Title: z.string().min(2, {
        message: "Başlık en az 2 karakter olmalıdır.",
    }),
    Description: z.string().min(10, {
        message: "Açıklama en az 10 karakter olmalıdır.",
    }),
    BranchID: z.string({
        required_error: "Lütfen bir bayi seçin.",
    }),
    Priority: z.string({
        required_error: "Lütfen bir öncelik seçin.",
    }),
    EstimatedCompletionDate: z.date({
        required_error: "Lütfen tahmini tamamlanma tarihi seçin.",
    }),
})

export default function CreateOnboarding({ filteredBranches = [] }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            Title: "",
            Description: "",
            Priority: "medium",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsLoading(true)
            // API çağrısı burada yapılacak
            console.log(values)
            router.back()
            router.refresh()
        } catch (error) {
            console.error("Onboarding oluşturulurken hata:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={() => router.back()}
                            variant="ghost"
                            className="h-8 w-8 p-0"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Yeni Onboarding Süreci
                        </h2>
                    </div>
                    <p className="text-[0.925rem] text-muted-foreground">
                        Yeni bir onboarding süreci başlatın
                    </p>
                </div>
            </div>

            <div className="grid gap-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <FormField
                                    control={form.control}
                                    name="Title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Başlık</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Onboarding başlığı"
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
                                    name="Description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Açıklama</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Onboarding süreci hakkında detaylı açıklama"
                                                    className="min-h-[100px]"
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
                                    name="BranchID"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bayi</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Bayi seçin" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {filteredBranches?.map((branch: any) => (
                                                        <SelectItem
                                                            key={branch?.BranchID || branch?.id}
                                                            value={(branch?.BranchID || branch?.id)?.toString() || ''}
                                                        >
                                                            {branch?.BranchName || branch?.name || 'İsimsiz Bayi'}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid gap-2">
                                <FormField
                                    control={form.control}
                                    name="Priority"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Öncelik</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Öncelik seçin" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="high">Yüksek</SelectItem>
                                                    <SelectItem value="medium">Orta</SelectItem>
                                                    <SelectItem value="low">Düşük</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid gap-2">
                                <FormField
                                    control={form.control}
                                    name="EstimatedCompletionDate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Tahmini Tamamlanma Tarihi</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP", { locale: tr })
                                                            ) : (
                                                                <span>Tarih seçin</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) =>
                                                            date < new Date()
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    Oluşturuluyor
                                </div>
                            ) : (
                                "Onboarding Sürecini Başlat"
                            )}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}
