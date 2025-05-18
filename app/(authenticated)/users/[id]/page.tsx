/**
 * User Detail Page
 *
 * This page displays detailed information about a specific user.
 */

import { UserDetailView } from "@/modules/users/components/user-detail-view"

interface UserDetailPageProps {
  params: {
    id: string
  }
}

export default function UserDetailPage({ params }: UserDetailPageProps) {
  return <UserDetailView userId={params.id} />
}
