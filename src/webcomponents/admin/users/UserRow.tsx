import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BookOpen, CircleCheck, CircleMinus, Eye, GraduationCap, MoreHorizontal, ShieldCheck, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

export interface User {
  id: string
  name: string
  email: string
  avatar?: string | null
  role: "Student" | "Teacher" | "Admin"
  status: "Active" | "Inactive"
  joined: string       // yyyy-mm-dd
  lastActive: string   // time-ago string or "Never"
  relatedInfo?: {
    username?: string
    level?: number
    totalXp?: number
    subject?: string
    institution?: string
    enrolledClasses?: number
    tasksCreated?: number
  }
}

const roleConfig: Record<User["role"], { label: string; icon: React.ReactNode; className: string }> = {
  Student: {
    label: "Student",
    icon: <GraduationCap size={13} />,
    className: "bg-primary/10 text-primary border-primary/20",
  },
  Teacher: {
    label: "Teacher",
    icon: <BookOpen size={13} />,
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  Admin: {
    label: "Admin",
    icon: <ShieldCheck size={13} />,
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
}

const statusConfig: Record<User["status"], { icon: React.ReactNode; className: string }> = {
  Active:   { icon: <CircleCheck size={13} />,  className: "bg-gray-100 text-gray-600 border-gray-200" },
  Inactive: { icon: <CircleMinus size={13} />,  className: "bg-gray-50 text-gray-400 border-gray-200" },
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
}

export const UserRow = ({
  user,
  onView,
  onDelete,
}: {
  user: User
  onView: (u: User) => void
  onDelete: (u: User) => void
}) => {
  const role = roleConfig[user.role]
  const status = statusConfig[user.status]
  const router = useRouter();

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
      {/* User */}
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 shrink-0">
            {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
            <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-gray-800 truncate">{user.name}</span>
            <span className="text-xs text-gray-400 truncate">{user.email}</span>
            {/* Show additional info for teachers/students */}
            {user.relatedInfo && (
              <span className="text-xs text-gray-400 mt-0.5">
                {user.role === "Student" && user.relatedInfo.level && `Level ${user.relatedInfo.level}`}
                {user.role === "Teacher" && user.relatedInfo.subject && user.relatedInfo.subject}
              </span>
            )}
          </div>
        </div>
      </td>

      {/* Role */}
      <td className="py-3.5 px-4">
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${role.className}`}
        >
          {role.icon}
          {role.label}
        </span>
      </td>

      {/* Status */}
      <td className="py-3.5 px-4">
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${status.className}`}
        >
          {status.icon}
          {user.status}
        </span>
      </td>

      {/* Joined */}
      <td className="py-3.5 px-4">
        <span className="text-sm text-gray-600">{user.joined}</span>
      </td>

      {/* Last Active */}
      <td className="py-3.5 px-4">
        <span className="text-sm text-gray-500">{user.lastActive}</span>
      </td>

      {/* Actions */}
      <td className="py-3.5 px-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors outline-none">
            <MoreHorizontal size={16} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem
              onClick={() => router.push(`/users/${user.id}`)}
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              <Eye size={14} />
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(user)}
              className="flex items-center gap-2 text-sm text-red-500 focus:text-red-600 cursor-pointer"
            >
              <Trash2 size={14} />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  )
}