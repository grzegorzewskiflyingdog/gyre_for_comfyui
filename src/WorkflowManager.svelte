<script>
    import FormBuilder from "./FormBuilder.svelte"

  import { writable } from 'svelte/store'
  import  testdata_workflow1 from './testdata/Inpainting Test with Gyre Tags.json'
  import  testdata_workflow2 from './testdata/SDXL Lightning.json'
  import { get_all_dirty_from_scope } from "svelte/internal";

  let testdata_workflow_list=[
    {
      name: "Inpainting Test with Gyre Tags",
      last_changed: "2024-03-01",
      gyre: testdata_workflow1.extra.gyre
    },
    {
      name: "SDXL Lightning",
      last_changed: "2024-02-24",
      gyre: testdata_workflow2.extra.gyre
    }    
  ]
  let foldOut=false
  let name=""   // current loaded workflow name
  let metadata=null // all Gyre data of current workflow: tags, forms, mappings,...
  let state="list"
  let tags=["Txt2Image","Inpainting","ControlNet","LayerMenu","Deactivated"]
  let workflowList = writable( testdata_workflow_list)    // todo:load all workflow basic data (name, last changed and gyre object) from server via server request
  let activatedTags={}
  let selectedTag=""
  function isVisible(workflow) {
    let tags=workflow.gyre.tags
    for(let activeTag in activatedTags) {
      if (activatedTags[activeTag] && !tags.includes(activeTag)) return false
    }
    return true
  }

  function loadList() {
    // todo: make server request and read metadata of all existing workflows on filesystem
  }
  function loadWorkflow(workflow) {
    // todo:check if current workflow is unsaved and make confirm otherwise
    // 1. make server request by workflow.name, getting full workflow data here
    // 2. update ComfyUI with new workflow
    // 3. set name and metadata here

    // only for testing:
    if (workflow.name=== "Inpainting Test with Gyre Tags") {
      name=workflow.name
      metadata=testdata_workflow1.extra.gyre
    }
    if (workflow.name=== "SDXL Lightning") {
      name=workflow.name
      metadata=testdata_workflow2.extra.gyre
    }

  }
  function saveWorkflow() {
    // todo:get workflow fom comfyUI
    // metadata should already point to extras.gyre - so nothing to do here
    // 1. make server request, with  name and full workflow, store it on filesystem there
    // 2. set unsaved state to false
    // 3. load list of all workflows again
    alert("save workflow "+name) // remove
    loadList()
   }      
   function addTag() {
      if (!selectedTag) return
      if (!metadata.tags) metadata.tags=[]
      metadata.tags.push(selectedTag)
      metadata=metadata
    }
    function removeTag(tag) {
      const index = metadata.tags.indexOf(tag);
      metadata.tags.splice(index, 1);
      metadata=metadata
    }
</script>

<div class="workflowManager">
  
  {#if !foldOut} 
    <div class="miniMenu">
    ✥
      {#if !name}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div  on:click={(e) => {foldOut=true}} class="title">New Workflow</div>
      {:else} 
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div  on:click={(e) => {foldOut=true}} class="title">{name}</div> [S]
      {/if}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div class="foldout" on:click={(e) => {foldOut=true}}>v</div>
    </div>
  {/if}
  {#if foldOut} 
  ✥  
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div class="foldout" on:click={(e) => {foldOut=false}}>^</div>
    {#if metadata}
      <input type="text" bind:value={name} class="text_input">
      <button on:click={(e) => {saveWorkflow()}}>Save</button>
      <br>
      <button style="margin-left:20px" on:click={(e) => {state="list"}} >List</button>
      <button on:click={(e) => {state="properties"}}>Properties</button><button on:click={(e) => {state="editForm"}} >Form Builder</button><button >Rules</button>
    {/if}
    {#if state==="properties"}
    <h1>Workflow Properties</h1>
    <div class="tagedit">
      <div class="title">Click on a Tag to remove it</div>
      <div class="tags">
        {#if metadata.tags}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          {#each metadata.tags as tag}<div class="tag" on:click={(e) => {removeTag(tag)}}>{tag}</div>{/each}
        {/if}
        </div>
        <select class="tagselect"  bind:value={selectedTag} on:change={(e) => {addTag()}}>
          <option selected value="">Add Tag...</option>
          {#each tags as tag}
            {#if !metadata.tags.includes(tag)}
            <option value="{tag}">{tag}</option>
            {/if}
          {/each}  
        </select>
    </div>
    {/if}
    {#if state==="editForm"}
     <div style="margin-top:10px"></div>
     <!-- todo: set to metadata.forms.default -->
      <FormBuilder ></FormBuilder>
    {/if}
    {#if state==="list"}
      <h1>Workflow List</h1>
      <div class="tags">
        {#each tags as tag} 
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <div class="tag" on:click={ (e) => { activatedTags[tag]=!activatedTags[tag];$workflowList=$workflowList}} class:on={activatedTags[tag]}>{tag}</div>
        {/each}
      </div>
      {#if workflowList}
        {#each $workflowList as workflow}
          {#if isVisible(workflow)}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="workflowEntry" on:click={loadWorkflow(workflow)}>
              {workflow.name}
              <div class="last_changed">{workflow.last_changed}</div>
              <div class="tags">
                {#if workflow.gyre && workflow.gyre.tags}                
                  {#each workflow.gyre.tags as tag}<div class="tag">{tag}</div>{/each}
                {/if}
              </div>
            </div>
          {/if}
        {/each}
      {/if}    
   {/if}
   {/if} <!-- foldOut -->
</div>
<style>

  .workflowManager {
    position: absolute;
    left:10px;
    top:10px;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif, "Segoe UI", Helvetica, Arial;
    padding: 10px;
    background-color: rgb(0, 0, 0);
    color: white;
    width: 490px;
    display: block;
    border-radius: 5px
  }
  .miniMenu .title {
    display:inline-block;
    cursor: pointer;
  }
  .tagedit .title {
    margin-bottom: 10px;
  }
  .tagedit .tag:hover {
    background-color: red;
  }
  .tagedit .tagselect:focus {
    outline: none;
  }
  .tagedit .tagselect {
    background-color: grey;
    font-size: 15px;
    color:white;
    border:none;
    margin-top:10px;
  }
  .foldout {
    position: absolute;
    right: 5px;
    top: 5px;
    font-size: 20px;
    cursor: pointer;
  }
  .foldout:hover {
    color: rgb(227, 206, 116);
  }
  .tags {
    user-select: none; 
  }
  .workflowManager button {
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif, "Segoe UI", Helvetica, Arial;
    font-size: 15px;
    min-width:70px;
    color: black;
    background-color: rgb(227, 206, 116);
    border-color: rgb(128, 128, 128);
    border-radius: 5px;
    cursor: pointer;
    margin-right:10px;
  }
  .workflowManager button:hover {
    background-color: #ddb74f;

  }
  .workflowEntry {
    border: 1px solid grey;
    border-radius: 3px;
    margin-bottom: 10px;;
    padding: 5px;
    cursor: pointer;
  }  
  .workflowEntry .last_changed {
    margin-top:5px;
    font-size: 12px;
  }
  .workflowEntry:hover {
    background-color: #ddb74f;
    color: black;
  }
  .workflowEntry .tags {
    margin-top:5px;
  }
  .tag {
    display:inline-block;
    background-color:dimgray;
    margin-right:5px;
    margin-bottom: 5px;
    padding:5px;
    cursor: pointer;
    font-size: 12px;
  }
  .on {
    background-color: #ddb74f;
    color: black;
  }
  .workflowEntry .tag {
    font-size: 12px;
    margin-right:5px;
    margin-bottom: 5px;
    padding:5px;
    opacity: 0.6;
  }
  .workflowManager h1 {
    font-size:18px;
  }
  .text_input {
    background: transparent;
    border: 1px solid white;    
    color:white;
    width:300px;
  }
</style>