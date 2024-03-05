import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "./ui/button"
import { ShoppingCart } from "lucide-react"

interface ProductProps {
    id: number
    name: string
    description: string
    image: string
    price: string
    onClick: () => void
}

export function ProductCard(props: ProductProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{props.name}</CardTitle>
                {props.description !== '' ? <CardDescription className="h-16">{props.description}</CardDescription> : null}
            </CardHeader>
            <CardContent>
                <img className="w-40 h-40 mx-auto" src={`/${props.image}`} alt={props.description} />
                <p className="text-2xl ">R$ {props.price}</p>
            </CardContent>
            <CardFooter>
                <Button className="gap-2 w-full" onClick={props.onClick}>
                    <p className="hidden md:block lg:block">Adicionar no carrinho</p> <ShoppingCart />
                </Button>
            </CardFooter>
        </Card>
    )
}