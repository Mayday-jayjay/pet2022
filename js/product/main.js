let carts = document.querySelectorAll('.add-cart');


function check_data(){
    if (document.myForm.purchaser_name.value.length == 0){
        alert("購買人姓名不可空白");
    }   else if (document.myForm.purchaser_phome.value.length <= 9)
        alert("購買人手機號碼需剛好10碼");
        else if (document.myForm.purchaser_email.value.length == 0)
        alert("購買人信箱不可空白");
        else if (document.myForm.recipient_name.value.length == 0)
        alert("收件人姓名不可空白");
        else if (document.myForm.recipient_phome.value.length > 10)
        alert("收件人手機號碼需剛好10碼");
        else if (document.myForm.recipient_address.value.length == 0)
        alert("請輸入地址");
        else if (document.myForm.op_time.value.length == 0)
        alert("請選擇配送時段");
        else if (document.myForm.transport.value.length == 0)
        alert("請選擇配送方式");
    else{
        alert("訂單已成功建立");
        myForm.submit();
    }
}


let products = [ 
    {
        name: "product1",
        tag: "product1",
        price: 510,
        inCart: 0
    },
    {
        name: "product2",
        tag: "product2",
        price: 520,
        inCart: 0
    },
    {
        name: "product3",
        tag: "product3",
        price: 530,
        inCart: 0
    },
    {
        name: "product4",
        tag: "product4",
        price: 540,
        inCart: 0
    }
];

for(let i=0; i< carts.length; i++) {
    carts[i].addEventListener('click', () => {
        cartNumbers(products[i]);
        totalCost(products[i]);
    });
}

function onLoadCartNumbers() {
    let productNumbers = localStorage.getItem('cartNumbers');
    if( productNumbers ) {
        document.querySelector('.cart-nav span').textContent = productNumbers;
    }
}

function cartNumbers(product, action) {
    let productNumbers = localStorage.getItem('cartNumbers');
    productNumbers = parseInt(productNumbers);

    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);

    if( action ) {
        localStorage.setItem("cartNumbers", productNumbers - 1);
        document.querySelector('.cart-nav span').textContent = productNumbers - 1;
        console.log("action running");
    } else if( productNumbers ) {
        localStorage.setItem("cartNumbers", productNumbers + 1);
        document.querySelector('.cart-nav span').textContent = productNumbers + 1;
    } else {
        localStorage.setItem("cartNumbers", 1);
        document.querySelector('.cart-nav span').textContent = 1;
    }
    setItems(product);
}

function setItems(product) {
    // let productNumbers = localStorage.getItem('cartNumbers');
    // productNumbers = parseInt(productNumbers);
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);

    if(cartItems != null) {
        let currentProduct = product.tag;
    
        if( cartItems[currentProduct] == undefined ) {
            cartItems = {
                ...cartItems,
                [currentProduct]: product
            }
        } 
        cartItems[currentProduct].inCart += 1;

    } else {
        product.inCart = 1;
        cartItems = { 
            [product.tag]: product
        };
    }

    localStorage.setItem('productsInCart', JSON.stringify(cartItems));
}

function totalCost( product, action ) {
    let cart = localStorage.getItem("totalCost");

    if( action) {
        cart = parseInt(cart);

        localStorage.setItem("totalCost", cart - product.price);
    } else if(cart != null) {
        
        cart = parseInt(cart);
        localStorage.setItem("totalCost", cart + product.price);
    
    } else {
        localStorage.setItem("totalCost", product.price);
    }
}

function displayCart() {
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);

    let cart = localStorage.getItem("totalCost");
    cart = parseInt(cart);

    let productContainer = document.querySelector('.products');
    let sub = document.querySelector('.subtotal');
    let fare = 0;
    let total = cart + fare;
    
    if(cart>1){
        fare = 80;
    }

    if( cartItems && productContainer ) {
        productContainer.innerHTML = '';
        Object.values(cartItems).map( (item, index) => {
            productContainer.innerHTML +=                                   
            `
            <div class="product"><ion-icon name="close-circle"></ion-icon>
                <img src="../images/popular_product/${item.tag}.png" />
                <span class="sm-hide">${item.name}</span>
            </div>
            <div class="price sm-hide">NT$${item.price}</div>
            <div class="quantity">
                <ion-icon class="decrease " name="remove"></ion-icon>
                    <span>${item.inCart}</span>
                <ion-icon class="increase" name="add"></ion-icon>
                
            </div>
            <div class="total">NT$${item.inCart * item.price}</div>
            `;
        });

        productContainer.innerHTML += `
            <div class="basketTotalContainer">
                <h4 class="basketTotalTitle">合計：</h4>
                <h4 class="basketTotal">NT$${cart}</h4>
            </div>`

        sub.innerHTML = `
            <div class="subtotal-item subtotal-item-total">
                <h2 id="test">總計：</h2>
                <p>NT$${cart}</p>
            </div>
            <hr>
            <div class="subtotal-item fare">
                <h2>運費：</h2>
                <p>NT$${fare}</p>
            </div>
            <hr>
            <div class="subtotal-item sub">
                <h2>合計：</h2>
                <p>NT${total}</p>
            </div>
            <div class="checkout-button">
                <input type="button" onclick="check_data()" value="提交訂單 ">
            </div>`
        deleteButtons();
        manageQuantity();
    }
}


function manageQuantity() {
    let decreaseButtons = document.querySelectorAll('.decrease');
    let increaseButtons = document.querySelectorAll('.increase');
    let currentQuantity = 0;
    let currentProduct = '';
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);

    for(let i=0; i < increaseButtons.length; i++) {
        decreaseButtons[i].addEventListener('click', () => {
            console.log(cartItems);
            currentQuantity = decreaseButtons[i].parentElement.querySelector('span').textContent;
            console.log(currentQuantity);
            currentProduct = decreaseButtons[i].parentElement.previousElementSibling.previousElementSibling.querySelector('span').textContent.toLocaleLowerCase().replace(/ /g,'').trim();
            console.log(currentProduct);

            if( cartItems[currentProduct].inCart > 1 ) {
                cartItems[currentProduct].inCart -= 1;
                cartNumbers(cartItems[currentProduct], "decrease");
                totalCost(cartItems[currentProduct], "decrease");
                localStorage.setItem('productsInCart', JSON.stringify(cartItems));
                displayCart();
            }
        });

        increaseButtons[i].addEventListener('click', () => {
            console.log(cartItems);
            currentQuantity = increaseButtons[i].parentElement.querySelector('span').textContent;
            console.log(currentQuantity);
            currentProduct = increaseButtons[i].parentElement.previousElementSibling.previousElementSibling.querySelector('span').textContent.toLocaleLowerCase().replace(/ /g,'').trim();
            console.log(currentProduct);

            cartItems[currentProduct].inCart += 1;
            cartNumbers(cartItems[currentProduct]);
            totalCost(cartItems[currentProduct]);
            localStorage.setItem('productsInCart', JSON.stringify(cartItems));
            displayCart();
        });
    }
}

function deleteButtons() {
    let deleteButtons = document.querySelectorAll('.product ion-icon');
    let productNumbers = localStorage.getItem('cartNumbers');
    let cartCost = localStorage.getItem("totalCost");
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);
    let productName;
    console.log(cartItems);

    for(let i=0; i < deleteButtons.length; i++) {
        deleteButtons[i].addEventListener('click', () => {
            productName = deleteButtons[i].parentElement.textContent.toLocaleLowerCase().replace(/ /g,'').trim();
           
            localStorage.setItem('cartNumbers', productNumbers - cartItems[productName].inCart);
            localStorage.setItem('totalCost', cartCost - ( cartItems[productName].price * cartItems[productName].inCart));

            delete cartItems[productName];
            localStorage.setItem('productsInCart', JSON.stringify(cartItems));

            displayCart();
            onLoadCartNumbers();
        })
    }
}

onLoadCartNumbers();
displayCart();




// google翻譯
function googleTranslateElementInit() {
    new google.translate.TranslateElement({ pageLanguage: 'zh-TW', includedLanguages: 'en,zh-CN,zh-TW' }, 'google_translate_element');
}





