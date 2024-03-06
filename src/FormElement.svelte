<script>
    import { createEventDispatcher } from 'svelte';


    export let element;
    export let showProperties=false
    import {layer_image_preview} from "./images"
  import { fix_and_outro_and_destroy_block } from 'svelte/internal';
    import {metadata} from "./stores/metadata";
    const dispatch = createEventDispatcher();
    let value=1
    
    // Function to immediately update the parent component
    function updateElement(updatedProps) {
        element={ ...element, ...updatedProps }
        dispatch('update', element)
        if (element.type==="slider" || element.type==="number") value=element.default
    }

    // Function to handle option updates for dropdowns
    function handleOptionChange(event, index, key) {
        const updatedOptions = [...element.options];
        updatedOptions[index][key] = event.target.value;
        updateElement({ options: updatedOptions });
    }

    // Add a new option to the dropdown
    function addOption() {
        updateElement({ options: [...element.options, { text: '', key: '' }] });
    }

    // Remove an option from the dropdown
    function removeOption(index) {
        const updatedOptions = element.options.filter((_, i) => i !== index);
        updateElement({ options: updatedOptions });
    }

    function openProperties() {
        dispatch('openProperties',{})
    }
    function closeProperties() {
        dispatch('closeProperties',{})
    }
    function deleteElement() {
        dispatch("delete",{})
    }

    export let advancedOptions=true
</script>

<div class="element-preview">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="editElementButton" on:click={openProperties}>Edit</div>
    <!-- Element preview based on type -->
    {#if element.type==="advanced_options"} 
        <!-- svelte-ignore a11y-missing-attribute -->
        <button on:click={(e) => { advancedOptions=!advancedOptions; dispatch("redrawAll",{}) }}>Show Advanced Options</button>
    {/if}

    {#if element.type==="layer_image"} 
        <label for={element.name} class="layer_image_label">{element.name}:</label>
        <!-- svelte-ignore a11y-missing-attribute -->
        <img name="{element.name}" src="{layer_image_preview}">
    {/if}
    {#if element.type === 'text'}
        <label for={element.name}>{element.label}:</label>
        <input type="text" class="textInput" placeholder="{element.placeholder}"  value="{element.default}"/>
    {:else if element.type === 'textarea'}
        <label for={element.name} class="textarea_label">{element.label}:</label>
        <textarea class="textarea" placeholder="{element.placeholder}" name="{element.name}">{element.default}</textarea>
    {:else if element.type === 'checkbox'}
        <label>
            <input type="checkbox" checked={element.default==="true"}  /> {element.label}
        </label>
    {:else if element.type === 'dropdown'}
    <label for={element.name}>{element.label}:</label>
        <select name="{element.name}" class="dropdown">
            {#each element.options as option}
                <option value={option.value}>{option.text} </option>
            {/each}
        </select>
    {:else if element.type === 'pre_filled_dropdown'}
    <label for={element.name}>{element.label}:</label>
        {#if element.widget_name && $metadata.combo_values[element.widget_name] }
        <select name="{element.name}" class="dropdown">
          {#each $metadata.combo_values[element.widget_name] as v}
                <option value={v}>{v} </option>
            {/each} 
        </select>      
        {:else if !element.widget_name}  
            Select Widget
        {:else}
            Widget {element.widget_name} not found.
        {/if}
    {:else if element.type === 'slider'}
        <label for={element.name} class="slider_label">{element.label}:</label>
        <span class="slidervalue">{value}</span><input type="range" min={element.min} max={element.max} step={element.step} value="{element.default}" name="{element.name}" on:change={(e) => {value=e.target.value}}/>
    {:else if element.type === 'number'}
        <label for={element.name}>{element.label}:</label>
        <input type="number" min={element.min} max={element.max} step={element.step} value="{element.default}" name="{element.name}" />
    {/if}    
</div>
{#if showProperties}
<div class="element-properties" >
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="formClose" on:click={closeProperties}>X</div>
    {#if element.type !== 'layer_image' &&  element.type!=="advanced_options"} 
        <div class="formLine">
            <label for="label">Label:</label>
            <input type="text" name="label" value={element.label} on:input={(e) => updateElement({ label: e.target.value })} />
        </div>
        <div class="formLine">
            <label  for="name"> Name: </label>
        <input type="text"  value={element.name} on:change={(e) => updateElement({ name: e.target.value }) } />
        </div>
        <div class="formLine">
            <label  for="default"> Default value: </label>
        <input type="text" name="default" value={element.default} on:input={(e) => updateElement({ default: e.target.value })} />
        </div>    
        <div class="formLine">
            <label  for="hidden">Hidden: </label>
            <input type="checkbox" name="hidden" bind:checked={element.hidden}  /> Hide Input in form
        </div>       
    {/if}
    {#if element.type === 'text' || element.type === 'textarea'}
        <div class="formLine">
            <label  for="placeholder"> Placeholder: </label>
        <input type="text" name="placeholder" value={element.placeholder} on:input={(e) => updateElement({ placeholder: e.target.value })} />
        </div>  
    {/if}
    {#if element.type === 'layer_image' }
        <div class="formLine">
            <label  for="name"> Name: </label>
            <input type="text" name="name" value={element.name} on:change={(e) => updateElement({ name: e.target.value })} />
        </div>
        <div class="formLine">
            <label  for="from_selection">Pixel Data: </label>
            <input type="checkbox" name="from_selection" bind:checked={element.from_selection}  /> From Selection
        </div>      
    {/if}
    {#if element.type === 'dropdown'}
        {#each element.options as option, index}
            <div class="formLine">
                <label for="text">Option Text:</label> <input name="text" type="text" value={option.text} on:input={(e) => handleOptionChange(e, index, 'text')} />
            </div>
            <div class="formLine">
                <label for="key">Option Value:</label> <input name="value" type="text" value={option.value} on:input={(e) => handleOptionChange(e, index, 'value')} />
                <button on:click={() => removeOption(index)}>Remove Option</button>
            </div>
        {/each}
        <button on:click={addOption}>Add Option</button>
    {/if}
    {#if element.type === 'pre_filled_dropdown'}
        <div class="formLine">
            <label  for="widget_name"> Combo Widget: </label>
            <select  name="widget_name"  on:change={(e) => updateElement({ widget_name: e.target.value })} bind:value={element.widget_name}  >
                <option>Select...</option>
                {#if $metadata.combo_values}
                    {#each Object.entries($metadata.combo_values) as [widget_name,values]}
                        <option value={widget_name}>{widget_name}</option>
                    {/each}
                {/if}
            </select>
    </div>
    {/if}
    {#if element.type === 'slider' || element.type === 'number'}
        <div class="formLine">
            <label for="min"> Min: </label>
            <input name="min" type="number" value={element.min} on:input={(e) => updateElement({ min: e.target.value })} />  
        </div>
        <div class="formLine">
            <label  for="max"> Max:</label>
            <input name="max" type="number" value={element.max} on:input={(e) => updateElement({ max: e.target.value })} />
        </div> 
        <div class="formLine">
            <label for="step"> Step: </label>
            <input name="step" type="number" value={element.step} on:input={(e) => updateElement({ step: e.target.value })} />
       </div>
    {/if}
    <div><button on:click={() => deleteElement()} class="delete">Delete</button></div>

</div>
{/if}

<style>
    * {
        box-sizing: border-box;

    }
    .element-preview {
        position: relative;
        margin-bottom: 20px;
    }
    .element-preview .editElementButton {
        display: none;
        position: absolute;
        right:0px;
        top: 0px;
        cursor: pointer;
        padding: 5px;
        background-color: rgb(51, 51, 51);
        width:50px;
        text-align: center;
    }

    .element-preview:hover .editElementButton {
        display: block;
    }
    .element-preview select {
        margin-right: 10px;
        background-color: black;
        color: white;
        padding: 5px;   
        display: inline-block;
  }
    .element-preview input,textarea {
        background: none;
        position: relative;
        display: inline-block;
        color:white;
        margin: 0;
    }
    .textInput,.textarea {
        width: 280px;
    }
    .element-preview label {
        min-width: 110px;
        display: inline-block;
    }
    .element-preview .textarea_label {
        vertical-align: top;
    }
    .element-preview .layer_image_label {
        vertical-align: 60px;
    }
    .element-preview .slider_label {
        vertical-align: 10px;
    }
    .element-properties {
        background-color: rgb(51, 51, 51);
        padding: 10px;
        display:block;
        position: relative;

    }
    .element-properties label {
        min-width: 110px;
        display: inline-block;
    }
    .element-properties input,textarea {
        background: none;
        position: relative;
        display: inline-block;
        color:white;
        margin: 0;
    }    
    .formLine {
        display: block;
        margin-bottom: 10px;
    }
    .element-properties .formClose {
        position: absolute;
        right:0px;
        top: 0px;
        cursor: pointer;
        padding: 5px;
        width: 20px;
    }    
 
    .slidervalue {
        vertical-align: 10px;
        margin-right: 10px;
    } 
    .element-properties button {
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
    .element-properties .delete {
        background-color: red;
        color: white;
    }       
</style>
