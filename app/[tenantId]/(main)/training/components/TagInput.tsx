'use client'

import { useState, KeyboardEvent } from 'react'
import { X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface TagInputProps {
    value: string[]
    onChange: (tags: string[]) => void
    placeholder?: string
    maxTags?: number
}

export function TagInput({ value, onChange, placeholder = 'Etiket ekle...', maxTags = 10 }: TagInputProps) {
    const [inputValue, setInputValue] = useState('')

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            addTag()
        } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
            removeTag(value.length - 1)
        }
    }

    const addTag = () => {
        const tag = inputValue.trim().toLowerCase()
        if (tag && !value.includes(tag) && value.length < maxTags) {
            onChange([...value, tag])
            setInputValue('')
        }
    }

    const removeTag = (index: number) => {
        onChange(value.filter((_, i) => i !== index))
    }

    return (
        <div className="w-full space-y-2">
            <div className="flex flex-wrap gap-2">
                {value.map((tag, index) => (
                    <Badge
                        key={index}
                        variant="secondary"
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(index)}
                            className="ml-2 hover:text-red-500 focus:outline-none"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </Badge>
                ))}
            </div>
            <Input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={addTag}
                placeholder={value.length < maxTags ? placeholder : `Maximum ${maxTags} etiket eklenebilir`}
                disabled={value.length >= maxTags}
                className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
                Enter veya virgül ile etiket ekleyebilirsiniz. Maximum {maxTags} etiket eklenebilir.
            </p>
        </div>
    )
}
