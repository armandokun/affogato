import React from 'react'
import { Globe } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent
} from '@/components/ui/dropdown-menu/dropdown-menu'
import Button from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'

type SearchSource = {
  id: string
  name: string
  description: string
  enabled: boolean
}

type Props = {
  sources: SearchSource[]
  onSourceToggle: (sourceId: string, enabled: boolean) => void
}

const SearchSourceDropdown = ({ sources, onSourceToggle }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-muted-foreground"
          type="button"
          tabIndex={-1}>
          <Globe className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        align="end"
        className="w-64 md:w-72"
        sideOffset={10}
        avoidCollisions={false}>
        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Search Sources
        </div>
        {sources.map((source) => (
          <div key={source.id} className="flex items-center justify-between gap-3 mb-1 px-2 py-1.5">
            <div className="flex items-center gap-3">
              <Globe className="size-4 shrink-0" />
              <div>
                <div className="font-medium text-sm">{source.name}</div>
                <div className="text-xs text-muted-foreground">{source.description}</div>
              </div>
            </div>
            <Switch
              checked={source.enabled}
              onCheckedChange={(checked) => onSourceToggle(source.id, checked)}
              disabled={true}
            />
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default SearchSourceDropdown
