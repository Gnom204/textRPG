const mainPage = document.querySelector(".root");
//шаблон из html
const template = document.querySelector("#popup");

const characterData = document.querySelector(".character");

let rouletAdd = 0;
let questsAdd = 0;
let storeAdd = 0;
let tropaAdd = 0;
let isSkelet = true;
const hp = document.querySelector("#hit-points");
const money = document.querySelector("#money");
const potion = document.querySelector("#potion");
// данные персонажа
let skelet = {
  hp: 85,
};

let character = {
  hp: 100,
  money: 200,
  potion: 0,
};
//функция, которая заменяет данные персонажа
const replaceData = () => {
  hp.textContent = character.hp;
  money.textContent = character.money;
  potion.textContent = character.potion;
};

replaceData();

function popupRender(method) {
  //копируем содержимое шаблона
  const clone = template.content.cloneNode(true);
  //ищем элементы внутри шаблона
  const popup = clone.querySelector(".popup");
  const closeBtn = clone.querySelector(".closePopup");
  const content = clone.querySelector(".content");
  console.log(method());
  content.appendChild(method());

  closeBtn.addEventListener("click", () => {
    popup.style.display = "none";
  });
  return clone;
}
let a = 0;
function replaceAll(main, id, method) {
  //айди можно посмотреть в html файле
  const newPage = document.querySelector(`.${id}`);

  const backButton = document.querySelector(`#${id}Back`);
  const doButton = document.querySelector(`#${id}Do`);
  const clone = popupRender(method);
  const popup = clone.querySelector(".popup");

  main.classList.add("invis");
  newPage.classList.add("active");

  doButton.addEventListener("click", () => {
    popup.style.display = "flex";

    if (a === 0) {
      newPage.appendChild(clone);
      a = 1;
    }
    console.log(a);
  });
  backButton.addEventListener("click", () => {
    main.classList.remove("invis");
    newPage.classList.remove("active");
    a = 0;
    console.log(a);
  });
}

function goToPage(e) {
  //если имя элемента по которому нажали - кнопка
  if ((e.target.nodeName = "BUTTON")) {
    //берем айди нажатого элемента
    const { id } = e.target;
    switch (id) {
      case "roulet":
        replaceAll(mainPage, id, rouletRender);
        break;
      case "quests":
        replaceAll(mainPage, id, questsRender);
        break;
      case "things":
        replaceAll(mainPage, id, thingsRender);
        break;
      case "exitOnTropa":
        replaceAll(mainPage, id, exitOnTropaRender);
        break;
    }
  }
}
//счетчик
var counter = 0;
//Контент попапа для рулетки
function rouletRender() {
  console.log(rouletAdd);
  if (rouletAdd === 0) {
    const template = document.querySelector("#roulet-content");
    const clone = template.content.cloneNode(true);
    const spinButton = clone.querySelector("#spin");
    const res = clone.querySelector(".res");

    spinButton.addEventListener("click", () => {
      const interval = setInterval(() => {
        //ждем выполнения функции 10 раз, чтобы сделать видимость прокрутки
        if (counter < 10) {
          counter++;
          let result = roulet();
          console.log(result);
          res.textContent = result;
          console.log(counter);
        } else {
          counter = 0;
          clearInterval(interval);
          let finish = rouletCheck();
          console.log({ finish });
          res.textContent = finish;
        }
      }, 100);
    });
    console.log("рулеткааа");
    return clone;
  }
}
//контент попапа для квестов

let isQuest = false;

function questsRender() {
  const template = document.getElementById("quests-content");
  const clone = template.content.cloneNode(true);
  const container = clone.querySelector(".quest");

  const accesQuest = clone.querySelector(".acces-quest");

  accesQuest.addEventListener("click", () => {
    if (!isQuest) {
      isQuest = true;
      characterData.appendChild(container);
      console.log("da");
      accesQuest.textContent = "Забрать награду";
      accesQuest.disabled = isSkelet;
    }
    if (!isSkelet) {
      accesQuest.disabled = isSkelet;
      character.money += 50;
      replaceData();
      characterData.removeChild(container);
    }
  });
  return clone;
}
//контенрт попапа для магазина
function thingsRender() {
  const template = document.querySelector("#store-content");
  const clone = template.content.cloneNode(true);
  const buyButton = clone.querySelector("#buyPotion");

  buyButton.addEventListener("click", () => {
    if (character.money >= 50) {
      character.money -= 50;
      character.potion += 1;
      replaceData();
    } else {
      alert("Недостаточно средств");
    }
  });
  return clone;
}
// контент для сражений
function exitOnTropaRender(e) {
  //не относящиеся к шаблону
  const template = document.querySelector("#battle-content");
  const popup = document.querySelector(".exitOnTropa");
  const questButton = document.querySelector(".acces-quest");
  popup.classList.add("active");
  //переменные относящиеся к шаблону
  const clone = template.content.cloneNode(true);
  const count = clone.querySelector("#count");
  const attackBtn = clone.querySelector("#attack");
  const skeletHp = clone.querySelector("#skelet-hp");
  const heroHp = clone.querySelector("#hero-hp");
  const heal = clone.querySelector("#heal");
  const exit = clone.querySelector("#exit");

  function replaceHp() {
    heroHp.textContent = character.hp;
    skeletHp.textContent = skelet.hp;
  }

  attackBtn.addEventListener("click", () => {
    character.hp -= randomNumber(3, 6);
    skelet.hp -= randomNumber(5, 10);
    // отрисовывает жизни героя и скелета в бою
    replaceHp();
    //отрисовывает характеристику персонажа
    replaceData();
    if (skelet.hp <= 0) {
      mainPage.classList.remove("invis");
      popup.classList.remove("active");
      a = 0; //сверху задавали, чтобы не отрисовывать одно и тоже несколько раз
      questButton.disabled = false;
      isSkelet = false;
    }
  });

  heal.addEventListener("click", () => {
    if (character.potion > 0) {
      character.hp += 35;
      character.potion--;
      replaceHp();
      replaceData();
    }
  });

  exit.addEventListener("click", () => {
    const num = randomNumber(1, 3);
    count.textContent = num;
    setTimeout(() => {
      if (num === 1) {
        mainPage.classList.remove("invis");
        popup.classList.remove("active");
        a = 0;
      } else {
        mainPage.classList.remove("invis");
        popup.classList.remove("active");
        a = 0;
        alert("вы погибли");
      }
      count.textContent = "";
    }, 1000);
  });

  return clone;
}
//получение рандомного числа для рулетки
function roulet() {
  const randomCount = Math.round(Math.random() * 100);
  return randomCount;
}
//рандомное число от мин до макс
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

//Выигрыш или проигрыш
function rouletCheck() {
  let num = roulet();
  if (num > 0 && num <= 50) {
    character.money += 100;
  } else {
    character.money -= 50;
  }
  replaceData();
  return num;
}

mainPage.addEventListener("click", goToPage);
