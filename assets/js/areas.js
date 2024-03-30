const boxes = document.querySelectorAll(".box");
const areas = document.querySelectorAll(".area");

boxes.forEach(box => {
  box.addEventListener("dragstart", function(ev) {
    const dataId = this.getAttribute("data-id");
    ev.dataTransfer.setData("data-ID", dataId); 
  });
});
areas.forEach(area => {
  area.addEventListener("dragover", function(ev) {
    ev.preventDefault();
  });

  area.addEventListener("drop", function(ev) {
    ev.preventDefault();
    let id = ev.dataTransfer.getData("data-ID");
    console.log(id);
    const parseId = parseInt(id);
    const start=parseInt(this.id.split("-")[0]);
    const end=parseInt(this.id.split("-")[1]);
    if (parseId >= start && parseId <= end) {
      this.append(document.querySelector(`[data-id="${id}"]`));
    }
    else{
      alert("Not right area!")
    }
  });
});
