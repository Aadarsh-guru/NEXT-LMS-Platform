const formatPrice = (price: number) => {
    const formatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    });
    return formatter.format(price);
};

export {
    formatPrice,
};