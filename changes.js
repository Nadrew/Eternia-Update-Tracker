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
	var searchInput = document.getElementById("changeSearchInput");
	searchInput.value = "";
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
	var searchInput = document.getElementById("changeSearchInput");
	searchInput.value = "";
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

function SearchSubmit() {
	var searchInput = document.getElementById("changeSearchInput");
	SearchChanges(searchInput.value);
}

function SearchChanges(query) {
	var searchResults = [];
	query = query.toLowerCase();
	query = query.replace(/[^a-z0-9 ]/gi, "");
	if(query && query.length >= 3) {
		var dateSelect = document.getElementById("changeDate");
		dateSelect.replaceChildren();
		selectedVersion = null;
		selectedDate = null;
		var changeContainer = document.createElement("div");
		if(selectedVersionSpan) {
			selectedVersionSpan.classList.remove("changeSelected");
		}
		selectedVersionSpan = null;
		var changeContent = document.getElementById("changeContent");
		changeContent.replaceChildren();
		for(var [changeVersion, changeDates] of Object.entries(loadedChanges)) {
			for(var [changeDate, changeCategories] of Object.entries(changeDates)) {
				for(var [changeCategory, changeNotes] of Object.entries(changeCategories)) {
					 if(Array.isArray(changeNotes)) {
						changeNotes.forEach(changeNote => {
							if(changeNote.toLowerCase().includes(query)) {
								var highlightPattern = new RegExp(query, "gi");
								var highlightResult = changeNote.replace(highlightPattern, "<span class=\"searchHighlight\">$&</span>");
								searchResults[changeVersion] = searchResults[changeVersion] || {};
								searchResults[changeVersion][changeDate] = searchResults[changeVersion][changeDate] || {};
								searchResults[changeVersion][changeDate][changeCategory] = searchResults[changeVersion][changeDate][changeCategory] || [];
								searchResults[changeVersion][changeDate][changeCategory].push(highlightResult);
							}
						});
					}
				}
			}
		}
		var totalResults = 0;
		for(var [resultVersion,resultDates] of Object.entries(searchResults)) {
			var versionDiv = document.createElement("div");
			versionDiv.classList.add("searchResultVersion");
			versionDiv.innerHTML = resultVersion;
			for(var [resultDate,resultCategories] of Object.entries(resultDates)) {
				var dateDiv = document.createElement("div");
				dateDiv.classList.add("searchResultDate");
				dateDiv.innerHTML = resultDate;
				for(var [resultCategory,resultNotes] of Object.entries(resultCategories)) {
					console.log(resultNotes);
					var categoryDiv = document.createElement("div");
					categoryDiv.classList.add("searchResultCategory");
					categoryDiv.innerHTML = resultCategory;
					if(Array.isArray(resultNotes)) {
						resultNotes.forEach(resultNote => {
							var noteSpan = document.createElement("span");
							noteSpan.classList.add("searchResultNote");
							noteSpan.innerHTML = resultNote;
							categoryDiv.appendChild(noteSpan);
							totalResults++;
						});
					}
					dateDiv.appendChild(categoryDiv);
				}
				versionDiv.appendChild(dateDiv);
			}
			changeContainer.appendChild(versionDiv);
		}
		var resultHeader = document.createElement("span");
		resultHeader.classList.add("searchHeader");
		resultHeader.innerHTML = "Search results for \"" + query + "\" (" + totalResults + " found)";
		changeContent.appendChild(resultHeader);
		changeContent.appendChild(changeContainer);
	}
	
	else {
		SearchError("Queries must be at least 3 characters long");
	}
}

function SearchError(error) {

}