//manage loading spinner
const manageLoading = (status) =>{
    if(status){
        document.querySelector('.loading').classList.remove('hidden');
        document.querySelector('#treeCards').classList.add('hidden');
    }
    else{
        document.querySelector('.loading').classList.add('hidden');
        document.querySelector('#treeCards').classList.remove('hidden');
    }
}

//loading and displaying all plants by default
const loadAllPlants = async() =>{
    manageLoading(true);

    const response = await fetch(`https://openapi.programming-hero.com/api/plants`);
    const data = await response.json();

    displayCategoryData(data.plants); //all plants are displayed by default
}

loadAllPlants(); //load all plants by default

const loadCategories = async() =>{
    const response = await fetch(`https://openapi.programming-hero.com/api/categories`);
    const data = await response.json();

    displayCategories(data.categories)
}

loadCategories();

const categoriesList = document.getElementById("categories-list");
const displayCategories = (categories) =>{
    // console.log(categories);

    categories.forEach(category =>{
        // console.log(category.category_name);
        categoriesList.innerHTML += `
            <li id=${category.id} class="list-none p-2 hover:bg-[#15803D] hover:text-white transition-all duration-500 cursor-pointer rounded-lg list-item mt-2">${category.category_name}</li>
        `
    })

    const listItems = document.querySelectorAll('.list-item');

    listItems.forEach(li => {
        li.addEventListener('click',function(event){

            listItems.forEach(li => li.classList.remove('active'));

            li.classList.add('active')
            
            const id = event.currentTarget.id;

            if(id === "allTrees"){
                loadAllPlants();
            }
            else{
                loadCategoryData(id);
            }
        })
    })
}

const loadCategoryData = async (id) =>{
    manageLoading(true);

    const response = await fetch(`https://openapi.programming-hero.com/api/category/${id}`);
    const data = await response.json();

    displayCategoryData(data.plants);
}

const plantsContainer = document.getElementById("treeCards");


//add to cart functionality
let addedToCart = [];
const cart = document.getElementById("cart");

//display all plants of a specific category
const displayCategoryData = (plants) =>{
    plantsContainer.innerHTML = '';

    plants.forEach(plant =>{
        plantsContainer.innerHTML += `
            <div class="singleTree p-4 shadow-xl rounded-lg flex flex-col h-full">
                <div class="h-64 cursor-pointer" onclick="loadPlantDetails(${plant.id})">
                    <img src="${plant.image}" alt="" class="rounded-lg w-full h-full object-cover">
                </div>
                    
                <h3 class="text-lg font-bold my-2 cursor-pointer" onclick="loadPlantDetails(${plant.id})">${plant.name}</h3>
                <p class="text-sm text-[#1F2937] mb-5">${plant.description}</p>

                <div class="mt-auto">
                    <div class="flex items-center justify-between mb-3">
                        <span class="bg-[#DCFCE7] py-2 px-4 text-[#15803D] font-bold rounded-full">${plant.category}</span>
                        <p class="font-bold text-lg">
                            <span>Tk. </span>
                            <span class="price">${plant.price}</span>
                        </p>
                    </div>
                    <button class="btn bg-[#15803D] w-full text-white rounded-full mb-0 add-to-cart" id=${plant.id}>Add To Cart</button>
                </div>
                
            </div>
        `
    })
    manageLoading(false);

    const addToCartBtns = document.querySelectorAll(".add-to-cart");

    addToCartBtns.forEach(btn =>{
        btn.addEventListener('click',(event)=>{
            const plantName = event.currentTarget.parentNode.parentNode.children[1].innerText;
            let plantPrice = event.currentTarget.parentNode.children[0].children[1].children[1].innerText;

            const newItem = {
                plantName : plantName,
                plantPrice : plantPrice,
                plantId : event.target.id
            }
            addedToCart.push(newItem);

            alert(`${plantName} has been added to cart ☘`);
         
            showCartItems(addedToCart);
        })
    })
}

const showCartItems = (addedToCart) =>{
        cart.innerHTML = '';
        let totalPrice = 0;

        addedToCart.forEach(plant => {
            const newItem = document.createElement('div');

            newItem.innerHTML = `
                <div class="addedPlant flex items-center justify-between mt-2 bg-[#F0FDF4] p-2 rounded-lg">
                    <div>
                        <h1 class="text-lg font-bold mb-1">${plant.plantName}</h1>
                        <p>Tk. <span class="treePrice text-gray-500">${plant.plantPrice}</span></p>
                    </div>
                    <span class="text-xl font-bold cursor-pointer text-[#1F2937] delete" id=${plant.plantId}>X</span>
                </div>
            `
            cart.appendChild(newItem);

            totalPrice = Number(plant.plantPrice) + totalPrice;
        })

        document.querySelector('.totalPriceContainer').innerText = totalPrice;

        console.log(addedToCart);
}

cart.addEventListener('click',(event)=>{
    if(event.target.innerText === 'X'){
        deleteItem(event);
    }
})

const deleteItem = (event) =>{
    const id = event.target.id;
    const indexToDelete = addedToCart.findIndex(plant => plant.plantId === id);

    addedToCart.splice(indexToDelete,1);

    showCartItems(addedToCart);
}



//plant details modal
const trees = document.querySelectorAll('.singleTree');

//load details for modal after clicking on a plant
const loadPlantDetails = (plantID) =>{
    fetch(`https://openapi.programming-hero.com/api/plant/${plantID}`)
    .then(response => response.json())
    .then(data => showDetails(data.plants))
    .catch(error => console.log("Error: ",error));
}

const modalBox = document.querySelector(".modal-box");

//show details of the plant
const showDetails = (plants) =>{
    const detailsModal = document.getElementById("plantDetailsModal");
    detailsModal.showModal();

    modalBox.innerHTML = `
        <div class="h-70">
            <img src="${plants.image}" alt="" class="rounded-lg w-full h-full object-cover">
        </div>

        <h3 class="text-lg font-bold my-2">${plants.name}</h3>
        <p class="text-sm text-[#1F2937] mb-5">${plants.description}</p>

        <div class="mt-auto">
            <div class="flex items-center justify-between mb-3">
                <span class="bg-[#DCFCE7] py-2 px-4 text-[#15803D] font-bold rounded-full">${plants.category}</span>
                <p class="font-bold text-lg">Tk. <span class="price">${plants.price}</span></p>
            </div>
        </div>       

        <div class="modal-action">
            <form method="dialog">
                <!-- if there is a button in form, it will close the modal -->
                <button class="btn">Close</button>
            </form>
        </div>
    `
}

// responsive menu - menu for mobile device 
const menuOpenBtn = document.querySelector(".menuOpenBtn");
const menuCloseBtn = document.getElementById("menuCloseBtn");
const mobileMenu = document.getElementById("mobileMenu");

menuOpenBtn.addEventListener('click',()=>{
    mobileMenu.classList.remove('-translate-x-full');
})
menuCloseBtn.addEventListener('click',()=>{
    mobileMenu.classList.add('-translate-x-full');
})



