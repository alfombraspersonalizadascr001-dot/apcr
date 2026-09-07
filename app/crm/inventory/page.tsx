'use client';

import React, { useState, useEffect } from 'react';
import SidebarLayout from '../components/SidebarLayout';
import { supabase } from '@/lib/supabase';
import { Package, Plus, Pencil, Trash2, X, Save, AlertCircle, Copy } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  base_price: number;
  cost: number;
  category: string;
  image_url: string;
  is_active: boolean;
  stock_quantity: number;
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    base_price: 0,
    cost: 0,
    category: '',
    image_url: '',
    stock_quantity: 0
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (!error && data) {
      setProducts(data);
    }
    setLoading(false);
  };

  const handleOpenModal = (product: Product | null = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        sku: product.sku || '',
        description: product.description || '',
        base_price: product.base_price,
        cost: product.cost || 0,
        category: product.category || '',
        image_url: product.image_url || '',
        stock_quantity: product.stock_quantity || 0
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        sku: '',
        description: '',
        base_price: 0,
        cost: 0,
        category: '',
        image_url: '',
        stock_quantity: 0
      });
    }
    setIsModalOpen(true);
  };

  const handleDuplicate = (product: Product) => {
    setEditingProduct(null);
    setFormData({
      name: `${product.name} (Copia)`,
      sku: product.sku ? `${product.sku}-COPIA` : '',
      description: product.description || '',
      base_price: product.base_price,
      cost: product.cost || 0,
      category: product.category || '',
      image_url: product.image_url || '',
      stock_quantity: product.stock_quantity || 0
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      // Update
      const { error } = await supabase
        .from('products')
        .update(formData)
        .eq('id', editingProduct.id);
      
      if (!error) {
        setIsModalOpen(false);
        fetchProducts();
      } else {
        alert("Error al actualizar: " + error.message);
      }
    } else {
      // Insert (New or Duplicated)
      const { error } = await supabase
        .from('products')
        .insert([formData]);
        
      if (!error) {
        setIsModalOpen(false);
        fetchProducts();
      } else {
        alert("Error al crear: " + error.message);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Está seguro que desea eliminar este producto?")) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (!error) {
        fetchProducts();
      } else {
        alert("Error al eliminar");
      }
    }
  };

  return (
    <SidebarLayout activeModule="inventory" title="Inventario" badge="NUEVO" badgeColor="indigo">
      <div className="flex flex-col gap-6">
        
        {/* Header Actions */}
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              Gestión de Productos
            </h2>
            <p className="text-slate-500 text-sm mt-1">Administre el catálogo de productos disponibles para cotizar.</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Nuevo Producto
          </button>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-bold">SKU</th>
                  <th className="p-4 font-bold">Producto</th>
                  <th className="p-4 font-bold">Categoría</th>
                  <th className="p-4 font-bold">En Stock</th>
                  <th className="p-4 font-bold">Precio Base</th>
                  <th className="p-4 font-bold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">Cargando inventario...</td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-20" />
                      No hay productos registrados. ¡Cree el primero!
                    </td>
                  </tr>
                ) : (
                  products.map(product => (
                    <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="p-4 text-sm font-mono text-slate-500">{product.sku || '---'}</td>
                      <td className="p-4">
                        <div className="font-bold text-slate-800">{product.name}</div>
                        <div className="text-xs text-slate-500 truncate max-w-xs">{product.description}</div>
                      </td>
                      <td className="p-4">
                        <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-xs font-medium">
                          {product.category || 'Sin categoría'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-md text-xs font-bold ${product.stock_quantity > 10 ? 'bg-green-100 text-green-700' : product.stock_quantity > 0 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                          {product.stock_quantity || 0} unds
                        </span>
                      </td>
                      <td className="p-4 font-bold text-slate-800">
                        ₡{product.base_price.toLocaleString('es-CR')}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button 
                            onClick={() => handleDuplicate(product)} 
                            title="Duplicar producto para editar y guardar copia"
                            className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleOpenModal(product)} 
                            title="Editar producto"
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(product.id)} 
                            title="Eliminar producto"
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">
                {editingProduct ? 'Editar Producto' : formData.name.includes('(Copia)') ? 'Duplicar Producto / Crear Copia' : 'Crear Nuevo Producto'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre del Producto *</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-800" placeholder="Ej. Alfombra Nomad Premium" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">SKU (Código)</label>
                  <input type="text" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-800" placeholder="ALF-001" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Categoría</label>
                  <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-800" placeholder="Alfombras" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Precio Base (₡) *</label>
                  <input required type="number" min="0" step="100" value={formData.base_price} onChange={e => setFormData({...formData, base_price: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-800 font-mono" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Costo Interno (₡)</label>
                  <input type="number" min="0" step="100" value={formData.cost} onChange={e => setFormData({...formData, cost: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-800 font-mono" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cantidad en Stock</label>
                  <input type="number" min="0" value={formData.stock_quantity} onChange={e => setFormData({...formData, stock_quantity: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-800 font-mono" />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Descripción</label>
                  <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-800 resize-none" placeholder="Descripción pública del producto..." />
                </div>
              </div>
              
              <div className="mt-8 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 rounded-xl text-slate-500 hover:bg-slate-100 font-medium transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md transition-colors flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Guardar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </SidebarLayout>
  );
}
