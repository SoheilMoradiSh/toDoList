const btnSwitchTheme = document.querySelector("#theme-switcher");
const body = document.querySelector("body");
const btnAdd = document.getElementById("add-btn");
const userInput = document.getElementById("addt");
const ul = document.querySelector(".todos");
const filter = document.querySelector(".filter");
const btnFilter = document.querySelector("#clear-completed");
function main() {
  //Theme Switcher
  btnSwitchTheme.addEventListener("click", () => {
    body.classList.toggle("light");

    const imgSwitchTheme = btnSwitchTheme.children[0];

    imgSwitchTheme.setAttribute(
      "src",
      imgSwitchTheme.getAttribute("src") === "./assets/images/icon-sun.svg"
        ? "./assets/images/icon-moon.svg"
        : "./assets/images/icon-sun.svg"
    );
  });

  makeTodoElement(JSON.parse(localStorage.getItem("todos")));

  ul.addEventListener("dragover", (e) => {
    if (
      !e.target.classList.contains("dragging") &&
      e.target.classList.contains("card")
    ) {
      const draggingcard = document.querySelector(".dragging");
      const cards = [...ul.querySelectorAll(".card")];
      const currentPos = cards.indexOf(draggingcard);
      const newPos = cards.indexOf(e.target);

      if (currentPos > newPos) {
        ul.insertBefore(draggingcard, e.target);
      } else {
        ul.insertBefore(draggingcard, e.target.nextSibling);
      }

      const todos = JSON.parse(localStorage.getItem("todos"));
      const remove = todos.splice(currentPos, 1);
      todos.splice(newPos, 0, remove[0]);
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  });
  userInput.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
      btnAdd.click();
    }
  });

  btnAdd.addEventListener("click", () => {
    var item = userInput.value.trim();

    if (item) {
      userInput.value = "";
      var todos = !localStorage.getItem("todos")
        ? []
        : JSON.parse(localStorage.getItem("todos"));

      var currentTodo = {
        item: item,
        isComplete: false,
      };

      todos.push(currentTodo);
      localStorage.setItem("todos", JSON.stringify(todos));
      makeTodoElement([currentTodo]);
    }
  });

  filter.addEventListener("click",(e)=>{
    const id = e.target.id;
    if(id){
      document.querySelector(".on").classList.remove("on");
      document.getElementById(id).classList.add("on");
      document.querySelector(".todos").className = `todos ${id}`


    }
  })
  btnFilter.addEventListener('click', () => {
    var deleteIndexes = [];
    document.querySelectorAll(".card.checked").forEach((card) => {
      deleteIndexes.push(
        [...document.querySelectorAll(".todos .card")].indexOf(card)
      );
      card.classList.add("fall");
      card.addEventListener('animationend', () => {
        card.remove();
      });

    });

    removeMultipleTodos(deleteIndexes);

  })
}
function removeTodo(index) {
  const todos = JSON.parse(localStorage.getItem("todos"));
  todos.splice(index, 1);
  localStorage.setItem("todos", JSON.stringify(todos));
}
function toDOstate(index, isCompleted) {
  const todos = JSON.parse(localStorage.getItem("todos"));
  todos[index].isComplete = isCompleted;
  localStorage.setItem("todos", JSON.stringify(todos));
}
function removeMultipleTodos(indexes) {
  var todos = JSON.parse(localStorage.getItem("todos"));
  todos = todos.filter((todo, index) => {
    return !indexes.includes(index);
  });
  localStorage.setItem("todos", JSON.stringify(todos));

}
function makeTodoElement(todoArray) {
  if (!todoArray) {
    return null;
  }

  const itemleft = document.querySelector("#items-left");
  todoArray.forEach((todoObject) => {
    //Create Html Elements Of Todo
    const card = document.createElement("li");
    const cbContainer = document.createElement("div");
    const cbInput = document.createElement("input");
    const checkSpan = document.createElement("span");
    const item = document.createElement("p");
    const clearBtn = document.createElement("button");
    const img = document.createElement("img");

    //Add Classes
    card.classList.add("card");
    cbContainer.classList.add("cb-container");
    cbInput.classList.add("cb-input");
    checkSpan.classList.add("check");
    item.classList.add("item");
    clearBtn.classList.add("clear");
    //Add Attributes
    card.setAttribute("draggable", true);
    cbInput.setAttribute("type", "checkbox");
    img.setAttribute("src", "./assets/images/icon-cross.svg");
    img.setAttribute("alt", "Clear It");
    item.textContent = todoObject.item;

    if (todoObject.isComplete) {
      card.classList.add("checked");
      cbInput.setAttribute("checked", "checked");
    }
    //Add EventListener

    card.addEventListener("dragstart", () => {
      card.classList.add("dragging");
    });

    card.addEventListener("dragend", () => {
      card.classList.remove("dragging");
    });

    clearBtn.addEventListener("click", (e) => {
      const currentCard = clearBtn.parentElement;
      currentCard.classList.add("fall");
      const indexOfCurrentCard = [
        ...document.querySelectorAll(".todos .card"),
      ].indexOf(currentCard);
      removeTodo(indexOfCurrentCard);

      currentCard.addEventListener("animationend", () => {
        setTimeout(() => {
          currentCard.remove();
          itemleft.textContent = document.querySelectorAll(
            ".todos .card:not(.checked)"
          ).length;
        }, 100);
      });
    });

    cbInput.addEventListener("click", (e) => {
      const currentCard = cbInput.parentElement.parentElement;
      const checked = cbInput.checked;
      const index = [...document.querySelectorAll(".todos .card")].indexOf(
        currentCard
      );

      toDOstate(index, checked);

      checked
        ? currentCard.classList.add("checked")
        : currentCard.classList.remove("checked");

      itemleft.textContent = document.querySelectorAll(
        ".todos .card:not(.checked)"
      ).length;
    });
    //Set Element by Parent Child
    clearBtn.appendChild(img);
    cbContainer.appendChild(cbInput);
    cbContainer.appendChild(checkSpan);
    card.appendChild(cbContainer);
    card.appendChild(item);
    card.appendChild(clearBtn);

    document.querySelector(".todos").appendChild(card);
  });
  itemleft.textContent = document.querySelectorAll(
    ".todos .card:not(.checked)"
  ).length;
}

document.addEventListener("DOMContentLoaded", main);
