"use strict";

// global variable to store update task id 
let UPDATE_TASK_ID;

// create task with tasks api
async function createTask() {
  // user input
  let task = document.getElementById("inputTask").value;
  task = task.trim(); // trim whitespace
  // clear input
  document.getElementById("inputTask").value = "";
  if (validateInput(task)) {
    try {
      const URL = 'https://api.travistackett.net/v1/tasks';
      await axios.post(URL, {
        task: task
      });
      // once created get all tasks agian
      getTasks();
    } catch (err) {
      console.error("ERROR: ", err);
    }
  }
}

// validate user input to be 300 <= input > 0
function validateInput(task) {
  if (task.length === 0) {
    alert("Please enter text before pressing enter.");
    return false;
  } else if (task.length >= 300) {
    alert("Please enter 300 or less characters per taks.");
    return false;
  }
  return true;
}

// delete task using task api
async function deleteThisItem(taskID) {
  if (confirm("Are you sure you want to DELETE this task?")) {
    try {
      const URL = `https://api.travistackett.net/v1/tasks/${taskID}`;
      await axios.delete(URL);
      getTasks();
    } catch (err) {
      console.error("ERROR: ", err);
    }
  }
}

// when user select edit icon this function prepares the app to
// allow editing
function prepUdateTask(taskID, task, item) {
  // task background color grey
  item.style.backgroundColor = "#616161";
  // hide add button and show update button
  document.getElementById('add').style.display = 'none';
  document.getElementById('update').style.display = 'inline-block';
  // set input field to selected task
  document.getElementById('inputTask').value = task;
  document.getElementById('inputTask').focus();
  // set taskID for updating
  UPDATE_TASK_ID = taskID;

}

// udated db with task api
async function updateTaskButton() {
  // get updated task text
  let updatedTask = document.getElementById("inputTask").value;
  updatedTask = updatedTask.trim(); // trim whitespace
  document.getElementById("inputTask").value = ""; // set back to empty
  // update task
  update(UPDATE_TASK_ID, updatedTask, function () {
    // when done updating:
    // show add button
    document.getElementById('add').style.display = 'inline-block';
    // hide update button
    document.getElementById('update').style.display = 'none';
    // reload tasks to show updates
    getTasks();
  });
}

// helper function to update task
async function update(taskID, task, callback) {

  if (validateInput(task)) {
    try {
      //console.log(taskID)
      const URL = `https://api.travistackett.net/v1/tasks/${taskID}`;
      let test = await axios.put(URL, {
        task: task
      });
      await callback();
    } catch (err) {
      console.log("ERROR: ", err);
    }
  }
}

// this function takes all the data from the get all api call in 
// getTasks() and creates a list of li tags
// creates these to add to ul:
/* <a class="collection-item">
    < li class = "taskText" > task 
      < i class = "material-icons deleteIcon" > delete < /i> with listener
      <i class="material-icons updateIcon">edit</i> with listener
    < /li>
   </a>
*/
// appends each item above to the ul tag
function createList(data) {
  // get task list
  let ul = document.getElementById("tasksList");
  // clear old list
  ul.innerHTML = '';
  // iterate all data from api get all call
  for (let element in data) {
    // get task_id and task
    const taskID = data[element]['task_id'];
    const task = data[element].task;

    // create a tag
    const item = document.createElement("A");
    item.className = "collection-item";

    // create icon for delete icon
    const deleteIcon = document.createElement("I");
    deleteIcon.className = "material-icons deleteIcon";
    const del = document.createTextNode("delete");
    deleteIcon.appendChild(del);

    // add listener to delete icon for deleting tasks when icon is clicked
    deleteIcon.addEventListener("click", function () {
      deleteThisItem(taskID);
    });

    // create update icon
    const updateIcon = document.createElement("I");
    updateIcon.className = "material-icons updateIcon";
    const edit = document.createTextNode("edit");
    updateIcon.appendChild(edit);

    // add listener to update icon for updating tasks when icon is clicked
    updateIcon.addEventListener("click", function () {
      prepUdateTask(taskID, task, item);
    });

    // create li tab
    const li = document.createElement("LI");
    li.className = "taskText";
    // textnode will store task text in li tag
    const textnode = document.createTextNode(task);

    li.appendChild(updateIcon);
    li.appendChild(textnode);
    li.appendChild(deleteIcon);
    item.appendChild(li);
    ul.appendChild(item);
  }
}

// get all tasks using tasks api
async function getTasks() {
  // Make a request for a user with a given ID
  const URL = 'https://api.travistackett.net/v1/tasks';
  try {
    const data = await axios.get(URL);
    await createList(data.data);
  } catch (err) {
    console.log("ERROR: ", err);
  }
}


// when document object is ready
$(document).ready(function () {
  // don't show update button onload
  document.getElementById('update').style.display = 'none';
  // get and load tasks from api to dom
  getTasks();
});