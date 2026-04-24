"use client";

import { useState } from "react";
import { Trash2, UserCog, ShieldAlert, ShieldCheck } from "lucide-react";
import { deleteAccount } from "@/app/actions/accounts";

export default function AccountsClient({ initialUsers }: { initialUsers: any[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const handleDelete = async (id: number, username: string) => {
    const confirmation = prompt(`To delete user '${username}', type "DELETE" in the box below:`);
    if (confirmation !== "DELETE") {
      alert("Account deletion cancelled.");
      return;
    }

    setIsDeleting(id);
    const res = await deleteAccount(id);
    setIsDeleting(null);

    if (res?.error) {
      alert(res.error);
    } else {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Manage Accounts</h1>
        <p className="text-gray-400">View and manage Admin and Cashier accounts.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/50 border-b border-white/10 text-gray-400 text-sm">
                <th className="p-4 font-medium">Username</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium">Created At</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {users.map(user => (
                <tr key={user.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold text-base flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                      <UserCog size={16} className="text-gray-300" />
                    </div>
                    {user.username}
                  </td>
                  <td className="p-4">
                    {user.role === 'ADMIN' ? (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 inline-flex items-center gap-1.5">
                        <ShieldAlert size={14} /> Admin
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 inline-flex items-center gap-1.5">
                        <ShieldCheck size={14} /> Cashier
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => handleDelete(user.id, user.username)}
                      disabled={isDeleting === user.id}
                      className="px-3 py-1.5 text-red-400 hover:text-white hover:bg-red-500/80 rounded-lg transition-colors font-medium text-sm inline-flex items-center gap-2 disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                      {isDeleting === user.id ? "Deleting..." : "Remove"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
