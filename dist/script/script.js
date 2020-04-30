'use strict';

document.addEventListener( 'DOMContentLoaded', () => {

    const url = './script/products.json';
    // const mod = `_220x220_1.jpg`;


    class List {
        constructor( url, container, item = itemList ) {
            this.url = url;
            this.container = container;
            this.item = item;
            this.allProducts = {};
            this.goods = {};  
            this._init();  
            
        };
        getJson() {
            return fetch( this.url )
            .then( ( res ) => res.json() )
            .then( ( res ) => {
                res.forEach( element => {
                    this.allProducts[ element.productId ] = element;
                } );
            } )
            .catch( ( err ) => {
                console.log( 'catch' );
                this.allProducts = getProducts();
            } );
        };
        getBasket () {
            const promise = new Promise ( ( resolve, reject ) => {
                const json = JSON.parse( localStorage.getItem( '6550101.ru' ) );
                if ( !json ) {
                    return {};
                };
                return resolve ( json );
            } );
            return promise;
            
        };
        render() {
            
            const block = document.querySelector( this.container );
            for ( let key in  this.allProducts ) {
                const productObj = new this.item[ this.constructor.name ](  this.allProducts[ key ] );
                block.insertAdjacentElement( 'beforeend', productObj.render() );
            };
        };
        _init() {
            return false;
        };
    };

    class ProductList extends List {
        constructor( url, cart, container = '.main' ) {
            super( url, container );
            this.cart = cart;
            this.getJson()
            .then( () => this.render() );
        };
        _init() {
            document.querySelector( this.container ).addEventListener( 'click', event => {
                if ( event.target.closest( '.product__button' ) ) {
                    this.cart.addToCart( this.allProducts[event.target.dataset.productId] );
                };
              });
        };
    };

    class CartList extends List {
        constructor( url, container = '.cart__content' ) {
            super( url, container );
            this.getBasket()
            .then( res => {
                this.allProducts = res;
                this.setCartInfo();
                this.render();
            } );
        };
        addToCart( element ) {

                 const Item = document.querySelector( `[ data-product-id="${ element.productId }" ]` ).offsetParent.previousElementSibling;
            if ( this.allProducts.hasOwnProperty( element.productId ) ) {
                const cartItem = document.querySelector( `[ data-product-cart-id="${ element.productId }" ]` );
                this.allProducts[ element.productId ].quantity += +Item.querySelector( '.counter__input' ).value;
                
                cartItem.querySelector( '.cart__item-prise-total' ).innerHTML = this.allProducts[ element.productId ].quantity * element.priceRetail;
                cartItem.querySelector( '.cart__item-quantity' ).innerHTML = this.allProducts[ element.productId ].quantity;
            } else {
                element.quantity = +Item.querySelector( '.counter__input' ).value

                document.querySelector( this.container ).innerHTML = '';
                this.allProducts[ element.productId ] = element;
                this.render();
            };
            this.setCartInfo();
            this.saveLocalStorage();
        };
        saveLocalStorage() {
            const object = {};
            for ( let key in this.allProducts ) {
                object[ key ] = this.allProducts[ key ];

            };
            localStorage.setItem( '6550101.ru', JSON.stringify(object) );
        };
        removeProduct( event ) {
            
            delete this.allProducts[ event.toElement.offsetParent.dataset.productCartId ];
            document.querySelector( this.container ).innerHTML = '';
            this.setCartInfo();
            if ( Object.keys( this.allProducts ).length === 0 ) {
                document.querySelector( '.cart__content' ).classList.toggle( 'none' )
            } else {
                this.render();
            }
            this.saveLocalStorage();
        };
        setCartInfo() {
            document.querySelector( '.cart__quantity' ).innerHTML = Object.keys( this.allProducts ).length;
            
            let sum = 0;
            for ( let key in this.allProducts ) {
                sum += this.allProducts[ key ].quantity * this.allProducts[ key ].priceRetail;
            };
            document.querySelector( '.cart__total-price' ).innerHTML = sum;
        };
        _init() {
            document.querySelector( '.cart' ).addEventListener( 'click', event => {
                if ( event.target.closest( '.cart' ) && !event.target.closest( '.cart__item' ) ) {
                    document.querySelector( '.cart__content' ).classList.toggle( 'none' )
                }
            } )
            document.querySelector( this.container ).addEventListener( 'click', event => {
                if ( event.target.classList.contains( 'cart__item-delete' ) ) {
                    this.removeProduct( event );
                };
            } );    
        };
    };

    

    
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
                    this.calcRatio();
                };
            };
            if (  event.target.classList.contains( 'down' ) ) {
                input.value = input.value <= 1 ? 1 : input.value - 1;
                if ( this.product.unit !== this.product.unitAlt ) {
                    this.calcRatio();
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
    };



    const itemList = {
        ProductList : ProductItem,
        CartList : CartItem,
    };

    const cart = new CartList( url );
    const list = new ProductList( url, cart );



} );



