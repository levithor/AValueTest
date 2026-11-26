// export const products = [
// ];

export const productData = [
    {
        id: 1,
        name: "Paper Towels (Size XL)",
        description: "High-quality paper towels for everyday use. The special pattern and thickness is designed for maximum absorbency.",
        price: 65.00,
        stock: 22
    },
    {
        id: 2,
        name: "Signature Ceramic Cooking Pot",
        description: "Large, oven-safe ceramic cooking pot. Comes with a lid. Multiple different colors are available, all with cream-colored interior.",
        price: 559.00,
        stock: 7
    },
    {
        id: 3,
        name: "Very Cool Teddy Bear",
        description: "A teddy bear with sunglasses and a mojito. Comes with built in lung functionality and courtesy cigar",
        price: 295.00,
        stock: 2
    },
    {
        id: 5,
        name: "EZ Cheeze 900ml",
        description: "A large can of spay-on cheese. Meant for crackers and childern under the age of 9.",
        price: 149.00,
        stock: 14
    }
];

export async function loadProducts() {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return productData.map(product => ({ ...product }));
}