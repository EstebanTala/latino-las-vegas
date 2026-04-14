"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import {
  useAllTaxonomy,
  useCreateTaxonomyItem,
  useUpdateTaxonomyItem,
  useDeleteTaxonomyItem,
  useCheckTaxonomyUsage,
  useTaxonomyUsageCounts,
  type TaxonomyItem,
} from "@/hooks/useTaxonomies";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { ArrowUp, ArrowDown, Plus, Pencil, Trash2, ArrowLeft, Archive, ExternalLink } from "lucide-react";
import Link from "next/link";

type TabKey = "zones" | "cuisines" | "venue_types" | "music_genres" | "amenities" | "attraction_types" | "show_types";

const TABS: { key: TabKey; label: string; table: "taxonomy_zones" | "taxonomy_cuisines" | "taxonomy_venue_types" | "taxonomy_music_genres" | "taxonomy_amenities" | "taxonomy_attraction_types" | "taxonomy_show_types"; listingField: string; previewParam: string; previewCat?: string }[] = [
  { key: "zones", label: "Zonas", table: "taxonomy_zones", listingField: "region", previewParam: "zona" },
  { key: "cuisines", label: "Cocinas", table: "taxonomy_cuisines", listingField: "cuisine", previewParam: "cocina", previewCat: "restaurantes" },
  { key: "venue_types", label: "Tipos de lugar", table: "taxonomy_venue_types", listingField: "venue_type", previewParam: "tipo", previewCat: "nocturna" },
  { key: "music_genres", label: "Géneros de música", table: "taxonomy_music_genres", listingField: "music_genres", previewParam: "genero", previewCat: "nocturna" },
  { key: "attraction_types", label: "Tipo de atracción", table: "taxonomy_attraction_types", listingField: "experience_type", previewParam: "tipo", previewCat: "atracciones" },
  { key: "show_types", label: "Tipo de show", table: "taxonomy_show_types", listingField: "show_experience_type", previewParam: "tipo", previewCat: "shows" },
  { key: "amenities", label: "Comodidades", table: "taxonomy_amenities", listingField: "amenities", previewParam: "comodidad", previewCat: "hoteles" },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function TaxonomyAdminPage() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<TabKey>("zones");

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-red border-t-transparent rounded-full" /></div>;
  }
  if (!user) return (() => { if (typeof window !== "undefined") window.location.replace("/login"); return null; })();
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Acceso Denegado</h1>
        <p className="text-muted-foreground">Solo administradores pueden acceder.</p>
        <Button onClick={signOut} variant="outline">Cerrar Sesión</Button>
      </div>
    );
  }

  const currentTabConfig = TABS.find(t => t.key === activeTab)!;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-display text-2xl tracking-[2px]">TAXONOMÍAS</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin">
              <Button variant="outline" size="sm">← Listings</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border bg-card">
        <div className="container flex gap-0 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3 text-[13px] font-semibold tracking-[0.5px] border-b-[3px] transition-colors whitespace-nowrap font-body ${
                activeTab === tab.key
                  ? "border-red text-red bg-red/[0.06]"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="container py-6">
        <TaxonomySection
          table={currentTabConfig.table}
          listingField={currentTabConfig.listingField}
          label={currentTabConfig.label}
          previewParam={currentTabConfig.previewParam}
          previewCat={currentTabConfig.previewCat}
        />
      </div>
    </div>
  );
}

function TaxonomySection({
  table,
  listingField,
  label,
  previewParam,
  previewCat,
}: {
  table: "taxonomy_zones" | "taxonomy_cuisines" | "taxonomy_venue_types" | "taxonomy_music_genres" | "taxonomy_amenities" | "taxonomy_attraction_types" | "taxonomy_show_types";
  listingField: string;
  label: string;
  previewParam: string;
  previewCat?: string;
}) {
  const { data: items = [], isLoading } = useAllTaxonomy(table);
  const createItem = useCreateTaxonomyItem(table);
  const updateItem = useUpdateTaxonomyItem(table);
  const deleteItem = useDeleteTaxonomyItem(table);
  const checkUsage = useCheckTaxonomyUsage();
  const { data: usageCounts = {} } = useTaxonomyUsageCounts(listingField);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TaxonomyItem | null>(null);
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");

  const sorted = [...items].sort((a, b) => {
    const countA = usageCounts[a.name] || 0;
    const countB = usageCounts[b.name] || 0;
    if (countB !== countA) return countB - countA;
    return a.name.localeCompare(b.name);
  });

  const openCreate = () => {
    setEditingItem(null);
    setFormName("");
    setFormSlug("");
    setDialogOpen(true);
  };

  const openEdit = (item: TaxonomyItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormSlug(item.slug);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formName.trim()) { toast.error("Nombre requerido"); return; }
    const slug = formSlug.trim() || slugify(formName);
    try {
      if (editingItem) {
        await updateItem.mutateAsync({ id: editingItem.id, name: formName.trim(), slug });
        toast.success("Actualizado");
      } else {
        const maxOrder = sorted.length > 0 ? Math.max(...sorted.map(i => i.sort_order)) : 0;
        await createItem.mutateAsync({ name: formName.trim(), slug, sort_order: maxOrder + 1 });
        toast.success("Creado");
      }
      setDialogOpen(false);
    } catch (e: any) {
      toast.error(e.message || "Error al guardar");
    }
  };

  const handleToggleActive = async (item: TaxonomyItem) => {
    try {
      await updateItem.mutateAsync({ id: item.id, active: !item.active });
      toast.success(item.active ? "Desactivado" : "Activado");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleDelete = async (item: TaxonomyItem) => {
    try {
      const count = await checkUsage.mutateAsync({ field: listingField, value: item.name });
      if (count > 0) {
        toast.error(`No se puede eliminar: ${count} listing(s) usan "${item.name}". Desactívalo en su lugar.`);
        return;
      }
      if (!confirm(`¿Eliminar "${item.name}"?`)) return;
      await deleteItem.mutateAsync(item.id);
      toast.success("Eliminado");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleReorder = async (item: TaxonomyItem, direction: "up" | "down") => {
    const idx = sorted.findIndex(i => i.id === item.id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const other = sorted[swapIdx];
    try {
      await Promise.all([
        updateItem.mutateAsync({ id: item.id, sort_order: other.sort_order }),
        updateItem.mutateAsync({ id: other.id, sort_order: item.sort_order }),
      ]);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  if (isLoading) return <div className="py-8 text-center text-muted-foreground">Cargando…</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-condensed text-lg font-bold tracking-[1px]">{label}</h2>
        <Button onClick={openCreate} size="sm" className="gap-1.5">
          <Plus className="w-4 h-4" /> Nuevo
        </Button>
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No hay items. Crea el primero.</div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_140px_60px_80px_100px] bg-muted/50 px-4 py-2 text-[11px] font-bold tracking-[1px] uppercase text-muted-foreground">
            <span>Nombre</span>
            <span>Slug</span>
            <span className="text-center">Usos</span>
            <span className="text-center">Activo</span>
            <span className="text-right">Acciones</span>
          </div>

          {sorted.map((item, idx) => (
            <div
              key={item.id}
              className={`grid grid-cols-[1fr_140px_60px_80px_100px] items-center px-4 py-2.5 border-t border-border text-sm ${
                !item.active ? "opacity-50" : ""
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="font-semibold">{item.name}</span>
                <a
                  href={`/explorar?${previewCat ? `cat=${previewCat}&` : ""}${previewParam}=${encodeURIComponent(item.slug)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground/40 hover:text-red transition-colors"
                  title="Ver en Explorar"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <span className="text-muted-foreground text-xs font-mono">{item.slug}</span>
              <span className={`text-center text-xs font-semibold ${(usageCounts[item.name] || 0) > 0 ? "text-foreground" : "text-muted-foreground/40"}`}>
                {usageCounts[item.name] || 0}
              </span>
              <div className="flex justify-center">
                <Switch checked={item.active} onCheckedChange={() => handleToggleActive(item)} />
              </div>
              <div className="flex items-center justify-end gap-1">
                <button onClick={() => openEdit(item)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                {(usageCounts[item.name] || 0) === 0 ? (
                  <button onClick={() => handleDelete(item)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors" title="Eliminar (sin usos)">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleToggleActive(item)}
                    className={`p-1.5 transition-colors ${item.active ? "text-muted-foreground hover:text-orange-500" : "text-orange-500 hover:text-foreground"}`}
                    title={item.active ? "Archivar" : "Restaurar"}
                  >
                    <Archive className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? "Editar" : "Nuevo"} {label.slice(0, -1)}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-sm font-medium mb-1 block">Nombre</label>
              <Input
                value={formName}
                onChange={e => {
                  setFormName(e.target.value);
                  if (!editingItem) setFormSlug(slugify(e.target.value));
                }}
                placeholder="Ej: West Las Vegas"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Slug</label>
              <Input
                value={formSlug}
                onChange={e => setFormSlug(e.target.value)}
                placeholder="west-las-vegas"
                className="font-mono text-sm"
              />
              <p className="text-[11px] text-muted-foreground mt-1">Se genera automáticamente del nombre</p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSave} disabled={createItem.isPending || updateItem.isPending}>
                {editingItem ? "Guardar" : "Crear"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
