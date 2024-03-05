import { Header } from "@/components/header";
import { ProductCard } from "@/components/product-card";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { RefreshCcw, ShoppingBag, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge"
import DATA from "@/lib/DATA";
import CATEGORY from "@/lib/CATEGORY";
import { Footer } from "@/components/footer";
import { toast } from "sonner"

interface ProductProps {
    id: number
    name: string
    description: string
    image: string
    price: string
    amount: number
    category: string
}

export function Home() {
    const [cartStore, setCartStore] = useState<ProductProps[]>([])
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>("Todos");

    const handleAddCartStore = (id: number) => {
        const productToAdd = DATA.find(product => product.id === id);
        if (productToAdd) {
            const existingProduct = cartStore.find(item => item.id === id);
            if (existingProduct) {
                existingProduct.amount += 1;
                setCartStore([...cartStore]);
                toast.success(`${existingProduct?.amount} ${existingProduct?.name} adicionado no carrinho.`)
            } else {
                toast(`${productToAdd?.name} adicionado no carrinho.`)
                setCartStore([...cartStore, { ...productToAdd, amount: 1 }]);
            }
        }
    }

    const handleRemoveCartStore = (id: number) => {
        setCartStore(cartStore.filter(product => product.id !== id));
        const removingProduct = cartStore.find(item => item.id = id)

        toast.warning(`${removingProduct?.amount} ${removingProduct?.name} removido do carrinho.`)
    }

    const handleDecreaseQuantity = (id: number) => {
        const updatedCart = cartStore.map(item => {
            if (item.id === id) {
                item.amount -= 1;

                if (item.amount === 0) {
                    const removingProduct = cartStore.find(item => item.id = id)
                    toast.warning(`${removingProduct?.name} removido do carrinho.`)
                }
            }
            return item;
        }).filter(item => item.amount > 0);
        setCartStore(updatedCart);
    }

    const filteredData = DATA.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleIncreaseQuantity = (id: number) => {
        const updatedCart = cartStore.map(item => {
            if (item.id === id) {
                item.amount += 1;
            }
            return item;
        });
        setCartStore(updatedCart);
    }

    const totalPrice = cartStore.reduce((acc, item) => acc + parseFloat(item.price.replace(',', '.')) * item.amount, 0).toFixed(2);

    const handleSendWhatsAppMessage = () => {
        const productsText = cartStore.map(item => `${item.amount}x ${item.name}`).join('\n');
        const message = encodeURIComponent(`Pedido:\n${productsText}\n\nTotal: ${totalPrice.replace('.', ',')}`);
        const whatsappLink = `https://wa.me/+5534984081905?text=${message}`;
        window.open(whatsappLink, '_blank');

    }

    return (
        <div id="produtos" className="w-screen h-screen">
            <Header />

            <div className="relative">
                <input
                    type="text"
                    placeholder="Buscar verdura"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-6/12 m-10 rounded-xl h-10 px-4 border-2 border-black"
                />

                <Button className="absolute right-10 top-10 space-x-2" onClick={() => { window.location.reload() }}>
                    <RefreshCcw /> <p className="hidden md:block lg:block">Atualizar</p>
                </Button>
            </div>

            <div className="flex w-11/12 md:w-6/12 lg-6/12 mx-10 justify-center mt-4">
                {CATEGORY.map((item) => (
                    <Button key={item.id} variant={selectedCategory === item.name ? 'default' : 'outline'} className="mr-2" onClick={() => setSelectedCategory(item.name)}>{item.name}</Button>
                ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 p-10">
                {searchQuery !== '' || selectedCategory === 'Todos' ?

                    <>
                        {filteredData.map((item) => (
                            <ProductCard
                                key={item.id}
                                onClick={() => handleAddCartStore(item.id)}
                                id={item.id}
                                name={item.name}
                                description={item.description}
                                image={item.image}
                                price={item.price} />
                        ))}
                    </>
                    :
                    <>
                        {DATA.filter(product => product.category === selectedCategory).map((item) => (
                            <ProductCard
                                key={item.id}
                                onClick={() => handleAddCartStore(item.id)}
                                id={item.id}
                                name={item.name}
                                description={item.description}
                                image={item.image}
                                price={item.price} />
                        ))}
                    </>
                }
            </div>

            <Dialog>
                <DialogTrigger asChild>
                    <Button className="w-16 h-16 rounded-full flex justify-center items-center fixed bottom-5 right-5">
                        <ShoppingBag />
                        {cartStore.length !== 0 && (
                            <Badge className="absolute top-0 right-0 bg-orange-800 hover:bg-orange-800">{cartStore.length}</Badge>
                        )}
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Produtos no carrinho</DialogTitle>
                        {cartStore.length > 0 && (
                            <div>
                                {cartStore.map((item) => (
                                    <div key={item.id} className="flex w-full justify-between items-center border-b-2 border-black pb-2 hover:bg-slate-400">
                                        <p className="border-r-2 pr-1 border-slate-500">{item.name}</p>
                                        <p className="border-r-2 pr-1 border-slate-500">R$ {item.price}</p>
                                        <p className="border-r-2 pr-1 border-slate-500">Qnt {item.amount}</p>
                                        <div className="flex gap-2">
                                            <Button variant="outline" className="mt-2" onClick={() => handleDecreaseQuantity(item.id)}>➖</Button>
                                            <Button variant="outline" className="mt-2" onClick={() => handleIncreaseQuantity(item.id)}>➕</Button>
                                            <Button variant="destructive" className="mt-2" onClick={() => handleRemoveCartStore(item.id)}><Trash /></Button>
                                        </div>
                                    </div>
                                ))}

                                <div className="flex justify-between mt-10">
                                    <p>Total: R$ {totalPrice.replace('.', ',')}</p>

                                    <Button onClick={handleSendWhatsAppMessage}>Fazer pedido</Button>
                                </div>
                            </div>
                        )}
                        {cartStore.length === 0 && (
                            <div className="h-40 flex items-center justify-center">
                                <p className="text-xl">Carrinho vazio!</p>
                            </div>
                        )}
                    </DialogHeader>
                </DialogContent>
            </Dialog>

            <Footer />
        </div>
    )
}