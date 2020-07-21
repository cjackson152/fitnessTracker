const { response } = require("express");

const actBtn = document.getElementById("act-button");
const note = document.getElementById("new-note");
const results = document.getElementById("results");
const status = document.getElementById("status");

function wipeAll() {
    document.getElementById("exercise-name").value = "";
    document.getElementById("description").value = "";
    document.getElementById("light").checked;
}
function wipeResults() {
    document.getElementById("results").innerHTML="";
}

function updateForms(data) {
    document.getElementById("exercise-name").value = data.name;
    document.getElementById("description").value = data.description;

    switch(data.difficulty) {
        case "light":
            document.getElementById("light").checked = true;
            break;
        case "moderate":
            document.getElementById("moderate").checked = true;
            break;
        case "intense":
            document.getElementById("intense").checked = true;
            break;
    }
}

function getResults() {
    wipeResults();
    fetch("/exercises")
    .then(function(response) {
        if(response.status !== 200) {
            console.log("Error: " + response.status);
            return;
        }
        response.json().then(function(data) {
            personalBest(data);
        });
    })
    .catch(function(err) {
        console.log("Error: ", err);

    });
}

function personalBest(res) {
    for (var i = 0; i < res.length; i++) {
        let data_id = res[i]["_id"];
        let exerciseName = res[i]["name"];
        let exerciseDifficulty = res[i]["difficulty"];
        let exerciseDescription = res[i]["description"];
        let exerciseList = document.getElementById("results");
        snippet = `
        <p class="dataEntry">
        <span class = "data-exerciseName" data-id=${data_id}>${exerciseName}</span>
        <span class = "data-exerciseName" data-id=${data_id}>${exerciseDescription}</span>
        <span class = "data-exerciseName" data-id=${data_id}>${exerciseDifficulty}</span>
        <span onClick = "delete" class = "delete" data-id=${data_id}>Delete</span>;
        </p>
        `;
        exerciseList.insertAdjacentHTML("beforeend", snippet);


    }
}

getResults();
results.addEventListener("click", function(e) {
    if(e.target.matches(".delete")) {
        element = e.target;
        data_id = element.getAttribute("data-id");
        fetch("/exercises/" + data_id, {
            method: "delete"
        })
        .then(function(response) {
            if(response.status !== 200) {
                console.log("Error: " + response.status);
                return;
            }
            element.parentNode.remove();
            wipeAll();
            let newBtn = `
            <button id = "create-new">Submit</button>`;
            actBtn.innerHTML = newBtn;

        })
        .catch(function(err) {
            console.log("Error: ", err);
        });
    } else if (e.target.matches(".data-exerciseName")) {
        element = e.target;
        data_id = element.getAttribute("data-id");
        status.innerText = "editing"

        fetch("/exercises/" + data_id, { method: "get" })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            updateForms(data);
            let newBtn = `<button id = "update" data-id=${data_id}>Update</button>`;
            actBtn.innerHTML = newBtn;

        })
        .catch(function(err) {
            console.log("Error: ", err);
        });
    }

});

actBtn.addEventListener("click", function(e) {
    if(e.target.matches("#update")) {
        updateBtnEl = e.target;
        data_id = updateBtnEl.getAttribute("data-id");
        const name = document.getElementById("exerciseName").value;
        const description = document.getElementById("description").value;
        let difficulty = "";
        if (document.getElementById("light").checked) {
            difficulty = "light";

        } else if (document.getElementById("moderate").checked) {
            difficulty = "moderate";
        } else {
            difficulty = "intense";
        }
        fetch("/exercises/" + data_id, {
            method: "put",
            headers: {
                Accept: "application/json, text/plain, */*",
                "content-type": "application/json"
            },
            body: JSON.stringify({
                name,
                description,
                difficulty
            })
        })
        .then(function(repsonse) {
            return response.json();
        })
        .then(function(data) {
            wipeAll();
            updateForms(data);
            let newBtn = `<button id = "create-new">Submit</button>`;
            actBtn.innerHTML = newBtn;
            status.innerText = "creating"
            location.reload();
        })
        .catch(function(err) {
            console.log("Error: ", err);
        })
    } else if (e.target.matches("#create-new")) {
        element = e.target;
        data_id = element.getAttribute("data-id");
        let diff = "";
        if (document.getElementById("light").checked) {
            diff = "light";
        } else if (document.getElementById("moderate").checked) {
            diff = "medium";
        } else {
            diff = "intense";
        }
        fetch("/submit", {
            method: "post",
            headers: {
                Accept: "application/json, test/plain, */*",
                "content-type": "application/json"
            },
            body: JSON.stringify({
                name: document.getElementById("exerciseName").value,
                description: document.getElementById("description").value,
                difficulty: diff
            })
        })
        .then(result => result.json().then(newExercise => {
            location.reload();
        }));
        wipeResults();
        
    }
})