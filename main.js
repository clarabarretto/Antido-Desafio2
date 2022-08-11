const dados = {
    "insurances": [{
        "id": 3322,
        "name": "Amil"
    }, {
        "id": 3293,
        "name": "Bradesco"
    }, {
        "id": 99231,
        "name": "Hapvida"
    }, {
        "id": 1322,
        "name": "CASSI"
    }, {
        "id": 23111,
        "name": "Sulamérica"
    }],
    "guides": [{
        "number": "3210998321",
        "start_date": "2022-08-23T19:18:47.210Z",
        "patient": {
            "id": 9321123,
            "name": "Augusto Ferreira",
            "thumb_url": "https://imgsapp2.correiobraziliense.com.br/app/noticia_127983242361/2019/10/04/794834/20191004154953157610i.jpg"
        },
        "insurane_id": 1322,
        "health_insurance": {
            "id": 1322,
            "name": "CASSI",
            "is_deleted": false
        },
        "price": 5567.2
    }, {
        "number": "287312832",
        "start_date": "2022-04-23T19:18:47.210Z",
        "patient": {
            "id": 93229123,
            "name": "Caio Carneiro",
            "thumb_url": "http://3.bp.blogspot.com/-XG5bGlqGnJw/T9lIcssnybI/AAAAAAAADTA/B23ezXOkx8Y/s1600/Aang.jpg"
        },
        "insurane_id": 1322,
        "health_insurance": {
            "id": 1322,
            "name": "CASSI",
            "is_deleted": false
        },
        "price": 213.3
    }, {
        "number": "283718273",
        "start_date": "2022-06-22T19:18:47.210Z",
        "patient": {
            "id": 213122388,
            "name": "Luciano José",
            "thumb_url": "https://i.ytimg.com/vi/yUXd-enstO8/maxresdefault.jpg"
        },
        "insurane_id": 3293,
        "health_insurance": {
            "id": 3293,
            "name": "Bradesco",
            "is_deleted": true
        },
        "price": 88.99
    }, {
        "number": "009090321938",
        "start_date": "2021-04-20T19:18:47.210Z",
        "patient": {
            "id": 3367263,
            "name": "Felício Santos",
            "thumb_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPSxlYabmRlKk43uvsBMIqjA7Rw_YCwK4TyA&usqp=CAU"
        },
        "insurane_id": 3293,
        "health_insurance": {
            "id": 3293,
            "name": "Bradesco",
            "is_deleted": true
        },
        "price": 828.99
    }, {
        "number": "8787128731",
        "start_date": "2021-04-01T19:18:47.210Z",
        "patient": {
            "id": 777882,
            "name": "Fernando Raposo"
        },
        "insurane_id": 3322,
        "health_insurance": {
            "id": 3322,
            "name": "Amil",
            "is_deleted": false
        },
        "price": 772
    }, {
        "number": "12929321",
        "start_date": "2021-04-02T19:18:47.210Z",
        "patient": {
            "id": 221,
            "name": "Paciente com nome grante pra colocar text ellipsis testando nome com paciente grande"
        },
        "insurane_id": 3322,
        "health_insurance": {
            "id": 3322,
            "name": "Amil",
            "is_deleted": false
        },
        "price": 221
    }]
};

const select = document.getElementById("select")
const input = document.getElementById("input_pesquisar")
const tabela = document.getElementById('tabelaDeInformacoes')
const paginationNav = document.getElementById('pagination_navigation')
let currentPage = 1;
let totalPages = '';
let resultadoInput = [];
let tableSortValid = false;
const initialDate = document.getElementById("beginning-date");
const finalDate = document.getElementById("ending-date");
const monthButton = document.getElementById("botao_mes");
const todayButton = document.getElementById("botao_hoje");

const sanitize = text => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")

const init = () => {
    preencherSelect();
    monthButtonFilter();
}

const preencherSelect = () => {
    let variavelSelect = '';

    dados.insurances.forEach(insurance => {
        variavelSelect += `<option> ${insurance.name}</option>`
    });
    document.getElementById('select').innerHTML += variavelSelect;
};

const tableSort = () => {
    tableSortValid = !tableSortValid;
}

const preencherTabela = (array) => {
    let variavelTabela = '';
    let dataFormatada;
    let precoFormatado;

    if (!array.length) {
        tabela.innerHTML = '<tr><td colspan="5" style="font-size: 18px; text-align: center;">nenhuma guia encontrada</td></tr>'
        return
    }

    array.forEach(element => {
        let hoverDeletado = "";
        let foiDeletado = "";

        if (element.health_insurance.is_deleted) {
            hoverDeletado = "Convênio apagado";
            foiDeletado = "deleted"
        }
        dataFormatada = new Date(element.start_date);
        precoFormatado = element.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        variavelTabela += ` 
        <tr>
            <td>${dataFormatada.toLocaleDateString('pt-BR')}</td>
            <td>${element.number}</td>
            <td class = "patient-name"><img src="${element.patient.thumb_url || 'https://via.placeholder.com/150x150.jpg'}" class="profile-pic"/> ${element.patient.name}</td>
            <td title="${hoverDeletado}" class="${foiDeletado}">${element.health_insurance.name}</td>
            <td>${precoFormatado}</td>
        </tr>`
    });

    tabela.innerHTML = variavelTabela;
};

const renderPagination = totalItems => {
    const itemsPerPage = 2;
    totalPages = Math.ceil(totalItems / itemsPerPage);

    if (!totalItems) {
        document.getElementById("paginations").innerHTML = '';
        return
    }

    let html = `
    <li class="page-item">
        <button onclick="previousPage(event)" type="button" class="page-link" id="btn-previous" aria-label="Previous">
        <span aria-hidden="true">&lt;</span>

    </li>`;

    for (let i = 1; i <= totalPages; i++) {
        const active = currentPage === i ? "active" : "";

        html += `<li class = "page-item ${active}">
        <a class="page-link" id=${i} onclick="paginate(event, ${i})">${i}</a>
        </li>`
    };

    html += `
        <li class="page-item">
            <button type="button" onclick="nextPage(event)" class="page-link" id="btn-next" aria-label="Next">
            <span aria-hidden="true">&gt;</span>
        </li>
        `

    document.getElementById("paginations").innerHTML = html;
    return totalPages
}

const monthButtonFilter = () => {
    initialDate.value = moment().startOf('month').format("YYYY-MM-DD")
    finalDate.value = moment().endOf('month').format("YYYY-MM-DD")
    buscarNaTabela();
}

const todayButtonFilter = () => {
    initialDate.value = moment().format("YYYY-MM-DD")
    finalDate.value = moment().format("YYYY-MM-DD")
    buscarNaTabela();
}

const buscarNaTabela = (event) => {
    if(event){
        event.preventDefault();
    };
    const initialDate = document.getElementById("beginning-date");
    const finalDate = document.getElementById("ending-date");

    resultadoInput = dados.guides.filter(element => {
        let valid = false

        if ((!input.value && !select.value) && (initialDate.value && finalDate.value) && moment(element.start_date).isSameOrBefore(finalDate.value) && moment(element.start_date).isSameOrAfter(initialDate.value)) {
            valid = true  // quando corresponde só ao filtro data
        }

        if ((input.value && !select.value) && (initialDate.value && finalDate.value) && (sanitize(element.patient.name).includes(sanitize(input.value)) || element.number.includes(input.value)) && moment(element.start_date).isSameOrBefore(finalDate.value) && moment(element.start_date).isSameOrAfter(initialDate.value)) {
            valid = true   // quando corresponde só ao filtro data
        }
        if ((!input.value && select.value) && (initialDate.value && finalDate.value) && element.health_insurance.name === select.value && moment(element.start_date).isSameOrBefore(finalDate.value) && moment(element.start_date).isSameOrAfter(initialDate.value)) {
            valid = true   // quando corresponde ao filtro data e ao select
        }
        if ((input.value && select.value && initialDate.value && finalDate.value) && (element.health_insurance.name === select.value) && (sanitize(element.patient.name).includes(sanitize(input.value)) || element.number.includes(input.value)) && moment(element.start_date).isSameOrBefore(finalDate.value) && moment(element.start_date).isSameOrAfter(initialDate.value)) {
            valid = true   // quando corresponde ao filtro data, ao select e ao input
        }
        return valid
    })
    if (tableSortValid) {
        resultadoInput.sort(function (a, b) {
            if (new Date(a.start_date).toISOString().slice(0, 10) > new Date(b.start_date).toISOString().slice(0, 10)) {
                return 1;
            }
            if (new Date(a.start_date).toISOString().slice(0, 10) < new Date(b.start_date).toISOString().slice(0, 10)) {
                return -1;
            }
            return 0;
        });
    } else {
        resultadoInput.sort(function (a, b) {
            if (new Date(a.start_date).toISOString().slice(0, 10) > new Date(b.start_date).toISOString().slice(0, 10)) {
                return -1;
            }
            if (new Date(a.start_date).toISOString().slice(0, 10) < new Date(b.start_date).toISOString().slice(0, 10)) {
                return 1;
            }
            return 0;
        });
    }

    tableSort();
    paginate(null, currentPage);
    renderPagination(resultadoInput.length);
    preencherTabela(resultadoInput.slice((currentPage - 1) * 2, ((currentPage - 1) * 2) + 2));
    totalPages = resultadoInput.length;
    colunsPerPage = resultadoInput.slice((currentPage - 1) * 2, ((currentPage - 1) * 2) + 2).length;
    return totalPages, colunsPerPage
}

const previousPage = (event) => {
    if (currentPage <= 1) {
        return
    }
    currentPage -= 1;
    paginate(event, currentPage);
    return currentPage
}

const nextPage = (event) => {
    if (currentPage === totalPages) {
        return
    };
    currentPage++
    paginate(event, currentPage);
    return currentPage
};

const paginate = (event, page) => {
    console.log(page, 'page');

    if (event) {
        event.preventDefault();
    }

    let items = resultadoInput.slice((page - 1) * 2, ((page - 1) * 2) + 2);
    currentPage = page;

    preencherTabela(items);
    renderPagination(resultadoInput.length);
    return items
};

init()