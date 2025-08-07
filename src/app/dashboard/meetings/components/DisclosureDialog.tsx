import Link from 'next/link'

import Button from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Dispatch, SetStateAction } from 'react'

type Props = {
  show: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
}

const DisclosureDialog = ({ show, onOpenChange }: Props) => {
  return (
    <Dialog open={show} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Google disclosure</DialogTitle>
        </DialogHeader>
        <DialogDescription className="space-y-4 text-md">
          <p>
            Affogato Agents use and transfer of information received from Google APIs to any other
            app will adhere to{' '}
            <Link
              href="https://developers.google.com/terms/api-services-user-data-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary underline">
              Google API Services User Data Policy
            </Link>
            , including the Limited Use requirements. For more information on how we use your data,
            see{' '}
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary underline">
              Privacy Policy
            </a>
            .
          </p>
        </DialogDescription>
        <div className="flex justify-end pt-2">
          <Button variant="default" onClick={() => onOpenChange(false)}>
            Got it
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DisclosureDialog
