/**
 * Получаем переменные, которые в дальнейшем будут нужны. По хорошему, стоит создать отдельный файл 'utils' специально для таких вещей. 
 */
const users = document.querySelector('.users');
const pagination = document.querySelector('.table__nabigation');
const template = document.querySelector('#table-template').content;
const buttons = [];
const sortName = document.querySelector('.sort-name');
const tableSort = document.querySelector('.table__sort');
const sortRows = tableSort.querySelectorAll('td');

const newValue = document.querySelector('.form__value')
const formBtn = document.querySelector('.form__btn');
const formInputName = document.querySelector('.form__name_value');
const formInputLastName = document.querySelector('.form__last-name_value');
const formInputAbout = document.querySelector('.form__about_value');
const formInputEye = document.querySelector('.form__eye_value');

/**
 * url для обращения к нашей БД. 
 * Благодаря тому, что я разместил сайт на github pages можно обратиться к нашей "БД" по url.
 */
const apiUrl = 'https://alekssharipov.github.io/tablejs/db.json';

/**
 * функция для создания таблицы. В ней я обращаюсь к template элементу в разметке, заполняю его данными и добавляю в таблицу users
 */
function newCard(obj) {
  const elemTable = template.cloneNode(true);
  const nameElement = elemTable.querySelector('.users__first-name');
  const lastNameElement = elemTable.querySelector('.users__last-name');
  const aboutElement = elemTable.querySelector('.users__about');
  const eyeColorElement = elemTable.querySelector('.users__eye-color');
  const refactoring = elemTable.querySelector('.users__refactoring');

  nameElement.textContent = obj.name.firstName;
  lastNameElement.textContent = obj.name.lastName;
  aboutElement.textContent = obj.about;
  eyeColorElement.textContent = obj.eyeColor;
  eyeColorElement.style.backgroundColor = obj.eyeColor;

  refactoring.addEventListener('click', function (e) {
    const val = this.parentNode;
    formInputName.textContent = val.querySelector('.users__first-name').textContent;
    formInputLastName.textContent = val.querySelector('.users__last-name').textContent;
    formInputAbout.textContent = val.querySelector('.users__about').textContent;
    formInputEye.textContent = val.querySelector('.users__eye-color').textContent;
  })

  users.append(elemTable);
}

/**
 * Отправляем запрос на сервер с помощью fetch, если приходит ответ с статусом ок, то мы получаем промис к которому обращаемся с помощью json. Если статус ответа отличен от ок, выбрасываем ошибку.
 */

function getUsers() {
  return fetch(apiUrl)
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(new Error(`Шэф, усё пропало ${res.status}`))
    })
}

/*Объединяем все обращения на сервер в один, чтобы воспользоваться promise.all */
const promiseUser = [getUsers()];

/*Активна ли страница */
let active;

/*Чисто строк в таблице */
let notesOnPage = 10;


/*
Создаем promise.all для того, чтобы отобразить все данные только после того, как все обращения к серверы выполнятся. 
*/
Promise.all(promiseUser)
  .then(([res]) => {
    /*Вычисляем ко-во страниц для пагинации */
    let countOfItems = Math.ceil(res.length / notesOnPage);

    for (let i = 1; i <= countOfItems; i++) {
      let li = document.createElement('li');
      li.innerHTML = i;
      pagination.appendChild(li);
      buttons.push(li)
    }

    /*по дефолту показываем первых 10 пользователей */
    showTable(buttons[0], res);

    /*
      при нажатие на кнопку показываем нужные 10 строк
    */
    for (let button of buttons) {
      button.addEventListener('click', function () {
        showTable(this, res)
      })
    }

    /**
     * навешиваем слушатель на кнопки сортировки
     */

    for (let i = 0; i < sortRows.length; i++) {
      sortRows[i].addEventListener('click', function () {
        valueSort('.users', i)
      })
    }
  })
  .catch(err => console.log(err))


/**
 * отоюражаем нужную таблицу при перелистывание страниц
 */
function showTable(item, res) {
  if (active) {
    active.classList.remove('active');
  }
  active = item;
  item.classList.add('active');

  let pageNum = +item.innerHTML;

  let start = (pageNum - 1) * notesOnPage;
  let end = start + notesOnPage;

  let notes = res.slice(start, end);
  users.innerHTML = '';

  notes.map(el => {
    newCard(el)
  })

}

/**
 * функция для сортировки. Принимает таблицу, которую нужно сортировать и колонку для сортировки.
 */
function valueSort(sortTable, n) {
  let table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.querySelector(sortTable);
  switching = true;
  dir = "asc";
  while (switching) {
    switching = false;
    rows = table.querySelectorAll('tr');
    for (i = 0; i < (rows.length - 1); i++) {
      shouldSwitch = false;
      x = rows[i].querySelectorAll('td')[n];

      y = rows[i + 1].querySelectorAll('td')[n];
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchcount++;
    } else {
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

