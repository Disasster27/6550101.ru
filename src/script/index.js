
const ProductItem = class {
    constructor ( product ) {
        this.product = product;
        this.productDomElement = null;
    };
    chooseVariant (  ) {
        let active = this.productDomElement.querySelector( '.product__variant-select_active' );
        let newActive = null;
        
        if ( event.target.classList.contains( 'product__variant-select' ) ) {
            newActive = event.toElement.parentElement;
            if ( active !== newActive ) {
                event.toElement.parentElement.classList.toggle( 'product__variant-select_active' );
                active.classList.toggle( 'product__variant-select_active' );
                active = newActive;
            };
        };
        this.setPriceForVariant( )
    };
    setPriceForVariant (  ) {
        const squad = this.productDomElement.querySelector( '.product__variant-squad' );
        const pak = this.productDomElement.querySelector( '.product__variant-pak' );
        const priseGold = this.productDomElement.querySelector( '.product__price-gold' );
        const priceRetail =this.productDomElement.querySelector( '.product__price-retail' );

        if ( squad.parentElement.classList.contains( 'product__variant-select_active' ) ) {
            priseGold.textContent = this.product.priceGoldAlt.toFixed( 2 );
            priceRetail.textContent = this.product.priceRetailAlt.toFixed( 2 );

        }; 
        if ( pak.parentElement.classList.contains( 'product__variant-select_active' ) ) {
            priseGold.textContent = this.product.priceGold.toFixed( 2 );
            priceRetail.textContent = this.product.priceRetail.toFixed( 2 );
        };
    };
    addCount () {
        const input = this.productDomElement.querySelector( '.counter__input' );

        if ( event.target.classList.contains( 'up' ) ) {
            input.value = +input.value + 1;
            if ( this.product.unit !== this.product.unitAlt ) {
                this.calcRatio()
            };
        };
        if (  event.target.classList.contains( 'down' ) ) {
            input.value = input.value <= 1 ? 1 : input.value - 1;
            if ( this.product.unit !== this.product.unitAlt ) {
                this.calcRatio()
            };
        };
    };
    calcRatio () {
        const inputValue = this.productDomElement.querySelector( '.counter__input' ).value;
        this.productDomElement.querySelector( '.product__pak' ).textContent = inputValue * this.product.unitRatio;
        this.productDomElement.querySelector( '.product__squad' ).textContent = ( inputValue * this.product.unitRatioAlt ).toFixed( 2 );
    };
    render (  ) {
        const productContainer = this.createElem( 'div', 'product', 'container__product' );
        this.productDomElement = productContainer;
        const productPhoto = this.createElem( 'div', 'product__photo' );
        productPhoto.innerHTML = `<a href="#">
                                    <img src="http:${ this.product.primaryImageUrl }" alt="Product photo">
                                </a>`;
        productContainer.insertAdjacentElement( 'beforeend', productPhoto );
        
        const productCode = this.createElem( 'div', 'product__code' );
        productCode.innerHTML = `Код ${ this.product.code.replace(/^0+/, '') }`;
        productContainer.insertAdjacentElement( 'beforeend', productCode );

        const productGoods = this.createElem( 'div', 'product__goods' );
        productContainer.insertAdjacentElement( 'beforeend', productGoods )
        const productDescription = this.createElem( 'div', 'product__description' );
        productDescription.innerHTML = `<a href="#">
                                            ${ this.product.title }
                                        </a>`;
        productGoods.insertAdjacentElement( 'beforeend', productDescription );
        
        const productTags = this.createElem( 'div', 'product__tags' );
        productTags.innerHTML = '<p>Могут понадобиться:</p>';
        for ( let i = 0 ; i < this.product.assocProducts.split( '\n' ).length ; i++ ) {
            const assocProducts = document.createElement( 'a' );
            assocProducts.textContent = ' ' + `${ this.product.assocProducts.split( '\n' )[i] }`;
            productTags.insertAdjacentElement( 'beforeend', assocProducts );
        };
        productGoods.insertAdjacentElement( 'beforeend', productTags );

        const productAvailable = this.createElem( 'div', 'product__available' );
        productAvailable.textContent = this.product.isActive ? 'Наличие' : 'Отсутствие';
        productContainer.insertAdjacentElement( 'beforeend', productAvailable );
        
        const productPrice = this.createElem( 'div', 'product__price' );
        productContainer.insertAdjacentElement( 'beforeend', productPrice );
        const productCost = this.createElem( 'div', 'product__cost' );
        productCost.innerHTML = `<p class="product__price-card">
                                    <span class="product__price-card-text">По карте клуба</span>
                                    <span class="product__price-gold">${ this.product.priceGoldAlt.toFixed( 2 ) }</span>
                                    <span class="product__ruble"><i class="fas fa-ruble-sign"></i></span>
                                </p>
                                <p class="product__price-default">
                                    <span class="product__price-retail">${ this.product.priceRetailAlt.toFixed( 2 ) }</span>
                                    <span class="product__ruble"><i class="fas fa-ruble-sign"></i></span>
                                </p>`;
        productPrice.insertAdjacentElement( 'beforeend', productCost );
        productPrice.insertAdjacentHTML( 'beforeend', `<p class="product__points">Можно купить за <span class="product__point-price">231.75</span> балла</p>` );
        
        const productVariant = this.createElem( 'div', 'product__variant' );
        productVariant.innerHTML = `<spam class="product__variant-select-wrapper product__variant-select_active">
                                        <span class="product__variant-select product__variant-squad">За ${ this.product.unitAlt } </span>
                                    </spam>
                                    <spam class="product__variant-select-wrapper">
                                        <span class="product__variant-select product__variant-pak">За ${ this.product.unit } </span>
                                    </spam>`;
        if ( this.product.unit !== this.product.unitAlt ) {
            productPrice.insertAdjacentElement( 'beforeend', productVariant );
        };
        productVariant.addEventListener( 'click', () => { this.chooseVariant() } );

        const productAdd = this.createElem( 'div', 'product__add' );

        const productHint = this.createElem( 'div', 'product__hint' );
        productHint.innerHTML = `<span class="info"></span>
                                <p>Продается упаковками:<br>
                                    <span class="product__pak">${ this.product.unitRatio }</span> ${ this.product.unit } = <span class="product__squad">${ this.product.unitRatioAlt.toFixed( 2 ) }</span> ${ this.product.unitAlt }
                                </p>`;
        if ( this.product.unit === this.product.unitAlt ) {
            productPrice.insertAdjacentHTML( 'beforeend', `<div>Цена за ${ this.product.unit }</div>` );
        } else {
            productAdd.insertAdjacentElement( 'beforeend', productHint );
        };
        
        const productCount = this.createElem( 'div', 'product__count', 'counter' );
        productCount.innerHTML = `<div class="counter__stepper">
                                    <input type="number" value="1" class="counter__input">
                                    <div class="counter__arrow">
                                        <span class="up"></span>
                                        <span class="down"></span>
                                    </div>
                                </div>`;
        productAdd.insertAdjacentElement( 'beforeend', productCount ); 
        productCount.addEventListener( 'click', () => { this.addCount() } );
        
        const cartButton = this.createElem( 'div', 'cart-button' );
        cartButton.innerHTML = `<button class="product__button" data-product-id="${ this.product.productId }">в корзину</button>`;
        productAdd.insertAdjacentElement( 'beforeend', cartButton );

        productPrice.insertAdjacentElement( 'beforeend', productAdd );
        return productContainer;
        
    };

    createElem  ( tag ) {
        const div = document.createElement( `${ tag }` );
        for ( let i = 1 ; i < arguments.length ; i++ ) {
            div.classList.add( `${ arguments[ i ] }` );
        };
        return div;
    };
};

class CartItem {
    constructor( product ) {
        this.product = product;
    };
    render() {
        const cartItem = document.createElement( 'div' );
        cartItem.classList.add( 'cart__item' );
        cartItem.dataset.productCartId = this.product.productId;
        cartItem.innerHTML = `<div><img class="cart__image" src="http:${ this.product.primaryImageUrl }" alt=""></div>
                            <div class="cart__title">${ this.product.title }</div>
                            <div >
                                <div class="cart__item-cost">
                                    <div class="cart__item-quantity">${ this.product.quantity } </div> x <div class="cart__item-price">${ this.product.priceRetail } </div> p.
                                </div>
                                <div class="cart__item-cost-total">
                                    <p>=</p>
                                    <span class="cart__item-prise-total">${ this.product.quantity * this.product.priceRetail }</span>р.
                                </div>
                            </div>
                            <div class="cart__item-delete"></div>`;
        return cartItem;
    };
}


