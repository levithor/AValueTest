export let cart = []; // Array to hold cart items

export function calculateCartTotals(cart) {
            // reduce: accumulate the cart subtotal from each existing cart item.
            const subtotal = cart.reduce(
                (currSubtotal, item) => currSubtotal + item.price * item.quantity,
                0
            );

            const discount = subtotal > 500 ? subtotal * 0.1 : 0;

            return {
                subtotal,
                discount,
                total: subtotal - discount
            };
        } 

export function calculateChange(paymentAmount, total) {
    return paymentAmount - total;
}