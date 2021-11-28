// select elments
const alert = document.querySelector('.alert')
const form = document.querySelector('.grocery-form')
const grocery = document.querySelector('#grocery')
const submitBtn = document.querySelector('.submit-btn')
const container = document.querySelector('.grocery-container')
const list = document.querySelector('.grocery-list')
const clearBtn = document.querySelector('.clear-btn')

// edit option
let editElement ;
let editFlag = false;
let editId = '';

const editItem =(e) => {
    const element = e.currentTarget.parentElement.parentElement
    
    editElement = e.currentTarget.parentElement.previousElementSibling
    
    // set form value
    grocery.value = editElement.innerHTML
    editFlag = true
    editId = element.dataset.id;
    submitBtn.textContent = 'edit'

}

const editLocalStorage = (id, value) =>{
    let items = getLocalStorage();
    items = items.map(item =>{
        if (item.id === id){
            item.value = value
        }
        return item
    })

    localStorage.setItem('list',JSON.stringify(items))
}

const addItem = (e) => {
    e.preventDefault()
    const value = grocery.value
    const id = new Date().getTime().toString()
    
    if (value && !editFlag) {
        createListItem(id, value)
        displayAlert('item added tothe list', 'success')
        // show container
        container.classList.add('show-container')

        // add to local storage
        addToLocalStorage(id, value);
        setBackToDefault();

    } else if(value && editFlag) {
        
        editElement.innerHTML = value;
        displayAlert('value change', 'success')

        editLocalStorage(editId, value);
        setBackToDefault();
    }

    else{
        displayAlert('please enter a value', 'danger')
    }
}

const deleteItem = (e) => {
    const element = e.currentTarget.parentElement.parentElement
    const id = element.dataset.id
    list.removeChild(element)
    

    if(list.children.length-1 === 0){
        container.classList.remove('show-container')
    }
    displayAlert('item removed', 'danger')
    setBackToDefault();


    // remove from local storage
    removeFromLocalStorage(id)
}
 
const displayAlert = (text, action) => {
    alert.textContent = text;
    alert.classList.add(`alert-${action}`)

    // remove displayAlert
    setTimeout(() => {
        alert.textContent = '';
        alert.classList.remove(`alert-${action}`)
    }, 1000);

} 

const addToLocalStorage = (id, value) => {
    const grocery = {id:id, value:value};
    
    let items = getLocalStorage();
    items.push(grocery)

    localStorage.setItem('list',JSON.stringify(items))
    
}

const setBackToDefault = () => {
    grocery.value = ''
    editFlag = false;
    editId = '';
    submitBtn.textContent = 'submit'
}


function removeFromLocalStorage(id){
        let items = getLocalStorage()
        items = items.filter(item => {
            if(item.id !== id) return item
        })
        localStorage.setItem('list',JSON.stringify(items))
}

const getLocalStorage = () => {
    return localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) : [];
}

const clearItems = () => {
     const items = document.querySelectorAll('.grocery-item')
     if(items.length > 1){
     items.forEach(item => {
         list.removeChild(item)})
     }
     
     container.classList.remove('show-container')
     displayAlert('empty list', 'success')


     setBackToDefault();
     localStorage.removeItem('list')
     
} 

form.addEventListener('submit', addItem)
clearBtn.addEventListener('click', clearItems)

window.addEventListener('DOMContentLoaded', setupItems)

function setupItems ()  { 
    let items = getLocalStorage()
    if(items.length > 0){
    items.forEach(item => {
    createListItem(item.id, item.value)
        }) 
    container.classList.add('show-container')
    }
}

function createListItem(id, value){
    const element = document.createElement('article')
    element.classList.add('grocery-item')
    const attr = document.createAttribute('data-id')
    attr.value = id
    element.setAttributeNode(attr)
    element.innerHTML = `<p class="title">${value}</p>
    <div class="btn-container">
      <button type="button" class="edit-btn">
        <i class="fas fa-edit"></i>
      </button>

      <button type="button" class="delete-btn">
        <i class="fas fa-trash"></i>
      </button>
    </div>`


    const deleteBtn = element.querySelector('.delete-btn')
    const editBtn = element.querySelector('.edit-btn')

    
    deleteBtn.addEventListener('click', deleteItem);
    editBtn.addEventListener('click', editItem)


    // append child
    list.appendChild(element)
}