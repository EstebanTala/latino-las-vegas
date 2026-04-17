"use client";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import Link from "next/link";
import { supabase } from "@/integrations/supabase/client";

import { useAuth } from "@/hooks/useAuth";
import { useListings, useCreateListing, useUpdateListing, useDeleteListing } from "@/hooks/useListings";
import { useZones } from "@/hooks/useTaxonomies";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import type { Listing } from "@/data/listings";
import ListingFormDialog from "@/components/admin/ListingFormDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ChevronUp, ChevronDown, ChevronsUpDown, Trash2, Tags, MapPin, Star, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

type SortCol = "name" | "cat" | "region" | "resort" | "stars";
type SortDir = "asc" | "desc";

export default function AdminPage() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const { data: listings = [], isLoading } = useListings();
  const { data: zones = [] } = useZones();
  const createListing = useCreateListing();
  const updateListing = useUpdateListing();
  const deleteListing = useDeleteListing();
  const queryClient = useQueryClient();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [sortCol, setSortCol] = useState<SortCol | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState<string | null>(null);
  const [bulkValue, setBulkValue] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [bulkPending, setBulkPending] = useState(false);

  const CAT_OPTIONS = [
    { value: "all", label: "All" },
    { value: "restaurantes", label: "Restaurantes" },
    { value: "hoteles", label: "Hoteles & Casinos" },
    { value: "shows", label: "Shows & Eventos" },
    { value: "nocturna", label: "Vida Nocturna" },
    { value: "atracciones", label: "Atracciones" },
  ];

  const BULK_CAT_OPTIONS = [
    { value: "restaurantes", label: "Restaurantes", catLabel: "Restaurantes" },
    { value: "hoteles", label: "Hoteles & Casinos", catLabel: "Hoteles & Casinos" },
    { value: "shows", label: "Shows & Eventos", catLabel: "Shows & Eventos" },
    { value: "nocturna", label: "Vida Nocturna", catLabel: "Vida Nocturna" },
    { value: "atracciones", label: "Atracciones", catLabel: "Atracciones" },
  ];

  const TIER_OPTIONS = [
    { value: "normal", label: "Básico" },
    { value: "featured", label: "Destacado" },
    { value: "sponsored", label: "Seleccionado" },
  ];

  const showResortCol = catFilter !== "hoteles";

  const resortNameMap = useMemo(() => {
    const map = new Map<string, string>();
    listings.forEach(l => map.set(String(l.id), l.name));
    return map;
  }, [listings]);

  const getResortName = (l: Listing) =>
    l.locatedInListingId ? resortNameMap.get(l.locatedInListingId) || "" : "";

  const filtered = useMemo(() => {
    let result = [...listings];
    if (catFilter !== "all") result = result.filter(l => l.cat === catFilter);
    if (zoneFilter !== "all") result = result.filter(l => l.region === zoneFilter);
    if (search) result = result.filter(l => l.name.toLowerCase().includes(search.toLowerCase()));

    if (sortCol) {
      const dir = sortDir === "asc" ? 1 : -1;
      result.sort((a, b) => {
        switch (sortCol) {
          case "name": return dir * a.name.localeCompare(b.name);
          case "cat": return dir * (a.catLabel || "").localeCompare(b.catLabel || "");
          case "region": {
            const ar = a.region || ""; const br = b.region || "";
            if (!ar && br) return 1; if (ar && !br) return -1;
            return dir * ar.localeCompare(br);
          }
          case "resort": {
            const ar = getResortName(a); const br = getResortName(b);
            if (!ar && br) return 1; if (ar && !br) return -1;
            return dir * ar.localeCompare(br);
          }
          case "stars": {
              const rA = Number(a.googleRating) || 0;
              const rB = Number(b.googleRating) || 0;
              if (rA !== rB) return dir * (rA - rB);
              return dir * ((a.googleUserRatingsTotal ?? 0) - (b.googleUserRatingsTotal ?? 0));
            }
          default: return 0;
        }
      });
    }

    return result;
  }, [listings, search, catFilter, zoneFilter, sortCol, sortDir, resortNameMap]);

  const filteredIds = useMemo(() => new Set(filtered.map(l => String(l.id))), [filtered]);
  const visibleSelected = useMemo(() => {
    const s = new Set<string>();
    selectedIds.forEach(id => { if (filteredIds.has(id)) s.add(id); });
    return s;
  }, [selectedIds, filteredIds]);
  const allVisibleSelected = filtered.length > 0 && visibleSelected.size === filtered.length;
  const someVisibleSelected = visibleSelected.size > 0 && !allVisibleSelected;

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><p>Loading...</p></div>;
  if (!user) return (() => { if (typeof window !== "undefined") window.location.replace("/login"); return null; })();
  if (!isAdmin) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground">You don't have admin privileges.</p>
        <Button variant="outline" onClick={signOut}>Sign Out</Button>
      </div>
    </div>
  );

  const toggleSort = (col: SortCol) => {
    if (sortCol === col) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ col }: { col: SortCol }) => {
    if (sortCol !== col) return <ChevronsUpDown className="w-3.5 h-3.5 opacity-40" />;
    return sortDir === "asc" ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />;
  };

  const toggleSelectAll = () => {
    if (allVisibleSelected) {
      const next = new Set(selectedIds);
      filtered.forEach(l => next.delete(String(l.id)));
      setSelectedIds(next);
    } else {
      const next = new Set(selectedIds);
      filtered.forEach(l => next.add(String(l.id)));
      setSelectedIds(next);
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedIds(next);
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
    setBulkAction(null);
    setBulkValue("");
  };

  const executeBulkUpdate = async (updates: Record<string, any>) => {
    setBulkPending(true);
    try {
      const ids = Array.from(visibleSelected);
      const { error } = await supabase.from("listings").update(updates as any).in("id", ids);
      if (error) throw error;
      await queryClient.invalidateQueries({ queryKey: ["listings"] });
      toast.success(`${ids.length} listing${ids.length === 1 ? "" : "s"} updated`);
      clearSelection();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setBulkPending(false);
    }
  };

  const executeBulkDelete = async () => {
    setBulkPending(true);
    try {
      const ids = Array.from(visibleSelected);
      const { error } = await supabase.from("listings").delete().in("id", ids);
      if (error) throw error;
      await queryClient.invalidateQueries({ queryKey: ["listings"] });
      toast.success(`${ids.length} listing${ids.length === 1 ? "" : "s"} deleted`);
      clearSelection();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setBulkPending(false);
      setDeleteConfirmOpen(false);
    }
  };

  const handleBulkApply = () => {
    if (!bulkAction || visibleSelected.size === 0) return;

    if (bulkAction === "delete") {
      setDeleteConfirmOpen(true);
      return;
    }

    if (bulkAction === "category" && bulkValue) {
      const catOption = BULK_CAT_OPTIONS.find(o => o.value === bulkValue);
      if (catOption) executeBulkUpdate({ cat: catOption.value, cat_label: catOption.catLabel });
      return;
    }

    if (bulkAction === "region" && bulkValue) {
      executeBulkUpdate({ region: bulkValue });
      return;
    }

    if (bulkAction === "tier" && bulkValue) {
      const updates: Record<string, any> = {
        is_featured: bulkValue === "featured",
        is_sponsored: bulkValue === "sponsored",
      };
      executeBulkUpdate(updates);
      return;
    }
  };

  const openCreate = () => {
    setEditingListing(null);
    setDialogOpen(true);
  };

  const openEdit = (l: Listing) => {
    setEditingListing(l);
    setDialogOpen(true);
  };

  const handleDelete = async (l: Listing) => {
    if (!confirm(`Delete "${l.name}"?`)) return;
    try {
      await deleteListing.mutateAsync(String(l.id));
      toast.success("Listing deleted");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleFormSubmit = async (payload: Record<string, any>, editingId: string | null) => {
    try {
      if (editingId) {
        await updateListing.mutateAsync({ id: editingId, ...payload });
        toast.success("Listing updated");
      } else {
        await createListing.mutateAsync(payload);
        toast.success("Listing created");
      }
      setDialogOpen(false);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold font-condensed">Admin Dashboard</h1>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/taxonomias"><Button variant="outline" size="sm">Taxonomías</Button></Link>
          <Button variant="outline" size="sm" onClick={() => window.location.href = "/"}>View Site</Button>
          <Button variant="ghost" size="sm" onClick={signOut}>Sign Out</Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search listings..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="max-w-xs"
            />
            <Select value={catFilter} onValueChange={setCatFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                {CAT_OPTIONS.map(o => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={zoneFilter} onValueChange={setZoneFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Zona" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Zones</SelectItem>
                {zones.map(z => (
                  <SelectItem key={z.id} value={z.name}>{z.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={openCreate}>+ New Listing</Button>
        </div>

        {/* Bulk Actions Bar */}
        {visibleSelected.size > 0 && (
          <div className="flex items-center gap-3 flex-wrap bg-muted/60 border border-border rounded-lg px-4 py-3">
            <span className="text-sm font-medium">
              {visibleSelected.size} listing{visibleSelected.size === 1 ? "" : "s"} selected
            </span>
            <div className="h-4 w-px bg-border" />

            <Select value={bulkAction || ""} onValueChange={(v) => { setBulkAction(v); setBulkValue(""); }}>
              <SelectTrigger className="w-[180px] h-8 text-xs">
                <SelectValue placeholder="Bulk action..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="category"><span className="flex items-center gap-1.5"><Tags className="w-3.5 h-3.5" /> Change Category</span></SelectItem>
                <SelectItem value="region"><span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Change Region</span></SelectItem>
                <SelectItem value="tier"><span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5" /> Change Tier</span></SelectItem>
                <SelectItem value="delete"><span className="flex items-center gap-1.5 text-destructive"><Trash2 className="w-3.5 h-3.5" /> Delete Selected</span></SelectItem>
              </SelectContent>
            </Select>

            {bulkAction === "category" && (
              <Select value={bulkValue} onValueChange={setBulkValue}>
                <SelectTrigger className="w-[180px] h-8 text-xs">
                  <SelectValue placeholder="Select category..." />
                </SelectTrigger>
                <SelectContent>
                  {BULK_CAT_OPTIONS.map(o => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {bulkAction === "region" && (
              <Select value={bulkValue} onValueChange={setBulkValue}>
                <SelectTrigger className="w-[180px] h-8 text-xs">
                  <SelectValue placeholder="Select region..." />
                </SelectTrigger>
                <SelectContent>
                  {zones.map(z => (
                    <SelectItem key={z.slug} value={z.name}>{z.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {bulkAction === "tier" && (
              <Select value={bulkValue} onValueChange={setBulkValue}>
                <SelectTrigger className="w-[180px] h-8 text-xs">
                  <SelectValue placeholder="Select tier..." />
                </SelectTrigger>
                <SelectContent>
                  {TIER_OPTIONS.map(o => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {bulkAction && (
              <Button
                size="sm"
                variant={bulkAction === "delete" ? "destructive" : "default"}
                onClick={handleBulkApply}
                disabled={bulkPending || (bulkAction !== "delete" && !bulkValue)}
                className="h-8 text-xs"
              >
                {bulkPending ? "Applying..." : bulkAction === "delete" ? "Delete" : "Apply"}
              </Button>
            )}

            <Button variant="ghost" size="sm" onClick={clearSelection} className="h-8 ml-auto">
              <X className="w-3.5 h-3.5 mr-1" /> Clear
            </Button>
          </div>
        )}

        {isLoading ? (
          <p className="text-muted-foreground">Loading listings...</p>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="p-3 w-10">
                    <Checkbox
                      checked={allVisibleSelected ? true : someVisibleSelected ? "indeterminate" : false}
                      onCheckedChange={toggleSelectAll}
                      aria-label="Select all"
                    />
                  </th>
                  <th className="text-left p-3 font-medium">
                    <button onClick={() => toggleSort("name")} className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
                      Name <SortIcon col="name" />
                    </button>
                  </th>
                  <th className="text-left p-3 font-medium hidden md:table-cell">
                    <button onClick={() => toggleSort("cat")} className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
                      Category <SortIcon col="cat" />
                    </button>
                  </th>
                  <th className="text-left p-3 font-medium hidden md:table-cell">
                    <button onClick={() => toggleSort("region")} className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
                      Region <SortIcon col="region" />
                    </button>
                  </th>
                  {showResortCol && (
                    <th className="text-left p-3 font-medium hidden lg:table-cell">
                      <button onClick={() => toggleSort("resort")} className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
                        Resort <SortIcon col="resort" />
                      </button>
                    </th>
                  )}
                  <th className="text-left p-3 font-medium hidden sm:table-cell">
                    <button onClick={() => toggleSort("stars")} className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
                      Reviews <SortIcon col="stars" />
                    </button>
                  </th>
                  <th className="text-right p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(l => {
                  const id = String(l.id);
                  return (
                    <tr key={id} className={`border-t border-border hover:bg-muted/30 ${selectedIds.has(id) ? "bg-primary/5" : ""}`}>
                      <td className="p-3">
                        <Checkbox
                          checked={selectedIds.has(id)}
                          onCheckedChange={() => toggleSelect(id)}
                          aria-label={`Select ${l.name}`}
                        />
                      </td>
                      <td className="p-3 font-medium">
                        <a href={`/lugar/${l.slug}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-2">
                          {l.logoUrl ? (
                            <img src={l.logoUrl} alt="" className="w-6 h-6 rounded object-contain bg-white p-0.5 shrink-0" />
                          ) : (
                            <span>{l.icon}</span>
                          )}
                          {l.name}
                        </a>
                      </td>
                      <td className="p-3 text-muted-foreground hidden md:table-cell">{l.catLabel}</td>
                      <td className="p-3 text-muted-foreground hidden md:table-cell">{l.region}</td>
                      {showResortCol && (
                        <td className="p-3 text-muted-foreground hidden lg:table-cell">
                          {getResortName(l) || <span className="text-muted-foreground/50">–</span>}
                        </td>
                      )}
                      <td className="p-3 hidden sm:table-cell text-muted-foreground">
                        {l.googleRating
                          ? <span>{Number(l.googleRating).toFixed(1)} <span className="text-muted-foreground/60">({l.googleUserRatingsTotal ?? 0})</span></span>
                          : <span className="text-muted-foreground/50">No reviews</span>}
                      </td>
                      <td className="p-3 text-right space-x-1">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(l)}>Edit</Button>
                        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(l)}>Delete</Button>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={showResortCol ? 7 : 6} className="p-6 text-center text-muted-foreground">No listings found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <p className="text-xs text-muted-foreground">{filtered.length} total {filtered.length === 1 ? 'listing' : 'listings'}</p>
      </main>

      <ListingFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingListing={editingListing}
        onSubmit={handleFormSubmit}
        isPending={createListing.isPending || updateListing.isPending}
      />

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {visibleSelected.size} listing{visibleSelected.size === 1 ? "" : "s"}?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The selected listings will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={bulkPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={executeBulkDelete}
              disabled={bulkPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {bulkPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
