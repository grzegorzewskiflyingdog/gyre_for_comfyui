<script>
    import FormBuilder from "./FormBuilder.svelte"
    import RuleEditor from "./RuleEditor.svelte"
    //import { app } from "/scripts/app.js";
    import {writable} from 'svelte/store'
    import {onMount,beforeUpdate} from 'svelte'
    import testdata_workflow1 from './testdata/Inpainting Test with Gyre Tags.json'
    import testdata_workflow2 from './testdata/SDXL Lightning.json'
    import {get_all_dirty_from_scope} from "svelte/internal";
    import {stylestr} from './styles';

    let allworkflows;
    let moving = false;
    let left = 10
    let top = 10
    let styleel;

    function onMouseDown() {
        moving = true;
    }

    function onMouseMove(e) {
        if (moving) {
            left += e.movementX;
            top += e.movementY;
        }
    }
    beforeUpdate(() => {
        if (  styleel && stylestr) {
            styleel.innerHTML = stylestr;
        }
    })


    onMount(async () => {
       await loadList();
    });

    function onMouseUp() {
        moving = false;
    }

    let testdata_workflow_list = [
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
    let foldOut = false
    let name = ""   // current loaded workflow name
    let metadata = null // all Gyre data of current workflow: tags, forms, mappings,...
    let state = "list"
    let tags = ["Txt2Image", "Inpainting", "ControlNet", "LayerMenu", "Deactivated"]
    let workflowList = writable(testdata_workflow_list)    // todo:load all workflow basic data (name, last changed and gyre object) from server via server request
    let activatedTags = {}
    let selectedTag = ""

    function isVisible(workflow) {

        let mytags = workflow?.gyre?.tags||[];
        for (let activeTag in activatedTags) {
            if (activatedTags[activeTag] && !mytags.includes(activeTag)) return false
        }
        return true
    }




    async function loadList() {
        // todo: make server request and read metadata of all existing workflows on filesystem
        console.log("load list");
        let result = await scanLocalNewFiles("/workspace/ComfyUI/my_workflows")
        let data_workflow_list = result.map((el)=>{
            let res = {name:el.name}
            let gyre = null;
            if(el.json) gyre = JSON.parse(el.json).extra.gyre;
            if(gyre) res.gyre = gyre;
            res.last_changed =  "2024-03-01";
            return res
        })
        console.log(data_workflow_list);
        workflowList.set(data_workflow_list)
    }

    async function scanLocalNewFiles(path, existFlowIds) {
        existFlowIds = [];
        try {
            const response = await fetch("/workspace/scan_local_new_files", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    path,
                    existFlowIds,
                }),
            });
            const result = await response.json();
            allworkflows = result;
            return result;
        } catch (error) {
            console.error("Error scan local new files:", error);
        }
    }

    function loadWorkflow(workflow) {
        // todo:check if current workflow is unsaved and make confirm otherwise
        // 1. make server request by workflow.name, getting full workflow data here
        // 2. update ComfyUI with new workflow
        // 3. set name and metadata here

        console.log("load workflow!!");
        name = workflow.name
        metadata = workflow.gyre;

        loadWorkflowIDImpl(workflow)
        /*
        // only for testing:
        if (workflow.name === "Inpainting Test with Gyre Tags") {
            name = workflow.name
            metadata = testdata_workflow1.extra.gyre
        }
        if (workflow.name === "SDXL Lightning") {
            name = workflow.name
            metadata = testdata_workflow2.extra.gyre
        }
        */
    }





    async function loadWorkflowIDImpl(workflow){
        if (window.app.graph == null) {
            console.error("app.graph is null cannot load workflow");
            return;
        }

        //setCurFlowIDAndName(id, flow.name);
        //window.app.ui.dialog.close();
        console.log(allworkflows);
        let current = allworkflows.find((el)=>{
            return el.name==workflow.name;
        })
        window.app.loadGraphData(JSON.parse(current.json));
    };




    async function saveWorkflow() {
                debugger;
                console.log("saveWorkflow");
                let graph = window.app.graph.serialize();
                let file_path =  graph.extra?.workspace_info?.name || "new.json";
                file_path = file_path.replace(/\.[^/.]+$/, "");
                if(metadata && graph.extra) graph.extra.gyre =  metadata;
                const graphJson = JSON.stringify(graph);
                await updateFile(file_path,graphJson);

        // todo:get workflow fom comfyUI
        // metadata should already point to extras.gyre - so nothing to do here
        // 1. make server request, with  name and full workflow, store it on filesystem there
        // 2. set unsaved state to false
        // 3. load list of all workflows again
        alert("save workflow " + name) // remove
        //loadList()
    }



    async function updateFile(file_path , jsonData ) {
        debugger;
        try {
            const response = await fetch("/workspace/update_file", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    file_path: file_path,
                    json_str: jsonData,
                }),
            });
            const result = await response.text();
            return result;
        } catch (error) {
            alert("Error saving workflow .json file: " + error);
            console.error("Error saving workspace:", error);
        }
    }





    function addTag() {
        if (!selectedTag) return
        if (!metadata.tags) metadata.tags = []
        metadata.tags.push(selectedTag)
        metadata = metadata
    }

    function removeTag(tag) {
        const index = metadata.tags.indexOf(tag);
        metadata.tags.splice(index, 1);
        metadata = metadata
    }
</script>

<div id="workflowManager" class="workflowManager" style="left: {left}px; top: {top}px;">

    {#if !foldOut}
        <div class="miniMenu">
            <svg on:mousedown={onMouseDown} xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FFF"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                 id="dragModelManagerTopBarIcon" cursor="move">
                <path d="M9 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                <path d="M9 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                <path d="M9 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                <path d="M15 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                <path d="M15 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                <path d="M15 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
            </svg>
            {#if !name}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div on:click={(e) => {foldOut=true}} class="title">New Workflow</div>
            {:else}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div on:click={(e) => {foldOut=true}} class="title">{name}</div>
                <div style="display: inline-block" class="saveIcon">
                    <svg on:click={(e) => {saveWorkflow()}} xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tabler-icon tabler-icon-device-floppy" aria-hidden="true" focusable="false"><path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2"></path><path d="M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path><path d="M14 4l0 4l-6 0l0 -4"></path></svg>
                </div>
            {/if}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="foldout" on:click={(e) => {foldOut=true}}>v</div>
        </div>
    {/if}
    {#if foldOut}
        <svg on:mousedown={onMouseDown} xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FFF"
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="draggableel" cursor="move">
            <path d="M9 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
            <path d="M9 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
            <path d="M9 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
            <path d="M15 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
            <path d="M15 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
            <path d="M15 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
        </svg>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="foldout" on:click={(e) => {foldOut=false}}>^</div>
        {#if metadata}
            <input type="text" bind:value={name} class="text_input">
            <button on:click={(e) => {saveWorkflow()}}>Save</button>
            <br>
            <button style="margin-left:20px" on:click={(e) => {state="list"}}>List</button>
            <button on:click={(e) => {state="properties"}}>Properties</button>
            <button on:click={(e) => {state="editForm"}}>Form Builder</button>
            <button on:click={(e) => {state="editRules"}}>Rules</button>
        {/if}
        {#if state === "properties"}
            <h1>Workflow Properties</h1>
            <div class="tagedit">
                <div class="title">Click on a Tag to remove it</div>
                <div class="tags">
                    {#if metadata.tags}
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        {#each metadata.tags as tag}
                            <div class="tag" on:click={(e) => {removeTag(tag)}}>{tag}</div>
                        {/each}
                    {/if}
                </div>
                <select class="tagselect" bind:value={selectedTag} on:change={(e) => {addTag()}}>
                    <option selected value="">Add Tag...</option>
                    {#each tags as tag}
                        {#if !metadata.tags.includes(tag)}
                            <option value="{tag}">{tag}</option>
                        {/if}
                    {/each}
                </select>
            </div>
        {/if}
        {#if state === "editForm"}
            <div style="margin-top:10px"></div>
            <!-- todo: set to metadata.forms.default -->
            <FormBuilder></FormBuilder>
        {/if}
        {#if state === "editRules"}
            <div style="margin-top:10px"></div>
            <!-- todo: set to metadata.forms.default -->
            <RuleEditor></RuleEditor>
        {/if}        
        {#if state === "list"}
            <h1>Workflow List</h1>
            <div class="tags">
                {#each tags as tag}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <div class="tag"
                         on:click={ (e) => { activatedTags[tag]=!activatedTags[tag];$workflowList=$workflowList}}
                         class:on={activatedTags[tag]}>{tag}</div>
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
                                    {#each workflow.gyre.tags as tag}
                                        <div class="tag">{tag}</div>
                                    {/each}
                                {/if}
                            </div>
                        </div>
                    {/if}
                {/each}
            {/if}
        {/if}
    {/if} <!-- foldOut -->
</div>
<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove}/>

{#if stylestr}
    <style bind:this={styleel}/>
{/if}
