import { getProducts } from "@/app/actions/pos";
import POSClient from "./POSClient";
import { getSession } from "@/lib/auth";

export default async function POSPage() {
  const session = await getSession();
  const products = await getProducts();

  return <POSClient initialProducts={products} user={session?.user} />;
}
