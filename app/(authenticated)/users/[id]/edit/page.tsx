/**
 * Edit User Page
 *
 * This page provides a form for editing an existing user.
 */

import { EditUserForm } from "@/modules/users/components/edit-user-form"

interface EditUserPageProps {
  params: {
    id: string
  }
}

export default function EditUserPage({ params }: EditUserPageProps) {
  return <EditUserForm userId={params.id} />
}
