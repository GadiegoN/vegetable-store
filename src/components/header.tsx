import { useState } from "react";
import { Button } from "./ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

export function Header() {
    const [name, setName] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    const handleSendMessage = () => {
        if (name && message) {
            setName('')
            setMessage('')
            const whatsappLink = `https://api.whatsapp.com/send?phone=+5534984081905&text=${encodeURIComponent(`Nome: ${name}\n\n Mensagem: ${message}`)}`;
            window.open(whatsappLink, "_blank");
        }
    }

    return (
        <div className="w-full h-32 bg-primary p-10 flex justify-between">
            <p className="text-3xl font-bold text-white">Verduras</p>

            <div>
                <Button className="text-white hover:scale-110" asChild variant="link"><a href="#produtos">Produtos</a></Button>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button className="text-white hover:scale-110" variant="link">Contato</Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Nos mande uma mensagem!</SheetTitle>
                            <SheetDescription>
                                <div className="mt-4 space-y-4">
                                    <h2 className="text-base font-bold">Enviar mensagem pelo WhatsApp</h2>
                                    <input
                                        type="text"
                                        placeholder="Digite seu nome"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full rounded-xl h-10 px-4 border-2 border-black"
                                    />
                                    <textarea
                                        placeholder="Digite sua mensagem"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className="w-full rounded-xl h-40 px-4 border-2 border-black"
                                    />
                                    <Button className="w-full" onClick={handleSendMessage}>Enviar mensagem</Button>
                                </div>
                            </SheetDescription>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    )
}