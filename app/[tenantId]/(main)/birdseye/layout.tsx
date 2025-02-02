import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Kuşbakışı",
    description: "Mevcut bayiler ve aday başvurularının coğrafi dağılımı",
}

export default function BirdseyeLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
