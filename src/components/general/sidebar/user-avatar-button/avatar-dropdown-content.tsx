import { useRouter } from 'next/navigation'
import { BookUp, LogOut } from 'lucide-react'

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu/dropdown-menu'
import { signOut } from '@/app/login/actions'

type Props = {
  onClose: () => void
}

const DropdownAvatarContentMenu = ({ onClose }: Props) => {
  const router = useRouter()

  const handleSignOut = async () => {
    onClose()

    await signOut()
  }

  const handleUpgrade = () => {
    onClose()

    router.push('/dashboard/pricing')
  }

  return (
    <DropdownMenuContent className="mx-4" side="top" align="end">
      <DropdownMenuItem
        onClick={handleUpgrade}
        className="flex items-center gap-4 w-full cursor-pointer">
        <BookUp />
        <p className="text-sm font-medium">View all plans</p>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onClick={handleSignOut}
        className="flex items-center gap-4 w-full cursor-pointer">
        <LogOut />
        <p className="text-sm font-medium">Sign Out</p>
      </DropdownMenuItem>
    </DropdownMenuContent>
  )
}

export default DropdownAvatarContentMenu
