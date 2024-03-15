const addressform = document.querySelector('#address-form');
const cepInput = document.querySelector('#cep');
const addressInput = document.querySelector('#address');
const cityInput = document.querySelector('#city');
const neighboorhoodInput = document.querySelector('#neighborhood');
const regionInput = document.querySelector('#region');
const formInput = document.querySelectorAll('[data-input]');

const fadeElement = document.querySelector('#fade');

const closeButton = document.querySelector('#close-message');

// validade CEP input

cepInput.addEventListener("keypress", (e) => {
    const onlyNumber = /[0-9]/ //REJEX/;
    const key = String.fromCharCode(e.keyCode) //Metodo para pegar oque foi digitado

    // alow only numbers
    if (!onlyNumber.test(key)) {
        e.preventDefault();
        return;
    }
});

// get addres event
cepInput.addEventListener("keyup", (e) => {
    const inputValue = e.target.value //pegando o valor do input

    // checar se tem o tamanho correto
    if (inputValue.length === 8) {
        getAddres(inputValue);
    }
})

//obter endereço do cliente da API

const getAddres = async (cep) => {
    toggleLoader();

    cepInput.blur(); //tira o cursor do cep para o usurario nao conseguir ficar mexendo enquanto carrega o loader

    const apiUrl = `https://viacep.com.br/ws/${cep}/json/` //API para consultar o cep

    const response = await fetch(apiUrl);

    const data = await response.json();

    //Ao receber um erro, exibir mensagem e resetar o formulario.
    if (data.erro == true) {
        if(!addressInput.hasAttribute("disabled")){
            toggleDisabled();
        }
        addressform.reset();
        toggleLoader();
        toggleMessage("CEP invalido, tente novamente.");
        return;
    }
        if(addressInput.value === ""){
            toggleDisabled();
        }

    addressInput.value = data.logradouro;
    cityInput.value = data.localidade;
    neighboorhoodInput.value = data.bairro;
    regionInput.value = data.uf;


    toggleLoader();
};

//adicionar ou remover disabled
const toggleDisabled = () => {
    if(regionInput.hasAttribute("disabled")){
        formInput.forEach((input) =>{
            input.removeAttribute('disabled')
        })
    }
    else{
       formInput.forEach((input) =>{
        input.setAttribute('disabled','disabled')
       }) ;
    }
}

//exibir loader
const toggleLoader = () => {
    const loaderlement = document.querySelector('#loader');

    fadeElement.classList.toggle('hide');
    loaderlement.classList.toggle('hide');

}

//mostrar toggle massage
const toggleMessage = (msg) => {
    const messageElement = document.querySelector('#message');

    const messageElementText = document.querySelector('.alert.alert-light p');

    messageElementText.innerText = msg

    messageElement.classList.toggle('hide')
    fadeElement.classList.toggle("hide");

};

// fechar a mensagem
closeButton.addEventListener('click',() => toggleMessage())

//salvar endereço
//submit == quando for enviado o formulario
addressform.addEventListener('submit', (e) => {
    e.preventDefault();

    toggleLoader();

    setTimeout(() =>{
        toggleLoader()

        toggleMessage('Endereço salvo com sucesso!');

        addressform.reset();

        toggleDisabled();
   
    },1500);
})