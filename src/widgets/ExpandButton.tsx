const buttonContainer = document.createElement("div");
buttonContainer.className = "esri-widget--button";

const localeBtn = document.createElement("span");
localeBtn.className =
  "esri-collapse__icon esri-expand__icon--expanded esri-icon-collapse";

buttonContainer.appendChild(localeBtn);

export default buttonContainer;
