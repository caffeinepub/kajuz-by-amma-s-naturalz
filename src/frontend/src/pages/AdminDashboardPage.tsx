import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import { LogOut, Plus, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  type Product,
  addCustomProduct,
  getProducts,
  setPriceOverride,
} from "../data/products";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { type OrderData, formatINR, getOrders } from "../utils/formatters";

export function AdminDashboardPage() {
  const { identity, clear } = useInternetIdentity();
  const { actor } = useActor();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>(getProducts());
  const [orders] = useState<OrderData[]>(getOrders());
  const [editPrices, setEditPrices] = useState<Record<string, string>>({});
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    grade: "",
    category: "whole" as "whole" | "broken",
    origin: "",
    pricePerKg: "",
    description: "",
  });

  useEffect(() => {
    if (!identity) {
      navigate({ to: "/admin" });
      return;
    }
    if (actor) {
      actor.isCallerAdmin().then((isAdmin) => {
        if (!isAdmin) navigate({ to: "/admin" });
      });
    }
    // navigate is stable
  }, [identity, actor, navigate]);

  const handleSavePrice = (productId: string) => {
    const newPrice = Number(editPrices[productId]);
    if (!newPrice || newPrice <= 0) {
      toast.error("Enter a valid price");
      return;
    }
    setPriceOverride(productId, newPrice);
    setProducts(getProducts());
    setEditPrices((prev) => {
      const n = { ...prev };
      delete n[productId];
      return n;
    });
    toast.success("Price updated");
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.pricePerKg) {
      toast.error("Name and price are required");
      return;
    }
    const product: Product = {
      id: `custom-${Date.now()}`,
      name: newProduct.name,
      grade: newProduct.grade || newProduct.name,
      category: newProduct.category,
      origin: newProduct.origin || "India",
      pricePerKg: Number(newProduct.pricePerKg),
      image: "/assets/generated/cashew-w320-whole.dim_800x600.jpg",
      description: newProduct.description,
    };
    addCustomProduct(product);
    setProducts(getProducts());
    setAddProductOpen(false);
    setNewProduct({
      name: "",
      grade: "",
      category: "whole",
      origin: "",
      pricePerKg: "",
      description: "",
    });
    toast.success("Product added");
  };

  const customers = Object.values(
    orders.reduce(
      (acc, o) => {
        if (!acc[o.customerPhone]) {
          acc[o.customerPhone] = {
            name: o.customerName,
            phone: o.customerPhone,
            business: o.businessName,
            city: o.city,
            orderCount: 0,
            totalValue: 0,
          };
        }
        acc[o.customerPhone].orderCount++;
        acc[o.customerPhone].totalValue += o.total;
        return acc;
      },
      {} as Record<
        string,
        {
          name: string;
          phone: string;
          business: string;
          city: string;
          orderCount: number;
          totalValue: number;
        }
      >,
    ),
  );

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            kajuz by Amma's Naturalz
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => {
            clear();
            navigate({ to: "/" });
          }}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>

      <Tabs defaultValue="products">
        <TabsList className="mb-6">
          <TabsTrigger value="products" data-ocid="admin.products_tab">
            Products ({products.length})
          </TabsTrigger>
          <TabsTrigger value="orders" data-ocid="admin.orders_tab">
            Orders ({orders.length})
          </TabsTrigger>
          <TabsTrigger value="customers" data-ocid="admin.customers_tab">
            Customers ({customers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <div className="flex justify-end mb-4">
            <Dialog open={addProductOpen} onOpenChange={setAddProductOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="gap-1.5"
                  data-ocid="admin.product_add_button"
                >
                  <Plus className="h-4 w-4" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-display">
                    Add New Product
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-3 mt-2">
                  <div>
                    <Label htmlFor="np-name">Product Name *</Label>
                    <Input
                      id="np-name"
                      value={newProduct.name}
                      onChange={(e) =>
                        setNewProduct((p) => ({ ...p, name: e.target.value }))
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="np-grade">Grade</Label>
                    <Input
                      id="np-grade"
                      value={newProduct.grade}
                      onChange={(e) =>
                        setNewProduct((p) => ({ ...p, grade: e.target.value }))
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="np-cat">Category</Label>
                    <Select
                      value={newProduct.category}
                      onValueChange={(v) =>
                        setNewProduct((p) => ({
                          ...p,
                          category: v as "whole" | "broken",
                        }))
                      }
                    >
                      <SelectTrigger
                        id="np-cat"
                        className="mt-1"
                        data-ocid="admin.category_select"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="whole">Whole</SelectItem>
                        <SelectItem value="broken">Broken</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="np-origin">Origin</Label>
                    <Input
                      id="np-origin"
                      value={newProduct.origin}
                      onChange={(e) =>
                        setNewProduct((p) => ({ ...p, origin: e.target.value }))
                      }
                      className="mt-1"
                      placeholder="India / Tanzania"
                    />
                  </div>
                  <div>
                    <Label htmlFor="np-price">Price per kg (₹) *</Label>
                    <Input
                      id="np-price"
                      value={newProduct.pricePerKg}
                      onChange={(e) =>
                        setNewProduct((p) => ({
                          ...p,
                          pricePerKg: e.target.value,
                        }))
                      }
                      type="number"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="np-desc">Description</Label>
                    <Textarea
                      id="np-desc"
                      value={newProduct.description}
                      onChange={(e) =>
                        setNewProduct((p) => ({
                          ...p,
                          description: e.target.value,
                        }))
                      }
                      className="mt-1"
                      rows={2}
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={handleAddProduct}
                    data-ocid="admin.add_product_submit_button"
                  >
                    Add Product
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="bg-card rounded-xl shadow-card overflow-hidden">
            <Table data-ocid="admin.products_table">
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Origin</TableHead>
                  <TableHead>Price/kg</TableHead>
                  <TableHead>Update Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((p, idx) => (
                  <TableRow
                    key={p.id}
                    data-ocid={`admin.product.row.${idx + 1}`}
                  >
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          p.category === "whole" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {p.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {p.origin}
                    </TableCell>
                    <TableCell className="price-display font-semibold">
                      {formatINR(p.pricePerKg)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          placeholder="New price"
                          className="w-28 h-8 text-sm"
                          value={editPrices[p.id] ?? ""}
                          onChange={(e) =>
                            setEditPrices((prev) => ({
                              ...prev,
                              [p.id]: e.target.value,
                            }))
                          }
                          data-ocid={`admin.price_input.${idx + 1}`}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 gap-1"
                          onClick={() => handleSavePrice(p.id)}
                          disabled={!editPrices[p.id]}
                          data-ocid={`admin.save_price_button.${idx + 1}`}
                        >
                          <Save className="h-3 w-3" />
                          Save
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="orders">
          {orders.length === 0 ? (
            <div
              className="text-center py-16 text-muted-foreground"
              data-ocid="admin.orders.empty_state"
            >
              No orders yet.
            </div>
          ) : (
            <div className="bg-card rounded-xl shadow-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Business</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((o, idx) => (
                    <TableRow
                      key={o.id}
                      data-ocid={`admin.order.row.${idx + 1}`}
                    >
                      <TableCell className="font-mono text-xs">
                        {o.id}
                      </TableCell>
                      <TableCell>{o.customerName}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {o.businessName}
                      </TableCell>
                      <TableCell className="price-display font-semibold">
                        {formatINR(o.total)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {o.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(o.createdAt).toLocaleDateString("en-IN")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="customers">
          {customers.length === 0 ? (
            <div
              className="text-center py-16 text-muted-foreground"
              data-ocid="admin.customers.empty_state"
            >
              No customers yet.
            </div>
          ) : (
            <div className="bg-card rounded-xl shadow-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Business</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Total Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((c, idx) => (
                    <TableRow
                      key={c.phone}
                      data-ocid={`admin.customer.row.${idx + 1}`}
                    >
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell>{c.business}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {c.phone}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {c.city}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{c.orderCount}</Badge>
                      </TableCell>
                      <TableCell className="price-display font-semibold">
                        {formatINR(c.totalValue)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
}
