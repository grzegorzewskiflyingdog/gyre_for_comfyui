<script>
  import FormElement from './FormElement.svelte';
  import { metadata} from './stores/metadata'
  import { rulesExecution } from './rulesExecution.js'
  
  if (!$metadata.forms) $metadata.forms={}

  export let form_key='default'  // support for multiple forms (e.g. wizards) in the future
  export let data={}            // the form data

  if (!$metadata.forms[form_key]) $metadata.forms[form_key]={elements:[]}
  if (!$metadata.forms[form_key].elements) $metadata.forms[form_key].elements=[]
  let formElements = $metadata.forms[form_key].elements
  ensureUniqueNames()
  setDefaultValues()

  let dragStartIndex=-1
  let showPropertiesIdx=-1
  let selectedType

  function ensureUniqueNames() {
  const nameMap = {}; // Object to keep track of names and their occurrences

  formElements.forEach(element => {
    let name = element.name;
    // Check if the name already exists in the nameMap
    if (nameMap[name]) {
      // If the name exists, increment the count and append it to the name
      let count = nameMap[name];
      let newName = `${name}_${count}`;
      while (nameMap[newName]) { // Ensure the new name is also unique
        count++;
        newName = `${name}_${count}`;
      }
      element.name = newName;
      nameMap[name]++;
      nameMap[newName] = 1; // Initialize this new name in the nameMap
    } else {
      // If the name doesn't exist, add it to the nameMap
      nameMap[name] = 1
    }
  });
}

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
    formElements.push(newElement)
    ensureUniqueNames()
    formElements=formElements
    showPropertiesIdx=formElements.length-1
    setDefaultValues()
  }

  function handleDragStart(event, index) {
    if (!advancedOptions) return
    dragStartIndex = index
  }

  function handleDragOver(event) {
    if (!advancedOptions) return
    event.preventDefault() // Necessary to allow dropping
  }

  function handleDrop(event, dropIndex) {
    if (!advancedOptions) return
    event.preventDefault()
    if (dragStartIndex === dropIndex) return
    
    const draggedItem = formElements[dragStartIndex];
    const remainingItems = formElements.filter((_, index) => index !== dragStartIndex)
    const reorderedItems = [
        ...remainingItems.slice(0, dropIndex),
        draggedItem,
        ...remainingItems.slice(dropIndex)
    ]
    // Reassign the reordered items back to formElements
    formElements = reorderedItems
    formElements=formElements
    // Reset dragged index
    dragStartIndex = -1
}

  function removeElement(index) {
    formElements.update(elements => elements.filter((_, i) => i !== index))
  }

  let advancedOptions=true
  function checkAdvancedOptions(element,index) {
    if (advancedOptions) return "block"
    if (element.type==="advanced_options") return "block"
    let advancedOptionsIndex=-1
    for(let i=0;i<formElements.length;i++) {
      let e=formElements[i]
      if  (e.type==="advanced_options") advancedOptionsIndex=i
    }

    if (advancedOptionsIndex<0) { // element does not exists anymore
      advancedOptions=true
      return "block"
    }
    if (index <advancedOptionsIndex) return "block" // before advanced options
    return "none"
  }

  function executeRules(element,value) {
    // first set the new value
    data[element.name]=value
    // now execute rules
    let re=new rulesExecution()
    let res=re.execute(data,formElements,$metadata.rules)
    if (!res) return
    data=res.data
  }
  function setDefaultValues() {
    if (!formElements) return
    for(let i=0;i<formElements.length;i++) {
      let field=formElements[i]
      if (!data[field.name]) data[field.name]=field.default
    }
  }
</script>



<div class="formBuilder">
<h1>Edit form</h1>
<div class="form">
  {#each formElements as element, index (element.name)}
    <div
      class="draggable"
      draggable="true"
      style="display:{checkAdvancedOptions(element,index)}"
      on:dragstart={() => handleDragStart(event, index)}
      on:dragover={handleDragOver}
      on:drop={() => handleDrop(event, index)}>
      <FormElement {element} bind:advancedOptions={advancedOptions}
        on:redrawAll={(e) => {formElements=formElements}}
        on:remove={() => removeElement(index)}  
        on:openProperties={() => {showPropertiesIdx=index }} 
        on:closeProperties={() => {showPropertiesIdx=-1 }}
        on:update={(e) => { formElements[index]=e.detail; ensureUniqueNames() }}
        on:delete={(e) => { formElements.splice(showPropertiesIdx,1);formElements=formElements;showPropertiesIdx=-1 }}
        value={data[element.name]}
        on:change={e => { executeRules(element,e.detail.value)}}
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
    <option value="pre_filled_dropdown">Pre-filled Dropdown</option>
    <option value="slider">Slider</option>
    <option value="number">Number</option>
    <option value="layer_image">Layer Image</option>
    <option value="advanced_options">Advanced Options Switch</option>
  </select>
  <button on:click={() => addElement(selectedType)}>Add</button>
</div>
</div>
<style>
  .formBuilder {
    padding: 10px;
    color: white;
    width: 470px;
    display: block;
  }
  .formBuilder h1 {
    font-size: 16px;
    margin-bottom: 30px;
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
        font-size: 14px;
        min-width: 70px;
        color: black;
        background-color: rgb(227, 206, 116);
        border-color: rgb(128, 128, 128);
        border-radius: 5px;
        cursor: pointer;
        margin-right: 10px;
    }
</style>