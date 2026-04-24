import prisma from "@/lib/prisma";
import AccountsClient from "./AccountsClient";

export default async function AccountsPage() {
  const users = await prisma.user.findMany({
    select: { id: true, username: true, role: true, createdAt: true },
    orderBy: { createdAt: 'desc' }
  });

  return <AccountsClient initialUsers={users} />;
}
