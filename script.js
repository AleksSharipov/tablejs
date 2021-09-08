const users = document.querySelector('.users');
const pagination = document.querySelector('.table__nabigation');
const template = document.querySelector('#table-template').content;
const buttons = [];
const sortName = document.querySelector('.sort-name');
const tableSort = document.querySelector('.table__sort');
const sortRows = tableSort.querySelectorAll('td');

let a;

function newCard(obj) {
  const elemTable = template.cloneNode(true);
  const nameElement = elemTable.querySelector('.users__first-name');
  const lastNameElement = elemTable.querySelector('.users__last-name');
  const aboutElement = elemTable.querySelector('.users__about');
  const eyeColorElement = elemTable.querySelector('.users__eye-color');

  nameElement.textContent = obj.name.firstName;
  lastNameElement.textContent = obj.name.lastName;
  aboutElement.textContent = obj.about;
  eyeColorElement.textContent = obj.eyeColor;
  eyeColorElement.style.backgroundColor = obj.eyeColor;

  aboutElement.addEventListener('click', function () {
    a = this.textContent
    // console.log(this.textContent)
    console.log(a)
  })

  users.append(elemTable);
}



function getUsers() {
  return fetch(`http://127.0.0.1:5500/db.json`)
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(new Error(`Шэф, усё пропало ${res.status}`))
    })
}

const promiseUser = [getUsers()];

let active;
let notesOnPage = 10;

Promise.all(promiseUser)
  .then(([res]) => {
    let countOfItems = Math.ceil(res.length / notesOnPage);

    for (let i = 1; i <= countOfItems; i++) {
      let li = document.createElement('li');
      li.innerHTML = i;
      pagination.appendChild(li);
      buttons.push(li)
    }

    showTable(buttons[0], res);

    for (let button of buttons) {
      button.addEventListener('click', function () {
        showTable(this, res)
      })
    }

    for (let i = 0; i < sortRows.length; i++) {
      sortRows[i].addEventListener('click', function () {
        valueSort('.users', i)
      })
    }
  })

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

