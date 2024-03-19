import { Header } from "@/components/header";
import { ProductCard } from "@/components/product-card";
import { useEffect, useState } from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
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

interface CepProps {
    bairro: string;
    cep: string;
    complemento: string;
    ddd: string;
    gia: string;
    ibge: string;
    localidade: string;
    logradouro: string;
    siafi: string;
    uf: string;
}

export function Home() {
    const [cartStore, setCartStore] = useState<ProductProps[]>([])
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
    const [dialogScreen, setDialogScreen] = useState('cart')
    const [cep, setCep] = useState<CepProps>()
    const [street, setStreet] = useState('')
    const [number, setNumber] = useState('')
    const [district, SetDistrict] = useState('')
    const [payment, setPayment] = useState('')
    const [, setErrorStreet] = useState(false)
    const [, setErrorNumber] = useState(false)
    const [, SetErrorDistrict] = useState(false)
    const [, setErrorPayment] = useState(false)
    const [payback, setPayback] = useState('')

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

        toast.warning(`Removido do carrinho.`)
    }

    const handleDecreaseQuantity = (id: number) => {
        const updatedCart = cartStore.map(item => {
            if (item.id === id) {
                item.amount -= 1;

                if (item.amount === 0) {
                    toast.warning(`Removido do carrinho.`)
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

    const addAddress = async () => {
        const response = await fetch("https://viacep.com.br/ws/38195000/json/", {
            method: "GET"
        })

        const data = await response.json()

        setCep(data)
    }

    const handleCloseOrder = () => {
        setDialogScreen('address')
    }

    const validateField = (field: string, errorSetter: any, errorMessage: string) => {
        if (field === '' || field === undefined) {
            errorSetter(true);
            toast.error(errorMessage);
            return false;
        }
        return true;
    };

    const handleAddAdress = () => {
        const isValidStreet = validateField(street, setErrorStreet, 'Nome da rua invalido!');
        const isValidNumber = validateField(number, setErrorNumber, 'Numero invalido!');
        const isValidDistrict = validateField(district, SetErrorDistrict, 'Nome do bairro invalido!');
        const isValidPayment = validateField(payment, setErrorPayment, 'Metodo de pagamento invalido!');

        if (isValidStreet && isValidNumber && isValidDistrict && isValidPayment) {
            setErrorStreet(false);
            setErrorNumber(false);
            SetErrorDistrict(false);
            setErrorPayment(false);
            setDialogScreen('finaly');
        } else {
            setErrorStreet(false);
            setErrorNumber(false);
            SetErrorDistrict(false);
            setErrorPayment(false);
        }
    };

    const handleSendWhatsAppMessage = () => {
        const productsText = cartStore.map(item => `${item.amount}x ${item.name}`).join('\n');

        if (payment === "Dinheiro") {
            const message = encodeURIComponent(`Pedido:\n${productsText}\n\nTotal: ${totalPrice.replace('.', ',')}\n\nEndereço >>>\nRua: ${street}, N°: ${number} - ${district}\n\nPagamento via: ${payment}\n\nTroco para: ${payback} R$`
            );
            const whatsappLink = `https://wa.me/+5534984081905?text=${message}`;
            window.open(whatsappLink, '_blank');
        }

        const message = encodeURIComponent(`Pedido:\n${productsText}\n\nTotal: ${totalPrice.replace('.', ',')}\n\nEndereço >>>\nRua: ${street}, N°: ${number} - ${district}\n\nPagamento via: ${payment}`
        );
        const whatsappLink = `https://wa.me/+5534984081905?text=${message}`;
        window.open(whatsappLink, '_blank');

    }

    useEffect(() => {
        addAddress()
    }, [])

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
                    </DialogHeader>
                    {dialogScreen === 'cart' && (
                        <DialogDescription>
                            {cartStore.length > 0 && (
                                <div>
                                    <ScrollArea className="h-[400px] rounded-md border p-4">
                                        {cartStore.map((item) => (
                                            <div key={item.id} className="flex w-full justify-between items-center border-b-2 border-black pb-2 hover:bg-slate-400/30">
                                                <p className="border-r-2 mx-2 flex-1 border-slate-500">{item.name}</p>
                                                <p className="border-r-2 mx-2 flex-1 border-slate-500">R$ {item.price}</p>
                                                <div className="flex gap-2">
                                                    <Button variant="outline" size="sm" className="mt-2" onClick={() => handleDecreaseQuantity(item.id)}>➖</Button>
                                                    <Button variant="default" className="mt-2" disabled>{item.amount}</Button>
                                                    <Button variant="outline" size="sm" className="mt-2" onClick={() => handleIncreaseQuantity(item.id)}>➕</Button>
                                                    <Button variant="destructive" className="mt-2" onClick={() => handleRemoveCartStore(item.id)}><Trash /></Button>
                                                </div>
                                            </div>
                                        ))}

                                    </ScrollArea>
                                    <div className="flex justify-between mt-10">
                                        <Button variant="link" className="mt-2 cursor-grab text-xl">Total: R$ {totalPrice.replace('.', ',')}</Button>

                                        <Button onClick={handleCloseOrder}>Finalizar pedido</Button>
                                    </div>
                                </div>
                            )}
                            {cartStore.length === 0 && (
                                <div className="h-40 flex flex-col items-center justify-center">
                                    <p className="text-xl">Carrinho vazio!</p>
                                    <DialogClose className="text-primary mt-10 border-2 border-primary p-5 rounded-xl flex justify-center items-center gap-4">Voltar as compras <ShoppingBag /></DialogClose>
                                </div>
                            )}
                        </DialogDescription>
                    )}
                    {dialogScreen === 'address' && (
                        <DialogDescription>
                            {cartStore.length > 0 && (
                                <div>
                                    <ScrollArea className="h-[400px] rounded-md border p-4">

                                        <p>Rua</p>
                                        <Input value={street} onChange={(value) => setStreet(value.target.value)} />
                                        <p>Número</p>
                                        <Input value={number} onChange={(value) => setNumber(value.target.value)} />
                                        <p>Bairro</p>
                                        <Input value={district} onChange={(value) => SetDistrict(value.target.value)} />

                                        <p>Metodo de pagamentp:</p>
                                        <Select onValueChange={e => { setPayment(e) }}>
                                            <SelectTrigger className="">
                                                <SelectValue placeholder="Selecione a forma de pagamento" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                                                <SelectItem value="Cartão de crédito">Cartão de crédito</SelectItem>
                                                <SelectItem value="Cartão de débito">Cartão de débito</SelectItem>
                                                <SelectItem value="Pix">Pix</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        {payment === 'Dinheiro' && (
                                            <>
                                                <p>Precisa de troco?</p>
                                                <Input type="number" value={payback} onChange={(value) => setPayback(value.target.value)} />
                                            </>
                                        )}
                                        <p>Cep: </p>
                                        <Input disabled value={cep?.cep !== '' ? cep?.cep : ''} />
                                        <p>Cidade: </p>
                                        <Input disabled value={cep?.localidade} />
                                        <p>Estado: </p>
                                        <Input disabled value={cep?.uf} />
                                    </ScrollArea>
                                    <div className="flex justify-between mt-10">
                                        <Button variant="link" className="mt-2 cursor-grab text-xl">Total: R$ {totalPrice.replace('.', ',')}</Button>

                                        <div className="flex gap-2">
                                            <Button variant="secondary" onClick={() => setDialogScreen('cart')}>Voltar</Button>
                                            <Button onClick={handleAddAdress}>Adicionar endereço</Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </DialogDescription>
                    )}
                    {dialogScreen === 'finaly' && (
                        <DialogDescription>
                            {cartStore.length > 0 && (
                                <div>
                                    <ScrollArea className="h-[400px] rounded-md border p-4">
                                        {cartStore.map((item) => (
                                            <div key={item.id} className="flex items-center py-2">
                                                <p>{item.amount}</p>
                                                <p>x {item.name}</p>
                                            </div>
                                        ))}

                                        <div>
                                            <p>Endereço</p>
                                            <p>Rua: {street}, N°: {number} - {district}</p>
                                            <p>Pagamento via: {payment}</p>
                                            {payment === "Dinheiro" && <p>Troco pra: R$ {payback}</p>}
                                        </div>
                                    </ScrollArea>
                                    <div className="flex justify-between mt-10">
                                        <Button variant="link" className="mt-2 cursor-grab text-xl">Total: R$ {totalPrice.replace('.', ',')}</Button>

                                        <div className="flex gap-2">
                                            <Button variant="secondary" onClick={handleCloseOrder}>Voltar</Button>
                                            <Button onClick={handleSendWhatsAppMessage}>Fazer pedido</Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </DialogDescription>
                    )}
                </DialogContent>
            </Dialog>

            <Footer />
        </div>
    )
}