// app/role-manager/users/page.tsx (or pages/role-manager/users.tsx)

import RoleManagerLayout from "../_components/RoleManagerLayout";


export default function UsersPage() {
  return (
    <RoleManagerLayout>
      <div>
        <h1 className="text-2xl font-bold mb-4">Users</h1>
        <p>Users management content goes here.</p>
      </div>
    </RoleManagerLayout>
  );
}
