import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Data Analiz",
    description: "Bayi ve aday başvuru analizleri",
}

export default function AnalyticsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
