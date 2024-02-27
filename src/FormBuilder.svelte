<script>
  import { writable } from 'svelte/store';
  import FormElement from './FormElement.svelte';


  let formElements = writable([
    // Initial JSON structure, can be empty or predefined elements
  ]);
  let dragStartIndex=-1;
  let showPropertiesIdx=0;
  let selectedType;
  function addElement(type) {
    if (!type) return
    let name="value_"+Math.random().toString(36).substr(2, 5)
    
    let newElement = {
      name: name, // Unique ID for key tracking and reactivity
      type: type,
      label: name.charAt(0).toUpperCase() + name.slice(1),
      name: name, // Example naming convention
      options: type === 'dropdown' ? [{ text: 'Option 1', key: '1' }] : [],
      default: ""
    }
    if (type==="slider" || type==="number") {
      newElement.min=1
      newElement.max=20
      newElement.step=1
      newElement.default=1
    }
    if (type==="checkbox") {
      newElement.default=false
    }
    if (type==="text" || type==="textarea") {
      newElement.placeholder=""
    }
    formElements.update(current => [...current, newElement]);
    showPropertiesIdx=$formElements.length-1
  }

  function handleDragStart(event, index) {
    dragStartIndex = index;
  }

  function handleDragOver(event) {
    event.preventDefault(); // Necessary to allow dropping
  }

  function handleDrop(event, dropIndex) {
    event.preventDefault();
    if (dragStartIndex === dropIndex) return; // No change
    formElements.update(currentElements => {
      const draggedItem = currentElements[dragStartIndex];
      const remainingItems = currentElements.filter((_, index) => index !== dragStartIndex);
      const reorderedItems = [
        ...remainingItems.slice(0, dropIndex),
        draggedItem,
        ...remainingItems.slice(dropIndex)
      ];
      return reorderedItems;
    });
    formElements=formElements
    // Reset dragged index
    dragStartIndex = -1;
  }

  function removeElement(index) {
    formElements.update(elements => elements.filter((_, i) => i !== index));
  }
</script>



<div class="formBuilder">
<h1>Edit form</h1>
<div class="form">
  {#each $formElements as element, index (element.name)}
    <div
      class="draggable"
      draggable="true"
      on:dragstart={() => handleDragStart(event, index)}
      on:dragover={handleDragOver}
      on:drop={() => handleDrop(event, index)}>
      <FormElement {element} 
        on:remove={() => removeElement(index)}  
        on:openProperties={() => {showPropertiesIdx=index }} 
        on:closeProperties={() => {showPropertiesIdx=-1 }}
        on:update={(e) => { $formElements[index]=e.detail }}
        on:delete={(e) => { $formElements.splice(showPropertiesIdx,1);$formElements=$formElements;showPropertiesIdx=-1 }}
        showProperties={showPropertiesIdx===index}/>
      </div>
  {/each}
</div>
<div>
<label for="add_field_select" class="add_field_select_label"> Add form field:</label> 
  <select class="add_field_select" name="add_field_select" bind:value={selectedType}>
    <option value="">Select...</option>
    <option value="text">Text Input</option>
    <option value="textarea">Textarea</option>
    <option value="checkbox">Checkbox</option>
    <option value="dropdown">Dropdown</option>
    <option value="slider">Slider</option>
    <option value="number">Number</option>
    <option value="layer_image">Layer Image</option>
  </select>
  <button on:click={() => addElement(selectedType)}>Add</button>
</div>
</div>
<style>
  .formBuilder {
    padding: 10px;
    background-color: rgb(51, 51, 51);
    color: white;
    width: 470px;
    display: block;
  }
  .formBuilder h1 {
    font-size:18px;
  }
  .draggable {
    cursor: grab;
  }
  .form {
    border-radius: 5px;
    background-color: black;
    width: 450px;
    padding: 10px;
    color: white;
    font: "Segoe UI", Roboto, system-ui;
    font-size:14px;
    margin-bottom: 10px;
  }
  .formBuilder .add_field_select_label {
    display: inline-block;
  }
  .formBuilder .add_field_select {
        margin-right: 10px;
        background-color: black;
        color: white;
        padding: 5px;   
        display: inline-block;
  }
    .formBuilder button {
        font-family: system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif, "Segoe UI", Helvetica, Arial;
        font-size: 15px;
        min-width: 70px;
        color: black;
        background-color: rgb(227, 206, 116);
        border-color: rgb(128, 128, 128);
        border-radius: 5px;
        cursor: pointer;
        margin-right: 10px;
    }
</style>