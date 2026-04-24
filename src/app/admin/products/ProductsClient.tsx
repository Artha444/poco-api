"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { createProduct, updateProduct, deleteProduct } from "@/app/actions/products";

type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  imageUrl: string | null;
};

export default function ProductsClient({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    imageUrl: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ name: "", description: "", price: 0, stock: 0, imageUrl: "" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl || ""
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const res = await deleteProduct(id);
    if (res?.error) {
      alert(res.error);
    } else {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (editingId) {
        await updateProduct(editingId, formData);
        setProducts(products.map(p => p.id === editingId ? { ...p, ...formData } : p));
      } else {
        await createProduct(formData);
        // Quick local update to avoid waiting for refresh, or we can just let Next.js refresh it.
        // Actually, since revalidatePath is called, the parent component will re-fetch.
        // Let's just force a reload for simplicity in this client component, or update local state.
        window.location.reload(); 
      }
      setIsModalOpen(false);
    } catch (error) {
      alert("Failed to save product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Products Catalog</h1>
          <p className="text-gray-400">Manage your POCO products inventory.</p>
        </div>
        <button onClick={handleOpenAdd} className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition-colors">
          <Plus size={20} />
          Add Product
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/50 border-b border-white/10 text-gray-400 text-sm">
                <th className="p-4 font-medium">Product</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Stock</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {products.map(product => (
                <tr key={product.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-black/50 border border-white/10 overflow-hidden flex-shrink-0">
                        {product.imageUrl && (
                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-base">{product.name}</p>
                        <p className="text-gray-500 text-xs truncate max-w-[200px]">{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-medium">Rp {product.price.toLocaleString('id-ID')}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${product.stock > 10 ? 'bg-green-500/10 text-green-400 border border-green-500/20' : product.stock > 0 ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                      {product.stock} units
                    </span>
                  </td>
                  <td className="p-4">
                    {product.stock > 0 ? (
                      <span className="text-green-400 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> In Stock</span>
                    ) : (
                      <span className="text-red-400 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> Out of Stock</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleOpenEdit(product)} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#11151c] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-xl font-bold">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Product Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-yellow-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                <textarea 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-yellow-500"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Price (Rp)</label>
                  <input 
                    required
                    type="number" 
                    min="0"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Stock</label>
                  <input 
                    required
                    type="number" 
                    min="0"
                    value={formData.stock}
                    onChange={e => setFormData({...formData, stock: Number(e.target.value)})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-yellow-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Image URL</label>
                <input 
                  type="url" 
                  value={formData.imageUrl}
                  onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-yellow-500"
                  placeholder="https://..."
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-medium transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition-colors disabled:opacity-50">
                  {isSubmitting ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
