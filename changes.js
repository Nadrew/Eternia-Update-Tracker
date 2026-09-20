const gameIP = "https://nadrew.github.io/Eternia-Update-Tracker";

var loadedChanges = null;

var selectedVersion = null;
var selectedVersionSpan = null;

var selectedDate = null;
var selectedOption = null;

async function LoadChanges() {
	fetch(gameIP + "/changelog.json")
		.then(pro => pro.json())
		.then(reply => ParseChanges(reply));
}

function ParseChanges(changes) {
	loadedChanges = changes;
	ShowVersions();
}

function ShowVersions() {
	var versionDiv = document.getElementById("changeVersions");
	var i = 0;
	for(var version in loadedChanges) {
		let versionSpan = document.createElement("span")
		versionSpan.classList.add("changeVersion");
		if(i == 0) {
			versionSpan.classList.add("changeSelected");
			selectedVersion = version;
			selectedVersionSpan = versionSpan;
			ShowDates(version);
		}
		versionSpan.addEventListener("click",(event) => {
			VersionChanged(event.target);
		});
		versionSpan.innerHTML = version;
		versionDiv.appendChild(versionSpan);
		i++;
	}
}

function VersionChanged(elem) {
	if(selectedVersionSpan) {
		if(elem == selectedVersionSpan) {
			return;
		}
		selectedVersionSpan.classList.remove("changeSelected");
	}
	elem.classList.add("changeSelected");
	selectedVersion = elem.innerHTML;
	selectedVersionSpan = elem;
	ShowDates(selectedVersion);
}

function DateChanged() {
	var dateSelect = document.getElementById("changeDate");
	var dateSelected = dateSelect.options[dateSelect.selectedIndex];
	if(selectedOption) {
		selectedOption.classList.remove("dateSelected");
	}
	dateSelected.classList.add("dateSelected");
	selectedOption = dateSelected;
	selectedDate = dateSelected.text;
	ShowChanges();
}

function ShowDates(version) {
	var dateSelect = document.getElementById("changeDate");
	dateSelect.replaceChildren();
	var i = 0;
	for(var date in loadedChanges[version]) {
		let dateOption = document.createElement("option");
		dateOption.classList.add("dateOption");
		if(i == 0) {
			dateOption.selected = true;
			dateOption.classList.add("dateSelected");
			selectedDate = date;
			selectedOption = dateOption;
			ShowChanges();
		}
		dateOption.innerHTML = date;
		dateSelect.appendChild(dateOption);
		i++;
	}
}

function ShowChanges() {
	if(selectedVersion && selectedDate) {
		var changeContent = document.getElementById("changeContent");
		changeContent.replaceChildren();
		var changeData = loadedChanges[selectedVersion][selectedDate];
		for(var changeType in changeData) {
			var changeDiv = document.createElement("div");
			changeDiv.classList.add("changeDetailsHeader");
			changeDiv.innerHTML = changeType;
			var changeArray = changeData[changeType];
			for(var changeIndex in changeArray) {
				var changeDetails = changeArray[changeIndex];
				var changeSpan = document.createElement("span");
				changeSpan.classList.add("changeDetails");
				changeSpan.innerHTML = changeDetails;
				changeDiv.appendChild(changeSpan);
			}
			changeContent.appendChild(changeDiv);
			
		}
	}
}